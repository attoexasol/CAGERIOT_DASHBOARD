/**
 * Assets Service
 * Handles file uploads for audio, video, and image assets
 * 
 * API Endpoints:
 * - POST /assets/upload - Upload a new asset
 * - GET /assets/:id - Get asset details
 * - GET /assets/:id/status - Check upload/processing status
 * - DELETE /assets/:id - Delete an asset
 */

import { apiClient } from '../client';
import { config } from '../../config';
import { logger } from '../../logger';

export interface AssetUploadResponse {
  uploadId: string;
  assetId?: string;
  url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface AssetStatusResponse {
  assetId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  url?: string;
  metadata?: {
    duration?: string;
    size?: number;
    format?: string;
    bitrate?: number;
  };
}

export interface AssetMetadata {
  title?: string;
  artist?: string;
  releaseId?: string;
  trackId?: string;
  [key: string]: any;
}

class AssetsService {
  /**
   * Upload an audio file
   * @param file - Audio file to upload
   * @param metadata - Additional metadata
   */
  async uploadAudio(file: File, metadata?: AssetMetadata): Promise<AssetUploadResponse> {
    logger.info('Uploading audio file', { filename: file.name, size: file.size });

    // Validate file type
    if (!config.upload.audioTypes.includes(file.type)) {
      throw new Error(`Invalid audio file type: ${file.type}`);
    }

    // Validate file size
    if (file.size > config.upload.maxSize) {
      throw new Error(`File size exceeds maximum: ${config.upload.maxSize / (1024 * 1024)}MB`);
    }

    try {
      const response = await apiClient.upload<AssetUploadResponse>(
        '/assets/audio',
        file,
        metadata
      );
      
      logger.info('Audio upload successful', { uploadId: response.uploadId });
      return response;
    } catch (error) {
      logger.error('Audio upload failed', error);
      throw error;
    }
  }

  /**
   * Upload a video file
   * @param file - Video file to upload
   * @param metadata - Additional metadata
   */
  async uploadVideo(file: File, metadata?: AssetMetadata): Promise<AssetUploadResponse> {
    logger.info('Uploading video file', { filename: file.name, size: file.size });

    // Validate file type
    if (!config.upload.videoTypes.includes(file.type)) {
      throw new Error(`Invalid video file type: ${file.type}`);
    }

    // Validate file size
    if (file.size > config.upload.maxSize) {
      throw new Error(`File size exceeds maximum: ${config.upload.maxSize / (1024 * 1024)}MB`);
    }

    try {
      const response = await apiClient.upload<AssetUploadResponse>(
        '/assets/video',
        file,
        metadata
      );
      
      logger.info('Video upload successful', { uploadId: response.uploadId });
      return response;
    } catch (error) {
      logger.error('Video upload failed', error);
      throw error;
    }
  }

  /**
   * Upload an image file
   * @param file - Image file to upload
   * @param metadata - Additional metadata
   */
  async uploadImage(file: File, metadata?: AssetMetadata): Promise<AssetUploadResponse> {
    logger.info('Uploading image file', { filename: file.name, size: file.size });

    // Validate file type
    if (!config.upload.imageTypes.includes(file.type)) {
      throw new Error(`Invalid image file type: ${file.type}`);
    }

    // Validate file size
    if (file.size > config.upload.maxSize) {
      throw new Error(`File size exceeds maximum: ${config.upload.maxSize / (1024 * 1024)}MB`);
    }

    try {
      const response = await apiClient.upload<AssetUploadResponse>(
        '/assets/image',
        file,
        metadata
      );
      
      logger.info('Image upload successful', { uploadId: response.uploadId });
      return response;
    } catch (error) {
      logger.error('Image upload failed', error);
      throw error;
    }
  }

  /**
   * Check the status of an asset upload
   * @param uploadId - The upload ID returned from upload
   */
  async checkStatus(uploadId: string): Promise<AssetStatusResponse> {
    logger.info('Checking asset status', { uploadId });

    try {
      const response = await apiClient.get<AssetStatusResponse>(
        `/assets/${uploadId}/status`
      );
      
      return response;
    } catch (error) {
      logger.error('Failed to check asset status', error);
      throw error;
    }
  }

  /**
   * Get asset details by ID
   * @param assetId - The asset ID
   */
  async getAsset(assetId: string): Promise<AssetStatusResponse> {
    logger.info('Getting asset details', { assetId });

    try {
      const response = await apiClient.get<AssetStatusResponse>(
        `/assets/${assetId}`
      );
      
      return response;
    } catch (error) {
      logger.error('Failed to get asset details', error);
      throw error;
    }
  }

  /**
   * Delete an asset
   * @param assetId - The asset ID to delete
   */
  async deleteAsset(assetId: string): Promise<{ success: boolean }> {
    logger.info('Deleting asset', { assetId });

    try {
      const response = await apiClient.delete<{ success: boolean }>(
        `/assets/${assetId}`
      );
      
      logger.info('Asset deleted successfully', { assetId });
      return response;
    } catch (error) {
      logger.error('Failed to delete asset', error);
      throw error;
    }
  }

  /**
   * Poll asset status until processing is complete
   * @param uploadId - The upload ID
   * @param maxAttempts - Maximum number of polling attempts (default: 60)
   * @param interval - Interval between polls in ms (default: 2000)
   */
  async pollUntilComplete(
    uploadId: string,
    maxAttempts: number = 60,
    interval: number = 2000
  ): Promise<AssetStatusResponse> {
    logger.info('Starting status polling', { uploadId, maxAttempts, interval });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.checkStatus(uploadId);

      if (status.status === 'completed') {
        logger.info('Asset processing completed', { uploadId, assetId: status.assetId });
        return status;
      }

      if (status.status === 'failed') {
        throw new Error('Asset processing failed');
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Asset processing timeout - max attempts reached');
  }
}

export const assetsService = new AssetsService();
