/**
 * Simple logger utility - just wraps console methods
 * No complex initialization or network calls
 */

class Logger {
  log(message: string, ...args: any[]) {
    console.log(message, ...args);
  }

  info(message: string, ...args: any[]) {
    console.info(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(message, ...args);
  }

  success(message: string, data?: any) {
    console.log('✅', message, data || '');
  }

  api(message: string, ...args: any[]) {
    console.log('[API]', message, ...args);
  }

  // Special formatted logs for track creation
  trackCreation(payload: any) {
    console.log('🚀 Creating track', payload);
  }

  trackCreated(result: any) {
    console.log('✅ Track created', result);
  }

  audioUpload(url: string, file: File) {
    console.log('📤 Uploading audio file', {
      url,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.type,
    });
  }

  audioUploaded(result: any) {
    console.log('✅ Audio uploaded', result);
  }

  errorOccurred(error: any, context: string) {
    console.error(`❌ ${context} failed:`, error);
  }
}

// Create logger instance - simple, no complex initialization
export const logger = new Logger();
