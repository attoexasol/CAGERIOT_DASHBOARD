export interface TrackSong {
  id: number | null;
  title: string | null;
  isrc: string | null;
  artist_display_name: string | null;
  duration: number | null;
  genre: string | null;
  label: {
    id: number;
    name: string;
  } | null;
  raw: any; 
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  type: "Album" | "Single" | "EP";
  releaseDate: string;
  description: string;
  coverArt: string;
  upc?: string;
  createdAt: string;
  updatedAt: string;
  configuration: string;
  status: string;
  isrc: string;
  metadata_language: string;
  release_date: string;
  label?: {
    id: number | string;
    name: string;
  } | null;
  version: string;
  cline_year: string;
  pline_year: string;
  genre: string;
  trackSongs?: TrackSong[];
}

export interface CreateReleaseRequest {
  title: string;
  artist?: string;
  artistId?: string;
  type: "Album" | "Single" | "EP";
  releaseDate: string;
  description?: string;
  coverArt?: string;
  upc?: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
