import { API_CONFIG, isDemoMode } from "../../config";
import { Release, CreateReleaseRequest, ListParams } from "../types";
import { logger } from "../../logger";
import { getApiHeaders, handleApiResponse } from "../helpers";
import { demoReleases, simulateDelay } from "../demo-data";
import { demoStorage } from "../demo-storage";

/**
 * Normalize API release response
 * API returns minimal data: { id, title, upc }
 */
// function normalizeRelease(item: any): Release {
//   const isrc = item?.discs?.[0]?.disc_tracks?.[0]?.track?.isrc || null;
//  const trackSongs =
//    item.discs?.flatMap((disc: any) =>
//      disc.disc_tracks?.map((dt: any) => ({
//        id: dt.track?.id || null,
//        title: dt.track?.title || null,
//        isrc: dt.track?.isrc || null,
//        artist_display_name: dt.track?.artist_display_name || null,
//        duration: dt.track?.duration || null,
//        genre: dt.track?.genre || null,
//        label: dt.track?.label || null,
//        raw: dt.track || null, 
//      }))
//    ) || [];
//   return {
//     ...item,
//     id: String(item.id),
//     title: item.title || "Untitled",
//     artist: item.artist || "Unknown Artist",
//     artistId: item.artistId || "",
//     type: item.type || "Album",
//     releaseDate: item.releaseDate || "",
//     description: item.description || "",
//     coverArt: item.coverArt || "/no-image.png",
//     upc: item.upc || "",
//     createdAt: item.createdAt || new Date().toISOString(),
//     updatedAt: item.updatedAt || new Date().toISOString(),
//     status: item.status,
//     isrc: isrc,
//     configuration: item.configuration,
//     metadata_language: item.metadata_language,
//     release_date: item.release_date,
//     label: item.label
//       ? {
//           id: item.label.id,
//           name: item.label.name,
//         }
//       : null,
//     version: item.version,
//     pline_year: item.pline_year,
//     cline_year: item.cline_year,
//     genre: item.genre,
//     trackSongs,
//   };
// }
// inside src/lib/api/services/releases.service.ts

function normalizeRelease(item: any, isMinimal: boolean = false): any {
  // Handle minimal API response (from list endpoint: only id, title, upc)
  if (isMinimal || (!item.discs && !item.artist && !item.release_date)) {
    return {
      id: String(item.id),
      title: item.title || "Untitled",
      artist: item.artist || "Unknown Artist",
      artistId: item.artistId || "",
      type: item.type || "Album",
      releaseDate: item.release_date ?? item.releaseDate ?? "",
      description: item.description ?? "",
      coverArt: item.coverArt || "/no-image.png",
      upc: item.upc ?? "",
      createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
      status: item.status ?? "",
      configuration: item.configuration ?? "",
      isrc: item.isrc ?? "",
      metadata_language: item.metadata_language ?? "",
      release_date: item.release_date ?? "",
      label: item.label ? { id: item.label.id, name: item.label.name } : null,
      version: item.version ?? "",
      cline_year: item.cline_year ?? "",
      pline_year: item.pline_year ?? "",
      genre: item.genre ?? "",
      trackSongs: [],
      _raw: item,
    };
  }

  // Build trackSongs from nested discs -> disc_tracks -> track
  const trackSongs =
    item?.discs?.flatMap((disc: any) =>
      (disc?.disc_tracks || []).map((dt: any) => {
        const t = dt?.track;
        if (!t) return null;
        return {
          id: t.id ?? null,
          title: t.title ?? null,
          isrc: t.isrc ?? null,
          artist_display_name: t.artist_display_name ?? null,
          duration: t.duration ?? null,
          genre: t.genre ?? null,
          label: t.label ?? null,
          raw: t ?? null,
        };
      })
    ).filter(Boolean) || [];

  const firstIsrc = trackSongs.length > 0 ? trackSongs[0].isrc : null;

  return {
    // original normalized fields (keep as your Release type expects)
    id: String(item.id),
    title: item.title || "Untitled",
    artist: item.artist || item.artist_display_name || "Unknown Artist",
    artistId: item.artistId || "",
    type: item.type || "Album",
    releaseDate: item.release_date ?? item.releaseDate ?? "",
    description: item.internal_synopsis ?? item.description ?? "",
    coverArt: (() => {
      // Priority 1: Direct cover_art_url from API response
      if (item.cover_art_url) return item.cover_art_url;
      
      // Priority 2: Nested cover_art object with cover_art_url
      if (item.cover_art?.cover_art_url) return item.cover_art.cover_art_url;
      
      // Priority 3: cover_art_id - construct download URL (API will return signed URL)
      // Note: This is a fallback - ideally cover_art_url should be in the response
      if (item.cover_art_id) {
        return `${API_CONFIG.BASE_URL}/cover_art/${item.cover_art_id}/download`;
      }
      
      // Priority 4: cover_art object with id
      if (item.cover_art?.id) {
        return `${API_CONFIG.BASE_URL}/cover_art/${item.cover_art.id}/download`;
      }
      
      // Priority 5: Legacy coverArt field
      if (item.coverArt) return item.coverArt;
      
      // Default: no image placeholder
      return "/no-image.png";
    })(),
    upc: item.upc ?? "",
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),

    // extra data from raw API
    status: item.status ?? null,
    configuration: item.configuration ?? null,
    metadata_language: item.metadata_language ?? null,
    genre: item.genre ?? null,
    version: item.version ?? null,
    pline_year: item.pline_year ?? null,
    cline_year: item.cline_year ?? null,
    label: item.label ? { id: item.label.id, name: item.label.name } : null,
    release_date: item.release_date,
    // tracks
    trackSongs,
    isrc: firstIsrc,
    // keep original raw object in case you need it:
    _raw: item,
  };
}

