"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { tracksService } from "../../../../../lib/api/services/tracks.service";
import { toast } from "sonner";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { ButtonPrimary } from "../../../../../components/ButtonPrimary";
import { Upload, Headphones, Trash2, Plus, Loader2 } from "lucide-react";

export default function TrackAudioPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [additionalMasters, setAdditionalMasters] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      loadTrack();
    }
  }, [id]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const trackData = await tracksService.getById(id!);
      setTrack(trackData);
      
      // If track has audio URL, set it as preview
      if (trackData.audioUrl) {
        setAudioPreview(trackData.audioUrl);
      }
    } catch (error: any) {
      console.error("Error loading track:", error);
      toast.error(error.message || "Failed to load track");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);
      
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/x-m4a'];
      if (!file.type.startsWith("audio/") && !allowedTypes.includes(file.type)) {
        setUploadError("Unable to process uploaded file due to unsupported format");
        return;
      }

      // Validate file size (e.g., max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        setUploadError("File size must be less than 100MB");
        return;
      }

      setAudioFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAudioPreview(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      toast.error("Please select an audio file to upload");
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("track_id", id!);

      // Upload audio file
      // Note: You may need to adjust this based on your API endpoint
      const response = await fetch(`/api/tracks/${id}/audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const result = await response.json();
      
      toast.success("Audio uploaded successfully!");
      
      // Reload track data
      await loadTrack();
      
      // Clear file selection
      setAudioFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error uploading audio:", error);
      toast.error(error.message || "Failed to upload audio");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAudio = async () => {
    if (!confirm("Are you sure you want to remove the audio file?")) {
      return;
    }

    try {
      setUploading(true);
      
      // Remove audio file
      // Note: You may need to adjust this based on your API endpoint
      await tracksService.update(id!, { audioUrl: null });
      
      toast.success("Audio removed successfully!");
      
      // Reload track data
      await loadTrack();
      setAudioFile(null);
      setAudioPreview(null);
    } catch (error: any) {
      console.error("Error removing audio:", error);
      toast.error(error.message || "Failed to remove audio");
    } finally {
      setUploading(false);
    }
  };

  // Get associated releases count (placeholder - you may need to fetch this)
  const associatedReleases = track?.releases?.length || 0;
  const associatedWorks = track?.works?.length || 0;
  const duration = track?.duration || "-";

  if (loading && !track) {
    return <div className="text-white">Loading audio information...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white mb-4">
          {track?.title || "Track"}
        </h1>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-400">TYPE:</span>{" "}
            <span className="text-white ml-2">{track?.track_type || "Audio"}</span>
          </div>
          <div>
            <span className="text-gray-400">ASSOCIATED RELEASES:</span>{" "}
            <span className="text-white ml-2">{associatedReleases}</span>
          </div>
          <div>
            <span className="text-gray-400">ASSOCIATED WORKS:</span>{" "}
            <span className="text-white ml-2">{associatedWorks}</span>
          </div>
          <div>
            <span className="text-gray-400">DURATION:</span>{" "}
            <span className="text-white ml-2">{duration}</span>
          </div>
        </div>
      </div>

      {/* PRIMARY AUDIO Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-blue-400">PRIMARY AUDIO</h2>
        
        {track?.audioUrl && !audioFile && (
          <div className="mb-4">
            <a
              href={track.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {track.title || "Track"}
            </a>
          </div>
        )}

        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <Headphones className="h-5 w-5 text-gray-400" />
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="audio-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse...
            </Button>
            <Input
              type="text"
              readOnly
              value={audioFile ? audioFile.name : "No file selected."}
              className="flex-1 bg-gray-800 border-gray-700 text-white"
            />
            {audioFile && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAudioFile(null);
                  setAudioPreview(null);
                  setUploadError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {uploadError && (
            <p className="text-red-400 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        {audioFile && (
          <div className="flex gap-4">
            <ButtonPrimary
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Audio
                </>
              )}
            </ButtonPrimary>
          </div>
        )}
      </div>

      {/* ADDITIONAL AUDIO MASTERS Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-400">ADDITIONAL AUDIO MASTERS</h2>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={() => {
              // Add new audio master functionality
              toast.info("Add Audio Master functionality coming soon");
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Audio Master
          </Button>
        </div>
        
        {additionalMasters.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400">No records</p>
          </div>
        ) : (
          <div className="space-y-2">
            {additionalMasters.map((master, index) => (
              <div
                key={index}
                className="bg-gray-900/30 border border-gray-800 rounded-lg p-4"
              >
                {/* Audio master item */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHARING Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-blue-400">SHARING</h2>
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">
            CURRENTLY SHARED PLAYLISTS
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-4 text-gray-400 font-medium">PLAYS</th>
                  <th className="text-left py-2 px-4 text-gray-400 font-medium">DOWNLOADS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 text-white">0</td>
                  <td className="py-2 px-4 text-white">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

