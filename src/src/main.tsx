import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';
import { validateConfig } from '../lib/config';
import { validateApiConfig } from '../lib/api/test-connection';
import { logger } from '../lib/logger';

// Validate configuration on startup
validateConfig();

// Validate API configuration
const apiValidation = validateApiConfig();
if (!apiValidation.valid) {
  logger.error('API Configuration Errors:');
  apiValidation.errors.forEach(error => logger.error(`  - ${error}`));
}
if (apiValidation.warnings.length > 0) {
  logger.warn('API Configuration Warnings:');
  apiValidation.warnings.forEach(warning => logger.warn(`  - ${warning}`));
}

// Log API test utilities availability
logger.info('💡 Tip: Run testApiConnection() in console to test your API');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
