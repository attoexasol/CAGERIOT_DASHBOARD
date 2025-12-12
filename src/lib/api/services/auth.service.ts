// /**
//  * Authentication API Service
//  * Supports both demo and live API modes
//  */

// import { API_CONFIG } from '../../config';
// import { LoginRequest, LoginResponse, User } from '../types';
// import { isDemoMode } from '../../config';
// import { logger } from '../../logger';
// import {
//   getApiHeaders,
//   handleApiResponse,
//   setAuthToken
// } from '../helpers';
// import {
//   demoLoginResponse,
//   demoUser,
//   simulateDelay
// } from '../demo-data';
// import { demoStorage } from '../demo-storage';

// export const authService = {
//   /**
//    * Login user
//    */
//   async login(emailArg: string, passwordArg: string): Promise<LoginResponse> {
//     // Demo mode
//     if (isDemoMode()) {
//       logger.api('Login attempt (demo mode)');
//       await simulateDelay();

//       // Simple demo validation
//       if (emailArg === 'demo@cageriot.com' && passwordArg === 'demo123') {
//         setAuthToken(demoLoginResponse.token);
//         logger.success('Login successful (demo mode)');
//         return demoLoginResponse;
//       }

//       logger.error('Invalid demo credentials');
//       throw new Error('Invalid credentials. Use demo@cageriot.com / demo123');
//     }

//     // Live API mode
//     try {
//       logger.api('Login attempt (live API)');

//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           ...getApiHeaders(false),
//         },
//         body: JSON.stringify({
//           email: emailArg,
//           password: passwordArg,
//         }),
//       });

//       const data = await handleApiResponse<LoginResponse>(response);

//       if (data.token) {
//         setAuthToken(data.token);
//         logger.success('Login successful (live API)');
//       }

//       return data;
//     } catch (error) {
//       logger.error('Login failed:', error);
//       throw error;
//     }
//   },

//   /**
//    * Logout user
//    */
//   async logout(): Promise<void> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay(300);
//       setAuthToken(null);
//       return;
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
//         method: 'POST',
//         headers: getApiHeaders(true),
//       });

//       await handleApiResponse(response);
//     } catch (error) {
//       logger.error('Logout failed:', error);
//     } finally {
//       setAuthToken(null);
//     }
//   },

//   /**
//    * Get current user profile
//    */
//   async getCurrentUser(): Promise<User> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay();
//       // Return stored user if exists, otherwise return default demo user
//       const storedUser = demoStorage.getUser();
//       return storedUser || demoUser;
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
//         method: 'GET',
//         headers: getApiHeaders(true),
//       });

//       const data = await handleApiResponse<User>(response);
//       return data;
//     } catch (error) {
//       logger.error('Get user failed:', error);
//       throw error;
//     }
//   },

//   /**
//    * Register new user
//    */
//   async register(data: {
//     email: string;
//     password: string;
//     name: string;
//     company?: string;
//   }): Promise<LoginResponse> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay();
//       throw new Error('Registration is not available in demo mode');
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: getApiHeaders(false),
//         body: JSON.stringify(data),
//       });

//       const result = await handleApiResponse<LoginResponse>(response);

//       if (result.token) {
//         setAuthToken(result.token);
//       }

//       return result;
//     } catch (error) {
//       logger.error('Registration failed:', error);
//       throw error;
//     }
//   },

//   /**
//    * Request password reset
//    */
//   async forgotPassword(email: string): Promise<void> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay();
//       throw new Error('Password reset is not available in demo mode');
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
//         method: 'POST',
//         headers: getApiHeaders(false),
//         body: JSON.stringify({ email }),
//       });

//       await handleApiResponse(response);
//     } catch (error) {
//       logger.error('Forgot password failed:', error);
//       throw error;
//     }
//   },

//   /**
//    * Reset password
//    */
//   async resetPassword(token: string, password: string): Promise<void> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay();
//       throw new Error('Password reset is not available in demo mode');
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
//         method: 'POST',
//         headers: getApiHeaders(false),
//         body: JSON.stringify({ token, password }),
//       });

//       await handleApiResponse(response);
//     } catch (error) {
//       logger.error('Reset password failed:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update user profile
//    */
//   async updateProfile(data: Partial<User>): Promise<User> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay();
//       const currentUser = demoStorage.getUser() || demoUser;
//       const updatedUser = {
//         ...currentUser,
//         ...data,
//         updatedAt: new Date().toISOString()
//       };
//       demoStorage.setUser(updatedUser);
//       logger.success('Profile updated (demo mode)');
//       return updatedUser;
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
//         method: 'PATCH',
//         headers: getApiHeaders(true),
//         body: JSON.stringify(data),
//       });

//       const result = await handleApiResponse<User>(response);
//       return result;
//     } catch (error) {
//       logger.error('Update profile failed:', error);
//       throw error;
//     }
//   },

//   /**
//    * Delete user account
//    */
//   async deleteAccount(): Promise<void> {
//     // Demo mode
//     if (isDemoMode()) {
//       await simulateDelay();
//       demoStorage.setUser(null);
//       setAuthToken(null);
//       logger.success('Account deleted (demo mode)');
//       return;
//     }

//     // Live API mode
//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}/auth/account`, {
//         method: 'DELETE',
//         headers: getApiHeaders(true),
//       });

