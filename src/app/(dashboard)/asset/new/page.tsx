
"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { ButtonPrimary } from "../../../../components/ButtonPrimary";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { releasesService } from "../../../../lib/api";

// Router handling for Next.js or React Router
const isNextJs =
  typeof window === "undefined" || !!(window as any).__NEXT_DATA__;
let Link: any;
let useRouter: any;
let useNavigate: any;

if (isNextJs) {
  try {
    const nextRouter = require("next/navigation");
    const nextLink = require("next/link");
    Link = nextLink.default;
    useRouter = nextRouter.useRouter;
  } catch {}
}

if (!Link) {
  try {
    const reactRouter = require("react-router-dom");
    Link = reactRouter.Link;
    useNavigate = reactRouter.useNavigate;
  } catch {
    Link = ({ to, href, children, ...props }: any) => (
      <a href={to || href} {...props}>
        {children}
      </a>
    );
  }
}

export default function NewAsset() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    catNo: "",
    barcode: "",
    primaryArtists: "",
    featuringArtists: "",
    territories: "",
    artistDisplayName: "",
    primaryGenre: "",
    cLine: "",
    cYear: new Date().getFullYear(),
    pLine: "",
    pYear: new Date().getFullYear(),
    label: "",
    format: "Single",
    releaseDate: "",
    originalReleaseDate: "",
    packshot: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert comma-separated strings to arrays
      const payload = {
        ...formData,
        primaryArtists: formData.primaryArtists
          ? formData.primaryArtists.split(",").map((s) => s.trim())
          : [],
        featuringArtists: formData.featuringArtists
          ? formData.featuringArtists.split(",").map((s) => s.trim())
          : [],
        territories: formData.territories
          ? formData.territories.split(",").map((s) => s.trim().toUpperCase())
          : [],
      };

      const data = await releasesService.create(payload);
      console.log("Release created:", data);
      toast.success("Release created successfully!");

      if (router) router.push("/releases");
      else if (navigate) navigate("/releases");
      else window.location.href = "/releases";
    } catch (error: any) {
      console.error("Create release failed:", error.message || error);
      toast.error(error.message || "Failed to create release");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 ">
        <Link to="/asset" href="/asset">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <ArrowLeft className="h-5 w-5 " />
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
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Release Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Title *"
                name="title"
                value={formData.title}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Catalog No"
                name="catNo"
                value={formData.catNo}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Artist Display Name"
                name="artistDisplayName"
                value={formData.artistDisplayName}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Primary Artists (comma separated)"
                name="primaryArtists"
                value={formData.primaryArtists}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Featuring Artists (comma separated)"
                name="featuringArtists"
                value={formData.featuringArtists}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Territories (comma separated)"
                name="territories"
                value={formData.territories}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Primary Genre"
                name="primaryGenre"
                value={formData.primaryGenre}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Label"
                name="label"
                value={formData.label}
                setFormData={setFormData}
                loading={loading}
              />

              {/* Format */}
              <div>
                <Label className="text-gray-300">Format *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, format: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Album">Album</SelectItem>
                    <SelectItem value="EP">EP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <InputField
                label="Release Date *"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="Original Release Date"
                name="originalReleaseDate"
                type="date"
                value={formData.originalReleaseDate}
                setFormData={setFormData}
                loading={loading}
              />

              <InputField
                label="© Line"
                name="cLine"
                value={formData.cLine}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="© Year"
                name="cYear"
                type="number"
                value={formData.cYear}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="℗ Line"
                name="pLine"
                value={formData.pLine}
                setFormData={setFormData}
                loading={loading}
              />
              <InputField
                label="℗ Year"
                name="pYear"
                type="number"
                value={formData.pYear}
                setFormData={setFormData}
                loading={loading}
              />

              {/* <div className="md:col-span-2 ">
                <Label className="text-gray-300">Packshot (Base64)</Label>
                <Textarea
                  value={formData.packshot}
                  onChange={(e) =>
                    setFormData({ ...formData, packshot: e.target.value })
                  }
                  className="mt-2 bg-gray-900 border-gray-800 text-white  resize-none h-24 overflow-auto"
                  placeholder="Paste Base64 encoded image string"
                  rows={4}
                  disabled={loading}
                />
              </div> */}
              <div className="md:col-span-2">
                <Label className="text-gray-300">Packshot (Base64)</Label>
                <Textarea
                  value={formData.packshot}
                  onChange={(e) =>
                    setFormData({ ...formData, packshot: e.target.value })
                  }
                  placeholder="Paste Base64 encoded image string"
                  disabled={loading}
                  className="mt-2 bg-gray-900 border-gray-800 text-white resize-none"
                  style={{
                    height: "5rem",
                    minHeight: "5rem",
                    maxHeight: "5rem",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonPrimary
              type="submit"
              className="flex-1 justify-center"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Release"}
            </ButtonPrimary>
            <Link to="/releases" href="/releases" className="flex-1">
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

// Reusable input field component
function InputField({
  label,
  name,
  type = "text",
  value,
  setFormData,
  loading,
}: {
  label: string;
  name: string;
  type?: string;
  value: any;
  setFormData: any;
  loading: boolean;
}) {
  return (
    <div className="w-full">
      <Label htmlFor={name} className="text-gray-300">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        value={value}
        onChange={(e) =>
          setFormData((prev: any) => ({ ...prev, [name]: e.target.value }))
        }
        className="mt-2 bg-gray-900 border-gray-800 text-white"
        disabled={loading}
      />
    </div>
  );
}
