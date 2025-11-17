/**
 * Videos Service
 * Handles video content management
 * 
 * API Endpoints:
 * - GET /videos - List all videos
 * - GET /videos/:id - Get video details
 * - POST /videos - Create new video
 * - PUT /videos/:id - Update video
 * - DELETE /videos/:id - Delete video
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { Video, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { demoVideos, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export interface CreateVideoRequest {
  title: string;
  artistId: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  releaseId?: string;
  publishedAt?: string;
}

class VideosService {
  /**
   * Get all videos
   */
  async list(params?: ListParams): Promise<PaginatedResponse<Video>> {
    if (isDemoMode()) {
      logger.api('Fetching videos (demo mode)');
      await simulateDelay();
      
      const videos = [...demoVideos, ...demoStorage.getAll<Video>('videos')];
      
      return {
        data: videos,
        pagination: {
          page: 1,
          limit: 10,
          total: videos.length,
          totalPages: 1,
        },
      };
    }

    logger.api('Fetching videos (live API)');
    return apiClient.get<PaginatedResponse<Video>>('/videos', { params });
  }

  /**
   * Get video by ID
   */
  async getById(id: string): Promise<Video> {
    if (isDemoMode()) {
      logger.api(`Fetching video ${id} (demo mode)`);
      await simulateDelay();
      
      const video = demoVideos.find(v => v.id === id) || demoStorage.getById<Video>('videos', id);
      if (!video) throw new Error('Video not found');
      return video;
    }

    logger.api(`Fetching video ${id} (live API)`);
    const response = await apiClient.get<ApiResponse<Video>>(`/videos/${id}`);
    return response.data;
  }

  /**
   * Create new video
   */
  async create(data: CreateVideoRequest): Promise<Video> {
    if (isDemoMode()) {
      logger.api('Creating video (demo mode)');
      await simulateDelay();
      
      const newVideo: Video = {
        id: `video-${Date.now()}`,
        title: data.title,
        artist: 'Demo Artist',
        artistId: data.artistId,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail,
        duration: data.duration,
        views: 0,
        releaseId: data.releaseId,
        publishedAt: data.publishedAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('videos', newVideo);
      
      return newVideo;
    }

    logger.api('Creating video (live API)');
    const response = await apiClient.post<ApiResponse<Video>>('/videos', data);
    return response.data;
  }

  /**
   * Update video
   */
  async update(id: string, data: Partial<CreateVideoRequest>): Promise<Video> {
    if (isDemoMode()) {
      logger.api(`Updating video ${id} (demo mode)`);
      await simulateDelay();
      
      const video = demoVideos.find(v => v.id === id) || demoStorage.getById<Video>('videos', id);
      if (!video) throw new Error('Video not found');
      
      const updatedVideo = {
        ...video,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const storageVideo = demoStorage.getById<Video>('videos', id);
      if (storageVideo) {
        demoStorage.update('videos', id, updatedVideo);
      }
      
      return updatedVideo;
    }

    logger.api(`Updating video ${id} (live API)`);
    const response = await apiClient.put<ApiResponse<Video>>(`/videos/${id}`, data);
    return response.data;
  }

  /**
   * Delete video
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting video ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('videos', id);
      return;
    }

    logger.api(`Deleting video ${id} (live API)`);
    await apiClient.delete(`/videos/${id}`);
  }

  /**
   * Increment video views
   */
  async incrementViews(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Incrementing views for video ${id} (demo mode)`);
      await simulateDelay();
      return;
    }

    logger.api(`Incrementing views for video ${id} (live API)`);
    await apiClient.post(`/videos/${id}/views`);
  }
}

export const videosService = new VideosService();
