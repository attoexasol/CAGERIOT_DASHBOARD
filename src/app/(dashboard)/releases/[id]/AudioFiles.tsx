"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Volume2, Download, Play } from "lucide-react";
import { releasesService } from "../../../../lib/api/services/releases.service";
import { tracksService } from "../../../../lib/api/services/tracks.service";
import { toast } from "sonner@2.0.3";

export default function ReleaseAudioPage() {
  const { id: releaseId } = useParams();

  const [release, setRelease] = useState<any>(null);
  const [audioMeta, setAudioMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!releaseId) return;

    async function load() {
      try {
        setLoading(true);

        // 1) Load Release
        const r = await releasesService.getById(releaseId);
        setRelease(r);

        const cleanTitle = r?.title?.toLowerCase();

        // 2) Load Tracks for this Release
        let tracks = await tracksService.getTracksForRelease(releaseId);

        // Fallback if release match fails
        if ((!tracks || tracks.length === 0) && cleanTitle) {
          tracks = await tracksService
            .list({ search: cleanTitle })
            .then((res) => res.data);
        }

        if (!tracks || tracks.length === 0) {
          setAudioMeta(null);
          return;
        }

        // Pick closest track
        const selected =
          tracks.find((t: any) => t.title?.toLowerCase() === cleanTitle) ||
          tracks[0];

        // 3) Load full metadata
        const metadata = await tracksService.getByTrackId(
          selected.id || selected._id
        );

        setAudioMeta(metadata);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [releaseId]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );

  if (!audioMeta)
    return (
      <div className="p-6 text-center text-gray-400">
        No audio metadata found.
      </div>
    );

  // Extract audio file if exists
  const master =
    audioMeta.audioVersions?.find(
      (v: any) => v.isMasterAudio && v.publicFile
    ) ||
    audioMeta.audioVersions?.find((v: any) => v.publicFile) ||
    null;

  const audioUrl = master?.publicFile || "";
  const meta = master?.fileMetadata || {};

  // PLAY BUTTON ACTION
  const handlePlay = () => {
    if (!audioUrl) {
      toast.warning("No audio available", {
        position: "top-right",
      });
      return;
    }
    audioRef.current?.play();
  };

  const handleDownload = () => {
    if (!audioUrl) {
     toast.error("No file to download", {
       position: "top-right",
     });
      return;
    }
    window.open(audioUrl, "_blank");
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-semibold mb-8">Audio Files</h1>

      <div className="bg-[#1c1c1e] rounded-2xl border border-gray-700 p-6 shadow-lg">
        {/* AUDIO ELEMENT (hidden) */}
        <audio ref={audioRef} src={audioUrl}></audio>

        {/* TOP BAR: TIME + BUTTONS */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer ${
                audioUrl
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-700 text-gray-500"
              }`}
            >
              <Play className="h-8 w-8 text-white" />
            </button>

            {/* <span>00:00</span> */}
            <div className="w-40 md:w-96 h-1 bg-gray-700 rounded-md" />
            <span>
              {meta.duration ? formatDuration(meta.duration) : "00:00"}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePlay}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <Volume2 />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <Download />
            </button>
          </div>
        </div>

        {/* GRID - ALWAYS SHOWS (even if no audio) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <MetaCard label="File Name" value={meta.name || "—"} />
          <MetaCard label="ISRC" value={audioMeta?.isrc || "—"} />
          <MetaCard
            label="Bitrate"
            value={
              meta.bitrate ? (meta.bitrate / 1000).toFixed(2) + " kbit/s" : "—"
            }
          />

          <MetaCard
            label="Sample rate"
            value={meta.sampleRate ? meta.sampleRate + " Hz" : "—"}
          />
          <MetaCard label="Channels" value={meta.numOfChannels || "—"} />
          <MetaCard
            label="Bit depth"
            value={meta.bitDepth ? meta.bitDepth + "-bit" : "—"}
          />
        </div>
      </div>
    </div>
  );
}

/* Format duration (e.g. 145 sec → 2:25) */
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* Metadata UI card */
function MetaCard({ label, value }: any) {
  return (
    <div className="p-4 rounded-xl bg-[#2c2c2e] border border-gray-700">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg mt-1 text-white">{value}</p>
    </div>
  );
}
