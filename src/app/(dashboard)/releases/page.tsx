// 'use client';

// import { useState, useEffect } from 'react';
// import { Plus, LayoutGrid, List, Filter, Loader2 } from 'lucide-react';
// import { SearchBar } from '../../../components/SearchBar';
// import { ButtonPrimary } from '../../../components/ButtonPrimary';
// import { ReleaseCard } from '../../../components/ReleaseCard';
// import { SEO } from '../../../components/SEO';
// import { releasesService } from '../../../lib/api';
// import { Release } from '../../../lib/api/types';
// import { toast } from 'sonner@2.0.3';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../../../components/ui/select';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '../../../components/ui/popover';
// import { Button } from '../../../components/ui/button';

// export default function Releases() {
//   const [releases, setReleases] = useState<Release[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [typeFilter, setTypeFilter] = useState<string>('all');

//   useEffect(() => {
//     fetchReleases();
//   }, [searchQuery, typeFilter]);

//   const fetchReleases = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 100 };
//       if (searchQuery) params.search = searchQuery;
//       if (typeFilter !== 'all') params.type = typeFilter;

//       const response = await releasesService.getAll(params);
//       setReleases(response.data);
//     } catch (error: any) {
//       // Fallback to mock data if API fails
//       setReleases([
//         {
//           id: '1',
//           title: 'Witching Hour',
//           artist: 'Grace Power',
//           artistId: '1',
//           type: 'Album',
//           releaseDate: '2024-10-15',
//           coverArt: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//           createdAt: '2024-10-01',
//           updatedAt: '2024-10-01',
//         },
//         {
//           id: '2',
//           title: 'Hand On The Bible',
//           artist: 'Grace Power',
//           artistId: '1',
//           type: 'Single',
//           releaseDate: '2024-09-20',
//           coverArt: 'https://images.unsplash.com/photo-1671786390055-13842b30e424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//           createdAt: '2024-09-15',
//           updatedAt: '2024-09-15',
//         },
//         {
//           id: '3',
//           title: 'How Does It Feel To Lose Me',
//           artist: 'Grace Power',
//           artistId: '1',
//           type: 'Single',
//           releaseDate: '2024-08-10',
//           coverArt: 'https://images.unsplash.com/photo-1669546164343-d89ffdd1017f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//           createdAt: '2024-08-01',
//           updatedAt: '2024-08-01',
//         },
//         {
//           id: '4',
//           title: 'Time After Time',
//           artist: 'Grace Power',
//           artistId: '1',
//           type: 'Single',
//           releaseDate: '2024-07-22',
//           coverArt: 'https://images.unsplash.com/photo-1646500366920-b4c5ce29237d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//           createdAt: '2024-07-15',
//           updatedAt: '2024-07-15',
//         },
//         {
//           id: '5',
//           title: 'Midnight Dreams',
//           artist: 'Echo Chamber',
//           artistId: '2',
//           type: 'Album',
//           releaseDate: '2024-06-30',
//           coverArt: 'https://images.unsplash.com/photo-1596807323443-a1528e2cd0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//           createdAt: '2024-06-20',
//           updatedAt: '2024-06-20',
//         },
//         {
//           id: '6',
//           title: 'Electric Soul',
//           artist: 'The Resonance',
//           artistId: '3',
//           type: 'EP',
//           releaseDate: '2024-05-18',
//           coverArt: 'https://images.unsplash.com/photo-1512153129600-528cae82b06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
//           createdAt: '2024-05-10',
//           updatedAt: '2024-05-10',
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredReleases = releases.filter((release) => {
//     const matchesSearch =
//       release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       release.artist.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesType = typeFilter === 'all' || release.type === typeFilter;

//     return matchesSearch && matchesType;
//   });

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO
//         title="Releases"
//         description="Manage your music releases including albums, singles, and EPs"
//         keywords="music releases, albums, singles, EPs, music management"
//       />
//       {/* Page header */}
//       <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
//         <h1 className="text-xl sm:text-2xl md:text-3xl text-white">Releases</h1>
//         <div className="flex items-center gap-2 sm:gap-3">
//           <button className="hidden sm:flex rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
//             •••
//           </button>
//           <ButtonPrimary icon={Plus} href="/releases/new">
//             <span className="hidden sm:inline">Create new</span>
//             <span className="sm:hidden">New</span>
//           </ButtonPrimary>
//         </div>
//       </div>

//       {/* Search and filters */}
//       <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
//         <div className="flex-1 min-w-0">
//           <SearchBar
//             placeholder="Search releases..."
//             value={searchQuery}
//             onChange={setSearchQuery}
//           />
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <div className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-900 p-1">
//             <button
//               onClick={() => setViewMode('list')}
//               className={`rounded p-2 ${
//                 viewMode === 'list'
//                   ? 'bg-gray-800 text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <List className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`rounded p-2 ${
//                 viewMode === 'grid'
//                   ? 'bg-gray-800 text-white'
//                   : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               <LayoutGrid className="h-4 w-4" />
//             </button>
//           </div>

//           <Popover>
//             <PopoverTrigger asChild>
//               <button className="rounded-lg bg-gray-900 p-2 sm:p-2.5 text-gray-400 hover:text-white">
//                 <Filter className="h-4 w-4" />
//               </button>
//             </PopoverTrigger>
//             <PopoverContent className="w-64 bg-gray-900 border-gray-800">
//               <div className="space-y-4">
//                 <div>
//                   <label className="mb-2 block text-sm text-gray-300">Release Type</label>
//                   <Select value={typeFilter} onValueChange={setTypeFilter}>
//                     <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="Album">Album</SelectItem>
//                       <SelectItem value="Single">Single</SelectItem>
//                       <SelectItem value="EP">EP</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <Button
//                   onClick={() => setTypeFilter('all')}
//                   variant="outline"
//                   className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800"
//                 >
//                   Clear Filters
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>

//       {/* Loading state */}
//       {loading && (
//         <div className="flex justify-center py-12 sm:py-20">
//           <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#ff0050]" />
//         </div>
//       )}

//       {/* Releases grid */}
//       {!loading && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//             {filteredReleases.map((release) => (
//               <ReleaseCard
//                 key={release.id}
//                 id={release.id}
//                 title={release.title}
//                 artist={release.artist}
//                 type={release.type}
//                 imageUrl={release.coverArt}

//               />
//             ))}
//           </div>

//           {filteredReleases.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
//               <p>No releases found</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Plus, LayoutGrid, List, Filter, Loader2 } from "lucide-react";
// import { SearchBar } from "../../../components/SearchBar";
// import { ButtonPrimary } from "../../../components/ButtonPrimary";
// import { ReleaseCard } from "../../../components/ReleaseCard";
// import { SEO } from "../../../components/SEO";
// import { releasesService } from '../../../lib/api';
// import { Release } from "../../../lib/api/types";
// import { toast } from "sonner@2.0.3";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../../../components/ui/popover";
// import { Button } from "../../../components/ui/button";

// export default function Releases() {
//   const [releases, setReleases] = useState<Release[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
//   const [typeFilter, setTypeFilter] = useState<string>("all");
// console.log(releases);
//   useEffect(() => {
//     fetchReleases();
//   }, [searchQuery, typeFilter]);

//   const fetchReleases = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 100 };
//       if (searchQuery) params.search = searchQuery;

//       const response = await releasesService.getAll(params);
//       setReleases(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch releases");
//       setReleases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredReleases = releases.filter((release) => {
//     const matchesSearch =
//       release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       release.artist.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesType = typeFilter === "all" || release.type === typeFilter;
//     return matchesSearch && matchesType;
//   });

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO
//         title="Releases"
//         description="Manage your music releases including albums, singles, and EPs"
//         keywords="music releases, albums, singles, EPs, music management"
//       />
//       {/* Header */}
//       <div className="mb-4 flex justify-between items-center">
//         <h1 className="text-2xl text-white">Releases</h1>
//         <ButtonPrimary icon={Plus} href="/releases/new">
//           Create new
//         </ButtonPrimary>
//       </div>

//       {/* Search & Filter */}
//       <div className="mb-6 flex gap-2">
//         <SearchBar
//           placeholder="Search releases..."
//           value={searchQuery}
//           onChange={setSearchQuery}
//         />
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-12">
//           <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filteredReleases.map((release) => (
//             <ReleaseCard
//               key={release.id}
//               id={release.id}
//               title={release.title}
//               artist={release.artist}
//               type={release.type}
//               imageUrl={release.coverArt}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Plus, Loader2, X } from "lucide-react";
// import { SearchBar } from "../../../components/SearchBar";
// import { ButtonPrimary } from "../../../components/ButtonPrimary";
// import { ReleaseCard } from "../../../components/ReleaseCard";
// import { SEO } from "../../../components/SEO";
// import { releasesService } from "../../../lib/api";
// import { Release } from "../../../lib/api/types";
// import { toast } from "sonner@2.0.3";
// import { Button } from "../../../components/ui/button";

// export default function Releases() {
//   const [releases, setReleases] = useState<Release[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRelease, setSelectedRelease] = useState<any>(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchReleases();
//   }, [searchQuery]);

//   const fetchReleases = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 100 };
//       if (searchQuery) params.search = searchQuery;

//       const response = await releasesService.getAll(params);
//       setReleases(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch releases");
//       setReleases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------------------------
//   // Load Release Details for Modal
//   // ---------------------------------------------
//   const openReleaseModal = async (id: string) => {
//     setShowModal(true);
//     setModalLoading(true);

//     try {
//       const data = await releasesService.getById(id);
//       setSelectedRelease(data);
//     } catch (err) {
//       toast.error("Failed to fetch release details");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedRelease(null);
//   };

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO title="Releases" description="Manage your releases" />

//       {/* Header */}
//       <div className="mb-4 flex justify-between items-center">
//         <h1 className="text-2xl text-white">Releases</h1>
//         <ButtonPrimary icon={Plus} href="/releases/new">
//           Create new
//         </ButtonPrimary>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <SearchBar
//           placeholder="Search releases..."
//           value={searchQuery}
//           onChange={setSearchQuery}
//         />
//       </div>

//       {/* Release List */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {releases.map((release) => (
//             <div
//               key={release.id}
//               onClick={() => openReleaseModal(release.id)}
//               className="cursor-pointer"
//             >
//               <ReleaseCard
//                 id={release.id}
//                 title={release.title}
//                 artist={release.artist}
//                 type={release.type}
//                 imageUrl={release.coverArt}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ---------------------------------------------
//             MODAL
//       ---------------------------------------------- */}
//       {showModal && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               className="absolute right-4 top-4 text-gray-400 hover:text-white"
//             >
//               <X className="h-6 w-6" />
//             </button>

//             {modalLoading ? (
//               <div className="flex justify-center py-10">
//                 <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
//               </div>
//             ) : selectedRelease ? (
//               <div className="text-white space-y-4">
//                 <h2 className="text-2xl font-semibold">
//                   {selectedRelease.title}
//                 </h2>

//                 <p className="text-gray-400">
//                   {(selectedRelease.primaryArtists || []).join(", ")}
//                 </p>

//                 {/* FIXED PACKSHOT URL */}
//                 {selectedRelease._id || selectedRelease.id ? (
//                   <img
//                     src={`https://packshot.rightshub.net/${
//                       selectedRelease._id || selectedRelease.id
//                     }`}
//                     alt={selectedRelease.title}
//                     className="w-full rounded-lg border border-gray-800"
//                     onError={(e) => {
//                       e.currentTarget.src = "/no-image.png";
//                     }}
//                   />
//                 ) : (
//                   <p className="text-gray-500">No Packshot Available</p>
//                 )}

//                 {/* Details */}
//                 <div className="grid grid-cols-2 gap-4 text-gray-300">
//                   <p>
//                     <b>Label:</b> {selectedRelease.label}
//                   </p>
//                   <p>
//                     <b>Genre:</b> {selectedRelease.primaryGenre}
//                   </p>
//                   <p>
//                     <b>Format:</b> {selectedRelease.format}
//                   </p>
//                   <p>
//                     <b>Release Date:</b> {selectedRelease.releaseDate}
//                   </p>
//                   <p>
//                     <b>Barcode:</b> {selectedRelease.barcode}
//                   </p>
//                   <p>
//                     <b>Cat No:</b> {selectedRelease.catNo}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-400 text-center py-10">
//                 No details found.
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { Loader2, Plus, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner@2.0.3";
// import { ButtonPrimary } from "../../../components/ButtonPrimary";
// import { ReleaseCard } from "../../../components/ReleaseCard";
// import { SearchBar } from "../../../components/SearchBar";
// import { SEO } from "../../../components/SEO";
// import { releasesService } from "../../../lib/api";
// import { Release } from "../../../lib/api/types";

// export default function Releases() {
//   const [releases, setReleases] = useState<Release[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRelease, setSelectedRelease] = useState<any>(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
// console.log(selectedRelease);
// console.log(releases);
//   useEffect(() => {
//     fetchReleases();
//   }, [searchQuery]);

//   const fetchReleases = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 100 };
//       if (searchQuery) params.search = searchQuery;

//       const response = await releasesService.getAll(params);
//       setReleases(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch releases");
//       setReleases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load release details for modal
//   const openReleaseModal = async (id: string) => {
//     setShowModal(true);
//     setModalLoading(true);

//     try {
//       const data = await releasesService.getById(id);
//       setSelectedRelease(data);
//     } catch (err) {
//       toast.error("Failed to fetch release details");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedRelease(null);
//   };

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO title="Releases" description="Manage your releases" />

//       {/* Header */}
//       <div className="mb-4 flex justify-between items-center">
//         <h1 className="text-2xl text-white">Releases</h1>
//         <ButtonPrimary icon={Plus} href="/releases/new">
//           Create new
//         </ButtonPrimary>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <SearchBar
//           placeholder="Search releases..."
//           value={searchQuery}
//           onChange={setSearchQuery}
//         />
//       </div>

//       {/* Release List */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {releases.map((release) => (
//             <div
//               key={release.id}
//               onClick={() => openReleaseModal(release.id)}
//               className="cursor-pointer"
//             >
//               <ReleaseCard
//                 id={release.id}
//                 title={release.title}
//                 artist={release.artist}
//                 type={release.type}
//                 // **FIXED IMAGE URL**
//                 imageUrl={
//                   release.packshot
//                     ? `https://packshot.rightshub.net/${release.packshot}`
//                     : "/no-image.png"
//                 }
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       {showModal && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={closeModal}
//               className="absolute right-4 top-4 text-gray-400 hover:text-white"
//             >
//               <X className="h-6 w-6" />
//             </button>

//             {modalLoading ? (
//               <div className="flex justify-center py-10">
//                 <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
//               </div>
//             ) : selectedRelease ? (
//               <div className="text-white space-y-4">
//                 <h2 className="text-2xl font-semibold">
//                   {selectedRelease.title}
//                 </h2>

//                 <p className="text-gray-400">
//                   {(selectedRelease.primaryArtists || []).join(", ")}
//                 </p>

//                 {/* Modal image fix */}
//                 {selectedRelease.packshot ? (
//                   <img
//                     src={`https://packshot.rightshub.net/${selectedRelease.packshot}`}
//                     alt={selectedRelease.title}
//                     className="w-full rounded-lg border border-gray-800"
//                     onError={(e) => (e.currentTarget.src = "/no-image.png")}
//                   />
//                 ) : (
//                   <p className="text-gray-500">No Packshot Available</p>
//                 )}

//                 {/* Details */}
//                 <div className="grid grid-cols-2 gap-4 text-gray-300">
//                   <p>
//                     <b>Label:</b> {selectedRelease.label}
//                   </p>
//                   <p>
//                     <b>Genre:</b> {selectedRelease.primaryGenre}
//                   </p>
//                   <p>
//                     <b>Format:</b> {selectedRelease.format}
//                   </p>
//                   <p>
//                     <b>Release Date:</b> {selectedRelease.releaseDate}
//                   </p>
//                   <p>
//                     <b>Barcode:</b> {selectedRelease.barcode}
//                   </p>
//                   <p>
//                     <b>Cat No:</b> {selectedRelease.catNo}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-400 text-center py-10">
//                 No details found.
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";
// import { Link } from "react-router-dom";
// import { Loader2, Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner@2.0.3";
// import { ButtonPrimary } from "../../../components/ButtonPrimary";
// import { ReleaseCard } from "../../../components/ReleaseCard";
// import { SearchBar } from "../../../components/SearchBar";
// import { SEO } from "../../../components/SEO";
// import { releasesService } from "../../../lib/api";
// import { Release } from "../../../lib/api/types";
// import { useNavigate } from "react-router-dom";

// export default function Releases() {
//   const [releases, setReleases] = useState<Release[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchReleases();
//   }, [searchQuery]);

//   const fetchReleases = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 100 };
//       if (searchQuery) params.search = searchQuery;

//       const response = await releasesService.getAll(params);
//       setReleases(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch releases");
//       setReleases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-3 sm:p-4 md:p-6 lg:p-8">
//       <SEO title="Releases" description="Manage your releases" />

//       {/* Header */}
//       <div className="mb-4 flex justify-between items-center">
//         <h1 className="text-2xl text-white">Releases</h1>
//         <ButtonPrimary icon={Plus} href="/releases/new">
//           Create new
//         </ButtonPrimary>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <SearchBar
//           placeholder="Search releases..."
//           value={searchQuery}
//           onChange={setSearchQuery}
//         />
//       </div>

//       {/* Release List */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {releases.map((release) => (
//             <div
//               key={release.id}
//               onClick={() => navigate(`/releases/${release.id}/overview`)}
//               className="cursor-pointer"
//             >
//               <Link to={`/releases/${release.id}`} className="block">
//                 <ReleaseCard
//                   id={release.id}
//                   title={release.title}
//                   artist={release.artist}
//                   type={release.type}
//                   imageUrl={release.coverArt}
//                 />
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";

import { ButtonPrimary } from "../../../components/ButtonPrimary";
import { ReleaseCard } from "../../../components/ReleaseCard";
import { SearchBar } from "../../../components/SearchBar";
import { SEO } from "../../../components/SEO";
import { releasesService } from "../../../lib/api";
import { Release } from "../../../lib/api/types";

export default function Releases() {
  const [recentRelease, setRecentRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentRelease();
  }, [searchQuery]);

  const fetchRecentRelease = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 1, sort: "createdAt:desc" }; 
      if (searchQuery) params.search = searchQuery;

      const response = await releasesService.getAll(params);

      const latest = response.data?.[0] || null;
      setRecentRelease(latest);
    } catch (error) {
      toast.error("Failed to fetch releases");
      setRecentRelease(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <SEO title="Releases" description="Manage your releases" />

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl text-white">Releases</h1>
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

      {/* Recent Release */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff0050]" />
        </div>
      ) : !recentRelease ? (
        <p className="text-gray-400 text-center py-8">No releases found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            onClick={() =>
              navigate(`/releases/${recentRelease.id}/overview`)
            }
            className="cursor-pointer"
          >
            <Link to={`/releases/${recentRelease.id}`} className="block">
              <ReleaseCard
                id={recentRelease.id}
                title={recentRelease.title}
                artist={recentRelease.artist}
                type={recentRelease.type}
                imageUrl={recentRelease.coverArt}
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
