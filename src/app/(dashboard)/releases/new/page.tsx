"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { ButtonPrimary } from "../../../../components/ButtonPrimary";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { releasesService } from "../../../../lib/api";
import { artistsService } from "../../../../lib/api/services/artists.service";
import { coverArtService } from "../../../../lib/api/services/cover-art.service";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import { useEffect, useRef } from "react";

// Input Field Component
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="w-full">
      <Label htmlFor={name} className="text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-2 bg-gray-900 border-gray-800 text-white ${
          error ? "border-red-500 ring-2 ring-red-500" : ""
        }`}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function NewRelease() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [artists, setArtists] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const [resourceNumber, setResourceNumber] = useState("");
  const [parentalAdvisory, setParentalAdvisory] = useState("");

  // Minimal form data - only essential fields
  const [formData, setFormData] = useState({
    title: "",
    release_date: "",
    artist_display_name: "",
    label: "",
    metadata_language: "",
    configuration: "",
  });

  // Contributors
  const [primaryContributions, setPrimaryContributions] = useState([
    { artist: "", featured: false },
  ]);
  const [contributions, setContributions] = useState([{ artist: "" }]);

  // Load artists on mount
  useEffect(() => {
    loadArtists();
  }, []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (coverArtPreview) {
        URL.revokeObjectURL(coverArtPreview);
      }
    };
  }, [coverArtPreview]);

  const loadArtists = async () => {
    try {
      const response = await artistsService.getAll();
      setArtists(response.data || []);
    } catch (error) {
      console.error("Failed to load artists:", error);
    }
  };

  const handleCoverArtSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/tiff'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP, or TIFF)");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("Cover art file must be less than 10MB");
        return;
      }

      setCoverArtFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCoverArtPreview(previewUrl);
    }
  };

  const handleRemoveCoverArt = () => {
    setCoverArtFile(null);
    if (coverArtPreview) {
      URL.revokeObjectURL(coverArtPreview);
      setCoverArtPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    const missingFields: string[] = [];
    
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
      missingFields.push("Title");
    }
    if (!formData.metadata_language || formData.metadata_language.trim() === "") {
      newErrors.metadata_language = "Metadata language is required";
      missingFields.push("Metadata Language");
    }
    if (!formData.configuration || formData.configuration.trim() === "") {
      newErrors.configuration = "Configuration is required";
      missingFields.push("Configuration");
    }
    if (!formData.label || formData.label.trim() === "") {
      newErrors.label = "Label is required";
      missingFields.push("Label");
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Scroll to first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          errorElement.focus();
        }, 300);
      }
      
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      // Build minimal payload - only send what's needed
      const payload: any = {
        title: formData.title.trim(),
        label: formData.label.trim(),
        metadata_language: formData.metadata_language,
        configuration: formData.configuration,
      };

      // Add optional fields only if they have values
      if (formData.release_date) {
        payload.release_date = formData.release_date;
      }
      if (formData.artist_display_name && formData.artist_display_name.trim()) {
        payload.artist_display_name = formData.artist_display_name.trim();
      }

      // Add primary contributions if any are filled
      if (primaryContributions.length > 0 && primaryContributions[0].artist) {
        payload.primary_contributions = primaryContributions
          .filter((c) => c.artist)
          .map((c) => ({
            artist: c.artist,
            featured: c.featured,
          }));
      }

      // Add contributions if any are filled
      if (contributions.length > 0 && contributions[0].artist) {
        payload.contributions = contributions
          .filter((c) => c.artist)
          .map((c) => ({
            artist: c.artist,
          }));
      }

      // Step 1: Create cover art metadata first if file is provided
      let coverArtId: number | null = null;
      if (coverArtFile) {
        try {
          // Generate resource number if not provided
          const resourceNum = resourceNumber.trim() || `RES${Date.now()}`;
          
          // Create cover art metadata
          const coverArt = await coverArtService.create({
            title: `${formData.title} Cover Art`,
            resource_number: resourceNum,
            parental_advisory: parentalAdvisory && parentalAdvisory !== "none" ? parentalAdvisory : undefined,
          });
          
          console.log("✅ Cover art created:", coverArt);
          coverArtId = coverArt.id;
        } catch (coverArtError: any) {
          console.error("❌ Cover art creation failed:", coverArtError);
          toast.error(`Cover art creation failed: ${coverArtError.message}`);
          // Continue with release creation even if cover art fails
        }
      }

      // Step 2: Create the release with cover_art_id if available
      if (coverArtId) {
        payload.cover_art_id = coverArtId;
      }

      console.log("Payload sent to API:", payload);

      const data = await releasesService.create(payload);
      console.log("✅ Release created:", data);
      
      // Step 3: Extract cover_art.id from response and upload file using both server-side and client-side
      if (coverArtFile && data) {
        try {
          // Extract cover_art.id from the response
          // The response structure: { status, message, data: { cover_art: { id, ... }, ... } }
          const rawResponse = (data as any)._rawResponse;
          const responseData = rawResponse?.data || (data as any).data || data;
          const coverArtFromResponse = responseData?.cover_art;
          
          // Use cover_art.id from response if available, otherwise fall back to the one we created
          const finalCoverArtId = coverArtFromResponse?.id || coverArtId;
          
          if (finalCoverArtId) {
            console.log(`📤 Uploading cover art file for cover_art ID: ${finalCoverArtId}`);
            
            // Upload and poll: Keep calling server-side upload until cover_art_url is NOT null
            const maxAttempts = 20; // Maximum 20 attempts
            const pollInterval = 2000; // Wait 2 seconds between attempts
            let coverArtUrl: string | null = null;
            let attempts = 0;
            
            while (coverArtUrl === null && attempts < maxAttempts) {
              attempts++;
              
              // Step 1: Server-side upload (form-data with name "file" and type "file")
              try {
                console.log(`🔄 Attempt ${attempts}/${maxAttempts}: Server-side upload (PUT /cover_art/${finalCoverArtId}/upload/{filename})...`);
                console.log("   - Sending file as form-data with name='file' and type='file'");
                await coverArtService.uploadServer(finalCoverArtId, coverArtFile);
                console.log("✅ Server-side upload completed successfully");
              } catch (serverError: any) {
                console.warn(`⚠️ Server-side upload failed on attempt ${attempts}:`, serverError.message);
                // Continue to check download even if upload fails
              }
              
              // Step 2: Check download endpoint for cover_art_url
              try {
                console.log(`🔍 Checking download endpoint (GET /cover_art/${finalCoverArtId}/download)...`);
                coverArtUrl = await coverArtService.download(finalCoverArtId);
                
                if (coverArtUrl && coverArtUrl.trim() !== '') {
                  console.log(`✅ Cover art URL retrieved on attempt ${attempts}:`, coverArtUrl);
                  break; // Success! Exit the loop
                } else {
                  console.log(`⏳ Attempt ${attempts}: cover_art_url is null - will upload again...`);
                  coverArtUrl = null; // Reset to null to continue loop
                }
              } catch (downloadError: any) {
                console.log(`⏳ Attempt ${attempts}: Download check failed - ${downloadError.message}`);
                coverArtUrl = null; // Reset to null to continue loop
              }
              
              // Wait before next attempt (except on last attempt)
              if (attempts < maxAttempts && coverArtUrl === null) {
                console.log(`⏳ Waiting ${pollInterval / 1000} seconds before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, pollInterval));
              }
            }
            
            // Report final result
            if (coverArtUrl && coverArtUrl.trim() !== '') {
              console.log("✅ Cover art URL is now available:", coverArtUrl);
              toast.success("Cover art uploaded and processed successfully");
            } else {
              console.warn("⚠️ Cover art URL is still null after all attempts. File may still be processing.");
              toast.warning("Cover art uploaded but may still be processing");
            }
          } else {
            console.warn("⚠️ No cover_art.id found in response, skipping file upload");
            toast.warning("Release created but cover art upload skipped (no cover_art.id in response)");
          }
        } catch (uploadError: any) {
          console.error("❌ Cover art upload error:", uploadError);
          toast.error(`Cover art upload error: ${uploadError.message}`);
          // Don't block navigation - release was created successfully
        }
      }
      
      if (coverArtId) {
        toast.success("Release and cover art created successfully!");
      } else {
        toast.success("Release created successfully!");
      }

      navigate("/releases");
    } catch (error: any) {
      console.error("❌ Create release failed:", error.message || error);
      const errorMessage = error.message || "Failed to create release";
      toast.error(errorMessage);
      
      // Show more detailed error if available
      if (error.response?.data?.details) {
        console.error("API Error Details:", error.response.data.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link to="/releases">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl text-white font-semibold">
            Create New Release
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Add a new release to your catalog
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/30 ">
            <CardHeader>
              <CardTitle className="text-white text-xl mt-2">Release Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title - Required */}
                <InputField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={(v) => {
                    setFormData({ ...formData, title: v });
                    if (errors.title) {
                      setErrors({ ...errors, title: "" });
                    }
                  }}
                  disabled={loading}
                  required
                  error={errors.title}
                  placeholder="Enter release title"
                />

                {/* Release Date - Optional */}
                <InputField
                  label="Release Date"
                  name="release_date"
                  type="date"
                  value={formData.release_date}
                  onChange={(v) => setFormData({ ...formData, release_date: v })}
                  disabled={loading}
                  placeholder="Select release date"
                />

                {/* Artist Display Name - Optional */}
                <InputField
                  label="Artist Display Name"
                  name="artist_display_name"
                  value={formData.artist_display_name}
                  onChange={(v) => setFormData({ ...formData, artist_display_name: v })}
                  disabled={loading}
                  placeholder="Enter artist name"
                />

                {/* Label - Required */}
                <InputField
                  label="Label"
                  name="label"
                  value={formData.label}
                  onChange={(v) => {
                    setFormData({ ...formData, label: v });
                    if (errors.label) {
                      setErrors({ ...errors, label: "" });
                    }
                  }}
                  disabled={loading}
                  required
                  error={errors.label}
                  placeholder="Enter label name"
                />

                {/* Metadata Language - Required Dropdown */}
                <div className="w-full" id="metadata_language">
                  <Label htmlFor="metadata_language" className="text-gray-300">
                    Metadata Language <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.metadata_language}
                    onValueChange={(value) => {
                      setFormData({ ...formData, metadata_language: value });
                      if (errors.metadata_language) {
                        setErrors({ ...errors, metadata_language: "" });
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger 
                      id="metadata_language_select"
                      className={`mt-2 bg-gray-900 border-gray-800 text-white ${
                        errors.metadata_language ? "border-red-500 ring-2 ring-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select metadata language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="English" className="text-white">English</SelectItem>
                      <SelectItem value="Spanish" className="text-white">Spanish</SelectItem>
                      <SelectItem value="French" className="text-white">French</SelectItem>
                      <SelectItem value="German" className="text-white">German</SelectItem>
                      <SelectItem value="Italian" className="text-white">Italian</SelectItem>
                      <SelectItem value="Portuguese" className="text-white">Portuguese</SelectItem>
                      <SelectItem value="Japanese" className="text-white">Japanese</SelectItem>
                      <SelectItem value="Chinese" className="text-white">Chinese</SelectItem>
                      <SelectItem value="Korean" className="text-white">Korean</SelectItem>
                      <SelectItem value="Russian" className="text-white">Russian</SelectItem>
                      <SelectItem value="Arabic" className="text-white">Arabic</SelectItem>
                      <SelectItem value="Hindi" className="text-white">Hindi</SelectItem>
                      <SelectItem value="Dutch" className="text-white">Dutch</SelectItem>
                      <SelectItem value="Swedish" className="text-white">Swedish</SelectItem>
                      <SelectItem value="Norwegian" className="text-white">Norwegian</SelectItem>
                      <SelectItem value="Danish" className="text-white">Danish</SelectItem>
                      <SelectItem value="Finnish" className="text-white">Finnish</SelectItem>
                      <SelectItem value="Polish" className="text-white">Polish</SelectItem>
                      <SelectItem value="Turkish" className="text-white">Turkish</SelectItem>
                      <SelectItem value="Greek" className="text-white">Greek</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.metadata_language && (
                    <p className="text-red-400 text-sm mt-1">{errors.metadata_language}</p>
                  )}
                </div>

                {/* Configuration - Required Dropdown */}
                <div className="w-full" id="configuration">
                  <Label htmlFor="configuration" className="text-gray-300">
                    Configuration <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.configuration}
                    onValueChange={(value) => {
                      setFormData({ ...formData, configuration: value });
                      if (errors.configuration) {
                        setErrors({ ...errors, configuration: "" });
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger 
                      id="configuration_select"
                      className={`mt-2 bg-gray-900 border-gray-800 text-white ${
                        errors.configuration ? "border-red-500 ring-2 ring-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select configuration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Digital Album" className="text-white">Digital Album</SelectItem>
                      <SelectItem value="Digital Single" className="text-white">Digital Single</SelectItem>
                      <SelectItem value="Digital EP" className="text-white">Digital EP</SelectItem>
                      <SelectItem value="Physical Album" className="text-white">Physical Album</SelectItem>
                      <SelectItem value="Physical Single" className="text-white">Physical Single</SelectItem>
                      <SelectItem value="Physical EP" className="text-white">Physical EP</SelectItem>
                      <SelectItem value="Vinyl Album" className="text-white">Vinyl Album</SelectItem>
                      <SelectItem value="Vinyl Single" className="text-white">Vinyl Single</SelectItem>
                      <SelectItem value="CD Album" className="text-white">CD Album</SelectItem>
                      <SelectItem value="CD Single" className="text-white">CD Single</SelectItem>
                      <SelectItem value="CD EP" className="text-white">CD EP</SelectItem>
                      <SelectItem value="Cassette Album" className="text-white">Cassette Album</SelectItem>
                      <SelectItem value="Cassette Single" className="text-white">Cassette Single</SelectItem>
                      <SelectItem value="Streaming Only" className="text-white">Streaming Only</SelectItem>
                      <SelectItem value="Download Only" className="text-white">Download Only</SelectItem>
                      <SelectItem value="Compilation" className="text-white">Compilation</SelectItem>
                      <SelectItem value="Mixtape" className="text-white">Mixtape</SelectItem>
                      <SelectItem value="Live Album" className="text-white">Live Album</SelectItem>
                      <SelectItem value="Remix Album" className="text-white">Remix Album</SelectItem>
                      <SelectItem value="Soundtrack" className="text-white">Soundtrack</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.configuration && (
                    <p className="text-red-400 text-sm mt-1">{errors.configuration}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Art Section */}
          <Card className="border-gray-800 bg-gray-900/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">Cover Art</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Resource Number */}
                <InputField
                  label="Resource Number"
                  name="resource_number"
                  value={resourceNumber}
                  onChange={(v) => setResourceNumber(v)}
                  disabled={loading}
                  placeholder="e.g., 240MGRES00001"
                />

                {/* Parental Advisory */}
                <div className="w-full">
                  <Label htmlFor="parental_advisory" className="text-gray-300">
                    Parental Advisory
                  </Label>
                  <Select
                    value={parentalAdvisory || undefined}
                    onValueChange={(value) => setParentalAdvisory(value === "none" ? "" : value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Select advisory" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="none" className="text-white">None</SelectItem>
                      <SelectItem value="Explicit" className="text-white">Explicit</SelectItem>
                      <SelectItem value="Clean" className="text-white">Clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cover Art File Upload */}
              <div className="w-full">
                <Label className="text-gray-300">Cover Art Image</Label>
                <div className="mt-2 space-y-3">
                  {coverArtPreview ? (
                    <div className="relative">
                      <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                        <img
                          src={coverArtPreview}
                          alt="Cover art preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveCoverArt}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {coverArtFile?.name} ({((coverArtFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 transition-colors bg-gray-800/50"
                    >
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400 text-sm mb-1">
                        Click to upload cover art
                      </p>
                      <p className="text-gray-500 text-xs">
                        JPEG, PNG, GIF, WebP, or TIFF (max 10MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/tiff"
                    onChange={handleCoverArtSelect}
                    className="hidden"
                    disabled={loading}
                  />
                  {!coverArtPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Cover Art Image
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Contributions Section */}
          <Card className="border-gray-800 bg-gray-900/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">Primary Contributions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {primaryContributions.map((cont, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label className="text-gray-300">Artist</Label>
                    <Select
                      value={cont.artist}
                      onValueChange={(value) => {
                        const newContributions = [...primaryContributions];
                        newContributions[index].artist = value;
                        setPrimaryContributions(newContributions);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                        <SelectValue placeholder="Select artist" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id} className="text-white">
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pb-2">
                    <Checkbox
                      id={`primary_featured_${index}`}
                      checked={cont.featured}
                      onCheckedChange={(checked) => {
                        const newContributions = [...primaryContributions];
                        newContributions[index].featured = checked as boolean;
                        setPrimaryContributions(newContributions);
                      }}
                      disabled={loading}
                    />
                    <Label htmlFor={`primary_featured_${index}`} className="text-gray-300">
                      Featured
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newContributions = primaryContributions.filter((_, i) => i !== index);
                      setPrimaryContributions(newContributions);
                    }}
                    disabled={loading}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setPrimaryContributions([...primaryContributions, { artist: "", featured: false }])}
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Primary Contribution
              </Button>
            </CardContent>
          </Card>

          {/* Contributions Section */}
          <Card className="border-gray-800 bg-gray-900/30">
            <CardHeader>
              <CardTitle className="text-white text-xl">Additional Contributions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contributions.map((cont, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label className="text-gray-300">Artist</Label>
                    <Select
                      value={cont.artist}
                      onValueChange={(value) => {
                        const newContributions = [...contributions];
                        newContributions[index].artist = value;
                        setContributions(newContributions);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                        <SelectValue placeholder="Select artist" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id} className="text-white">
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newContributions = contributions.filter((_, i) => i !== index);
                      setContributions(newContributions);
                    }}
                    disabled={loading}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setContributions([...contributions, { artist: "" }])}
                disabled={loading}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contribution
              </Button>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonPrimary
              type="submit"
              className="flex-1 justify-center"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Release"}
            </ButtonPrimary>
            <Link to="/releases" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800"
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
