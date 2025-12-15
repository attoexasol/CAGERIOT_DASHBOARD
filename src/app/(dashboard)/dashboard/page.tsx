
"use client";

import { useEffect, useState } from "react";
import { Music, Users, DollarSign, TrendingUp } from "lucide-react";
import { ReleaseCard } from "../../../components/ReleaseCard";
import { SEO } from "../../../components/SEO";
import { releasesService } from "../../../lib/api";
import { Release } from "../../../lib/api/types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [recentReleases, setRecentReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [allReleases, setAllReleases] = useState<Release[]>([]); 
  const [activeArtists, setActiveArtists] = useState<number>(0);

  // Extract firstName from user name
  const getFirstName = () => {
    if (!user?.name) return "User";
    // If user has firstName field, use it; otherwise extract from name
    if ((user as any).firstName) {
      return (user as any).firstName;
    }
    // Extract first name from full name
    const nameParts = user.name.split(" ");
    return nameParts[0] || "User";
  };


  useEffect(() => {
    loadRecentReleases();
  }, []);

  const loadRecentReleases = async () => {
    try {
      const response = await releasesService.getAll({ limit: 20 });
      const releases = response.data || [];
      setAllReleases(releases);
// console.log(releases);
      //  Unique artist extraction
      const artistSet = new Set();

      releases.forEach((release) => {
        if (release.artist) artistSet.add(release.artist);

        if (Array.isArray(release.primaryArtists)) {
          release.primaryArtists.forEach((name) => artistSet.add(name));
        }
      });

      // Save artist count
      setActiveArtists(artistSet.size);

      // Sort by newest date
      const sorted = releases.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Take latest 4
      setRecentReleases(sorted.slice(0, 1));
    } catch (err) {
      console.error("Failed to load dashboard releases:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <SEO
        title="Dashboard"
        description="Your activity and insights with releases, artists, and revenue tracking"
        keywords="dashboard, music rights, releases, artists, revenue"
      />

      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl text-white">
          Hi, {getFirstName()}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          Your activity and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Total Releases</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">
            {allReleases.length}
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">
            +3 this month
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Active Artists</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">
            {activeArtists}
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
            Across all labels
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Total Revenue</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">
            $389,200
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">
            +18.3% this year
          </div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">This Month</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">
            $31,200
          </div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">
            +12.5% growth
          </div>
        </div>
      </div>

      {/* Recent Releases */}
      <div>
        <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">
          Recent Releases
        </h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading latest releases...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {recentReleases.map((release) => (
              <Link to={`/releases/${release.id}/overview`}>
                <ReleaseCard
                  key={release.id}
                  id={release.id}
                  title={release.title}
                  artist={release.artist}
                  type={release.type}
                  // FIX public packshot support
                  imageUrl={
                    release.publicPackshot ||
                    `https://packshot.rightshub.net/${release.id}` ||
                    release.coverArt
                  }
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
