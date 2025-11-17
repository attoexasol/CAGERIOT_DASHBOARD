// 'use client';

// import { useState, useEffect } from 'react';
// import { Plus, Play } from 'lucide-react';
// import { SearchBar } from '../../../components/SearchBar';
// import { ButtonPrimary } from '../../../components/ButtonPrimary';
// import { SEO } from '../../../components/SEO';
// import { AudioPlayer } from '../../../components/AudioPlayer';
// import { tracksService } from '../../../lib/api';
// import { Track } from '../../../lib/api/types';
// import { toast } from 'sonner@2.0.3';

// export default function Tracks() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentTrack, setCurrentTrack] = useState<{ title: string; artist: string } | null>(null);
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadTracks();
//   }, []);

//   const loadTracks = async () => {
//     try {
//       setLoading(true);
//       const response = await tracksService.list({ limit: 100 });
//       setTracks(response.data);
//     } catch (error: any) {
//       console.error('Failed to load tracks:', error);
//       toast.error(error.message || 'Failed to load tracks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTracks = tracks.filter(
//     (track) =>
//       track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       track.artist.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const formatPlays = (plays: number) => {
//     if (plays >= 1000000) {
//       return `${(plays / 1000000).toFixed(1)}M`;
//     } else if (plays >= 1000) {
//       return `${(plays / 1000).toFixed(0)}K`;
//     }
//     return plays.toString();
//   };

//   const handlePlayTrack = (track: Track) => {
//     setCurrentTrack({ title: track.title, artist: track.artist });
//   };

//   if (loading) {
//     return (
//       <div className="flex h-96 items-center justify-center p-3 sm:p-4 md:p-8">
//         <div className="text-sm sm:text-base text-gray-400">Loading tracks...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO
//         title="Tracks"
//         description="Manage individual music tracks, plays, and analytics"
//         keywords="tracks, songs, music, analytics, plays"
//       />
//       <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
//         <h1 className="text-xl sm:text-2xl md:text-3xl text-white">Tracks</h1>
//         <ButtonPrimary icon={Plus} href="/tracks/new">
//           <span className="hidden sm:inline">Add Track</span>
//           <span className="sm:hidden">Add</span>
//         </ButtonPrimary>
//       </div>

//       <div className="mb-4 sm:mb-6">
//         <SearchBar placeholder="Search tracks..." value={searchQuery} onChange={setSearchQuery} />
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block overflow-hidden rounded-lg border border-gray-800">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-900/50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs text-gray-400">Title</th>
//                 <th className="px-6 py-4 text-left text-xs text-gray-400">Artist</th>
//                 <th className="px-6 py-4 text-left text-xs text-gray-400">Album</th>
//                 <th className="px-6 py-4 text-left text-xs text-gray-400">Duration</th>
//                 <th className="px-6 py-4 text-left text-xs text-gray-400">Plays</th>
//                 <th className="px-6 py-4 text-left text-xs text-gray-400"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTracks.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
//                     {searchQuery ? 'No tracks found matching your search' : 'No tracks found. Add your first track!'}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredTracks.map((track, index) => (
//                   <tr
//                     key={track.id}
//                     className={`border-t border-gray-800 transition-colors hover:bg-gray-900/30 ${
//                       index % 2 === 0 ? 'bg-gray-900/10' : ''
//                     }`}
//                   >
//                     <td className="px-6 py-4 text-white">{track.title}</td>
//                     <td className="px-6 py-4 text-gray-400">{track.artist}</td>
//                     <td className="px-6 py-4 text-gray-400">{track.album || 'N/A'}</td>
//                     <td className="px-6 py-4 text-gray-400">{track.duration}</td>
//                     <td className="px-6 py-4 text-gray-400">{formatPlays(track.plays)}</td>
//                     <td className="px-6 py-4">
//                       <button 
//                         onClick={() => handlePlayTrack(track)}
//                         className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-[#ff0050]"
//                       >
//                         <Play className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Mobile Cards */}
//       <div className="md:hidden space-y-3">
//         {filteredTracks.length === 0 ? (
//           <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 sm:p-8 text-center text-sm text-gray-400">
//             {searchQuery ? 'No tracks found matching your search' : 'No tracks found. Add your first track!'}
//           </div>
//         ) : (
//           filteredTracks.map((track) => (
//             <div
//               key={track.id}
//               className="rounded-lg border border-gray-800 bg-gray-900/30 p-3 sm:p-4"
//             >
//               <div className="flex items-start justify-between mb-2 sm:mb-3">
//                 <div className="flex-1 min-w-0 pr-2">
//                   <h3 className="text-sm sm:text-base text-white truncate">{track.title}</h3>
//                   <p className="text-xs sm:text-sm text-gray-400 truncate">{track.artist}</p>
//                 </div>
//                 <button 
//                   onClick={() => handlePlayTrack(track)}
//                   className="flex-shrink-0 rounded-lg p-1.5 sm:p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-[#ff0050]"
//                 >
//                   <Play className="h-4 w-4" />
//                 </button>
//               </div>
//               <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
//                 <div className="min-w-0">
//                   <span className="text-gray-500 block mb-0.5">Album</span>
//                   <p className="text-gray-400 truncate">{track.album || 'N/A'}</p>
//                 </div>
//                 <div className="min-w-0">
//                   <span className="text-gray-500 block mb-0.5">Duration</span>
//                   <p className="text-gray-400 truncate">{track.duration}</p>
//                 </div>
//                 <div className="min-w-0">
//                   <span className="text-gray-500 block mb-0.5">Plays</span>
//                   <p className="text-gray-400 truncate">{formatPlays(track.plays)}</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Audio Player */}
//       {currentTrack && (
//         <AudioPlayer
//           trackTitle={currentTrack.title}
//           artist={currentTrack.artist}
//           onClose={() => setCurrentTrack(null)}
//         />
//       )}
//     </div>
//   );
// }







