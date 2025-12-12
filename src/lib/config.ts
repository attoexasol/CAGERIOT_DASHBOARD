// config.ts

// ----------------------------
// Helper Functions
// ----------------------------
const getEnv = (key: string, defaultValue = ""): string => {
  return (import.meta.env as any)[key] || defaultValue;
};

const getEnvBoolean = (key: string, defaultValue = false): boolean => {
  const val = (import.meta.env as any)[key];
  return val === "true" || (val === undefined ? defaultValue : false);
};

const getEnvNumber = (key: string, defaultValue = 0): number => {
  const val = (import.meta.env as any)[key];
  return val ? Number(val) : defaultValue;
};

// ----------------------------
// API CONFIG
// ----------------------------
// Use proxy in development to avoid CORS issues
// Check if we're in development by checking hostname
const isDevelopment = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname.includes('127.0.0.1') || 
  window.location.hostname.includes('0.0.0.0') ||
  window.location.port !== ''
);

const getBaseUrl = () => {
  const envUrl = getEnv("VITE_API_BASE_URL", "");
  if (envUrl) return envUrl;
  
  // Use proxy in development to avoid CORS issues
  if (isDevelopment) {
    return "/api";
  }
  
  // Use full API URL in production
  return "https://openplay.attoexasolutions.com/api";
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  USERNAME: getEnv("VITE_API_USERNAME", "EJLLN8KJ"),
  PASSWORD: getEnv("VITE_API_PASSWORD", "0cb81fba-adba-4942-ae0f-d2f577571dde"),
  // API_KEY: getEnv(
  //   "VITE_API_KEY",
  //   "ajbWGxm8BRbJr0lSHaAWD4uu24D0ewizX1GwGXcrwT8fZVzeboa870qbH9jw"
  // ),
  TIMEOUT: getEnvNumber("VITE_API_TIMEOUT", 30000),
  USE_LIVE_API: getEnvBoolean("VITE_USE_LIVE_API", true),
} as const;

export const config = {
  api: {
    useLiveApi: API_CONFIG.USE_LIVE_API,
    baseUrl: API_CONFIG.BASE_URL,
    username: API_CONFIG.USERNAME,
    password: API_CONFIG.PASSWORD,
    apiKey: getEnv("VITE_API_KEY", ""),
    timeout: API_CONFIG.TIMEOUT,
  },

  upload: {
    maxSize: getEnvNumber("VITE_MAX_UPLOAD_SIZE", 100) * 1024 * 1024,
    audioTypes: getEnv(
      "VITE_AUDIO_FILE_TYPES",
      "audio/mpeg,audio/wav,audio/flac,audio/aac"
    ).split(","),
    videoTypes: getEnv(
      "VITE_VIDEO_FILE_TYPES",
      "video/mp4,video/webm,video/quicktime"
    ).split(","),
    imageTypes: getEnv(
      "VITE_IMAGE_FILE_TYPES",
      "image/jpeg,image/png,image/webp"
    ).split(","),
  },

  features: {
    uploads: getEnvBoolean("VITE_ENABLE_FILE_UPLOADS", true),
    analytics: getEnvBoolean("VITE_ENABLE_ANALYTICS", true),
    notifications: getEnvBoolean("VITE_ENABLE_NOTIFICATIONS", true),
    realTimeSync: getEnvBoolean("VITE_ENABLE_REAL_TIME_SYNC", false),
  },

  dev: {
    debug: getEnvBoolean("VITE_DEBUG_MODE", true),
    mockDelay: getEnvNumber("VITE_MOCK_API_DELAY", 500),
  },

  app: {
    name: "Cage Riot",
    version: "1.0.0",
  },
} as const;

// ----------------------------
// API Helpers
// ----------------------------
export const isDemoMode = (): boolean => !config.api.useLiveApi;
export const isLiveMode = (): boolean => config.api.useLiveApi;

export const getApiHeaders = (useAuth = false): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    version: "2",
  };

  const apiKey = getEnv("VITE_API_KEY", "");
  if (useAuth && apiKey) {
    headers["apikey"] = apiKey;
  }

  return headers;
};

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let json: any = {};

  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON response from API");
  }

  if (!response.ok) {
    throw new Error(json.message || `API request failed (${response.status})`);
  }

  return json as T;
}

// ----------------------------
// Logger
// ----------------------------
export const logger = {
  log: (...args: any[]) => console.log("[LOG]", ...args),
  api: (...args: any[]) => console.log("[API]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args),
  warn: (...args: any[]) => console.warn("[WARN]", ...args),
  info: (...args: any[]) => console.info("[INFO]", ...args),
};

// ----------------------------
// Config Validation
// ----------------------------
export const validateConfig = () => {
  if (config.api.useLiveApi && !config.api.apiKey) {
    console.warn("⚠️ Live API enabled but VITE_API_KEY missing.");
  }

  console.log(
    config.api.useLiveApi
      ? `✅ Live API Mode: ${config.api.baseUrl}`
      : "🎮 Demo Mode Enabled"
  );
};
