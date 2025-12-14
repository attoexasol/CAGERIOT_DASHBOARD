/**
 * API Connection Test Utility
 * Use this to test your API connection and endpoints
 */

import { API_CONFIG, isLiveMode } from "../config";
import { logger } from "../logger";
import { getApiHeaders, handleApiResponse } from "./helpers";

export interface ConnectionTestResult {
  endpoint: string;
  status: "success" | "failed" | "skipped";
  statusCode?: number;
  message: string;
  responseTime?: number;
}

export interface FullTestReport {
  mode: "demo" | "live";
  apiUrl: string;
  hasApiKey: boolean;
  timestamp: string;
  results: ConnectionTestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

/**
 * Test a single endpoint
 */
async function testEndpoint(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  requiresAuth: boolean = false
): Promise<ConnectionTestResult> {
  const startTime = performance.now();

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method,
      headers: getApiHeaders(requiresAuth),
      body: method === "POST" ? JSON.stringify({}) : undefined,
    });

    await handleApiResponse(response);
    const responseTime = Math.round(performance.now() - startTime);

    return {
      endpoint,
      status: "success",
      statusCode: response.status,
      message: `âœ“ Success (${responseTime}ms)`,
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Math.round(performance.now() - startTime);

    return {
      endpoint,
      status: "failed",
      statusCode: error.status || 0,
      message: `âœ— Failed: ${error.message}`,
      responseTime,
    };
  }
}

/**
 * Run comprehensive connection test
 */
export async function testApiConnection(): Promise<FullTestReport> {
  const mode = isLiveMode() ? "live" : "demo";

  logger.info(`Starting API connection test in ${mode} mode...`);

  const results: ConnectionTestResult[] = [];

  // Only test in live mode
  if (mode === "demo") {
    logger.info("Skipping connection test - running in demo mode");

    return {
      mode,
      apiUrl: API_CONFIG.BASE_URL,
      hasApiKey: !!(API_CONFIG.API_USERNAME && API_CONFIG.API_PASSWORD),
      timestamp: new Date().toISOString(),
      results: [
        {
          endpoint: "all",
          status: "skipped",
          message: "Demo mode active - using mock data",
        },
      ],
      summary: {
        total: 1,
        passed: 0,
        failed: 0,
        skipped: 1,
      },
    };
  }

  // Test endpoints
  const endpoints = [
    { path: "/releases/", method: "GET" as const, requiresAuth: true },
    { path: "/artists/", method: "GET" as const, requiresAuth: true },
    { path: "/tracks/", method: "GET" as const, requiresAuth: true },
  ];

  for (const endpoint of endpoints) {
    logger.info(`Testing ${endpoint.method} ${endpoint.path}...`);
    const result = await testEndpoint(
      endpoint.path,
      endpoint.method,
      endpoint.requiresAuth
    );
    results.push(result);
  }

  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "success").length,
    failed: results.filter((r) => r.status === "failed").length,
    skipped: results.filter((r) => r.status === "skipped").length,
  };

  const report: FullTestReport = {
    mode,
    apiUrl: API_CONFIG.BASE_URL,
    hasApiKey: !!(API_CONFIG.API_USERNAME && API_CONFIG.API_PASSWORD),
    timestamp: new Date().toISOString(),
    results,
    summary,
  };

  // Log results
  logger.info("API Connection Test Results:");
  logger.info(
    `Total: ${summary.total} | Passed: ${summary.passed} | Failed: ${summary.failed}`
  );

  results.forEach((result) => {
    if (result.status === "success") {
      logger.success(result.message);
    } else if (result.status === "failed") {
      logger.error(result.message);
    }
  });

  return report;
}

/**
 * Quick health check
 */
export async function quickHealthCheck(): Promise<boolean> {
  if (!isLiveMode()) {
    logger.info("Demo mode active");
    return true;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/releases/`, {
      method: "GET",
      headers: getApiHeaders(true),
    });

    await handleApiResponse(response);
    logger.success("API health check passed");
    return true;
  } catch (error) {
    logger.error("API health check failed", error);
    return false;
  }
}

/**
 * Validate configuration
 */
export function validateApiConfig(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if live mode is enabled
  if (isLiveMode()) {
    // Check API URL
    if (!API_CONFIG.BASE_URL) {
      errors.push("API base URL is not configured (VITE_API_BASE_URL)");
    } else if (!API_CONFIG.BASE_URL.startsWith("http")) {
      errors.push("API base URL must start with http:// or https://");
    }

    // Check credentials
    if (!API_CONFIG.API_USERNAME || !API_CONFIG.API_PASSWORD) {
      warnings.push(
        "API credentials are not configured (VITE_API_USERNAME and VITE_API_PASSWORD)"
      );
    }

    // Check timeout
    if (API_CONFIG.TIMEOUT < 5000) {
      warnings.push("API timeout is very low - may cause timeout errors");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Export utility for browser console
 */
if (typeof window !== "undefined") {
  (window as any).testApiConnection = testApiConnection;
  (window as any).quickHealthCheck = quickHealthCheck;
  (window as any).validateApiConfig = validateApiConfig;

  logger.info("API test utilities loaded. Try:");
  logger.info("- testApiConnection() - Full connection test");
  logger.info("- quickHealthCheck() - Quick health check");
  logger.info("- validateApiConfig() - Validate configuration");
}
