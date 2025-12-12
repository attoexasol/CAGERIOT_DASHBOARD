"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { ButtonPrimary } from "../../../../components/ButtonPrimary";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

import { tracksService } from "../../../../lib/api/services/tracks.service";
import { artistsService } from "../../../../lib/api/services/artists.service";
import { API_CONFIG } from "../../../../lib/config";

// Audio file validation helper
const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type - must be WAV
  if (!file.type.includes("wav") && !file.name.toLowerCase().endsWith(".wav")) {
    return { valid: false, error: "File must be in WAV format" };
  }

  // Note: Full validation (channels, bit depth, sample rate, duration) 
  // would require audio analysis library or server-side validation
  // For now, we'll do basic checks and show the requirements

  // Check file size (reasonable limit)
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 500MB" };
  }

  return { valid: true };
};

// Create Artist Modal Component
function CreateArtistModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (artist: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    spotifyUrl: "",
    appleUrl: "",
    youtubeUrl: "",
    soundcloudUrl: "",
    instagramUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create artist with profile URLs
      const artistData = {
        name: formData.name,
        email: "", // Required by API but not in form
        role: "Artist",
        bio: "",
        profileUrls: {
          spotify: formData.spotifyUrl,
          apple: formData.appleUrl,
          youtube: formData.youtubeUrl,
          soundcloud: formData.soundcloudUrl,
          instagram: formData.instagramUrl,
        },
      };

      const newArtist = await artistsService.create(artistData as any);
      toast.success("Artist created successfully!");
      onSave(newArtist);
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        spotifyUrl: "",
        appleUrl: "",
        youtubeUrl: "",
        soundcloudUrl: "",
        instagramUrl: "",
      });
    } catch (error: any) {
      console.error("Error creating artist:", error);
      toast.error(error.message || "Failed to create artist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Create a New Artist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new artist to the system. They will appear in all contributor dropdowns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Artist Official Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 bg-gray-900 border-gray-800 text-white"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Artist Profile URLs</Label>
            <div className="mt-2 space-y-3">
              <div>
                <Label className="text-gray-400 text-sm">Spotify Profile URL</Label>
                <Input
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                  placeholder="Add profile URL"
                  type="url"
                />
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Apple Profile URL</Label>
                <Input
                  value={formData.appleUrl}
                  onChange={(e) => setFormData({ ...formData, appleUrl: e.target.value })}
                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                  placeholder="Add profile URL"
                  type="url"
                />
              </div>

              <div>
                <Label className="text-gray-400 text-sm">YouTube URL</Label>
                <Input
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                  placeholder="Add profile URL"
                  type="url"
                />
              </div>

              <div>
                <Label className="text-gray-400 text-sm">SoundCloud URL</Label>
                <Input
                  value={formData.soundcloudUrl}
                  onChange={(e) => setFormData({ ...formData, soundcloudUrl: e.target.value })}
                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                  placeholder="Add profile URL"
                  type="url"
                />
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Instagram URL</Label>
                <Input
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="mt-1 bg-gray-900 border-gray-800 text-white"
                  placeholder="Add profile URL"
                  type="url"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <ButtonPrimary type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? "Saving..." : "Save Artist"}
            </ButtonPrimary>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function NewTrackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [hasIsrc, setHasIsrc] = useState<boolean | null>(null);
  const [isrc, setIsrc] = useState("");
  
  const [trackTitle, setTrackTitle] = useState("");
  
  const [artists, setArtists] = useState<any[]>([]);
  const [mainPrimaryArtist, setMainPrimaryArtist] = useState("");
  const [showCreateArtistModal, setShowCreateArtistModal] = useState(false);
  
  const [contributors, setContributors] = useState<{
    featuredArtist: string;
    producer: string;
    writer: string;
    mixer: string;
    masteringEngineer: string;
  }>({
    featuredArtist: "",
    producer: "",
    writer: "",
    mixer: "",
    masteringEngineer: "",
  });

  // Load artists on mount
  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const response = await artistsService.getAll();
      setArtists(response.data || []);
    } catch (error) {
      console.error("Failed to load artists:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError(null);
    const validation = validateAudioFile(file);
    
    if (!validation.valid) {
      setAudioError(validation.error || "Invalid audio file");
      setAudioFile(null);
      setAudioFileName("");
      return;
    }

    setAudioFile(file);
    setAudioFileName(file.name);
  };

  const handleRemoveFile = () => {
    setAudioFile(null);
    setAudioFileName("");
    setAudioError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleArtistCreated = (newArtist: any) => {
    // Add new artist to list and select it
    setArtists([...artists, newArtist]);
    setMainPrimaryArtist(newArtist.id);
    loadArtists(); // Refresh list
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation - Only Track Title and Audio File are mandatory
      if (!audioFile) {
        toast.error("Please upload an audio file");
        setLoading(false);
        return;
      }

      if (!trackTitle.trim()) {
        toast.error("Track Title is required");
        setLoading(false);
        return;
      }

      // Prepare track data according to API specification
      // Only include isrc if user selected "Yes"
      const trackData: any = {
        title: trackTitle.trim(),
        track_type: "audio",
      };

      // Only include ISRC if user selected "Yes" and provided a value
      if (hasIsrc === true && isrc.trim()) {
        trackData.isrc = isrc.trim();
      }
      // If hasIsrc is false or null, do not include isrc in the payload

      console.log("========================================");
      console.log("🚀 CREATING TRACK");
      console.log("========================================");
      console.log("📤 Request Payload:", JSON.stringify(trackData, null, 2));
      console.log("📋 Track Title:", trackTitle.trim());
      console.log("🎵 Track Type: audio");
      console.log("🔢 Has ISRC:", hasIsrc);
      console.log("📝 ISRC Value:", hasIsrc === true ? isrc.trim() : "Not included");
      console.log("📁 Audio File:", {
        name: audioFile?.name,
        size: `${(audioFile?.size || 0) / (1024 * 1024)} MB`
      });
      console.log("========================================");

      // Create track using tracksService
      const result = await tracksService.create(trackData);
      
      console.log("✅ Track created successfully!");
      console.log("📥 Response Data:", JSON.stringify(result, null, 2));
      console.log("🆔 Track ID:", result?.id);
      console.log("========================================");

      // Upload audio file if track was created successfully
      if (result?.id && audioFile) {
        try {
          // Get the track ID from the response
          const trackId = result.id;
          
          console.log("========================================");
          console.log("📤 UPLOADING AUDIO FILE");
          console.log("========================================");
          console.log("📁 File Name:", audioFile.name);
          console.log("📊 File Size:", (audioFile.size / (1024 * 1024)).toFixed(2), "MB");
          console.log("📋 File Type:", audioFile.type);
          console.log("🆔 Track ID:", trackId);
          console.log("========================================");

          // Step 1: Request a pre-signed URL from the API
          const presignedUrlEndpoint = `${API_CONFIG.BASE_URL}/tracks/${trackId}/presigned_url/`;
          const token = btoa(`${API_CONFIG.USERNAME}:${API_CONFIG.PASSWORD}`);

          console.log("🔗 Step 1: Requesting pre-signed URL from:", presignedUrlEndpoint);

          const presignedResponse = await fetch(presignedUrlEndpoint, {
            method: "GET",
            headers: {
              Authorization: `Basic ${token}`,
            },
          });

          if (!presignedResponse.ok) {
            const errorText = await presignedResponse.text();
            console.error("❌ Failed to get pre-signed URL:", errorText);
            throw new Error(`Failed to get pre-signed URL (${presignedResponse.status}): ${errorText}`);
          }

          const presignedData = await presignedResponse.json();
          console.log("✅ Step 1: Received pre-signed URL response");
          console.log("📥 Pre-signed Data:", JSON.stringify(presignedData, null, 2));

          // Step 2: Upload file directly to S3 using pre-signed URL and fields
          const s3Url = presignedData.url;
          const fields = presignedData.fields || {};

          console.log("🔗 Step 2: Uploading to S3 URL:", s3Url);
          console.log("📋 S3 Fields:", JSON.stringify(fields, null, 2));

          // Create FormData with all required fields
          const uploadFormData = new FormData();
          
          // Add all pre-signed fields, replacing ${filename} placeholder if present
          Object.keys(fields).forEach((key) => {
            let value = fields[key];
            // Replace ${filename} placeholder with actual filename if present
            if (typeof value === 'string' && value.includes('${filename}')) {
              value = value.replace('${filename}', audioFile.name);
            }
            uploadFormData.append(key, value);
          });

          // Add the file - must be last field in FormData for S3
          uploadFormData.append("file", audioFile);

          // Step 3: Upload directly to S3
          const uploadResponse = await fetch(s3Url, {
            method: "POST",
            body: uploadFormData,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
          });

          console.log("📡 Step 3: Upload Response Status:", uploadResponse.status, uploadResponse.statusText);

          if (!uploadResponse.ok) {
            let errorText = "";
            try {
              errorText = await uploadResponse.text();
              console.error("❌ Upload Error Response:", errorText);
            } catch (e) {
              console.error("❌ Could not read error response");
            }
            
            const errorMessage = errorText || uploadResponse.statusText || "Unknown error";
            console.error("❌ Full Error Details:", {
              status: uploadResponse.status,
              statusText: uploadResponse.statusText,
              s3Url: s3Url,
              errorText: errorText,
            });
            
            throw new Error(`Audio upload failed (${uploadResponse.status}): ${errorMessage}`);
          }

          console.log("✅ Audio uploaded successfully to S3!");
          console.log("========================================");
          
          toast.success("Track and audio file uploaded successfully!");
        } catch (uploadError: any) {
          console.error("========================================");
          console.error("❌ AUDIO UPLOAD FAILED");
          console.error("========================================");
          console.error("Error:", uploadError);
          console.error("Error Message:", uploadError.message);
          console.error("Error Stack:", uploadError.stack);
          console.error("========================================");
          // Track is created, but audio upload failed - show warning
          toast.warning(`Track created but audio upload failed: ${uploadError.message || "Please upload audio manually."}`);
        }
      } else {
        console.warn("⚠️ Skipping audio upload - Track ID or audio file missing");
        console.log("Track ID:", result?.id);
        console.log("Audio File:", audioFile ? audioFile.name : "Not provided");
        toast.success("Track created successfully!");
      }

      toast.success("Track created successfully!");
      
      // Redirect to tracks list
      navigate("/tracks");
    } catch (error: any) {
      console.error("========================================");
      console.error("❌ TRACK CREATION FAILED");
      console.error("========================================");
      console.error("Error:", error);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
      if (error.response) {
        console.error("Error Response:", error.response);
      }
      console.error("========================================");
      toast.error(error.message || "Failed to create track");
    } finally {
      setLoading(false);
      console.log("🏁 Form submission completed");
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-4">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/tracks">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-white">Create New Track</h1>
          <p className="text-sm text-gray-400 mt-1">Upload audio and add track information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Upload Audio File */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Upload Audio File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Upload audio file</Label>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Specifications: 2 channel (stereo) WAV format, 16-24 bit depth, 44.1 kHz minimum sample rate, more than 15 seconds duration.
              </p>

              {!audioFile ? (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".wav,audio/wav"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-300">Click to upload or drag and drop</span>
                    <span className="text-sm text-gray-500">WAV format only</span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700 rounded">
                      <Upload className="h-5 w-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{audioFileName}</p>
                      <p className="text-sm text-gray-400">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
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

              {audioError && (
                <p className="mt-2 text-sm text-red-500">{audioError}</p>
              )}

              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-sm text-blue-300 font-semibold mb-2">Validation Requirements:</p>
                <ul className="text-xs text-blue-200 space-y-1 list-disc list-inside">
                  <li>WAV format only</li>
                  <li>Stereo (2 channels)</li>
                  <li>16–24 bit depth</li>
                  <li>44.1 kHz or higher sample rate</li>
                  <li>Duration must exceed 15 seconds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. ISRC Section */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">ISRC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Do you have an ISRC for this recording?</Label>
              <div className="mt-3 flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isrc-yes"
                    checked={hasIsrc === true}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setHasIsrc(true);
                      } else {
                        setHasIsrc(null);
                        setIsrc("");
                      }
                    }}
                  />
                  <Label htmlFor="isrc-yes" className="text-gray-300 cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isrc-no"
                    checked={hasIsrc === false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setHasIsrc(false);
                        setIsrc("");
                      } else {
                        setHasIsrc(null);
                      }
                    }}
                  />
                  <Label htmlFor="isrc-no" className="text-gray-300 cursor-pointer">
                    No
                  </Label>
                </div>
              </div>
            </div>

            {hasIsrc === true && (
              <div>
                <Label className="text-gray-300">Enter ISRC</Label>
                <Input
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Enter ISRC manually"
                />
                <p className="mt-1 text-xs text-gray-400">
                  ISRC must be typed manually by the user
                </p>
              </div>
            )}

            {hasIsrc === false && (
              <p className="text-sm text-gray-400 italic">
                Cage Riot will manually assign ISRC later
              </p>
            )}
          </CardContent>
        </Card>

        {/* 3. Track Title */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Track Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Track Title *</Label>
              <Input
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                className="mt-2 bg-gray-900 border-gray-800 text-white"
                placeholder="Track Title"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* 4. Contributors Section */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Contributors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Primary Artist */}
            <div>
              <Label className="text-gray-300">Main Primary Artist</Label>
              <div className="mt-2 flex gap-2">
                <Select value={mainPrimaryArtist} onValueChange={setMainPrimaryArtist}>
                  <SelectTrigger className="flex-1 bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Select artist (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id || artist.name}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateArtistModal(true)}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Additional Contributor Roles */}
            <div className="space-y-4">
              <Label className="text-gray-300">Additional Contributor Roles</Label>

              {/* Featured Artist */}
              <div>
                <Label className="text-gray-400 text-sm">Featured Artist</Label>
                <div className="mt-2 flex gap-2">
                  <Select
                    value={contributors.featuredArtist}
                    onValueChange={(value) =>
                      setContributors({ ...contributors, featuredArtist: value })
                    }
                  >
                    <SelectTrigger className="flex-1 bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id || artist.name}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateArtistModal(true)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Producer */}
              <div>
                <Label className="text-gray-400 text-sm">Producer</Label>
                <div className="mt-2 flex gap-2">
                  <Select
                    value={contributors.producer}
                    onValueChange={(value) =>
                      setContributors({ ...contributors, producer: value })
                    }
                  >
                    <SelectTrigger className="flex-1 bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id || artist.name}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateArtistModal(true)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Writer */}
              <div>
                <Label className="text-gray-400 text-sm">Writer</Label>
                <div className="mt-2 flex gap-2">
                  <Select
                    value={contributors.writer}
                    onValueChange={(value) =>
                      setContributors({ ...contributors, writer: value })
                    }
                  >
                    <SelectTrigger className="flex-1 bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id || artist.name}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateArtistModal(true)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mixer */}
              <div>
                <Label className="text-gray-400 text-sm">Mixer</Label>
                <div className="mt-2 flex gap-2">
                  <Select
                    value={contributors.mixer}
                    onValueChange={(value) =>
                      setContributors({ ...contributors, mixer: value })
                    }
                  >
                    <SelectTrigger className="flex-1 bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id || artist.name}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateArtistModal(true)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mastering Engineer */}
              <div>
                <Label className="text-gray-400 text-sm">Mastering Engineer</Label>
                <div className="mt-2 flex gap-2">
                  <Select
                    value={contributors.masteringEngineer}
                    onValueChange={(value) =>
                      setContributors({ ...contributors, masteringEngineer: value })
                    }
                  >
                    <SelectTrigger className="flex-1 bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id || artist.name}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateArtistModal(true)}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6">
          <ButtonPrimary type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? "Creating..." : "Create Track"}
          </ButtonPrimary>
          <Link to="/tracks">
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

      {/* Create Artist Modal */}
      <CreateArtistModal
        open={showCreateArtistModal}
        onClose={() => setShowCreateArtistModal(false)}
        onSave={handleArtistCreated}
      />
    </div>
  );
}
