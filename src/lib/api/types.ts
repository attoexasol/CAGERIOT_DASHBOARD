

export type Maybe<T> = T | null | undefined; 

// ---------- Auth ----------
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  company?: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

// ---------- Releases ----------
export interface Release {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  type: 'Single' | 'Album' | 'EP';
  releaseDate: string;
  description?: string;
  coverArt?: string; // ★ changed (optional)
  upc?: string;
  labelId?: string;
  tracks?: Track[];
  totalTracks?: number;
  revenue?: number;
  streams?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReleaseRequest {
  title: string;
  artistId: string;
  type: 'Single' | 'Album' | 'EP';
  releaseDate: string;
  description?: string;
  coverArt?: string;
  upc?: string;
  labelId?: string;
}

// ---------- Tracks ----------
export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  releaseId?: string;
  album?: string;
  duration?: string;
  isrc?: string;
  audioUrl?: string;
  plays: number;
  revenue: number;
  writers?: Writer[];
  producers?: Producer[];
  createdAt?: string;
  updatedAt?: string;
  type?: "Audio" | "Video" | string;
}

export interface CreateTrackRequest {
  title: string;
  artistId: string;
  releaseId?: string;
  duration?: string;    
  isrc?: string;
  audioUrl?: string;
}

// ---------- Artists ----------
export interface Artist {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  totalRoyalties: number;
  totalReleases: number;
  totalStreams: number;
  joinDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtistRequest {
  name: string;
  role: string;
  email: string;
  phone?: string;
  bio?: string;
}

// ---------- Videos ----------
export interface Video {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: number;
  releaseId?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Collaborators ----------
export interface Performer {
  id: string;
  name: string;
  instrument: string;
  email: string;
  phone?: string;
  projects: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Producer {
  id: string;
  name: string;
  role: 'Producer' | 'Audio Engineer' | 'Mixing Engineer' | 'Mastering Engineer';
  email: string;
  phone?: string;
  credits: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Writer {
  id: string;
  name: string;
  email: string;
  ipiNumber: string;
  songs: number;
  royalties: number;
  publisherId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Publishers / Labels ----------
export interface Publisher {
  id: string;
  name: string;
  catalogSize: number;
  revenue: number;
  territory: string;
  contact?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  artists: number;
  releases: number;
  revenue: number;
  contact?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Finance ----------
export interface Royalty {
  id: string;
  trackId: string;
  artistId: string;
  amount: number;
  source: 'streaming' | 'mechanical' | 'performance' | 'sync';
  platform?: string;
  period: string;
  status: 'pending' | 'processing' | 'paid';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payout {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  collaboratorType: 'artist' | 'writer' | 'producer' | 'performer';
  amount: number;
  period: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Dashboard ----------
export interface Stats {
  totalReleases: number;
  totalArtists: number;
  totalTracks: number;
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyRoyalties: number;
  totalStreams: number;
  revenueGrowth: number;
  artistGrowth: number;
}

export interface RoyaltyStats {
  total: number;
  bySource: {
    streaming: number;
    mechanical: number;
    performance: number;
    sync: number;
  };
  byPlatform: {
    spotify: number;
    appleMusic: number;
    youtube: number;
    other: number;
  };
  monthlyBreakdown: Array<{
    month: string;
    streaming: number;
    mechanical: number;
    performance: number;
  }>;
  topTracks: Array<{
    trackId: string;
    title: string;
    revenue: number;
  }>;
}

export interface DashboardData {
  stats: Stats;
  recentReleases: Release[];
  topArtists: Artist[];
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

// ---------- List / API helpers ----------
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

// ★ added
export interface ApiResponse<T> {
  status?: string;
  message?: string;
  data: T;
}

// ★ added
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ★ added
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ---------- Demo compatibility ----------
export interface DashboardStats {
  totalReleases: number;
  totalArtists: number;
  totalStreams: number;
  totalRevenue: number;
  recentReleases: Release[];
  topArtists: Artist[];
  revenueChart: Array<{ month: string; revenue: number }>;
  streamsChart: Array<{ month: string; streams: number }>;
}

export interface PayoutRecord {
  id: string;
  artistId: string;
  artistName: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  date: string;
  period: string;
}

export interface RoyaltyRecord {
  id: string;
  trackId: string;
  trackName: string;
  artistName: string;
  streams: number;
  amount: number;
  period: string;
  platform: string;
}