export const releasesService = {
  /**
   * GET ALL RELEASES
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
      // Get or create token
      let token = localStorage.getItem("authToken");

      if (!token) {
        const username = import.meta.env.VITE_API_USERNAME;
        const password =
          import.meta.env.VITE_API_PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem("authToken", token);
        console.log("✅ Token created and stored in localStorage");
      }

      // Build URL using BASE_URL from config
    let url = `${API_CONFIG.BASE_URL}/releases`;


      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 API Response:", data);
      // Handle the API response structure: { results: [...], current_page, total_results, ... }
      const releases: Release[] = Array.isArray(data.results)
        ? data.results.map((item: any) => normalizeRelease(item, true)) // Use minimal normalization for list endpoint
        : [];

      console.log(`✅ Normalized ${releases.length} releases`);

      const pagination = {
        page: data.current_page || 1,
        limit: params?.limit || 10,
        total: data.total_results || releases.length,
        totalPages: Math.ceil((data.total_results || releases.length) / (params?.limit || 10)),
      };

      return { data: releases, pagination };
    } catch (error) {
      logger.error("Get releases failed:", error);
      throw error;
    }
  },

  /**
   * GET RELEASE BY ID
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
      let token = localStorage.getItem("authToken");

      if (!token) {
        const username = import.meta.env.VITE_API_USERNAME;
        const password =
          import.meta.env.VITE_API_PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem("authToken", token);
      }

      const url = `${API_CONFIG.BASE_URL}/releases/${releaseId}`;

      console.log("📡 Fetching release from:", url);

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch release: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      return normalizeRelease(data);
    } catch (error) {
      logger.error(`Get release ${releaseId} failed:`, error);
      throw error;
    }
  },

  /**
   * CREATE RELEASE
   */
  async create(releaseData: CreateReleaseRequest): Promise<Release> {
    if (isDemoMode()) {
      logger.api("Creating release (demo mode)");
      await simulateDelay();

      const newRelease: any = {
        id: String(Date.now()),
        artist: "Demo Artist",
        artistId: "",
        coverArt: "/no-image.png",
        upc: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "",
        isrc: "",
        metadata_language: "",
        label: null,
        version: "",
        cline_year: "",
        pline_year: "",
        genre: "",
        ...releaseData,
        title: releaseData.title || "Untitled",
        type: releaseData.type || "Album",
        releaseDate: releaseData.releaseDate || "",
        description: releaseData.description || "",
        release_date: releaseData.releaseDate || "",
      };

      demoStorage.add("releases", newRelease);
      return newRelease;
    }

    try {
      let token = localStorage.getItem("authToken");

      if (!token) {
        const username = import.meta.env.VITE_API_USERNAME || "EJLLN8KJ";
        const password =
          import.meta.env.VITE_API_PASSWORD ||
          "0cb81fba-adba-4942-ae0f-d2f577571dde";
        token = btoa(`${username}:${password}`);
        localStorage.setItem("authToken", token);
      }

      const url = `${API_CONFIG.BASE_URL}/releases`;

      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(releaseData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create release: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log("✅ API Response:", apiResponse);

      // Handle API response structure: { status, message, data: { ... } }
      const responseReleaseData = apiResponse.data || apiResponse;
      
      // Return both normalized release and raw response for cover_art extraction
      const normalizedRelease = normalizeRelease(responseReleaseData);
      
      // Attach raw response data for access to nested cover_art object
      return {
        ...normalizedRelease,
        _rawResponse: apiResponse,
      } as any;
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
      let token = localStorage.getItem("authToken");

      if (!token) {
        const username = import.meta.env.VITE_API_USERNAME || "EJLLN8KJ";
        const password =
          import.meta.env.VITE_API_PASSWORD ||
          "0cb81fba-adba-4942-ae0f-d2f577571dde";
        token = btoa(`${username}:${password}`);
        localStorage.setItem("authToken", token);
      }

      const url = `${API_CONFIG.BASE_URL}/releases/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(releaseData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update release: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      return normalizeRelease(data);
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
      let token = localStorage.getItem("authToken");

      if (!token) {
        const username = import.meta.env.VITE_API_USERNAME || "EJLLN8KJ";
        const password =
          import.meta.env.VITE_API_PASSWORD ||
          "0cb81fba-adba-4942-ae0f-d2f577571dde";
        token = btoa(`${username}:${password}`);
        localStorage.setItem("authToken", token);
      }

      const url = `${API_CONFIG.BASE_URL}/releases/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete release: ${response.status}`);
      }

      console.log("✅ Release deleted successfully");
    } catch (error) {
      logger.error(`Delete release ${id} failed:`, error);
      throw error;
    }
  },
};