//       await handleApiResponse(response);
//       setAuthToken(null);
//       logger.success('Account deleted');
//     } catch (error) {
//       logger.error('Delete account failed:', error);
//       throw error;
//     }
//   },
// };

/**
 * Authentication API Service
 * Supports both demo and live API modes
 * âœ… Updated: Always allow demo login even when using live API
 */

import { API_CONFIG, getApiHeaders } from "../../config";
import { LoginRequest, LoginResponse, User } from "../types";
import { isDemoMode } from "../../config";
import { logger } from "../../logger";
import { handleApiResponse } from "../helpers";
import { demoLoginResponse, demoUser, simulateDelay } from "../demo-data";
import { demoStorage } from "../demo-storage";

// Helper functions for token management
function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export const authService = {
  /**
   * âœ… LOGIN USER (Hybrid: works for both demo & live)
   */
  async login(emailArg: string, passwordArg: string): Promise<LoginResponse> {
    // âœ… Always allow demo credentials regardless of mode
    if (emailArg === "demo@cageriot.com" && passwordArg === "demo123") {
      logger.api("Login as demo user (forced hybrid mode)");
      await simulateDelay(300); // small delay for realism
      setAuthToken(demoLoginResponse.token);
      demoStorage.setUser(demoUser);
      logger.success("Login successful (demo user)");
      return demoLoginResponse;
    }

    // ðŸ§© Keep existing demo mode logic (when explicitly in demo mode)
    if (isDemoMode()) {
      logger.api("Login attempt (demo mode)");
      await simulateDelay();

      // Simple demo validation
      if (emailArg === "demo@cageriot.com" && passwordArg === "demo123") {
        setAuthToken(demoLoginResponse.token);
        logger.success("Login successful (demo mode)");
        return demoLoginResponse;
      }

      logger.error("Invalid demo credentials");
      throw new Error("Invalid credentials. Use demo@cageriot.com / demo123");
    }

    // ðŸŒ Live API mode (unchanged)
    try {
      logger.api("Login attempt (live API)");

      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          ...getApiHeaders(false),
        },
        body: JSON.stringify({
          email: emailArg,
          password: passwordArg,
        }),
      });

      const data = await handleApiResponse<LoginResponse>(response);

      if (data.token) {
        setAuthToken(data.token);
        logger.success("Login successful (live API)");
      }

      return data;
    } catch (error) {
      logger.error("Login failed (live API):", error);
      throw error;
    }
  },

  /**
   * LOGOUT USER
   */
  async logout(): Promise<void> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay(300);
      setAuthToken(null);
      return;
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getApiHeaders(true),
      });

      await handleApiResponse(response);
    } catch (error) {
      logger.error("Logout failed:", error);
    } finally {
      setAuthToken(null);
    }
  },

  /**
   * GET CURRENT USER PROFILE
   */
  async getCurrentUser(): Promise<User> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      const storedUser = demoStorage.getUser();
      return storedUser || demoUser;
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
        method: "GET",
        headers: getApiHeaders(true),
      });

      const data = await handleApiResponse<User>(response);
      return data;
    } catch (error) {
      logger.error("Get user failed:", error);
      throw error;
    }
  },

  /**
   * REGISTER NEW USER
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }): Promise<LoginResponse> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      throw new Error("Registration is not available in demo mode");
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: "POST",
        headers: getApiHeaders(false),
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse<LoginResponse>(response);

      if (result.token) {
        setAuthToken(result.token);
      }

      return result;
    } catch (error) {
      logger.error("Registration failed:", error);
      throw error;
    }
  },

  /**
   * REQUEST PASSWORD RESET
   */
  async forgotPassword(email: string): Promise<void> {
    if (isDemoMode()) {
      await simulateDelay();
      throw new Error("Password reset is not available in demo mode");
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: getApiHeaders(false),
          body: JSON.stringify({ email }),
        }
      );

      await handleApiResponse(response);
    } catch (error) {
      logger.error("Forgot password failed:", error);
      throw error;
    }
  },

  /**
   * RESET PASSWORD
   */
  async resetPassword(token: string, password: string): Promise<void> {
    if (isDemoMode()) {
      await simulateDelay();
      throw new Error("Password reset is not available in demo mode");
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: getApiHeaders(false),
          body: JSON.stringify({ token, password }),
        }
      );

      await handleApiResponse(response);
    } catch (error) {
      logger.error("Reset password failed:", error);
      throw error;
    }
  },

  /**
   * UPDATE USER PROFILE
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    if (isDemoMode()) {
      await simulateDelay();
      const currentUser = demoStorage.getUser() || demoUser;
      const updatedUser = {
        ...currentUser,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      demoStorage.setUser(updatedUser);
      logger.success("Profile updated (demo mode)");
      return updatedUser;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: getApiHeaders(true),
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse<User>(response);
      return result;
    } catch (error) {
      logger.error("Update profile failed:", error);
      throw error;
    }
  },

  /**
   * DELETE USER ACCOUNT
   */
  async deleteAccount(): Promise<void> {
    if (isDemoMode()) {
      await simulateDelay();
      demoStorage.setUser(null);
      setAuthToken(null);
      logger.success("Account deleted (demo mode)");
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/account`, {
        method: "DELETE",
        headers: getApiHeaders(true),
      });

      await handleApiResponse(response);
      setAuthToken(null);
      logger.success("Account deleted");
    } catch (error) {
      logger.error("Delete account failed:", error);
      throw error;
    }
  },
};
