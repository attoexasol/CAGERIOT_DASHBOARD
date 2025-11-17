/**
 * Demo Data for Demo Mode
 * This data is used when VITE_USE_LIVE_API=false
 */

import type { 
  LoginResponse, 
  User, 
  Release, 
  Artist, 
  Track,
  DashboardStats,
  PayoutRecord,
  RoyaltyRecord,
  Video,
  Label,
  Publisher,
  Writer,
  Producer,
  Performer
} from './types';

// Demo User
export const demoUser: User = {
  id: '1',
  email: 'demo@cageriot.com',
  name: 'Demo User',
  company: 'Cage Riot Records',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z',
};

// Demo Login Response
export const demoLoginResponse: LoginResponse = {
  token: 'demo_token_12345',
  user: demoUser,
  expiresIn: 86400,
};

// Demo Releases
export const demoReleases: Release[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'The Waves',
    artistId: '1',
    type: 'Album',
    releaseDate: '2024-06-15',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
    totalTracks: 12,
    streams: 1250000,
    revenue: 5234.50,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    artistId: '2',
    type: 'Single',
    releaseDate: '2024-08-20',
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
    totalTracks: 1,
    streams: 850000,
    revenue: 3567.25,
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-08-20T00:00:00Z',
  },
  {
    id: '3',
    title: 'Electric Soul',
    artist: 'Neon Beats',
    artistId: '3',
    type: 'EP',
    releaseDate: '2024-09-10',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300',
    totalTracks: 6,
    streams: 620000,
    revenue: 2604.80,
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-10T00:00:00Z',
  },
];

// Demo Artists
export const demoArtists: Artist[] = [
  {
    id: '1',
    name: 'The Waves',
    email: 'contact@thewaves.com',
    role: 'Primary Artist',
    totalReleases: 3,
    totalStreams: 2500000,
    totalRoyalties: 10500.00,
    joinDate: '2023-01-15',
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Luna Eclipse',
    email: 'luna@eclipse.com',
    role: 'Featured Artist',
    totalReleases: 2,
    totalStreams: 1200000,
    totalRoyalties: 5040.00,
    joinDate: '2023-06-20',
    status: 'active',
    createdAt: '2023-06-20T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Neon Beats',
    email: 'info@neonbeats.com',
    role: 'Electronic Artist',
    totalReleases: 1,
    totalStreams: 620000,
    totalRoyalties: 2604.80,
    joinDate: '2024-01-10',
    status: 'active',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-09-10T00:00:00Z',
  },
];

