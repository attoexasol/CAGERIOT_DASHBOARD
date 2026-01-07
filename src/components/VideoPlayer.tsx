'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
  onClose?: () => void;
}

export function VideoPlayer({ videoUrl, thumbnail, title, onClose }: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsPlaying(false);
    setIsMaximized(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose?.();
  };

  return (
    <>
      {/* Video Thumbnail Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-900/50 transition-all hover:bg-gray-800/50"
      >
        <div className="relative aspect-video bg-gray-900">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback to a default placeholder if thumbnail fails to load
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-800">
              <Play className="h-12 w-12 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff0050]">
              <Play className="ml-1 h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`bg-black border-gray-800 p-0 transition-all duration-300 ${isMaximized ? 'max-w-[95vw] w-[95vw] h-[95vh]' : 'max-w-5xl'}`}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Video player for {title}
          </DialogDescription>
          <div className={`relative bg-black ${isMaximized ? 'h-full' : 'aspect-video'}`}>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video Element */}
            <video
              ref={videoRef}
              className={`h-full w-full transition-all duration-300 ${isMaximized ? 'object-contain' : 'object-cover'}`}
              poster={thumbnail || undefined}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
              onError={(e) => {
                console.error('Video playback error:', e);
                console.error('Video URL:', videoUrl);
              }}
              onLoadedData={() => {
                console.log('Video loaded successfully:', videoUrl);
              }}
              crossOrigin="anonymous"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div
                onClick={handleProgressClick}
                className="mb-4 h-1 cursor-pointer overflow-hidden rounded-full bg-gray-700"
              >
                <div
                  className="h-full bg-[#ff0050] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>

                  <span className="text-sm text-white">{title}</span>
                </div>

                <button 
                  onClick={toggleMaximize}
                  className="rounded-full p-2 text-white transition-all hover:bg-white/10 hover:scale-110"
                  title={isMaximized ? "Minimize" : "Maximize"}
                  aria-label={isMaximized ? "Minimize video" : "Maximize video"}
                >
                  <Maximize className={`h-5 w-5 transition-transform ${isMaximized ? 'scale-110 text-[#ff0050]' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
