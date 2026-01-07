'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { SEO } from '../../../components/SEO';
import { tracksService } from '../../../lib/api/services/tracks.service';
import { API_CONFIG } from '../../../lib/config';
import { toast } from 'sonner@2.0.3';

interface VideoTrack {
  id: string | number;
  title: string;
  artist?: string;
  videoUrl?: string;
  thumbnail?: string;
  duration?: string;
  views?: string | number;
}

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  // Helper function to check if a URL points to a video file
  const isVideoUrl = (url: string): boolean => {
    if (!url) return false;
    const urlLower = url.toLowerCase();
    // Decode URL to handle encoded filenames (e.g., %2Emp4 becomes .mp4)
    const decodedUrl = decodeURIComponent(urlLower);
    // Check for video file extensions in the URL (both encoded and decoded)
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    return videoExtensions.some(ext => 
      urlLower.includes(ext) || 
      decodedUrl.includes(ext) ||
      urlLower.includes(ext.replace('.', '%2e')) || // URL-encoded dot
      urlLower.includes(ext.replace('.', '%2E'))    // URL-encoded dot (uppercase)
    );
  };

  // Helper function to extract video URL from assets array or media object
  const extractVideoUrl = (track: any): string => {
    // Check for assets array
    if (track.assets && Array.isArray(track.assets)) {
      // Find video files by MIME type or type flag
      const videoAsset = track.assets.find((asset: any) => {
        const mimeType = asset.mime_type || asset.mimeType || asset.type || '';
        const typeFlag = asset.type || asset.file_type || '';
        const assetUrl = asset.url || asset.public_url || asset.publicUrl || '';
        
        // Check if it's a video by MIME type (video/mp4, video/webm, etc.)
        if (mimeType.startsWith('video/')) {
          return true;
        }
        
        // Check if it's a video by type flag
        if (typeFlag === 'video' || typeFlag.toLowerCase().includes('video')) {
          return true;
        }
        
        // Check if URL contains video file extension
        if (isVideoUrl(assetUrl)) {
          return true;
        }
        
        return false;
      });
      
      if (videoAsset) {
        return videoAsset.url || videoAsset.public_url || videoAsset.publicUrl || '';
      }
    }
    
    // Check for media object
    if (track.media) {
      // If media is an object with video property
      if (track.media.video) {
        return track.media.video.url || track.media.video.public_url || '';
      }
      
      // If media is an array
      if (Array.isArray(track.media)) {
        const videoMedia = track.media.find((item: any) => {
          const mimeType = item.mime_type || item.mimeType || item.type || '';
          const mediaUrl = item.url || item.public_url || '';
          return mimeType.startsWith('video/') || isVideoUrl(mediaUrl);
        });
        
        if (videoMedia) {
          return videoMedia.url || videoMedia.public_url || '';
        }
      }
    }
    
    // For video tracks, check audioUrl field for MP4/video files
    // Video files are managed under the same endpoints as audio assets
    // So MP4 files may be stored in audioUrl field
    if (track.audioUrl) {
      // Priority 1: If it's a video track, always use audioUrl
      // This ensures video tracks are displayed even if URL doesn't have clear extension
      if (track.track_type === 'video') {
        console.log('🎬 Using audioUrl for video track:', track.id, track.audioUrl.substring(0, 80));
        return track.audioUrl;
      }
      // Priority 2: If audioUrl contains a video file extension, use it
      // This converts MP4 files in audioUrl to be displayed as videos
      if (isVideoUrl(track.audioUrl)) {
        console.log('🎬 Using audioUrl (MP4 detected):', track.id, track.audioUrl.substring(0, 80));
        return track.audioUrl;
      }
    }
    
    // Fallback to direct video URL fields
    const fallbackUrl = track.video_url || track.videoUrl || track.publicFile || '';
    if (fallbackUrl && isVideoUrl(fallbackUrl)) {
      return fallbackUrl;
    }
    
    return fallbackUrl || track.audioUrl || '';
  };

  const loadVideos = async () => {
    try {
      setLoading(true);
      
      // Fetch tracks with include_files to get assets array
      const getBasicToken = () => {
        let token = localStorage.getItem("authToken");
        if (!token) {
          const username = API_CONFIG.USERNAME;
          const password = API_CONFIG.PASSWORD;
          token = btoa(`${username}:${password}`);
          localStorage.setItem("authToken", token);
        }
        return token;
      };
      
      const token = getBasicToken();
      const queryParams = new URLSearchParams();
      queryParams.append("include_files", "true");
      
      const url = `${API_CONFIG.BASE_URL}/tracks/?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Get raw track data (not normalized) to access assets array
      const rawTracks = Array.isArray(data.results) ? data.results : [];
      
      console.log('📹 Total tracks fetched:', rawTracks.length);
      console.log('📹 Sample track:', rawTracks[0]);
      
      // Filter tracks to show videos:
      // 1. Tracks with track_type === "video" (always include these, even if audioUrl doesn't have extension)
      // 2. Tracks with MP4/video files in audioUrl field (convert and display as video)
      // 3. Tracks with video files in assets array
      const videoTracks = rawTracks
        .filter((track: any) => {
          // Priority 1: Include if track_type is explicitly "video"
          // This ensures all video tracks are shown, regardless of audioUrl format
          if (track.track_type === 'video') {
            console.log('✅ Video track found by track_type:', track.id, track.title, track.audioUrl ? 'has audioUrl' : 'no audioUrl');
            return true;
          }
          
          // Priority 2: Include if audioUrl contains a video file (MP4, WebM, etc.)
          // This converts tracks with MP4 in audioUrl to be displayed as videos
          if (track.audioUrl && isVideoUrl(track.audioUrl)) {
            console.log('✅ Video track found by audioUrl (MP4/video detected):', track.id, track.title);
            return true;
          }
          
          // Priority 3: Include if assets array contains video files
          if (track.assets && Array.isArray(track.assets) && track.assets.length > 0) {
            const hasVideoAsset = track.assets.some((asset: any) => {
              const mimeType = asset.mime_type || asset.mimeType || asset.type || '';
              const assetUrl = asset.url || asset.public_url || asset.publicUrl || '';
              const isVideo = mimeType.startsWith('video/') || isVideoUrl(assetUrl);
              return isVideo;
            });
            if (hasVideoAsset) {
              console.log('✅ Video track found by assets array:', track.id, track.title);
              return true;
            }
          }
          
          return false;
        })
        .map((track: any) => {
          const videoUrl = extractVideoUrl(track);
          
          // Log extraction result for debugging
          if (videoUrl) {
            console.log('🎬 Extracted video URL for track', track.id, track.title, ':', videoUrl.substring(0, 100));
          } else {
            console.log('⚠️ No video URL extracted for track', track.id, track.title, {
              track_type: track.track_type,
              has_audioUrl: !!track.audioUrl,
              audioUrl_sample: track.audioUrl ? track.audioUrl.substring(0, 50) : 'none',
              has_assets: !!(track.assets && track.assets.length > 0)
            });
          }
          
          // Generate a default thumbnail if none exists
          // Use a placeholder or generate one from the video URL
          let thumbnail = track.thumbnail || track.cover_art?.url || track.coverArt || '';
          
          // If no thumbnail, use a default placeholder or try to generate one
          if (!thumbnail && videoUrl) {
            // Use a default video placeholder image
            thumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
          }
          
          return {
            id: track.id,
            title: track.title || 'Untitled Video',
            artist: track.artist_display_name || track.artist || 'Unknown Artist',
            videoUrl: videoUrl,
            thumbnail: thumbnail,
            duration: track.duration ? formatDuration(track.duration) : '0:00',
            views: track.views || 0,
          };
        })
        .filter((video: VideoTrack) => {
          const hasUrl = !!video.videoUrl && video.videoUrl.trim() !== '';
          if (!hasUrl) {
            console.log('❌ Filtered out video (no valid URL):', video.id, video.title);
          } else {
            console.log('✅ Video will be displayed:', video.id, video.title);
          }
          return hasUrl;
        });
      
      console.log('📹 Final video tracks count:', videoTracks.length);
      console.log('📹 Video tracks:', videoTracks);
      
      setVideos(videoTracks);
    } catch (error: any) {
      console.error('Failed to load videos:', error);
      toast.error(error.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | string): string => {
    const sec = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.artist && video.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading videos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <SEO
        title="Videos"
        description="Manage music videos, lyric videos, and live sessions"
        keywords="music videos, lyric videos, live sessions, video content"
      />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl text-white">Videos</h1>
        <ButtonPrimary icon={Plus} href="/videos/new">Add Video</ButtonPrimary>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search videos..." value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && videos.length > 0 && (
        <div className="mb-4 rounded-lg bg-gray-800/50 p-4 text-xs text-gray-400">
          <p>Debug: Found {videos.length} video(s), {filteredVideos.length} after search filter</p>
          {videos.map((v) => (
            <p key={v.id} className="mt-1">
              - {v.title}: {v.videoUrl ? 'Has URL' : 'No URL'} | {v.thumbnail ? 'Has thumbnail' : 'No thumbnail'}
            </p>
          ))}
        </div>
      )}

      {filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-400 text-lg mb-2">
            {searchQuery ? 'No videos found matching your search' : 'No videos yet'}
          </p>
          <p className="text-gray-500 text-sm">
            {!searchQuery && 'Upload your first video to get started'}
          </p>
          {process.env.NODE_ENV === 'development' && videos.length === 0 && (
            <p className="mt-4 text-xs text-gray-600">
              Check browser console for video loading details
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos
            .filter((video) => {
              // Filter out videos without valid URLs
              const hasValidUrl = video.videoUrl && video.videoUrl.trim() !== '';
              if (!hasValidUrl) {
                console.warn('⚠️ Filtering out video (no valid URL):', video.id, video.title);
              }
              return hasValidUrl;
            })
            .map((video) => {
              // Ensure we have valid video URL and thumbnail
              const validVideoUrl = video.videoUrl!.trim();
              const validThumbnail = video.thumbnail && video.thumbnail.trim() !== '' 
                ? video.thumbnail 
                : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
            
              return (
                <div key={video.id} className="w-full">
                  <VideoPlayer
                    videoUrl={validVideoUrl}
                    thumbnail={validThumbnail}
                    title={video.title}
                  />
                  <div className="mt-3">
                    <h3 className="text-white font-medium">{video.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{video.artist}</p>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                      <span>{typeof video.views === 'number' ? video.views.toLocaleString() : video.views || 0} views</span>
                      {video.duration && video.duration !== '0:00' && (
                        <>
                          <span>•</span>
                          <span>{video.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
