import { API_CONFIG, isDemoMode } from "../../config";
import { ListParams } from "../types";
import { logger } from "../../logger";
import { demoStorage } from "../demo-storage";
import { demoTracks, simulateDelay } from "../demo-data";

// Track interface for service
interface Track {
  id: string;
  title: string;
  artist?: string;
  artistId?: string;
  album?: string;
  duration?: string;
  isrc?: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create track request interface
interface CreateTrackRequest {
  title: string;
  [key: string]: any; // Allow additional fields
}

/** Normalize API response */
function normalizeTrack(item: any): Track {
  // Check all possible audio URL fields from API response
  const audioUrl = item.audio_url || item.audioUrl || item.publicFile || "";
  
  return {
    id: String(item.id),
    title: item.title || "Untitled",
    artist: item.artist || item.artist_display_name || "Unknown Artist",
    artistId: item.artistId || "",
    album: item.album || "",
    duration: item.duration || "",
    isrc: item.isrc || "",
    audioUrl: audioUrl,
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
  };
}

/** Auth header generator - Uses API Key ID for Basic Auth */
function getBasicToken() {
  let token = localStorage.getItem("authToken");

  if (!token) {
    // Use API Key ID for Basic Auth (as username, empty password)
    // The -u flag in curl means Basic Auth with username:password
    // For API Key ID, we use it as username with empty password
    const apiKeyId = API_CONFIG.USERNAME || "";
    // Basic Auth format: base64(username:password)
    token = btoa(`${apiKeyId}:`);
    localStorage.setItem("authToken", token);
  }

  return token;
}

export const tracksService = {
  /** ------------------------------------------------------
   * LIST WRAPPER (for TracksPage compatibility)
   * ------------------------------------------------------*/
  async list(params?: ListParams) {
    return this.getAll(params);
  },

  /** ------------------------------------------------------
   * GET ALL TRACKS
   * ------------------------------------------------------*/
  async getAll(params?: ListParams): Promise<{
    data: Track[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    if (isDemoMode()) {
      logger.api("Fetching tracks (demo mode)");
      await simulateDelay();

      let tracks = [...demoTracks, ...demoStorage.getAll<Track>("tracks")];

      if (params?.search) {
        const s = params.search.toLowerCase();
        tracks = tracks.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.artist.toLowerCase().includes(s)
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;

      return {
        data: tracks.slice(start, start + limit),
        pagination: {
          page,
          limit,
          total: tracks.length,
          totalPages: Math.ceil(tracks.length / limit),
        },
      };
    }

    try {
      const token = getBasicToken();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("include_files", "true");
      if (params?.page) {
        queryParams.append("page", String(params.page));
      }
      if (params?.limit) {
        queryParams.append("limit", String(params.limit));
      }
      if (params?.search) {
        queryParams.append("search", params.search);
      }
      
      const url = `${API_CONFIG.BASE_URL}/tracks/?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      const tracks = Array.isArray(data.results)
        ? data.results.map(normalizeTrack)
        : [];

      return {
        data: tracks,
        pagination: {
          page: data.current_page || 1,
          limit: params?.limit || 10,
          total: data.total_results || 0,
          totalPages: Math.ceil(
            (data.total_results || 0) / (params?.limit || 10)
          ),
        },
      };
    } catch (err) {
      logger.error("Get tracks failed:", err);
      throw err;
    }
  },

  /** ------------------------------------------------------
   * GET TRACK BY ID
   * ------------------------------------------------------*/
  async getById(trackId: string): Promise<Track> {
    if (isDemoMode()) {
      await simulateDelay();

      const track =
        demoTracks.find((t) => t.id === trackId) ||
        demoStorage.getById<Track>("tracks", trackId);

      if (!track) throw new Error("Track not found");
      return track;
    }

    try {
      const token = getBasicToken();
      const url = `${API_CONFIG.BASE_URL}/tracks/${trackId}`;

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch track: ${response.status}`);
      }

      const data = await response.json();
   
      return normalizeTrack(data);
    } catch (err) {
      logger.error(`Get track ${trackId} failed:`, err);
      throw err;
    }
  },

  /** ------------------------------------------------------
   * CREATE TRACK
   * ------------------------------------------------------*/
  async create(trackData: CreateTrackRequest): Promise<Track> {
    if (isDemoMode()) {
      await simulateDelay();
      const newTrack: Track = {
        id: `demo-${Date.now()}`,
        ...trackData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoStorage.add("tracks", newTrack);
      return newTrack;
    }

    try {
      const token = getBasicToken();
      // Ensure URL ends with trailing slash as per API specification
      const url = `${API_CONFIG.BASE_URL}/tracks/`;

      // Only title is required, but we send all data
      // Ensure title is present and trimmed
      const title = (trackData.title || "").trim();
      
      // Validate required field
      if (!title || title === "") {
        throw new Error("Title is required");
      }

      // Clean payload - convert empty strings to null, keep all fields
      const cleanPayload = (obj: any, depth = 0): any => {
        // Prevent infinite recursion
        if (depth > 10) return obj;
        
        // If undefined, return undefined (don't include in payload)
        if (obj === undefined) {
          return undefined;
        }
        
        // If null, keep as null
        if (obj === null) {
          return null;
        }
        
        // Convert empty strings to null
        if (obj === '') {
          return null;
        }
        
        // Handle arrays
        if (Array.isArray(obj)) {
          // If array is empty, return null
          if (obj.length === 0) {
            return null;
          }
          // Recursively clean each item in the array
          const cleaned = obj.map(item => cleanPayload(item, depth + 1));
          return cleaned;
        }
        
        // Handle objects
        if (typeof obj === 'object') {
          const cleaned: any = {};
          for (const [key, value] of Object.entries(obj)) {
            // Always keep title as-is (even if empty, it's required)
            if (key === 'title') {
              cleaned[key] = value;
              continue;
            }
            
            // Recursively clean the value
            const cleanedValue = cleanPayload(value, depth + 1);
            
            // Include the field even if it's null (to send null for empty fields)
            // Only skip if it's undefined (which means it shouldn't be in the payload)
            if (cleanedValue !== undefined) {
              cleaned[key] = cleanedValue;
            }
          }
          return cleaned;
        }
        
        // For primitive values, return as-is
        return obj;
      };

      // Build payload with cleaned data
      const cleanedData = cleanPayload(trackData);
      const payload = {
        title,
        ...(cleanedData || {}),
      };

      // Log the request for debugging
      console.log(" Creating track:", {
        url,
        method: "POST",
        payload: JSON.stringify(payload, null, 2),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token.substring(0, 10)}...`,
        },
      });

      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Get response text first to handle both success and error cases
      const responseText = await response.text();
      let responseData: any = {};

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        // If response is not JSON, use the text as error message
        console.error("❌ Failed to parse response:", responseText);
        if (!response.ok) {
          throw new Error(responseText || `Failed to create track: ${response.status}`);
        }
      }

      // Log response for debugging
      console.log("📥 API Response:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      });

      if (!response.ok) {
        // Extract error message from API response
        const errorMessage = 
          responseData.message || 
          responseData.error || 
          responseData.detail ||
          responseData.non_field_errors?.[0] ||
          (typeof responseData === 'string' ? responseData : `Failed to create track: ${response.status} ${response.statusText}`);
        
        // Extract field-specific errors from API response
        // API typically returns errors in format: { field_name: ["error message"] }
        const fieldErrors: Record<string, string[]> = {};
        if (responseData && typeof responseData === 'object') {
          for (const [key, value] of Object.entries(responseData)) {
            // Skip non-field error keys
            if (key !== 'message' && key !== 'error' && key !== 'detail' && key !== 'non_field_errors') {
              if (Array.isArray(value)) {
                fieldErrors[key] = value;
              } else if (typeof value === 'string') {
                fieldErrors[key] = [value];
              }
            }
          }
        }
        
        console.error("❌ API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          fieldErrors: fieldErrors,
          fullResponse: responseData,
          responseText: responseText,
        });
        
        // For 500 errors, log the full request details for debugging
        if (response.status === 500) {
          console.error("💥 Server Error (500) - Full Request Details:", {
            url,
            method: "POST",
            payload: JSON.stringify(payload, null, 2),
            payloadSize: JSON.stringify(payload).length,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token.substring(0, 10)}...`,
            },
            response: responseText,
          });
        }
        
        // Create error object with both message and field errors
        const error: any = new Error(errorMessage || `Server error: ${response.status} ${response.statusText}`);
        error.fieldErrors = fieldErrors;
        error.responseData = responseData;
        throw error;
      }

