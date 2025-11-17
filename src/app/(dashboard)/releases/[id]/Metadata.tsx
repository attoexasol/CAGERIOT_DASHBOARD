// export default function Metadata() {
//   return <h2 className="text-xl font-bold">Metadata</h2>;
// }
// src/app/(dashboard)/releases/[id]/metadata/page.tsx



"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { releasesService } from "../.././../../lib/api/services/releases.service";
import { tracksService } from "../.././../../lib/api/services/tracks.service";
import { Loader2 } from "lucide-react";

export default function MetadataPage() {
  const { id } = useParams();
  const [release, setRelease] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);

        // 1) Load Release
        const r = await releasesService.getById(id);
        setRelease(r);

        const title = r?.title?.toLowerCase();

        // 2) Get Tracks by releaseId
        let tracks = await tracksService.getTracksForRelease(id);

        // 3) If no tracks → search by title
        if ((!tracks || tracks.length === 0) && title) {
          tracks = await tracksService.searchByTitle(title);
        }

        if (!tracks || tracks.length === 0) {
          setMeta(null);
          setLoading(false);
          return;
        }

        // 4) Find exact title match
        let selectedTrack =
          tracks.find((t: any) => t.title?.toLowerCase() === title) ||
          tracks[0];

        const trackId = selectedTrack?._id;

        // 5) Load metadata by trackId
        if (trackId) {
          const data = await tracksService.getByTrackId(trackId);
          setMeta(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0050]" />
      </div>
    );

  if (!meta)
    return (
      <div className="text-center text-gray-400 py-20">
        No metadata found for this release.
      </div>
    );

  return (
    <div className="p-8 text-gray-100">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        {/* {release?.title || meta?.title} */} Metadata
      </h1>

      {/* GRID WRAPPER */}
      <div className="space-y-8">
        {/* Release Title + Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldCard label="Release Title" value={release?.title} />
          <FieldCard label="Title Version" value="—" />
        </div>

        {/* Type + Metadata Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldCard label="Type" value={release?.type || "Single"} />
          <FieldCard
            label="Metadata Language"
            value={meta?.trackMetadataLanguage || "N/A"}
          />
        </div>

        {/* Description */}
        <FieldCard
          label="Description"
          value={release?.description || "—"}
          full
        />

        {/* Artists List */}
        <div className="bg-[#0e0e0e] border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-2">Artists</p>
          <div className="flex items-center gap-3 bg-[#111] px-4 py-3 rounded-lg border border-gray-800">
            <div className="h-4 w-4 rounded-full bg-green-400" />
            <span className="text-gray-200">
              {meta?.primaryArtists?.[0] || release?.artist}
            </span>
            <span className="text-gray-400 text-sm">Main Primary Artist</span>

            <div className="flex-1" />
            <div className="flex gap-3">
              <span className="text-green-400 text-xl">🟢</span>
              <span className="text-pink-400 text-xl">🎵</span>
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldCard label="Primary Genre" value={meta?.primaryGenre || "—"} />
          <FieldCard
            label="Secondary Genre"
            value={meta?.secondaryGenre || "—"}
          />
        </div>

        {/* Label */}
        <FieldCard label="Label" value={release?.label || "—"} full />

        {/* UPC + Catalog ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldCard label="UPC" value={release?.barcode || "—"} />
          <FieldCard label="Catalog ID" value="—" />
        </div>

        {/* Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldCard
            label="© Copyright"
            value={`2025 ${release?.artist}, Distributed by Cage Riot`}
          />
          <FieldCard label="© Copyright" value={`2025 ${release?.artist}`} />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------
   REUSABLE FIELD CARD COMPONENT
------------------------------------ */
function FieldCard({
  label,
  value,
  full = false,
}: {
  label: string;
  value: any;
  full?: boolean;
}) {
  return (
    <div
      className={`bg-[#0e0e0e] border border-gray-800 rounded-xl p-5 ${
        full ? "col-span-1 md:col-span-2" : ""
      }`}
    >
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-gray-200 whitespace-pre-line">{value || "—"}</p>
    </div>
  );
}
