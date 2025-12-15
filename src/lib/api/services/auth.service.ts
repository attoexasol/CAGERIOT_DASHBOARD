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
import { LoginRequest, LoginResponse, User, SignupResponse, LoginApiResponse } from "../types";
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
   * LOGIN USER
   */
  async login(emailArg: string, passwordArg: string): Promise<LoginResponse> {
    try {
      logger.api("Login attempt");

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

      const apiResponse = await handleApiResponse<LoginApiResponse>(response);

      // Transform the API response to match LoginResponse format
      if (apiResponse.status && apiResponse.data) {
        const loginResponse: LoginResponse = {
          token: apiResponse.data.token,
          user: {
            id: apiResponse.data.user.id,
            name: apiResponse.data.user.name,
            email: apiResponse.data.user.email,
            organization: apiResponse.data.user.organization,
            company: apiResponse.data.user.organization,
            user_role: apiResponse.data.user.user_role,
            role: apiResponse.data.user.user_role,
            createdAt: apiResponse.data.user.created_at || apiResponse.data.user.createdAt,
          },
        };

        if (loginResponse.token) {
          setAuthToken(loginResponse.token);
          
          // Store admin's actual user ID if they're an admin
          // This helps us track when they're impersonating another user
          if (loginResponse.user.user_role === 'admin' || loginResponse.user.role === 'admin') {
            localStorage.setItem('admin_user_id', String(loginResponse.user.id));
            // Clear any previous impersonation when logging in
            localStorage.removeItem('impersonated_user_id');
          } else {
            // Clear admin tracking for non-admin users
            localStorage.removeItem('admin_user_id');
            localStorage.removeItem('impersonated_user_id');
          }
          
          logger.success("Login successful");
        }

        return loginResponse;
      } else {
        throw new Error(apiResponse.message || "Login failed");
      }
    } catch (error: any) {
      logger.error("Login failed:", error);
      const errorMessage = error?.message || error?.data?.message || "Invalid email or password. Try again.";
      throw new Error(errorMessage);
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
      // Clear impersonation data
      localStorage.removeItem('admin_user_id');
      localStorage.removeItem('impersonated_user_id');
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
      // Clear impersonation data on logout
      localStorage.removeItem('admin_user_id');
      localStorage.removeItem('impersonated_user_id');
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
    organization?: string;
    company?: string;
  }): Promise<LoginResponse> {
    try {
      logger.api("Registration attempt");

      // Prepare request body - use organization if provided, otherwise use company
      const requestBody = {
        name: data.name,
        email: data.email,
        password: data.password,
        organization: data.organization || data.company || "",
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/signup`, {
        method: "POST",
        headers: getApiHeaders(false),
        body: JSON.stringify(requestBody),
      });

      const result = await handleApiResponse<SignupResponse>(response);

      // Transform the API response to match LoginResponse format
      if (result.status && result.data) {
        const loginResponse: LoginResponse = {
          token: result.data.token,
          user: {
            id: result.data.user.id,
            name: result.data.user.name,
            email: result.data.user.email,
            organization: result.data.user.organization,
            company: result.data.user.organization,
            user_role: result.data.user.user_role,
            role: result.data.user.user_role,
            createdAt: result.data.user.created_at || result.data.user.createdAt,
          },
        };

        if (loginResponse.token) {
          setAuthToken(loginResponse.token);
          
          // Store admin's actual user ID if they're an admin
          if (loginResponse.user.user_role === 'admin' || loginResponse.user.role === 'admin') {
            localStorage.setItem('admin_user_id', String(loginResponse.user.id));
            localStorage.removeItem('impersonated_user_id');
          } else {
            localStorage.removeItem('admin_user_id');
            localStorage.removeItem('impersonated_user_id');
          }
          
          logger.success("Registration successful");
        }

        return loginResponse;
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error: any) {
      logger.error("Registration failed:", error);
      throw new Error(error?.message || "Registration failed. Please try again.");
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
