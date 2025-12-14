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
import { Plus, X } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import { useEffect } from "react";

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

  const loadArtists = async () => {
    try {
      const response = await artistsService.getAll();
      setArtists(response.data || []);
    } catch (error) {
      console.error("Failed to load artists:", error);
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

      console.log("Payload sent to API:", payload);

      const data = await releasesService.create(payload);
      console.log("✅ Release created:", data);
      toast.success("Release created successfully!");

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
