// export default function Overview() {
//   return <h2 className="text-xl font-bold">Overview</h2>;
// }

// src/app/(dashboard)/releases/[id]/overview/page.tsx



"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { releasesService } from "../../../../lib/api/services/releases.service";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

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
  const { id } = useParams();
  const [release, setRelease] = useState<ReleaseAny | null>(null);
  const [loading, setLoading] = useState(true);

  // chart mock state (will be replaced when API gives real analytics)
  const [streamsData, setStreamsData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      try {
        const res = await releasesService.getById(id!);
        const data = res?.data ?? res ?? null;
        if (data && Object.keys(data).length > 0) setRelease(data);
        else setRelease(null);

        // If your API returns analytics data, use it. Here we build fallback/mock.
        const today = new Date();
        const streamsMock = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          return { day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), streams: Math.floor(200 + Math.random() * 200) };
        });
        setStreamsData(streamsMock);

        const revenueMock = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(today);
          d.setMonth(today.getMonth() - (5 - i));
          return { month: d.toLocaleDateString(undefined, { month: "short" }), revenue: parseFloat((Math.random() * 80 + 10).toFixed(2)) };
        });
        setRevenueData(revenueMock);
      } catch (err) {
        console.error(err);
        setRelease(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p className="text-gray-400">Loading overview...</p>;
  if (!release) return <p className="text-red-400">No data found for this release (ID: {id}).</p>;

  return (
    <div className="space-y-6">
      {/* Top region */}
      <div className="flex gap-6 items-start">
        <img
          src={release.publicPackshot || release.coverArt || "/no-image.png"}
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
                {/* Example badges */}
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  <span className="h-2 w-2 rounded-full bg-[#a0ff4d] block" />{" "}
                  {release.artistDisplayName || "Unknown Artist"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  {release.label || "Label"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  UPC {release.barcode || "—"}
                </span>
                <button className="px-3 py-1 bg-[#121212] rounded-full text-sm text-gray-200">
                  See Info
                </button>
              </div>
            </div>

            {/* Download / more menu placeholder */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-[#121212] hover:bg-[#1a1a1a]">
                {/* download icon (simple) */}
                <svg
                  className="h-5 w-5 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-[#121212] hover:bg-[#1a1a1a]">
                <svg
                  className="h-5 w-5 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                  <path d="M12 5v0" stroke="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          {/* Secondary small data row */}
          <div className="mt-4 text-gray-300 grid grid-cols-3 gap-4">
            <div className="text-sm">
              <div className="text-xs text-gray-400">Release Date</div>
              <div>{formatReleaseDate(release.releaseDate || "N/A")} </div>
            </div>
            <div className="text-sm">
              <div className="text-xs text-gray-400">Status</div>
              <div>{release.status || "Unknown"}</div>
            </div>
            <div className="text-sm">
              <div className="text-xs text-gray-400">Primary Genre</div>
              <div>{release.primaryGenre || "—"}</div>
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

        {/* Tracks */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-300">
              Tracks{" "}
              <span className="text-xs bg-[#121212] px-2 rounded ml-2 text-gray-400">
                {" "}
                {release.tracks?.length ?? 0}{" "}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {release.totalDuration || ""}
            </div>
          </div>

          <div className="space-y-2">
            {(release.tracks ?? []).map((t: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#101010] rounded-md p-3 flex justify-between text-gray-200"
              >
                <div>
                  {idx + 1}. {t.title || t.name || "Track"}
                </div>
                <div className="text-sm text-gray-400">
                  {t.duration || "00:00"}
                </div>
              </div>
            ))}

            {(!release.tracks || release.tracks.length === 0) && (
              <div className="text-gray-400">No tracks</div>
            )}
          </div>
        </div>

        {/* Release Details */}
        <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-3">Release Details</div>

          <div className="text-gray-300 space-y-3">
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Release Date</div>
              <div>{formatReleaseDate(release.releaseDate)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">UPC</div>
              <div>{release.barcode || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Metadata Language</div>
              <div>{release?.metadataLanguage || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-gray-400">Primary Genre</div>
              <div>{release.primaryGenre || "N/A"}</div>
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
        {/* Streams (last 7 days) */}
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

        {/* Revenue (last 6 months) */}
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
    </div>
  );
}
