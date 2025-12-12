/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_USE_LIVE_API: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_USERNAME: string;
  readonly VITE_API_PASSWORD: string;
  readonly VITE_API_TIMEOUT: string;

  // Upload Configuration
  readonly VITE_MAX_UPLOAD_SIZE: string;
  readonly VITE_AUDIO_FILE_TYPES: string;
  readonly VITE_VIDEO_FILE_TYPES: string;
  readonly VITE_IMAGE_FILE_TYPES: string;

  // Feature Flags
  readonly VITE_ENABLE_FILE_UPLOADS: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_REAL_TIME_SYNC: string;

  // External Services
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_SENTRY_DSN: string;

  // Development
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_MOCK_API_DELAY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
