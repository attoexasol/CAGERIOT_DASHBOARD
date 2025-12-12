"use client";
import React, { useEffect, useState } from "react";
import { Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "../../../components/AudioPlayer";
import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { SearchBar } from "../../../components/SearchBar";
import { SEO } from "../../../components/SEO";
import { tracksService } from "../../../lib/api/services/tracks.service";

interface Track {
  id: string;
  title: string;
  artist?: string;
  audioUrl?: string;
  isrc?: string;
}

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const response = await tracksService.list({ limit: 100 });
      console.log("📋 Loaded tracks:", response.data.length);
      // Log first track to see what data structure we're getting
      if (response.data.length > 0) {
        console.log("🔍 Sample track data:", {
          id: response.data[0].id,
          title: response.data[0].title,
          audioUrl: response.data[0].audioUrl,
        });
      }
      setTracks(response.data);
    } catch (error: any) {
      console.error("Error fetching tracks:", error);
      toast.error(error.message || "Failed to fetch tracks");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tracks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayTrack = async (track: Track) => {
    // If audioUrl is not available in the list, try fetching full track details
    if (!track.audioUrl) {
      try {
        console.log("🔍 Track from list has no audioUrl, fetching full details for:", track.id);
        // Fetch full track details which should include audio URL
        const fullTrack = await tracksService.getById(track.id);
        
        console.log("📥 Full track data:", {
          id: fullTrack.id,
          title: fullTrack.title,
          audioUrl: fullTrack.audioUrl,
        });
        
        if (!fullTrack.audioUrl) {
          console.warn("⚠️ Track still has no audioUrl after fetching details");
          toast.warning("No audio available for this track.");
          return;
        }
        
        // Use the full track data with audio URL
        setCurrentTrack(fullTrack);
      } catch (error: any) {
        console.error("❌ Error fetching track details:", error);
        toast.warning("No audio available for this track.");
      }
      return;
    }
    setCurrentTrack(track);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 text-white">
      <SEO title="Tracks" description="Manage audio assets" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tracks</h1>
        <ButtonPrimary icon={Plus} href="/tracks/new">
        CreateTrack
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
                    <td className="p-4 text-gray-400">—</td>
                    <td className="p-4 text-gray-400">{track.isrc || "—"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="p-2 rounded-lg hover:bg-gray-800 hover:text-pink-500 disabled:opacity-40"
                        disabled={!track.audioUrl}
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

      {currentTrack && currentTrack.audioUrl && (
        <AudioPlayer
          trackTitle={currentTrack.title}
          artist={currentTrack.artist || "Unknown Artist"}
          src={currentTrack.audioUrl}
          onClose={() => setCurrentTrack(null)}
        />
      )}
    </div>
  );
}
