
import { API_CONFIG, getApiHeaders, handleApiResponse } from "../../config";
import type { PaginatedResponse, Track } from "../types";

function normalizeAsset(a: any): Track {
  const audioUrl =
    a.publicFile ||
    a.audioVersions?.find((v: any) => !!v.publicFile)?.publicFile ||
    "";

  return {
    id: a._id,
    title: a.title || "Untitled",
    artist: a.artistDisplayName || a.primaryArtists?.[0] || "Unknown Artist",
    artistId: "",
    album: a.label || "",
    duration: a.fileMetadata?.duration ? String(a.fileMetadata.duration) : "",
    isrc: a.isrc || "",
    audioUrl,
    plays: 0,
    revenue: 0,
    createdAt: a.createdAt || "",
    updatedAt: a.updatedAt || "",
  };
}

export const tracksService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Track>> {
    const url = new URL(`${API_CONFIG.BASE_URL}/assets/searchAssets`);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));
    if (params?.search) url.searchParams.set("search", params.search);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: getApiHeaders(true),
    });

    const json = await handleApiResponse<any>(res);
    const results = json.results || [];
    const tracks = results.map(normalizeAsset);

    return {
      data: tracks,
      pagination: {
        page: json.page || 1,
        limit: json.limit || tracks.length,
        total: json.total || tracks.length,
        totalPages: Math.ceil(
          (json.total || tracks.length) / (json.limit || tracks.length || 1)
        ),
      },
    };
  },

  async create(data: {
    title: string;
    artistName?: string;
    label?: string;
    genre?: string;
    isrc?: string;
  }): Promise<Track> {
    const body = {
      trackMetadataLanguage: "English",
      trackMetadataLanguageCode: "EN",
      title: data.title,
      artistDisplayName: data.artistName || "Unknown Artist",
      primaryArtists: [data.artistName],
      primaryGenre: data.genre || "Pop",
      secondaryGenre: "",
      label: data.label || "",
      type: "Audio",
      explicit: "None",
      priceTier: "Front",
      pYear: new Date().getFullYear(),
      previewStart: 0,
      isrc: data.isrc || "",
    };

    const res = await fetch(`${API_CONFIG.BASE_URL}/assets/createAsset`, {
      method: "POST",
      headers: getApiHeaders(true),
      body: JSON.stringify(body),
    });

    const json = await handleApiResponse<any>(res);
    return normalizeAsset(json.result || json);
  },

  /** GET METADATA BY TRACK ID (robust) */
  async getByTrackId(trackId: string): Promise<any> {
    if (!trackId) {
      throw new Error("trackId is required");
    }

    // Correct URL
    const url = `${
      API_CONFIG.BASE_URL
    }/assets/getAsset?trackId=${encodeURIComponent(trackId)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(true),
    });

    const json = await handleApiResponse<any>(res);

    // API returns EXACTLY ONE OBJECT like your JSON — return as-is
    if (json && typeof json === "object") {
      return json;
    }

    // Safety fallback
    return null;
  },

  /**
   *  Get all tracks for a Release (to extract trackId)
   */
  async getTracksForRelease(releaseId: string): Promise<any[]> {
    const url = `${
      API_CONFIG.BASE_URL
    }/assets/searchAssets?releaseId=${encodeURIComponent(releaseId)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(true),
    });

    const json = await handleApiResponse<any>(res);
    return json.results || [];
  },
};
