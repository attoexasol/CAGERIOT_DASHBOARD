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

// Auth Types
export interface User {
  id: string | number;
  name: string;
  email: string;
  organization?: string;
  company?: string;
  user_role?: string;
  role?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

export interface SignupResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
  impersonating?: string;
}

export interface LoginApiResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
  impersonating?: string;
}

// Artist Types
export interface Artist {
  id: number | string;
  name: string;
  apple_url?: string | null;
  created_at?: string;
  deleted_at?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  ipi_name_numbers?: any[];
  rights_controlled?: boolean;
  spotify_url?: string | null;
  updated_at?: string;
  usa_license_indicator?: string | null;
  x_url?: string | null;
  youtube_url?: string | null;
  soundcloud_url?: string | null;
  // Legacy fields for backward compatibility
  email?: string;
  role?: string;
  phone?: string;
  bio?: string;
  totalReleases?: number;
  totalStreams?: number;
  totalRoyalties?: number;
  joinDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArtistRequest {
  name: string; // Required
  spotify_url?: string | null;
  apple_url?: string | null;
  youtube_url?: string | null;
  soundcloud_url?: string | null;
  instagram_url?: string | null;
  // Legacy fields for backward compatibility
  email?: string;
  role?: string;
  phone?: string;
  bio?: string;
}
