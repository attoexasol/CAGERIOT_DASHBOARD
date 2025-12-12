"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { ReleaseCard } from "../../../components/ReleaseCard";
import { SearchBar } from "../../../components/SearchBar";
import { SEO } from "../../../components/SEO";
import { releasesService } from "../../../lib/api/services/releases.service";
import { Release } from "../../../lib/api/types";

export default function Releases() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReleases();
  }, [searchQuery]);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching releases with search:", searchQuery);

      const response = await releasesService.getAll({
        search: searchQuery || undefined,
        page: 1,
        limit: 100,
      });

      console.log("📦 Service response:", response);

      setReleases(response.data || []);
      setTotalResults(response.pagination?.total || 0);

      if (response.data && response.data.length > 0) {
        console.log(`✅ Loaded ${response.data.length} releases`);
      }
    } catch (error: any) {
      console.error("❌ Error fetching releases:", error);
      toast.error(error.message || "Failed to load releases");
      setReleases([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <SEO title="Releases" description="Manage your releases" />

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-white">Releases</h1>
          {!loading && totalResults > 0 && (
            <p className="text-gray-400 text-sm mt-1">
              {totalResults} {totalResults === 1 ? "release" : "releases"}
            </p>
          )}
        </div>
        <ButtonPrimary icon={Plus} href="/releases/new">
          Create new
        </ButtonPrimary>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search releases..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
        </div>
      ) : releases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {searchQuery
              ? "No releases found matching your search."
              : "No releases found."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[#ff0050] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {releases.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/releases/${item.id}/overview`)}
              className="cursor-pointer"
            >
              <ReleaseCard
                id={item.id}
                title={item.title}
                artist={item.artist || "Unknown Artist"}
                type={item.type || "Album"}
                upc={item.upc || null}
                digital={item.configuration}
                imageUrl={item.coverArt || ""}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
