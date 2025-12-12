"use client";

import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tracksService } from "../../../../lib/api/services/tracks.service";
import { Track } from "../../../../lib/api/types";

export default function TrackDetailPage() {
  const { id } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTrack();
    }
  }, [id]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      const trackData = await tracksService.getById(id!);
      setTrack(trackData);
    } catch (error) {
      console.error("Error loading track:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !track) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white">
      {/* Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="flex space-x-1 px-6 pt-4">
          <NavLink
            to={`/tracks/${id}`}
            end
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-pink-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`
            }
          >
            Details
          </NavLink>
          <NavLink
            to={`/tracks/${id}/audio`}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-pink-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`
            }
          >
            Audio
          </NavLink>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}