"use client";

import { useState, useEffect } from "react";
import { Plus, Play } from "lucide-react";
import { SearchBar } from "../../../components/SearchBar";
import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { SEO } from "../../../components/SEO";
import { AudioPlayer } from "../../../components/AudioPlayer";
import { tracksService } from "../../../lib/api/services/tracks.service";
import { Track } from "../../../lib/api/types";
import { toast } from "sonner@2.0.3";

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    artist: string;
    publicFile?: string;
  } | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const response = await tracksService.list({ limit: 100 });
      setTracks(response.data);
    } catch (error: any) {
      console.error("Error fetching tracks:", error);
      toast.error(error.message || "Failed to fetch tracks");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayTrack = (track: Track) => {
    if (!track.audioUrl) {
      toast.warning("No audio available");
      return;
    }
    setCurrentTrack({
      title: track.title,
      artist: track.artist,
      publicFile: track.audioUrl,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white">
      <SEO
        title="Tracks"
        description="Manage audio assets"
        keywords="tracks, assets"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Tracks</h1>
        <ButtonPrimary icon={Plus} href="/tracks/new">
          <span className="hidden sm:inline">Add Track</span>
          <span className="sm:hidden">Add</span>
        </ButtonPrimary>
      </div>

      <SearchBar
        placeholder="Search tracks..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-400">
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800 mt-6">
          <table className="w-full text-left">
            <thead className="bg-gray-900/60">
              <tr>
                <th className="p-4 text-gray-400 text-xs">Title</th>
                <th className="p-4 text-gray-400 text-xs">Artist</th>
                <th className="p-4 text-gray-400 text-xs">Label</th>
                <th className="p-4 text-gray-400 text-xs">ISRC</th>
                <th className="p-4 text-gray-400 text-xs">Play</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    No tracks found.
                  </td>
                </tr>
              ) : (
                filtered.map((track) => (
                  <tr
                    key={track.id}
                    className="border-t border-gray-800 hover:bg-gray-900/40"
                  >
                    <td className="p-4">{track.title}</td>
                    <td className="p-4 text-gray-400">{track.artist}</td>
                    <td className="p-4 text-gray-400">{track.album || "—"}</td>
                    <td className="p-4 text-gray-400">{track.isrc || "—"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="p-2 rounded-lg hover:bg-gray-800 hover:text-pink-500"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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
