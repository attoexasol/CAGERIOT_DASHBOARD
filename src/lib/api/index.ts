/**
 * API Services Index
 * Central export for all API services
 */

export * from "./types";

// Configuration and utilities
export { config, isDemoMode, isLiveMode, API_CONFIG } from "../config";
export { logger } from "../logger";

// API Helpers
export {
  getApiHeaders,
  handleApiResponse,
  handleApiError,
  getAuthToken,
  setAuthToken,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiUpload,
} from "./helpers";

// Testing utilities
export {
  testApiConnection,
  quickHealthCheck,
  validateApiConfig,
} from "./test-connection";

// Services
export { authService } from "./services/auth.service";
export { releasesService } from "./services/releases.service";
export { artistsService } from "./services/artists.service";
export { tracksService } from "./services/tracks.service";
export { dashboardService } from "./services/dashboard.service";
export { royaltiesService } from "./services/royalties.service";
export { payoutsService } from "./services/payouts.service";
export { assetsService } from "./services/assets.service";
export { labelsService } from "./services/labels.service";
export { videosService } from "./services/videos.service";
export { writersService } from "./services/writers.service";
export { publishersService } from "./services/publishers.service";
export { producersService } from "./services/producers.service";
export { performersService } from "./services/performers.service";
