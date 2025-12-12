// import { NavLink, Outlet, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { releasesService } from "../../../../lib/api/services/releases.service";
// import { Release } from "../../../../lib/api/types";

// export default function ReleaseDetailsLayout() {
//   const { id } = useParams();
//   const [release, setRelease] = useState<Release | null>(null);

//   useEffect(() => {
//     releasesService.getById(id!).then(setRelease);
//   }, [id]);

//   if (!release) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="flex h-screen bg-white">
//       {/* LEFT SIDEBAR */}
//       <aside className="w-64 border-r bg-gray-50 p-4 space-y-4">
//         <button
//           onClick={() => window.history.back()}
//           className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//         >
//           ← Back
//         </button>

//         <h2 className="text-lg font-semibold">Catalog</h2>

//         {[
//           { label: "Overview", link: "overview" },
//           { label: "Metadata", link: "metadata" },
//           { label: "Tracks", link: "tracks" },
//           { label: "Distribution", link: "distribution" },
//           { label: "Track Splits", link: "track-splits" },
//         ].map((item) => (
//           <NavLink
//             key={item.link}
//             to={item.link}
//             className={({ isActive }) =>
//               `block px-3 py-2 rounded ${
//                 isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
//               }`
//             }
//           >
//             {item.label}
//           </NavLink>
//         ))}

//         <details>
//           <summary className="px-3 py-2 cursor-pointer rounded hover:bg-gray-100">
//             Analytics
//           </summary>
//           <div className="ml-4 mt-2 space-y-1">
//             <NavLink to="analytics/consumption">Consumption</NavLink>
//             <NavLink to="analytics/engagement">Engagement</NavLink>
//             <NavLink to="analytics/revenue">Revenue</NavLink>
//             <NavLink to="analytics/geo">Geo</NavLink>
//           </div>
//         </details>
//       </aside>

//       {/* RIGHT CONTENT */}
//       <main className="flex-1 overflow-y-auto p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }


"use client";

import { ReleaseSidebar } from "../../../../components/ReleaseSidebar";
import { Header } from "../../../../components/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function ReleaseDetailsLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <ReleaseSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
     
    

      {/* RIGHT SIDE AREA */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* FIXED HEADER */}
        <div className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-20">
          <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
