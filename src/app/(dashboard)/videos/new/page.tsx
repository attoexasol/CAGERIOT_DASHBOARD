'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { ButtonPrimary } from '../../../../components/ButtonPrimary';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { API_CONFIG } from '../../../../lib/config';

// Video file validation helper
const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type - common video formats
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
  const validExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  if (!hasValidType && !hasValidExtension) {
    return { valid: false, error: "File must be a video format (MP4, WebM, OGG, MOV, AVI)" };
  }

  // Check file size (reasonable limit - 2GB)
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 2GB" };
  }

  return { valid: true };
};

export default function NewVideo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    const validation = validateVideoFile(file);
    
    if (!validation.valid) {
      setVideoError(validation.error || "Invalid video file");
      setVideoFile(null);
      setVideoFileName("");
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);
  };

  const handleRemoveFile = () => {
    setVideoFile(null);
    setVideoFileName("");
    setVideoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!videoFile) {
        toast.error("Please upload a video file");
        setLoading(false);
        return;
      }

      if (!videoTitle.trim()) {
        toast.error("Video Title is required");
        setLoading(false);
        return;
      }

      // Step 1: Create a track with track_type: "video" to generate an ID
      const trackData: any = {
        title: videoTitle.trim(),
        track_type: "video",
      };

      const API_URL = `${API_CONFIG.BASE_URL}/tracks`;
      const API_USERNAME = API_CONFIG.USERNAME;
      const API_PASSWORD = API_CONFIG.PASSWORD;
      
      // Create Basic Auth token
      const token = btoa(`${API_USERNAME}:${API_PASSWORD}`);

      console.log("Creating video track with payload:", trackData);

      const response = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(trackData),
      });

      const responseText = await response.text();
      let responseData: any = {};

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Failed to parse response:", responseText);
        if (!response.ok) {
          throw new Error(responseText || `Failed to create video track: ${response.status}`);
        }
      }

      if (!response.ok) {
        const errorMessage = 
          responseData.message || 
          responseData.error || 
          responseData.detail ||
          `Failed to create video track: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      console.log("Video track created successfully:", responseData);

      // Step 2: Store the generated ID
      const trackId = responseData.id;
      
      if (!trackId) {
        throw new Error("Track ID not received from API");
      }

      console.log("Track ID generated:", trackId);

      // Step 3: Upload video file as binary data
      if (trackId && videoFile) {
        try {
          // Extract file name from the video file and URL-encode it
          const fileName = videoFile.name;
          const encodedFileName = encodeURIComponent(fileName);
          console.log("Uploading video file:", {
            trackId,
            fileName,
            encodedFileName,
            size: videoFile.size,
            type: videoFile.type
          });

          // Construct the upload endpoint URL with encoded filename
          const uploadUrl = `${API_CONFIG.BASE_URL}/tracks/${trackId}/upload-binary/${encodedFileName}`;
          console.log("Upload URL:", uploadUrl);

          // Read the file as binary data (ArrayBuffer)
          const fileBuffer = await videoFile.arrayBuffer();

          // Upload the video file as binary data
          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            mode: "cors",
            headers: {
              "Content-Type": "application/octet-stream",
              Authorization: `Basic ${token}`,
            },
            body: fileBuffer,
          });

          if (!uploadResponse.ok) {
            const uploadErrorText = await uploadResponse.text();
            console.error("Video upload failed:", {
              status: uploadResponse.status,
              statusText: uploadResponse.statusText,
              error: uploadErrorText
            });
            throw new Error(
              `Video upload failed: ${uploadResponse.status} ${uploadResponse.statusText}. ${uploadErrorText || ''}`
            );
          }

          console.log("Video file uploaded successfully");
          toast.success("Video created and uploaded successfully! Processing will begin shortly.");
        } catch (uploadError: any) {
          console.error("Video upload failed:", uploadError);
          // Track is created, but video upload failed - show warning
          toast.warning(
            uploadError.message || "Video track created but upload failed. Please upload video manually.",
            { duration: 5000 }
          );
        }
      } else {
        toast.success("Video track created successfully!");
      }
      
      // Redirect to videos list
      navigate("/videos");
    } catch (error: any) {
      console.error("Error creating video:", error);
      toast.error(error.message || "Failed to create video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/videos">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-white">Create New Video</h1>
          <p className="text-sm text-gray-400 mt-1">Upload video and add video information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Title */}
        <Card className="bg-gray-900/30 border-gray-800 py-4">
          <CardHeader>
            <CardTitle className="text-white">Video Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Video Title *</Label>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-800 text-white"
                placeholder="Enter video title"
                required
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Video File */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white mt-4">Upload Video File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Upload video file</Label>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Supported formats: MP4, WebM, OGG, MOV, AVI. Maximum file size: 2GB.
              </p>

              {!videoFile ? (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-300">Click to upload or drag and drop</span>
                    <span className="text-sm text-gray-500">Video files only</span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700 rounded">
                      <Upload className="h-5 w-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{videoFileName}</p>
                      <p className="text-sm text-gray-400">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {videoError && (
                <p className="mt-2 text-sm text-red-500">{videoError}</p>
              )}

              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-sm text-blue-300 font-semibold mb-2">Supported Formats:</p>
                <ul className="text-xs text-blue-200 space-y-1 list-disc list-inside">
                  <li>MP4 (recommended)</li>
                  <li>WebM</li>
                  <li>OGG</li>
                  <li>MOV</li>
                  <li>AVI</li>
                  <li>Maximum file size: 2GB</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 mb-6">
          <ButtonPrimary type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? "Creating..." : "Create Video"}
          </ButtonPrimary>
          <Link to="/videos">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