      // Success response
      const data = responseData;
      return normalizeTrack(data);
    } catch (err: any) {
      logger.error("Create track failed:", err);
      // Re-throw with the error message for frontend display
      throw new Error(err.message || "Failed to create track");
    }
  },

  /** ------------------------------------------------------
   * UPDATE TRACK
   * ------------------------------------------------------*/
  async update(
    id: string,
    trackData: Partial<CreateTrackRequest>
  ): Promise<Track> {
    if (isDemoMode()) {
      await simulateDelay();

      const track =
        demoTracks.find((t) => t.id === id) ||
        demoStorage.getById<Track>("tracks", id);

      if (!track) throw new Error("Track not found");

      const updatedTrack = {
        ...track,
        ...trackData,
        updatedAt: new Date().toISOString(),
      };

      demoStorage.update("tracks", id, updatedTrack);
      return updatedTrack;
    }

    try {
      const token = getBasicToken();
      const url = `${API_CONFIG.BASE_URL}/tracks/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(trackData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update track: ${response.status}`);
      }

      const data = await response.json();
      // For single track, check all possible audio URL fields
      const normalized = normalizeTrack(data);
      // Also check raw response for audio URLs that might not be in normalizeTrack
      const audioUrl = data.audio_url || data.audioUrl || data.publicFile || normalized.audioUrl || "";
      return {
        ...normalized,
        audioUrl: audioUrl,
      };
    } catch (err) {
      logger.error(`Update track ${id} failed:`, err);
      throw err;
    }
  },

  /** ------------------------------------------------------
   * DELETE TRACK
   * ------------------------------------------------------*/
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      await simulateDelay();
      demoStorage.delete("tracks", id);
      return;
    }

    try {
      const token = getBasicToken();
      const url = `${API_CONFIG.BASE_URL}/tracks/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete track: ${response.status}`);
      }
    } catch (err) {
      logger.error(`Delete track ${id} failed:`, err);
      throw err;
    }
  },
};
