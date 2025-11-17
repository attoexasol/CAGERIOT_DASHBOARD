"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Music,
  Download,
  Mic2,
  Disc3,
  Globe2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner"; // optional if you’re already using it
import { releasesService } from "../../../lib/api"; // Replace with assetsService if available

interface Asset {
  _id: string;
  title: string;
  artistDisplayName: string;
  type: string;
  label: string;
  primaryGenre: string;
  pYear: number;
  publicFile?: string;
  fileMetadata?: {
    duration?: number;
    name?: string;
  };
  status?: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Example API call — replace with your actual endpoint if different
        const res = await fetch(
          "https://api-ext.rightshub.net/api/assets/searchAssets"
        );
        const data = await res.json();

        if (data.results && Array.isArray(data.results)) {
          setAssets(data.results);
        } else {
          toast.error("No assets found");
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("Failed to load assets");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  // Handle play/pause audio preview
  const togglePlay = (id: string) => {
    if (playingId === id) setPlayingId(null);
    else setPlayingId(id);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-pink-500" />
      </div>
    );

  return (
    <div className="p-6 sm:p-8 text-white transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Assets</h1>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Upload New
        </button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset._id}
            className="bg-gray-900/70 p-5 rounded-xl shadow-md hover:bg-gray-800/70 transition-all border border-gray-800"
          >
            {/* Top Row — Title + Type */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold truncate">
                {asset.title || "Untitled"}
              </h3>
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full capitalize">
                {asset.type || "Audio"}
              </span>
            </div>

            {/* Metadata */}
            <div className="space-y-1 text-sm text-gray-400 mb-3">
              <p className="flex items-center gap-2">
                <Mic2 size={14} /> {asset.artistDisplayName || "Unknown Artist"}
              </p>
              <p className="flex items-center gap-2">
                <Disc3 size={14} /> {asset.primaryGenre || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <Globe2 size={14} /> {asset.label || "No Label"}
              </p>
              <p className="flex items-center gap-2">
                <Calendar size={14} /> {asset.pYear || "—"}
              </p>
              {asset.status && (
                <p className="flex items-center gap-2 text-xs mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      asset.status === "pending"
                        ? "bg-yellow-600/30 text-yellow-400"
                        : "bg-green-600/30 text-green-400"
                    }`}
                  >
                    {asset.status}
                  </span>
                </p>
              )}
            </div>

            {/* Audio Preview */}
            {asset.publicFile ? (
              <div className="mt-4 bg-gray-800/70 rounded-lg p-3 flex items-center gap-3">
                <button
                  onClick={() => togglePlay(asset._id)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-md text-xs"
                >
                  {playingId === asset._id ? "Pause" : "Play"}
                </button>

                <audio
                  src={asset.publicFile}
                  controls={false}
                  autoPlay={playingId === asset._id}
                  onEnded={() => setPlayingId(null)}
                />

                <p className="text-xs text-gray-400 truncate">
                  {asset.fileMetadata?.name || "Audio file"}
                </p>
              </div>
            ) : (
              <div className="mt-4 bg-gray-800/40 rounded-lg p-4 flex items-center justify-center text-gray-500 text-sm">
                <Music size={16} className="mr-2" /> No Audio File
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 flex justify-between items-center">
              <a
                href={asset.publicFile || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-xs ${
                  asset.publicFile
                    ? "text-pink-400 hover:text-pink-300"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                <Download size={14} /> Download
              </a>

              <span className="text-xs text-gray-500">
                {asset.fileMetadata?.duration
                  ? `${asset.fileMetadata.duration}s`
                  : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Assets */}
      {assets.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-400">
          <Music size={24} className="mx-auto mb-3" />
          <p>No assets available.</p>
        </div>
      )}
    </div>
  );
}
