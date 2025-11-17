
import { API_CONFIG, isDemoMode } from "../../config";
import { Release, CreateReleaseRequest, ListParams } from "../types";
import { logger } from "../../logger";
import { getApiHeaders, handleApiResponse } from "../helpers";
import { demoReleases, simulateDelay } from "../demo-data";
import { demoStorage } from "../demo-storage";

/**
 * Normalize RightsHub API release into your Release interface
 * (IMAGE FIX ADDED HERE)
 */
function normalizeRelease(item: any): Release {
  return {
    id: item._id,
    title: item.title || "Untitled",
    artist: item.artistDisplayName || (item.primaryArtists?.[0] ?? "Unknown"),
    artistId: item.accountId || "",

    type:
      (item.format === "Album" && "Album") ||
      (item.format === "Single" && "Single") ||
      (item.format === "EP" && "EP") ||
      "Album",

    releaseDate: item.releaseDate || "",
    description: item.description || "",

    //  FIXED IMAGE (always works)
    coverArt: item._id
      ? `https://packshot.rightshub.net/${item._id}`
      : "/no-image.png",

    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || "",
  };
}

export const releasesService = {
  /**
   * GET ALL RELEASES (RightsHub)
   */
  async getAll(params?: ListParams): Promise<{
    data: Release[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    // Demo mode
    if (isDemoMode()) {
      logger.api("Fetching releases (demo mode)");
      await simulateDelay();

      let releases = [
        ...demoReleases,
        ...demoStorage.getAll<Release>("releases"),
      ];

      if (params?.search) {
        const search = params.search.toLowerCase();
        releases = releases.filter(
          (r) =>
            r.title.toLowerCase().includes(search) ||
            r.artist.toLowerCase().includes(search)
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        data: releases.slice(start, end),
        pagination: {
          page,
          limit,
          total: releases.length,
          totalPages: Math.ceil(releases.length / limit),
        },
      };
    }

    // Live API mode
    try {
      const url = `${API_CONFIG.BASE_URL}/releases/searchReleases`;

      const response = await fetch(url, {
        method: "GET",
        headers: getApiHeaders(false),
      });

      const data = await handleApiResponse(response);

      const releases: Release[] = Array.isArray(data.results)
        ? data.results.map(normalizeRelease)
        : [];

      if (params?.search) {
        const q = params.search.toLowerCase();
        return {
          data: releases.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              r.artist.toLowerCase().includes(q)
          ),
        };
      }

      return { data: releases };
    } catch (error) {
      logger.error("Get releases failed:", error);
      throw error;
    }
  },

  /**
   * GET RELEASE DETAILS (RightsHub)
   */
  async getById(releaseId: string): Promise<any> {
    if (isDemoMode()) {
      logger.api(`Fetching release ${releaseId} (demo mode)`);
      await simulateDelay();

      const release =
        demoReleases.find((r) => r.id === releaseId) ||
        demoStorage.getById<Release>("releases", releaseId);

      if (!release) throw new Error("Release not found");

      return release;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/releases/getRelease?releaseId=${releaseId}`,
        {
          method: "GET",
          headers: getApiHeaders(true),
        }
      );

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error(`Get release ${releaseId} failed:`, error);
      throw error;
    }
  },

  /**
   * CREATE RELEASE
   */
  async create(releaseData: CreateReleaseRequest): Promise<Release> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/releases/createRelease`,
        {
          method: "POST",
          headers: getApiHeaders(true),
          body: JSON.stringify(releaseData),
        }
      );

      return await handleApiResponse(response);
    } catch (error) {
      logger.error("Create release failed:", error);
      throw error;
    }
  },

  /**
   * UPDATE RELEASE
   */
  async update(
    id: string,
    releaseData: Partial<CreateReleaseRequest>
  ): Promise<Release> {
    if (isDemoMode()) {
      logger.api(`Updating release ${id} (demo mode)`);
      await simulateDelay();

      const release =
        demoReleases.find((r) => r.id === id) ||
        demoStorage.getById<Release>("releases", id);

      if (!release) throw new Error("Release not found");

      const updatedRelease = {
        ...release,
        ...releaseData,
        updatedAt: new Date().toISOString(),
      };

      const stored = demoStorage.getById<Release>("releases", id);
      if (stored) demoStorage.update("releases", id, updatedRelease);

      return updatedRelease;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/releases/${id}`, {
        method: "PUT",
        headers: getApiHeaders(true),
        body: JSON.stringify(releaseData),
      });

      return await handleApiResponse(response);
    } catch (error) {
      logger.error(`Update release ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * DELETE RELEASE
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting release ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete("releases", id);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/releases/${id}`, {
        method: "DELETE",
        headers: getApiHeaders(true),
      });

      await handleApiResponse(response);
    } catch (error) {
      logger.error(`Delete release ${id} failed:`, error);
      throw error;
    }
  },
};
