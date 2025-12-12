"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tracksService } from "../../../../../lib/api/services/tracks.service";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Button } from "../../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { ButtonPrimary } from "../../../../../components/ButtonPrimary";
import { Save, Plus, Minus } from "lucide-react";

export default function TrackDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState<any>(null);
  
  // Initialize form data with same structure as new track form
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    track_type: "",
    isrc: "",
    display_title: "",
    version_display_title: "",
    version_title: "",
    artist_display_name: "",
    
    // Language & Location
    audio_language: "",
    metadata_language: "",
    metadata_language_country: "",
    primary_recording_location: "",
    other_recording_locations: [] as string[],
    recording_location_detail: "",
    mixing_location_detail: "",
    mastering_location_detail: "",
    
    // P-Line & C-Line
    parental_advisory: "",
    pline_year: "",
    pline_owner: "",
    pline_license: "",
    cline_year: "",
    cline_owner: "",
    cline_license: "",
    recording_end_date_year: "",
    
    // Additional Info
    vline: "",
    keywords: "",
    notes: "",
    contains_samples: false,
    
    // Audio Settings
    duration: "",
    preview_in: "",
    sample_length: "",
    
    // Session & Audio Info
    session_performance_type: "",
    session_type: "",
    music_type: "",
    audio_presentation: "",
    
    // Primary Contributions
    primary_contributions: [
      {
        artist: "",
        featured: false,
      },
    ],
    
    // Contributions
    contributions: [
      {
        artist: "",
      },
    ],
    
    // Artist Type
    artist_type: "",
    name_format: "",
    
    // Works
    works: [
      {
        title: "",
        iswc: "",
        language: "",
        label_work_code: "",
        music_type: "",
        agency: "",
        keywords: "",
        contains_ai: false,
        lyrics: "",
        copyright_year: "",
        description: "",
        contributions: [
          {
            artist: "",
            affiliation: "",
            split_percentage: null as number | null,
            territory: "",
            restrictions: [] as string[],
            role: "",
            type: "",
          },
        ],
        publishers: [
          {
            publisher: "",
            rights_administrator: "",
            affiliation: "",
            split_percentage: null as number | null,
            territory: "",
            restrictions: [] as string[],
          },
        ],
        partner_ids: [
          {
            name: "",
            value: "",
          },
        ],
      },
    ],
    
    // Partner IDs
    partner_ids: [
      {
        name: "",
        value: "",
      },
    ],
    
    // Union Details
    union_details: [
      {
        agreement_type: "",
        afm_agreement: "",
        sag_agreement: null as string | null,
      },
    ],
    
    // Rights Holders
    rights_holders: [
      {
        rights_holder_name: "",
        rights_holder_type: "",
        rights_use_type: "",
        rights_share: "",
        rights_begin_date: "",
        rights_expiration_date: "",
        territory: "",
        restrictions: [] as string[],
      },
    ],
  });

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
      
      // Populate form with track data - map all fields from trackData
      setFormData({
        title: trackData.title || "",
        track_type: (trackData as any).track_type || "",
        isrc: trackData.isrc || "",
        display_title: (trackData as any).display_title || "",
        version_display_title: (trackData as any).version_display_title || "",
        version_title: (trackData as any).version_title || "",
        artist_display_name: (trackData as any).artist_display_name || "",
        audio_language: (trackData as any).audio_language || "",
        metadata_language: (trackData as any).metadata_language || "",
        metadata_language_country: (trackData as any).metadata_language_country || "",
        primary_recording_location: (trackData as any).primary_recording_location || "",
        other_recording_locations: (trackData as any).other_recording_locations || [],
        recording_location_detail: (trackData as any).recording_location_detail || "",
        mixing_location_detail: (trackData as any).mixing_location_detail || "",
        mastering_location_detail: (trackData as any).mastering_location_detail || "",
        parental_advisory: (trackData as any).parental_advisory || "",
        pline_year: (trackData as any).pline_year || "",
        pline_owner: (trackData as any).pline_owner || "",
        pline_license: (trackData as any).pline_license || "",
        cline_year: (trackData as any).cline_year || "",
        cline_owner: (trackData as any).cline_owner || "",
        cline_license: (trackData as any).cline_license || "",
        recording_end_date_year: (trackData as any).recording_end_date_year || "",
        vline: (trackData as any).vline || "",
        keywords: (trackData as any).keywords || "",
        notes: (trackData as any).notes || "",
        contains_samples: (trackData as any).contains_samples || false,
        duration: trackData.duration || (trackData as any).duration || "",
        preview_in: (trackData as any).preview_in || "",
        sample_length: (trackData as any).sample_length || "",
        session_performance_type: (trackData as any).session_performance_type || "",
        session_type: (trackData as any).session_type || "",
        music_type: (trackData as any).music_type || "",
        audio_presentation: (trackData as any).audio_presentation || "",
        primary_contributions: (trackData as any).primary_contributions || [{ artist: "", featured: false }],
        contributions: (trackData as any).contributions || [{ artist: "" }],
        artist_type: (trackData as any).artist_type || "",
        name_format: (trackData as any).name_format || "",
        works: (trackData as any).works || [{
          title: "",
          iswc: "",
          language: "",
          label_work_code: "",
          music_type: "",
          agency: "",
          keywords: "",
          contains_ai: false,
          lyrics: "",
          copyright_year: "",
          description: "",
          contributions: [{
            artist: "",
            affiliation: "",
            split_percentage: null,
            territory: "",
            restrictions: [],
            role: "",
            type: "",
          }],
          publishers: [{
            publisher: "",
            rights_administrator: "",
            affiliation: "",
            split_percentage: null,
            territory: "",
            restrictions: [],
          }],
          partner_ids: [{ name: "", value: "" }],
        }],
        partner_ids: (trackData as any).partner_ids || [{ name: "", value: "" }],
        union_details: (trackData as any).union_details || [{ agreement_type: "", afm_agreement: "", sag_agreement: null }],
        rights_holders: (trackData as any).rights_holders || [{
          rights_holder_name: "",
          rights_holder_type: "",
          rights_use_type: "",
          rights_share: "",
          rights_begin_date: "",
          rights_expiration_date: "",
          territory: "",
          restrictions: [],
        }],
      });
    } catch (error: any) {
      console.error("Error loading track:", error);
      toast.error(error.message || "Failed to load track");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare update data - handle number conversions and arrays
      const processedData: any = {
        ...formData,
        pline_year: formData.pline_year && formData.pline_year !== "" ? Number(formData.pline_year) : undefined,
        cline_year: formData.cline_year && formData.cline_year !== "" ? Number(formData.cline_year) : undefined,
        recording_end_date_year: formData.recording_end_date_year && formData.recording_end_date_year !== ""
          ? Number(formData.recording_end_date_year)
          : undefined,
        works: formData.works.map((work) => ({
          ...work,
          copyright_year: work.copyright_year && work.copyright_year !== "" ? Number(work.copyright_year) : undefined,
          contributions: work.contributions.map((c) => {
            const splitPct: any = c.split_percentage;
            const isEmpty =
              splitPct === null ||
              splitPct === undefined ||
              splitPct === "" ||
              (typeof splitPct === "string" && splitPct.trim() === "");
            return {
              ...c,
              split_percentage: isEmpty ? undefined : Number(splitPct),
            };
          }),
          publishers: work.publishers.map((p) => {
            const splitPct: any = p.split_percentage;
            const isEmpty =
              splitPct === null ||
              splitPct === undefined ||
              splitPct === "" ||
              (typeof splitPct === "string" && splitPct.trim() === "");
            return {
              ...p,
              split_percentage: isEmpty ? undefined : Number(splitPct),
            };
          }),
        })),
      };

      await tracksService.update(id!, processedData);
      toast.success("Track details updated successfully!");
      
      // Reload track data
      await loadTrack();
    } catch (error: any) {
      console.error("Error updating track:", error);
      toast.error(error.message || "Failed to update track");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateArrayField = (path: string, index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;
      for (const key of keys) {
        current = current[key];
      }
      current[index] = { ...current[index], [field]: value };
      return newData;
    });
  };

  const addArrayItem = (path: string, defaultItem: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;
      for (const key of keys) {
        current = current[key];
      }
      current.push(defaultItem);
      return newData;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;
      for (const key of keys) {
        current = current[key];
      }
      current.splice(index, 1);
      return newData;
    });
  };

  if (loading && !track) {
    return <div className="text-white">Loading track details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          {track?.title || "Track Details"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Track Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Enter track title"
                />
              </div>

              <div>
                <Label className="text-gray-300">ISRC Code</Label>
                <Input
                  value={formData.isrc}
                  onChange={(e) => updateField("isrc", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="USOPM2200001"
                />
              </div>

              <div>
                <Label className="text-gray-300">Artist Display Name</Label>
                <Input
                  value={formData.artist_display_name}
                  onChange={(e) => updateField("artist_display_name", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Michael McDonald & Friends"
                />
              </div>

              <div>
                <Label className="text-gray-300">Display Title</Label>
                <Input
                  value={formData.display_title}
                  onChange={(e) => updateField("display_title", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Playin' by the Rules Special Edition"
                />
              </div>

              <div>
                <Label className="text-gray-300">Version Display Title</Label>
                <Input
                  value={formData.version_display_title}
                  onChange={(e) => updateField("version_display_title", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Special Bonus Edition"
                />
              </div>

              <div>
                <Label className="text-gray-300">Version Title</Label>
                <Input
                  value={formData.version_title}
                  onChange={(e) => updateField("version_title", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Bonus Edition"
                />
              </div>

              <div>
                <Label className="text-gray-300">V-Line</Label>
                <Input
                  value={formData.vline}
                  onChange={(e) => updateField("vline", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="The Regular Collective"
                />
              </div>

              <div>
                <Label className="text-gray-300">Keywords</Label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => updateField("keywords", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="modern r&b classics"
                />
              </div>

              <div>
                <Label className="text-gray-300">Track Type</Label>
                <Select
                  value={formData.track_type}
                  onValueChange={(value) => updateField("track_type", value)}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Parental Advisory</Label>
                <Select
                  value={formData.parental_advisory}
                  onValueChange={(value) => updateField("parental_advisory", value)}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Non-Applicable">Non-Applicable</SelectItem>
                    <SelectItem value="Explicit">Explicit</SelectItem>
                    <SelectItem value="Clean">Clean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="contains_samples"
                  checked={formData.contains_samples}
                  onCheckedChange={(checked) =>
                    updateField("contains_samples", checked)
                  }
                />
                <Label htmlFor="contains_samples" className="text-gray-300 cursor-pointer">
                  Contains Samples
                </Label>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="mt-2 bg-gray-900 border-gray-800 text-white min-h-24"
                placeholder="Hat not included"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">Duration (ISO 8601: PT3M48S)</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="PT3M48S"
                />
              </div>

              <div>
                <Label className="text-gray-300">Preview In (ISO 8601: PT43S)</Label>
                <Input
                  value={formData.preview_in}
                  onChange={(e) => updateField("preview_in", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="PT43S"
                />
              </div>

              <div>
                <Label className="text-gray-300">Sample Length (ISO 8601: PT30S)</Label>
                <Input
                  value={formData.sample_length}
                  onChange={(e) => updateField("sample_length", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="PT30S"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Session Performance Type</Label>
                <Input
                  value={formData.session_performance_type}
                  onChange={(e) => updateField("session_performance_type", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Vocal"
                />
              </div>

              <div>
                <Label className="text-gray-300">Session Type</Label>
                <Input
                  value={formData.session_type}
                  onChange={(e) => updateField("session_type", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Studio"
                />
              </div>

              <div>
                <Label className="text-gray-300">Music Type</Label>
                <Input
                  value={formData.music_type}
                  onChange={(e) => updateField("music_type", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="pop"
                />
              </div>

              <div>
                <Label className="text-gray-300">Audio Presentation</Label>
                <Input
                  value={formData.audio_presentation}
                  onChange={(e) => updateField("audio_presentation", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Stereo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Language & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Audio Language</Label>
                <Input
                  value={formData.audio_language}
                  onChange={(e) => updateField("audio_language", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="English"
                />
              </div>

              <div>
                <Label className="text-gray-300">Metadata Language</Label>
                <Input
                  value={formData.metadata_language}
                  onChange={(e) => updateField("metadata_language", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="English"
                />
              </div>

              <div>
                <Label className="text-gray-300">Metadata Language Country</Label>
                <Input
                  value={formData.metadata_language_country}
                  onChange={(e) => updateField("metadata_language_country", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="United States"
                />
              </div>

              <div>
                <Label className="text-gray-300">Primary Recording Location</Label>
                <Input
                  value={formData.primary_recording_location}
                  onChange={(e) => updateField("primary_recording_location", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="US"
                />
              </div>

              <div>
                <Label className="text-gray-300">Recording Location Detail</Label>
                <Input
                  value={formData.recording_location_detail}
                  onChange={(e) => updateField("recording_location_detail", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Santa Monica, CA"
                />
              </div>

              <div>
                <Label className="text-gray-300">Mixing Location Detail</Label>
                <Input
                  value={formData.mixing_location_detail}
                  onChange={(e) => updateField("mixing_location_detail", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Los Angeles, CA"
                />
              </div>

              <div>
                <Label className="text-gray-300">Mastering Location Detail</Label>
                <Input
                  value={formData.mastering_location_detail}
                  onChange={(e) => updateField("mastering_location_detail", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Venice, CA"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-300">Other Recording Locations (comma-separated)</Label>
                <Input
                  value={formData.other_recording_locations.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "other_recording_locations",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="FR, DE"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* P-Line & C-Line Section */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">P-Line Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">P-Line Year</Label>
                <Input
                  type="number"
                  value={formData.pline_year}
                  onChange={(e) => {
                    updateField("pline_year", e.target.value === "" ? "" : Number(e.target.value));
                  }}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">P-Line Owner</Label>
                <Input
                  value={formData.pline_owner}
                  onChange={(e) => updateField("pline_owner", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Smooth Records Group"
                />
              </div>

              <div>
                <Label className="text-gray-300">P-Line License</Label>
                <Input
                  value={formData.pline_license}
                  onChange={(e) => updateField("pline_license", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Under License"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">C-Line Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">C-Line Year</Label>
                <Input
                  type="number"
                  value={formData.cline_year}
                  onChange={(e) => {
                    updateField("cline_year", e.target.value === "" ? "" : Number(e.target.value));
                  }}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">C-Line Owner</Label>
                <Input
                  value={formData.cline_owner}
                  onChange={(e) => updateField("cline_owner", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Smooth Records Group"
                />
              </div>

              <div>
                <Label className="text-gray-300">C-Line License</Label>
                <Input
                  value={formData.cline_license}
                  onChange={(e) => updateField("cline_license", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Under License"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Recording End Date Year</Label>
              <Input
                type="number"
                value={formData.recording_end_date_year}
                onChange={(e) => {
                  updateField("recording_end_date_year", e.target.value === "" ? "" : Number(e.target.value));
                }}
                className="mt-2 bg-gray-900 border-gray-800 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Works Section */}
        {formData.works.map((work, workIndex) => (
          <Card key={workIndex} className="bg-gray-900/30 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Work {workIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Work Title</Label>
                  <Input
                    value={work.title}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "title", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="I Keep Forgettin'"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">ISWC</Label>
                  <Input
                    value={work.iswc}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "iswc", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="T-345246800-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Language</Label>
                  <Input
                    value={work.language}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "language", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="English"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Label Work Code</Label>
                  <Input
                    value={work.label_work_code}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "label_work_code", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="WORKS123"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Music Type</Label>
                  <Input
                    value={work.music_type}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "music_type", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="pop"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Agency</Label>
                  <Input
                    value={work.agency}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "agency", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="McDonald Publishing"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Keywords</Label>
                  <Input
                    value={work.keywords}
                    onChange={(e) =>
                      updateArrayField("works", workIndex, "keywords", e.target.value)
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="pop soul hits"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`work-contains-ai-${workIndex}`}
                    checked={work.contains_ai}
                    onCheckedChange={(checked) =>
                      updateArrayField("works", workIndex, "contains_ai", checked)
                    }
                  />
                  <Label htmlFor={`work-contains-ai-${workIndex}`} className="text-gray-300 cursor-pointer">
                    Contains AI
                  </Label>
                </div>

                <div>
                  <Label className="text-gray-300">Copyright Year</Label>
                  <Input
                    type="number"
                    value={work.copyright_year}
                    onChange={(e) =>
                      updateArrayField(
                        "works",
                        workIndex,
                        "copyright_year",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={work.description}
                  onChange={(e) =>
                    updateArrayField("works", workIndex, "description", e.target.value)
                  }
                  className="mt-2 bg-gray-900 border-gray-800 text-white min-h-24"
                  placeholder="Written by Michael McDonald and Ed Sanford..."
                />
              </div>

              <div>
                <Label className="text-gray-300">Lyrics</Label>
                <Textarea
                  value={work.lyrics}
                  onChange={(e) =>
                    updateArrayField("works", workIndex, "lyrics", e.target.value)
                  }
                  className="mt-2 bg-gray-900 border-gray-800 text-white min-h-32"
                  placeholder="I keep forgettin' we're not in love anymore..."
                />
              </div>

              {/* Work Contributions */}
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-gray-300 text-lg">Contributions</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newContrib = {
                        artist: "",
                        affiliation: "",
                        split_percentage: null as number | null,
                        territory: "",
                        restrictions: [],
                        role: "",
                        type: "",
                      };
                      updateArrayField("works", workIndex, "contributions", [
                        ...work.contributions,
                        newContrib,
                      ]);
                    }}
                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {work.contributions.map((contrib, contribIndex) => (
                  <Card
                    key={contribIndex}
                    className="bg-gray-800/50 border-gray-700 mb-4"
                  >
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Artist</Label>
                          <Input
                            value={contrib.artist}
                            onChange={(e) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                artist: e.target.value,
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="Ed Sanford"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Affiliation</Label>
                          <Input
                            value={contrib.affiliation}
                            onChange={(e) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                affiliation: e.target.value,
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="BMG"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Split Percentage</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={contrib.split_percentage === null ? "" : contrib.split_percentage}
                            onChange={(e) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                split_percentage: e.target.value === "" ? null : Number(e.target.value),
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="50.0 (leave empty for null)"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Territory</Label>
                          <Select
                            value={contrib.territory}
                            onValueChange={(value) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                territory: value,
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                          >
                            <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="worldwide">Worldwide</SelectItem>
                              <SelectItem value="worldwide_except">Worldwide Except</SelectItem>
                              <SelectItem value="only">Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-gray-300">Role</Label>
                          <Input
                            value={contrib.role}
                            onChange={(e) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                role: e.target.value,
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="Author"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Type</Label>
                          <Input
                            value={contrib.type}
                            onChange={(e) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                type: e.target.value,
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="DVD"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label className="text-gray-300">Restrictions (comma-separated)</Label>
                          <Input
                            value={contrib.restrictions.join(", ")}
                            onChange={(e) => {
                              const newContribs = [...work.contributions];
                              newContribs[contribIndex] = {
                                ...contrib,
                                restrictions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                              };
                              updateArrayField("works", workIndex, "contributions", newContribs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="FR"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newContribs = work.contributions.filter(
                            (_, i) => i !== contribIndex
                          );
                          updateArrayField("works", workIndex, "contributions", newContribs.length > 0 ? newContribs : [{
                            artist: "",
                            affiliation: "",
                            split_percentage: null as number | null,
                            territory: "",
                            restrictions: [],
                            role: "",
                            type: "",
                          }]);
                        }}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Work Publishers */}
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-gray-300 text-lg">Publishers</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newPub = {
                        publisher: "",
                        rights_administrator: "",
                        affiliation: "",
                        split_percentage: null as number | null,
                        territory: "",
                        restrictions: [],
                      };
                      updateArrayField("works", workIndex, "publishers", [
                        ...work.publishers,
                        newPub,
                      ]);
                    }}
                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {work.publishers.map((publisher, pubIndex) => (
                  <Card
                    key={pubIndex}
                    className="bg-gray-800/50 border-gray-700 mb-4"
                  >
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Publisher</Label>
                          <Input
                            value={publisher.publisher}
                            onChange={(e) => {
                              const newPubs = [...work.publishers];
                              newPubs[pubIndex] = {
                                ...publisher,
                                publisher: e.target.value,
                              };
                              updateArrayField("works", workIndex, "publishers", newPubs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="Yacht Times"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Rights Administrator</Label>
                          <Input
                            value={publisher.rights_administrator}
                            onChange={(e) => {
                              const newPubs = [...work.publishers];
                              newPubs[pubIndex] = {
                                ...publisher,
                                rights_administrator: e.target.value,
                              };
                              updateArrayField("works", workIndex, "publishers", newPubs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="SESAC"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Affiliation</Label>
                          <Input
                            value={publisher.affiliation}
                            onChange={(e) => {
                              const newPubs = [...work.publishers];
                              newPubs[pubIndex] = {
                                ...publisher,
                                affiliation: e.target.value,
                              };
                              updateArrayField("works", workIndex, "publishers", newPubs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="BMG"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Split Percentage</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={publisher.split_percentage === null ? "" : publisher.split_percentage}
                            onChange={(e) => {
                              const newPubs = [...work.publishers];
                              newPubs[pubIndex] = {
                                ...publisher,
                                split_percentage: e.target.value === "" ? null : Number(e.target.value),
                              };
                              updateArrayField("works", workIndex, "publishers", newPubs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="100.0"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300">Territory</Label>
                          <Select
                            value={publisher.territory}
                            onValueChange={(value) => {
                              const newPubs = [...work.publishers];
                              newPubs[pubIndex] = {
                                ...publisher,
                                territory: value,
                              };
                              updateArrayField("works", workIndex, "publishers", newPubs);
                            }}
                          >
                            <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="worldwide">Worldwide</SelectItem>
                              <SelectItem value="worldwide_except">Worldwide Except</SelectItem>
                              <SelectItem value="only">Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label className="text-gray-300">Restrictions (comma-separated)</Label>
                          <Input
                            value={publisher.restrictions.join(", ")}
                            onChange={(e) => {
                              const newPubs = [...work.publishers];
                              newPubs[pubIndex] = {
                                ...publisher,
                                restrictions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                              };
                              updateArrayField("works", workIndex, "publishers", newPubs);
                            }}
                            className="mt-2 bg-gray-900 border-gray-800 text-white"
                            placeholder="US"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newPubs = work.publishers.filter((_, i) => i !== pubIndex);
                          updateArrayField("works", workIndex, "publishers", newPubs.length > 0 ? newPubs : [{
                            publisher: "",
                            rights_administrator: "",
                            affiliation: "",
                            split_percentage: null as number | null,
                            territory: "",
                            restrictions: [],
                          }]);
                        }}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Work Partner IDs */}
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-gray-300 text-lg">Partner IDs</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newPartner = {
                        name: "",
                        value: "",
                      };
                      updateArrayField("works", workIndex, "partner_ids", [
                        ...work.partner_ids,
                        newPartner,
                      ]);
                    }}
                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {work.partner_ids.map((partner, partnerIndex) => (
                  <div key={partnerIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg mb-4">
                    <div>
                      <Label className="text-gray-300">Partner Name</Label>
                      <Input
                        value={partner.name}
                        onChange={(e) => {
                          const newPartners = [...work.partner_ids];
                          newPartners[partnerIndex] = {
                            ...partner,
                            name: e.target.value,
                          };
                          updateArrayField("works", workIndex, "partner_ids", newPartners);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="Amazon Product Code"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Partner Value</Label>
                      <Input
                        value={partner.value}
                        onChange={(e) => {
                          const newPartners = [...work.partner_ids];
                          newPartners[partnerIndex] = {
                            ...partner,
                            value: e.target.value,
                          };
                          updateArrayField("works", workIndex, "partner_ids", newPartners);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="AMZ001"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newPartners = work.partner_ids.filter((_, i) => i !== partnerIndex);
                          updateArrayField("works", workIndex, "partner_ids", newPartners.length > 0 ? newPartners : [{ name: "", value: "" }]);
                        }}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
          onClick={() => {
            addArrayItem("works", {
              title: "",
              iswc: "",
              language: "",
              label_work_code: "",
              music_type: "",
              agency: "",
              keywords: "",
              contains_ai: false,
              lyrics: "",
              copyright_year: "",
              description: "",
              contributions: [
                {
                  artist: "",
                  affiliation: "",
                  split_percentage: null as number | null,
                  territory: "",
                  restrictions: [],
                  role: "",
                  type: "",
                },
              ],
              publishers: [
                {
                  publisher: "",
                  rights_administrator: "",
                  affiliation: "",
                  split_percentage: null as number | null,
                  territory: "",
                  restrictions: [],
                },
              ],
              partner_ids: [
                {
                  name: "",
                  value: "",
                },
              ],
            });
          }}
        >
          <Plus className="h-4 w-4" /> Add Work
        </Button>

        {/* Contributions Section */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Primary Contributions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.primary_contributions.map((contrib, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <Label className="text-gray-300">Artist</Label>
                  <Input
                    value={contrib.artist}
                    onChange={(e) => {
                      const newContribs = [...formData.primary_contributions];
                      newContribs[index] = {
                        ...contrib,
                        artist: e.target.value,
                      };
                      updateField("primary_contributions", newContribs);
                    }}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="Michael McDonald"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`featured-${index}`}
                    checked={contrib.featured}
                    onCheckedChange={(checked) => {
                      const newContribs = [...formData.primary_contributions];
                      newContribs[index] = { ...contrib, featured: checked as boolean };
                      updateField("primary_contributions", newContribs);
                    }}
                  />
                  <Label htmlFor={`featured-${index}`} className="text-gray-300 cursor-pointer">
                    Featured
                  </Label>
                </div>

                <div className="flex items-end">
                  {formData.primary_contributions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newContribs = formData.primary_contributions.filter((_, i) => i !== index);
                        updateField("primary_contributions", newContribs.length > 0 ? newContribs : [{ artist: "", featured: false }]);
                      }}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addArrayItem("primary_contributions", {
                  artist: "",
                  featured: false,
                });
              }}
              className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Primary Contribution
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Contributions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.contributions.map((contrib, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-800/50 rounded-lg items-end">
                <div className="flex-1">
                  <Label className="text-gray-300">Artist</Label>
                  <Input
                    value={contrib.artist}
                    onChange={(e) => {
                      const newContribs = [...formData.contributions];
                      newContribs[index] = {
                        ...contrib,
                        artist: e.target.value,
                      };
                      updateField("contributions", newContribs);
                    }}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="Michael McDonald"
                  />
                </div>
                {formData.contributions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newContribs = formData.contributions.filter((_, i) => i !== index);
                      updateField("contributions", newContribs.length > 0 ? newContribs : [{ artist: "" }]);
                    }}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addArrayItem("contributions", {
                  artist: "",
                });
              }}
              className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Contribution
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Artist Type & Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Artist Type</Label>
                <Input
                  value={formData.artist_type}
                  onChange={(e) => updateField("artist_type", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Recording Entity"
                />
              </div>

              <div>
                <Label className="text-gray-300">Name Format</Label>
                <Input
                  value={formData.name_format}
                  onChange={(e) => updateField("name_format", e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Compound Artist"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rights Section */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Rights Holders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.rights_holders.map((holder, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Rights Holder Name</Label>
                      <Input
                        value={holder.rights_holder_name}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            rights_holder_name: e.target.value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="Smooth Records Group"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Rights Holder Type</Label>
                      <Input
                        value={holder.rights_holder_type}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            rights_holder_type: e.target.value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="Original Owner"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Rights Use Type</Label>
                      <Input
                        value={holder.rights_use_type}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            rights_use_type: e.target.value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="All"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Rights Share (%)</Label>
                      <Input
                        value={holder.rights_share}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            rights_share: e.target.value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="51.0"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Rights Begin Date</Label>
                      <Input
                        type="date"
                        value={holder.rights_begin_date}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            rights_begin_date: e.target.value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Rights Expiration Date</Label>
                      <Input
                        type="date"
                        value={holder.rights_expiration_date}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            rights_expiration_date: e.target.value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Territory</Label>
                      <Select
                        value={holder.territory}
                        onValueChange={(value) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            territory: value,
                          };
                          updateField("rights_holders", newHolders);
                        }}
                      >
                        <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="worldwide">Worldwide</SelectItem>
                          <SelectItem value="worldwide_except">Worldwide Except</SelectItem>
                          <SelectItem value="only">Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label className="text-gray-300">Restrictions (comma-separated)</Label>
                      <Input
                        value={holder.restrictions.join(", ")}
                        onChange={(e) => {
                          const newHolders = [...formData.rights_holders];
                          newHolders[index] = {
                            ...holder,
                            restrictions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          updateField("rights_holders", newHolders);
                        }}
                        className="mt-2 bg-gray-900 border-gray-800 text-white"
                        placeholder="US, CA"
                      />
                    </div>
                  </div>

                  {formData.rights_holders.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newHolders = formData.rights_holders.filter((_, i) => i !== index);
                        updateField("rights_holders", newHolders.length > 0 ? newHolders : [{
                          rights_holder_name: "",
                          rights_holder_type: "",
                          rights_use_type: "",
                          rights_share: "",
                          rights_begin_date: "",
                          rights_expiration_date: "",
                          territory: "",
                          restrictions: [],
                        }]);
                      }}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addArrayItem("rights_holders", {
                  rights_holder_name: "",
                  rights_holder_type: "",
                  rights_use_type: "",
                  rights_share: "",
                  rights_begin_date: "",
                  rights_expiration_date: "",
                  territory: "",
                  restrictions: [],
                });
              }}
              className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Rights Holder
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Union Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.union_details.map((union, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <Label className="text-gray-300">Agreement Type</Label>
                  <Input
                    value={union.agreement_type}
                    onChange={(e) => {
                      const newUnions = [...formData.union_details];
                      newUnions[index] = {
                        ...union,
                        agreement_type: e.target.value,
                      };
                      updateField("union_details", newUnions);
                    }}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="AFM New Media Sideletter"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">AFM Agreement</Label>
                  <Select
                    value={union.afm_agreement || ""}
                    onValueChange={(value) => {
                      const newUnions = [...formData.union_details];
                      newUnions[index] = {
                        ...union,
                        afm_agreement: value,
                      };
                      updateField("union_details", newUnions);
                    }}
                  >
                    <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">SAG Agreement</Label>
                  <Select
                    value={union.sag_agreement === null ? "null" : union.sag_agreement || ""}
                    onValueChange={(value) => {
                      const newUnions = [...formData.union_details];
                      newUnions[index] = {
                        ...union,
                        sag_agreement: value === "null" ? null : value,
                      };
                      updateField("union_details", newUnions);
                    }}
                  >
                    <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="null">Not Specified</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  {formData.union_details.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newUnions = formData.union_details.filter((_, i) => i !== index);
                        updateField("union_details", newUnions.length > 0 ? newUnions : [{ agreement_type: "", afm_agreement: "", sag_agreement: null }]);
                      }}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addArrayItem("union_details", {
                  agreement_type: "",
                  afm_agreement: "",
                  sag_agreement: null,
                });
              }}
              className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Union Detail
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Partner IDs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.partner_ids.map((partner, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <Label className="text-gray-300">Partner Name</Label>
                  <Input
                    value={partner.name}
                    onChange={(e) => {
                      const newPartners = [...formData.partner_ids];
                      newPartners[index] = { ...partner, name: e.target.value };
                      updateField("partner_ids", newPartners);
                    }}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="Amazon Product Code"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Partner Value</Label>
                  <Input
                    value={partner.value}
                    onChange={(e) => {
                      const newPartners = [...formData.partner_ids];
                      newPartners[index] = { ...partner, value: e.target.value };
                      updateField("partner_ids", newPartners);
                    }}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="AMZ001"
                  />
                </div>

                <div className="flex items-end">
                  {formData.partner_ids.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newPartners = formData.partner_ids.filter((_, i) => i !== index);
                        updateField("partner_ids", newPartners.length > 0 ? newPartners : [{ name: "", value: "" }]);
                      }}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                addArrayItem("partner_ids", { name: "", value: "" });
              }}
              className="w-full border-gray-700 bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Partner ID
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-6">
          <ButtonPrimary
            type="submit"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}

