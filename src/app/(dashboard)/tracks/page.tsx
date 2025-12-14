"use client";
import React, { useEffect, useState } from "react";
import { Play, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AudioPlayer } from "../../../components/AudioPlayer";
import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { SearchBar } from "../../../components/SearchBar";
import { SEO } from "../../../components/SEO";
import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { tracksService } from "../../../lib/api/services/tracks.service";

// Track type from tracks service
type Track = {
  id: string;
  title: string;
  artist?: string;
  isrc?: string;
  audioUrl?: string;
};

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 50;

  useEffect(() => {
    loadTracks();
  }, [currentPage, searchQuery]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const response = await tracksService.list({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
      });
      setTracks(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
        setTotalResults(response.pagination.total || 0);
      }
    } catch (error: any) {
      console.error("Error fetching tracks:", error);
      toast.error(error.message || "Failed to fetch tracks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePlayTrack = async (track: Track) => {
    console.log("Play button clicked for track:", track.id, track.title);
    
    // Always fetch full track details to get the latest audio URL
    // The list endpoint might not include audio URLs or they might be null
    try {
      console.log("Fetching track details from API...");
      const fullTrack = await tracksService.getById(track.id);
      console.log("Full track data received:", fullTrack);
      
      // Check all possible audio URL fields from the API response
      const audioUrl = (fullTrack as any).audio_url || 
                      (fullTrack as any).audioUrl || 
                      (fullTrack as any).publicFile || 
                      fullTrack.audioUrl || 
                      "";
      
      console.log("Audio URL found:", audioUrl);
      
      if (!audioUrl) {
        toast.warning("No audio available for this track.");
        return;
      }

      // Update track with audio URL and play
      setCurrentTrack({
        ...track,
        audioUrl: audioUrl,
      });
      console.log("Setting current track to play:", { ...track, audioUrl });
    } catch (error: any) {
      console.error("Error fetching track details:", error);
      toast.error("Failed to load audio for this track.");
    }
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
        onChange={handleSearchChange}
      />

      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-400">
          Loading...
        </div>
      ) : (
        <>
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
                {tracks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No tracks found.
                    </td>
                  </tr>
                ) : (
                  tracks.map((track) => (
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
                          className="p-2 rounded-lg hover:bg-gray-800 hover:text-pink-500 transition-colors"
                          type="button"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing page {currentPage} of {totalPages} ({totalResults} total tracks)
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      size="default"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      size="default"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem> 
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {currentTrack && ( 
        <AudioPlayer
          trackTitle={currentTrack.title}
          artist={currentTrack.artist || "Unknown Artist"}
          src={currentTrack.audioUrl || ""}
          onClose={() => setCurrentTrack(null)}
        />
      )}
    </div>
  );
}
