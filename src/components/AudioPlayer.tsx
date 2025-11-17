

"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, X, Music } from "lucide-react";

interface AudioPlayerProps {
  trackTitle: string;
  artist: string;
  src: string; // now required — no fallback
  onClose?: () => void;
}

export function AudioPlayer({
  trackTitle,
  artist,
  src,
  onClose,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Autoplay failed:", err);
        setIsPlaying(false);
      }
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((e) => console.error("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    onClose?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black/95 backdrop-blur-lg text-white">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-6">
          <div className="flex min-w-[220px] items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff0050] to-[#cc0040]">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium">{trackTitle}</div>
              <div className="text-xs text-gray-400">{artist}</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <div
                onClick={handleSeek}
                className="h-1 flex-1 cursor-pointer rounded-full bg-gray-700 overflow-hidden"
              >
                <div
                  className="h-full bg-[#ff0050] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