// Demo Tracks
export const demoTracks: Track[] = [
  {
    id: '1',
    title: 'Sunset Boulevard',
    artist: 'The Waves',
    artistId: '1',
    releaseId: '1',
    album: 'Summer Vibes',
    duration: '4:05',
    isrc: 'USRC12345678',
    plays: 450000,
    revenue: 1890.00,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Ocean Drive',
    artist: 'The Waves',
    artistId: '1',
    releaseId: '1',
    album: 'Summer Vibes',
    duration: '3:33',
    isrc: 'USRC12345679',
    plays: 380000,
    revenue: 1596.00,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
];

// Demo Dashboard Stats
export const demoDashboardStats: DashboardStats = {
  totalReleases: 24,
  totalArtists: 12,
  totalStreams: 5420000,
  totalRevenue: 22750.50,
  recentReleases: demoReleases.slice(0, 3),
  topArtists: demoArtists.slice(0, 3),
  revenueChart: [
    { month: 'Jan', revenue: 2500 },
    { month: 'Feb', revenue: 3200 },
    { month: 'Mar', revenue: 2800 },
    { month: 'Apr', revenue: 3500 },
    { month: 'May', revenue: 4200 },
    { month: 'Jun', revenue: 5234 },
  ],
  streamsChart: [
    { month: 'Jan', streams: 450000 },
    { month: 'Feb', streams: 520000 },
    { month: 'Mar', streams: 480000 },
    { month: 'Apr', streams: 610000 },
    { month: 'May', streams: 750000 },
    { month: 'Jun', streams: 850000 },
  ],
};

// Demo Payouts
export const demoPayouts: PayoutRecord[] = [
  {
    id: '1',
    artistId: '1',
    artistName: 'The Waves',
    amount: 2500.00,
    status: 'Completed',
    date: '2024-10-01',
    period: 'Q3 2024',
  },
  {
    id: '2',
    artistId: '2',
    artistName: 'Luna Eclipse',
    amount: 1200.00,
    status: 'Pending',
    date: '2024-10-15',
    period: 'Q3 2024',
  },
];

// Demo Royalties
export const demoRoyalties: RoyaltyRecord[] = [
  {
    id: '1',
    trackId: '1',
    trackName: 'Sunset Boulevard',
    artistName: 'The Waves',
    streams: 450000,
    amount: 1890.00,
    period: 'September 2024',
    platform: 'Spotify',
  },
  {
    id: '2',
    trackId: '2',
    trackName: 'Ocean Drive',
    artistName: 'The Waves',
    streams: 380000,
    amount: 1596.00,
    period: 'September 2024',
    platform: 'Apple Music',
  },
];

// Demo Videos
export const demoVideos: Video[] = [
  {
    id: '1',
    title: 'Sunset Boulevard - Official Music Video',
    artist: 'The Waves',
    artistId: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    duration: '4:05',
    views: 125000,
    releaseId: '1',
    publishedAt: '2024-06-15T00:00:00Z',
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Midnight Dreams - Lyric Video',
    artist: 'Luna Eclipse',
    artistId: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    duration: '3:42',
    views: 89000,
    releaseId: '2',
    publishedAt: '2024-08-20T00:00:00Z',
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-08-20T00:00:00Z',
  },
];

// Demo Labels
export const demoLabels: Label[] = [
  {
    id: '1',
    name: 'Indie Wave Records',
    artists: 8,
    releases: 24,
    revenue: 45000.00,
    contact: 'contact@indiewave.com',
    website: 'https://indiewave.com',
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Electronic Dreams',
    artists: 5,
    releases: 18,
    revenue: 32000.00,
    contact: 'info@electronicdreams.com',
    website: 'https://electronicdreams.com',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
];

// Demo Publishers
export const demoPublishers: Publisher[] = [
  {
    id: '1',
    name: 'Global Music Publishing',
    catalogSize: 1200,
    revenue: 85000.00,
    territory: 'Worldwide',
    contact: 'rights@globalmusic.com',
    website: 'https://globalmusic.com',
    createdAt: '2020-05-10T00:00:00Z',
    updatedAt: '2024-05-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Independent Publishing Co.',
    catalogSize: 450,
    revenue: 28000.00,
    territory: 'North America',
    contact: 'contact@indpub.com',
    website: 'https://indpub.com',
    createdAt: '2021-08-15T00:00:00Z',
    updatedAt: '2024-08-15T00:00:00Z',
  },
];

// Demo Writers
export const demoWriters: Writer[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    email: 'sarah@example.com',
    ipiNumber: '00123456789',
    songs: 45,
    royalties: 12500.00,
    publisherId: '1',
    createdAt: '2022-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'James Chen',
    email: 'james@example.com',
    ipiNumber: '00987654321',
    songs: 32,
    royalties: 8900.00,
    publisherId: '1',
    createdAt: '2022-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
];

// Demo Producers
export const demoProducers: Producer[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    role: 'Producer',
    email: 'mike@example.com',
    phone: '+1-555-0101',
    credits: 28,
    revenue: 15600.00,
    createdAt: '2022-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    name: 'Emily Rodriguez',
    role: 'Mixing Engineer',
    email: 'emily@example.com',
    phone: '+1-555-0102',
    credits: 42,
    revenue: 22100.00,
    createdAt: '2021-11-10T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
];

// Demo Performers
export const demoPerformers: Performer[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    instrument: 'Guitar',
    email: 'alex@example.com',
    phone: '+1-555-0103',
    projects: 18,
    revenue: 8400.00,
    createdAt: '2022-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
  {
    id: '2',
    name: 'Lisa Wong',
    instrument: 'Drums',
    email: 'lisa@example.com',
    phone: '+1-555-0104',
    projects: 24,
    revenue: 11200.00,
    createdAt: '2022-07-12T00:00:00Z',
    updatedAt: '2024-07-12T00:00:00Z',
  },
];

// Helper to simulate API delay
import { config } from '../config';
export const simulateDelay = (ms?: number) => 
  new Promise(resolve => setTimeout(resolve, ms || config.dev.mockDelay));

// Helper to simulate API errors
export const shouldSimulateError = () => Math.random() < 0.05; // 5% error rate
