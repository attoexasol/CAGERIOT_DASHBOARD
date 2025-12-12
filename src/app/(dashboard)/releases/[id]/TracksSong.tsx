// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { Loader2, Volume2, Download, Play } from "lucide-react";
// import { releasesService } from "../../../../lib/api/services/releases.service";
// import { tracksService } from "../../../../lib/api/services/tracks.service";
// import { toast } from "sonner@2.0.3";

// export default function Tracks() {
//   const { id: releaseId } = useParams();

//   const [release, setRelease] = useState<any>(null);
//   const [audioMeta, setAudioMeta] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     if (!releaseId) return;

//     async function load() {
//       try {
//         setLoading(true);

//         const r = await releasesService.getById(releaseId);
//         setRelease(r);

//         // Load tracks for release
//         let tracks = await tracksService.getTracksForRelease(releaseId);

//         if (!tracks || tracks.length === 0) {
//           tracks = await tracksService
//             .list({ search: r?.title?.toLowerCase() })
//             .then((res) => res.data);
//         }

//         if (!tracks || tracks.length === 0) {
//           setAudioMeta(null);
//           return;
//         }

//         const selected =
//           tracks.find(
//             (t: any) => t.title?.toLowerCase() === r?.title?.toLowerCase()
//           ) || tracks[0];

//         const metadata = await tracksService.getByTrackId(
//           selected.id || selected._id
//         );

//         setAudioMeta(metadata);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [releaseId]);

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
//       </div>
//     );

//   if (!audioMeta)
//     return (
//       <div className="p-6 text-center text-gray-400">
//         No audio found for this track.
//       </div>
//     );

//   // Extract audio
//   const master =
//     audioMeta.audioVersions?.find((v: any) => v.isMasterAudio) ||
//     audioMeta.audioVersions?.[0] ||
//     null;

//   const fileUrl = master?.publicFile || "";
//   const meta = master?.fileMetadata || {};

//   const handlePlay = () => {
//     if (!fileUrl) {
//       toast.warning("No audio available");
//       return;
//     }
//     audioRef.current?.play();
//   };

//   const handleDownload = () => {
//     if (!fileUrl) {
//       toast.error("No file to download");
//       return;
//     }
//     window.open(fileUrl, "_blank");
//   };

//   return (
//     <div className="text-white">
//       <h1 className="text-3xl font-semibold mb-10">Audio File</h1>

//       <div className="bg-[#1c1c1e] rounded-2xl border border-gray-700 p-6 shadow-lg">
//         <audio ref={audioRef} src={fileUrl}></audio>

//         {/* Play Row */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={handlePlay}
//               className={`w-14 h-14 rounded-full flex items-center justify-center ${
//                 fileUrl
//                   ? "bg-pink-600 hover:bg-pink-700"
//                   : "bg-gray-700 text-gray-400"
//               }`}
//             >
//               <Play className="h-8 w-8" />
//             </button>

//             <div className="w-40 md:w-96 h-1 bg-gray-700 rounded-md"></div>

//             <span>
//               {meta.duration ? formatDuration(meta.duration) : "00:00"}
//             </span>
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={handlePlay}
//               className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
//             >
//               <Volume2 />
//             </button>

//             <button
//               onClick={handleDownload}
//               className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
//             >
//               <Download />
//             </button>
//           </div>
//         </div>

//         {/* Metadata Section (same style as screenshot grid) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <MetaCard label="File Name" value={meta.name || "—"} />
//           <MetaCard label="ISRC" value={audioMeta?.isrc || "—"} />
//           <MetaCard
//             label="Bitrate"
//             value={
//               meta.bitrate ? (meta.bitrate / 1000).toFixed(1) + " kbps" : "—"
//             }
//           />
//           <MetaCard
//             label="Sample Rate"
//             value={meta.sampleRate ? meta.sampleRate + " Hz" : "—"}
//           />
//           <MetaCard label="Channels" value={meta.numOfChannels || "—"} />
//           <MetaCard
//             label="Bit Depth"
//             value={meta.bitsPerSample ? meta.bitsPerSample + "-bit" : "—"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function formatDuration(sec: number) {
//   const m = Math.floor(sec / 60);
//   const s = sec % 60;
//   return `${m}:${String(s).padStart(2, "0")}`;
// }

// function MetaCard({ label, value }: any) {
//   return (
//     <div className="p-4 rounded-xl bg-[#2c2c2e] border border-gray-700">
//       <p className="text-sm text-gray-400">{label}</p>
//       <p className="text-lg mt-1">{value}</p>
//     </div>
//   );
// }
"use client";

