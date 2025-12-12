"use client";

import { ChevronRight, Loader2, MoreVertical, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner@2.0.3";
import { AudioPlayer } from "../../../../components/AudioPlayer";
import DownloadDropdown from "../../../../components/Download";
import { SearchBar } from "../../../../components/SearchBar";
import { SEO } from "../../../../components/SEO";
import { releasesService } from "../../../../lib/api/services/releases.service";


function formatReleaseDate(dateString?: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

type ReleaseAny = any;

export default function Overview() {
  // single useParams call
  const { id: releaseId } = useParams();

  const [release, setRelease] = useState<ReleaseAny | null>(null);
  const [loading, setLoading] = useState(true);
  // tracks and audio
  const [tracks, setTracks] = useState<any[]>([]);
  const [trackLoading, setTrackLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
console.log(release);
  // chart mock state
  const [streamsData, setStreamsData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // Load release & mocks
  useEffect(() => {
    if (!releaseId) return;
    let mounted = true;

    async function loadRelease() {
      setLoading(true);
      try {
        const res = await releasesService.getById(releaseId);
        const data = res?.data ?? res ?? null;
        if (mounted) setRelease(data);

        // build fallback mock analytics
        const today = new Date();
        const streamsMock = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          return {
            day: d.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            }),
            streams: Math.floor(200 + Math.random() * 200),
          };
        });
        const revenueMock = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(today);
          d.setMonth(today.getMonth() - (5 - i));
          return {
            month: d.toLocaleDateString(undefined, { month: "short" }),
            revenue: parseFloat((Math.random() * 80 + 10).toFixed(2)),
          };
        });

        if (mounted) {
          setStreamsData(streamsMock);
          setRevenueData(revenueMock);
        }
      } catch (err) {
        console.error("Failed to load release", err);
        if (mounted) setRelease(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadRelease();
    return () => {
      mounted = false;
    };
  }, [releaseId]);

  // Load tracks for release (expects release.tracks = [{ trackId: "..." }, ...])
  useEffect(() => {
    if (!releaseId) return;
    let mounted = true;

    async function loadTracks() {
      try {
        setTrackLoading(true);

        const relRes = await releasesService.getById(releaseId);
        const rel = relRes?.data ?? relRes;

        // If tracks field missing or empty (handle arrays of ids or objects)
        let trackIds: string[] = [];

        if (!rel?.tracks) {
          trackIds = [];
        } else {
          // if array of strings
          if (Array.isArray(rel.tracks) && rel.tracks.length > 0) {
            if (typeof rel.tracks[0] === "string") {
              trackIds = rel.tracks as string[];
            } else {
              // array of objects with trackId or id
              trackIds = rel.tracks
                .map((t: any) => t.trackId ?? t.id ?? t.track ?? null)
                .filter(Boolean);
            }
          }
        }

        if (trackIds.length === 0) {
          if (mounted) {
            setTracks([]);
            setTrackLoading(false);
          }
          return;
        }

        const loaded: any[] = [];
        for (const tid of trackIds) {
          try {
            const tRes = await tracksService.getByTrackId(tid);
            // tRes may be wrapped in .data or direct object
            const t = tRes?.data ?? tRes ?? null;
            if (t) loaded.push(t);
          } catch (err) {
            console.warn("Could not load track", tid, err);
          }
        }

        if (mounted) setTracks(loaded);
      } catch (err) {
        console.error("Failed to load tracks", err);
        toast.error("Could not load tracks for this release");
      } finally {
        if (mounted) setTrackLoading(false);
      }
    }

    loadTracks();
    return () => {
      mounted = false;
    };
  }, [releaseId]);

  const filteredTracks = tracks.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const title = (t?.title ?? "").toString().toLowerCase();
    const artist = (t?.artistDisplayName ?? t?.artist ?? "")
      .toString()
      .toLowerCase();
    return title.includes(q) || artist.includes(q);
  });

  const handlePlayTrack = (track: any) => {
    const file =
      track.publicFile ||
      track.audioVersions?.find((v: any) => v.publicFile)?.publicFile ||
      track.file ||
      null;

    if (!file) {
      toast.warning("No audio available for this track");
      return;
    }

    setCurrentTrack({
      title: track.title ?? "Untitled",
      artist: track.artistDisplayName ?? track.artist ?? "Unknown",
      publicFile: file,
    });
  };

  // if (loading) return <p className="text-gray-400">Loading overview...</p>;
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0050]" />
      </div>
    );
  if (!release)
    return (
      <p className="text-red-400">
        No data found for this release (ID: {releaseId}).
      </p>
    );

  // ---- total duration calculation ----
  function formatTotalDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}h ${m}m ${String(s).padStart(2, "0")}s`;
    }

    if (m > 0) {
      return `${m}m ${String(s).padStart(2, "0")}s`;
    }

    return `${s}s`;
  }

  const totalSeconds = tracks.reduce((sum, track) => {
    const d =
      track?.fileMetadata?.duration ||
      track?.audioVersions?.[0]?.fileMetadata?.duration ||
      0;

    return sum + d;
  }, 0);

  const totalDuration = formatTotalDuration(totalSeconds);

  return (
    <div className="space-y-6">
      {/* HEAD: optional SEO/SearchBar */}
      <SEO
        title={release.title || "Release Overview"}
        description={release.label || ""}
        keywords={release.primaryGenre || ""}
      />
      {/* <div className="flex items-center justify-between gap-4">
        <SearchBar
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div> */}

      {/* Top region */}
      <div className="flex gap-6 items-start">
        <img
          src={release.coverArt}
          alt={release.title}
          className="w-36 h-36 rounded-lg border border-gray-800 object-cover shadow"
          style={{ width: "200px" }}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {release.title || "Untitled"}
              </h1>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  <span className="h-2 w-2 rounded-full bg-[#a0ff4d] block" />{" "}
                  {release.artist}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  {release.label?.name || "Label"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  ISRC {release.isrc}
                </span>
                {/* <button className="px-3 py-1 bg-gray-800 rounded-full text-xs text-white cursor-pointer inline-flex">
                  See Info <ChevronRight className="w-4 h-4" />
                </button> */}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full group bg-[#121212] hover:bg-[#1a1a1a] cursor-pointer">
                <div className="flex items-center gap-2">
                  {/* <DownloadDropdown
                    onCSV={exportCSV}
                    onXLSX={exportXLSX}
                    onTXT={exportTXT}
                    onAssets={downloadAssets}
                    onCoverArt={downloadCoverArt}
                  /> */}
                  <DownloadDropdown releaseId={releaseId} />

                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm text-gray-300">
                    Download
                  </span>
                </div>
              </button>

              <button className="p-2 rounded-full bg-[#121212] hover:bg-[#1a1a1a]">
                <MoreVertical className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-gray-300 grid grid-cols-3 gap-4">
            <div className="text-sm">
              <div className="text-xs text-gray-400">Release Date</div>
              <div>{formatReleaseDate(release.release_date || "N/A")}</div>
            </div>
            <div className="text-sm">
              <div className="text-xs text-gray-400">Status</div>
              <div>{release.status || "Unknown"}</div>
            </div>
            <div className="text-sm">
              <div className="text-xs text-gray-400">Primary Genre</div>
              <div>{release.genre}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle cards: Distribution / Tracks / Release Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-3">Distribution</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#101010] rounded-md p-4">
              <div className="text-xs text-gray-400">Distributed</div>
              <div className="text-2xl font-bold mt-2">
                {release.distributedCount ?? 0}
              </div>
            </div>
            <div className="bg-[#101010] rounded-md p-4">
              <div className="text-xs text-gray-400">Processing</div>
              <div className="text-2xl font-bold mt-2">
                {release.processingCount ?? 0}
              </div>
            </div>
            <div className="bg-[#101010] rounded-md p-4">
              <div className="text-xs text-gray-400">Issues</div>
              <div className="text-2xl font-bold mt-2">
                {release.issuesCount ?? 0}
              </div>
            </div>
            <div className="bg-[#101010] rounded-md p-4">
              <div className="text-xs text-gray-400">Takedown</div>
              <div className="text-2xl font-bold mt-2">
                {release.takedownCount ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* Tracks (card) */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            {/* <h2 className="text-white font-semibold">Tracks</h2> */}
            <span className="text-gray-400 text-sm">
              Tracks {tracks.length}
            </span>

            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-white">
              {totalDuration}
            </span>
          </div>

          {trackLoading ? (
            <p className="text-center text-gray-500 py-6">Loading tracks…</p>
          ) : filteredTracks.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No tracks found.</p>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track, index) => {
                // duration is usually in audioVersions[0].fileMetadata.duration
                const duration =
                  track?.audioVersions?.[0]?.fileMetadata?.duration ??
                  track?.fileMetadata?.duration ??
                  0;
                const min = Math.floor(duration / 60);
                const sec = String(duration % 60).padStart(2, "0");

                return (
                  <div
                    key={track._id ?? track.id ?? index}
                    onClick={() => handlePlayTrack(track)}
                    className="group flex items-center justify-between bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg p-3 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 w-4">{index + 1}</span>

                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 transition p-1 rounded-full hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(track);
                        }}
                      >
                        <Play className="w-4 h-4 text-white cursor-pointer" />
                      </button>

                      <span className="text-white font-medium">
                        {track.title}
                      </span>

                      {/* {track.explicit === "Explicit" && (
                        <span className="text-xs font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">
                          E
                        </span>
                      )} */}
                    </div>

                    <span className="text-gray-400 text-sm">
                      {min}:{sec}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Release Details */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-3">Release Details</div>

          <div className="text-gray-300 space-y-3">
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Release Date</div>
              <div>{formatReleaseDate(release.release_date)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">ISRC</div>
              <span> {release.isrc}</span>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Metadata Language</div>
              <div>{release?.metadata_language || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Primary Genre</div>
              <div>{release.genre || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Catalog ID</div>
              <div>{release.catalogId || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-400">
                Streams{" "}
                <span className="text-xs text-gray-400">Last 7 days</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {streamsData.reduce((s, r) => s + r.streams, 0)}
              </div>
            </div>
            <button className="px-3 py-1 bg-[#121212] rounded text-sm text-gray-300">
              See Consumption
            </button>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={streamsData}>
                <defs>
                  <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1b1b1b" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#9ca3af" }} />
                <YAxis tick={{ fill: "#9ca3af" }} />
                <Tooltip
                  wrapperStyle={{ background: "#0f1724", borderRadius: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="streams"
                  stroke="#60a5fa"
                  fill="url(#colorStreams)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-gray-400">
                Revenue{" "}
                <span className="text-xs text-gray-400">Last 6 month</span>
              </div>
              <div className="text-3xl font-bold text-white">
                ${revenueData.reduce((s, r) => s + r.revenue, 0).toFixed(2)}
              </div>
            </div>
            <button className="px-3 py-1 bg-[#121212] rounded text-sm text-gray-300">
              See Revenue
            </button>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid stroke="#1b1b1b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af" }} />
                <YAxis tick={{ fill: "#9ca3af" }} />
                <Tooltip
                  wrapperStyle={{ background: "#0f1724", borderRadius: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audio player modal / sticky */}
      {currentTrack && (
        <AudioPlayer
          trackTitle={currentTrack.title}
          artist={currentTrack.artist}
          src={currentTrack.publicFile}
          onClose={() => setCurrentTrack(null)}
        />
      )}
    </div>
  );
}


