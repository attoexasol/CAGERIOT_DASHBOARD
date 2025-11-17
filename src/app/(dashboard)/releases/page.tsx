
"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { tracksService } from "../../../lib/api/services/tracks.service";
import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { SearchBar } from "../../../components/SearchBar";

export default function SingleReleaseCard() {
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const trackId = "6916a352d97b582877d20699";

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await tracksService.getByTrackId(trackId);
        setMeta(data?.data ?? data);
      } catch (err) {
        console.error(err);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );

  if (!meta)
    return (
      <div className="text-center py-20 text-gray-400">No metadata found.</div>
    );

  return (
    <div className="p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">Release</h1>
        <ButtonPrimary icon={Plus} href="/tracks/new">
          <span className="hidden sm:inline">Create New</span>
          <span className="sm:hidden">Add</span>
        </ButtonPrimary>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* 4 COLUMN GRID LIKE RELEASE PAGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD EXACT LIKE ReleaseCard */}
        <div className="bg-gray-800 rounded-xl p-3 shadow hover:shadow-xl transition duration-200">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-700">
            <img
              src={"/no-image.png"}
              alt={meta.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/no-image.png")}
            />
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-white font-semibold truncate">{meta.title}</p>

            <p className="text-gray-400 text-sm truncate">
              {meta.primaryArtists?.[0] || "Unknown Artist"}
            </p>

            <span className="text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
              {meta.type}
            </span>
          </div>

          {/* EXTRA META */}
          {/* <div className="mt-4 space-y-2 text-sm border-t border-gray-700 pt-3">
            <MetaRow label="ISRC" value={meta.isrc} />
            <MetaRow label="Explicit" value={meta.explicit} />
            <MetaRow
              label="Duration"
              value={`${Math.floor(meta.duration / 1000)} sec`}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

/* REUSABLE META ROW */
function MetaRow({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value || "—"}</span>
    </div>
  );
}
