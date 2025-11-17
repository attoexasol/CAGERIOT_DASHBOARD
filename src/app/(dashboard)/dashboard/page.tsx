// 'use client';

// import { useEffect, useState } from 'react';
// import { Music, Users, DollarSign, TrendingUp } from 'lucide-react';
// import { ReleaseCard } from '../../../components/ReleaseCard';
// import { SEO } from '../../../components/SEO';

// const recentReleases = [
//   {
//     id: '1',
//     title: 'Witching Hour',
//     artist: 'Grace Power',
//     type: 'Album',
//     imageUrl: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//   },
//   {
//     id: '2',
//     title: 'Hand On The Bible',
//     artist: 'Grace Power',
//     type: 'Single',
//     imageUrl: 'https://images.unsplash.com/photo-1671786390055-13842b30e424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//   },
//   {
//     id: '3',
//     title: 'How Does It Feel To Lose Me',
//     artist: 'Grace Power',
//     type: 'Single',
//     imageUrl: 'https://images.unsplash.com/photo-1669546164343-d89ffdd1017f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//   },
//   {
//     id: '4',
//     title: 'Time After Time',
//     artist: 'Grace Power',
//     type: 'Single',
//     imageUrl: 'https://images.unsplash.com/photo-1646500366920-b4c5ce29237d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//   },
// ];

// export default function Dashboard() {
//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO
//         title="Dashboard"
//         description="Overview of your music rights portfolio with releases, artists, and revenue tracking"
//         keywords="dashboard, music rights, releases, artists, revenue"
//       />
//       <div className="mb-4 sm:mb-6 md:mb-8">
//         <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl text-white">Dashboard</h1>
//         <p className="text-xs sm:text-sm md:text-base text-gray-400">Overview of your music rights portfolio</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">Total Releases</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">24</div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">+3 this month</div>
//         </div>

//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">Active Artists</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">12</div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">Across all labels</div>
//         </div>

//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">Total Revenue</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">$389,200</div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">+18.3% this year</div>
//         </div>

//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">This Month</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">$31,200</div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">+12.5% growth</div>
//         </div>
//       </div>

//       {/* Recent Releases */}
//       <div>
//         <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">Recent Releases</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//           {recentReleases.map((release) => (
//             <ReleaseCard key={release.id} {...release} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";

// import { useEffect, useState } from "react";
// import { Music, Users, DollarSign, TrendingUp } from "lucide-react";
// import { ReleaseCard } from "../../../components/ReleaseCard";
// import { SEO } from "../../../components/SEO";
// import { releasesService } from "../../../lib/api";
// import { Release } from "../../../lib/api/types";

// export default function Dashboard() {
//   const [recentReleases, setRecentReleases] = useState<Release[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [allReleases, setAllReleases] = useState<Release[]>([]); 
//   const [activeArtists, setActiveArtists] = useState<number>(0);


//   useEffect(() => {
//     loadRecentReleases();
//   }, []);

//   const loadRecentReleases = async () => {
//     try {
//       const response = await releasesService.getAll({ limit: 20 });
//       const releases = response.data || [];
//       setAllReleases(releases);
// // console.log(releases);
//       //  Unique artist extraction
//       const artistSet = new Set();

//       releases.forEach((release) => {
//         if (release.artist) artistSet.add(release.artist);

//         if (Array.isArray(release.primaryArtists)) {
//           release.primaryArtists.forEach((name) => artistSet.add(name));
//         }
//       });

//       // Save artist count
//       setActiveArtists(artistSet.size);

//       // Sort by newest date
//       const sorted = releases.sort(
//         (a: any, b: any) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );

//       // Take latest 4
//       setRecentReleases(sorted.slice(0, 4));
//     } catch (err) {
//       console.error("Failed to load dashboard releases:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO
//         title="Dashboard"
//         description="Overview of your music rights portfolio with releases, artists, and revenue tracking"
//         keywords="dashboard, music rights, releases, artists, revenue"
//       />

//       {/* Header */}
//       <div className="mb-4 sm:mb-6 md:mb-8">
//         <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl text-white">
//           Dashboard
//         </h1>
//         <p className="text-xs sm:text-sm md:text-base text-gray-400">
//           Overview of your music rights portfolio
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">Total Releases</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">
//             {allReleases.length}
//           </div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">
//             +3 this month
//           </div>
//         </div>

//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">Active Artists</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">
//             {activeArtists}
//           </div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">
//             Across all labels
//           </div>
//         </div>

//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">Total Revenue</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">
//             $389,200
//           </div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">
//             +18.3% this year
//           </div>
//         </div>

//         <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
//           <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
//             <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
//             <span className="text-xs sm:text-sm truncate">This Month</span>
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl text-white">
//             $31,200
//           </div>
//           <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">
//             +12.5% growth
//           </div>
//         </div>
//       </div>

//       {/* Recent Releases */}
//       <div>
//         <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">
//           Recent Releases
//         </h2>

//         {loading ? (
//           <p className="text-gray-400 text-sm">Loading latest releases...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//             {recentReleases.map((release) => (
//               <ReleaseCard
//                 key={release.id}
//                 id={release.id}
//                 title={release.title}
//                 artist={release.artist}
//                 type={release.type}
//                 // FIX public packshot support
//                 imageUrl={
//                   release.publicPackshot ||
//                   `https://packshot.rightshub.net/${release.id}` ||
//                   release.coverArt
//                 }
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { DollarSign, Loader2, Music, TrendingUp, Users } from "lucide-react";
import { tracksService } from "../../../lib/api/services/tracks.service";

export default function Dashboard() {
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Example trackId
  const trackId = "6916a352d97b582877d20699";

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const data = await tracksService.getByTrackId(trackId);
        setMeta(data?.data ?? data);
      } catch (err) {
        console.error(err);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );

  if (!meta)
    return (
      <div className="text-center py-20 text-gray-400">No metadata found.</div>
    );

  return (
    <div className="p-6">
      <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Total Releases</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">
            18
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
            6
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
      {/* SAME GRID LIKE RELEASE PAGE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD EXACT LIKE RELEASECARD */}
        <div className="bg-gray-800 rounded-xl p-3 shadow hover:shadow-xl transition duration-200">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-700">
            <img
              src={"/no-image.png"}
              alt={meta.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/no-image.png")}
            />
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-white font-semibold truncate">{meta.title}</p>
            <p className="text-gray-400 text-sm truncate">
              {" "}
              {meta.primaryArtists?.[0] || "Unknown Artist"}
            </p>
            <span className="text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
              {meta.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE META ROW */
function MetaRow({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-gray-800 pb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value || "—"}</span>
    </div>
  );
}