import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner@2.0.3";
import { AudioPlayer } from "../../../../components/AudioPlayer";
import { SearchBar } from "../../../../components/SearchBar";
import { SEO } from "../../../../components/SEO";
import { releasesService } from "../../../../lib/api/services/releases.service";
import { tracksService } from "../../../../lib/api/services/tracks.service";

export default function ReleaseTracksPage() {
  const { id: releaseId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  useEffect(() => {
    if (releaseId) loadTracks();
  }, [releaseId]);

  /* ---------------------------------------------------
     LOAD TRACKS (3-Layer System)
     1. trackSongs (from normalizeRelease)
     2. discs[].disc_tracks (raw API nested)
     3. fallback → /tracks?release_id=
  ---------------------------------------------------- */
  const loadTracks = async () => {
    try {
      setLoading(true);

      // 1️ LOAD RELEASE OBJECT
      const release = await releasesService.getById(releaseId);
      console.log("RELEASE:", release);

      let collectedTracks: any[] = [];

      // 2️ PRIORITY 1 → normalized trackSongs (if available)
      if (release.trackSongs && release.trackSongs.length > 0) {
        collectedTracks = release.trackSongs.map((t: any) => ({
          id: t.id,
          title: t.title,
          isrc: t.isrc,
          artist_display_name: t.artist_display_name,
          raw: t.raw || t,
        }));
      }

      // 3 PRIORITY 2 → extract from discs/disc_tracks
      if (collectedTracks.length === 0 && release.discs?.length > 0) {
        release.discs.forEach((disc: any) => {
          disc.disc_tracks?.forEach((dt: any) => {
            const tr = dt.track;
            if (tr) {
              collectedTracks.push({
                id: tr.id,
                title: tr.title,
                isrc: tr.isrc,
                artist_display_name: tr.artist_display_name,
                raw: tr,
              });
            }
          });
        });
      }

      // 4️⃣ PRIORITY 3 → API fallback: /tracks?release_id=XXXX
      if (collectedTracks.length === 0) {
        const fallbackTracks = await tracksService.getTracksForRelease(
          releaseId!
        );

        if (fallbackTracks.length > 0) {
          collectedTracks = fallbackTracks;
        }
      }

      // 5️⃣ Still empty? No tracks found
      if (collectedTracks.length === 0) {
        console.warn("No tracks found for release:", releaseId);
        setTracks([]);
      } else {
        console.log("TRACKS LOADED:", collectedTracks);
        setTracks(collectedTracks);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tracks.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------
     FILTER TRACKS 
  ---------------------------------------------------- */
  const filteredTracks = tracks.filter((t) =>
    (t.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------------------------------------------
     PLAY TRACK
  ---------------------------------------------------- */
  const handlePlayTrack = (track: any) => {
    const file =
      track.raw?.publicFile ||
      track.raw?.audioVersions?.[0]?.publicFile ||
      track.raw?.audio_url ||
      null;

    if (!file) {
      toast.warning("No audio available for this track.");
      return;
    }

    setCurrentTrack({
      title: track.title,
      artist: track.artist_display_name || "Unknown Artist",
      publicFile: file,
    });
  };

  /* ---------------------------------------------------
     UI RENDER
  ---------------------------------------------------- */
  return (
    <div className="p-6 text-white">
      <SEO title="Tracks" description="Tracks under this release" />

      <h1 className="text-2xl font-semibold mb-4">Tracks</h1>

      <SearchBar
        placeholder="Search tracks..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* TRACK TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-800 mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-900/60">
            <tr>
              <th className="p-4 text-gray-400 text-xs">Title</th>
              <th className="p-4 text-gray-400 text-xs">Track ID</th>
              <th className="p-4 text-gray-400 text-xs">ISRC</th>
              <th className="p-4 text-gray-400 text-xs">Artist</th>
              <th className="p-4 text-gray-400 text-xs">Play</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Loading tracks...
                </td>
              </tr>
            ) : filteredTracks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No tracks found.
                </td>
              </tr>
            ) : (
              filteredTracks.map((track) => (
                <tr
                  key={track.id}
                  className="border-t border-gray-800 hover:bg-gray-900/40"
                >
                  <td className="p-4">{track.title}</td>
                  <td className="p-4 text-gray-400">{track.id}</td>
                  <td className="p-4 text-gray-400">{track.isrc || "—"}</td>
                  <td className="p-4 text-gray-400">
                    {track.artist_display_name || "—"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-2 rounded-lg hover:bg-gray-800 hover:text-pink-500"
                    >
                      <Play className="w-4 h-4 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AUDIO PLAYER */}
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
