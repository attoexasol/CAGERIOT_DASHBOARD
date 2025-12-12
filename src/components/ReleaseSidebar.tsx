// import { NavLink, useParams } from "react-router-dom";
// import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// export function ReleaseSidebar() {
//   const { id } = useParams();
//   const [open, setOpen] = useState(false);

//   return (
//     <aside className="w-64 bg-[#0d0d0d] border-r border-gray-800 p-5 overflow-y-auto">
//       <Link to={"/releases"}>
//         <h2 className="text-xl font-semibold mb-6 text-gray-100 cursor-pointer">
//           <ChevronLeft />
//         </h2>
//       </Link>

//       <nav className="space-y-1">
//         <NavItem label="Overview" to={`/releases/${id}/overview`} />
//         <NavItem label="Metadata" to={`/releases/${id}/metadata`} />
//         <NavItem label="Tracks" to={`/releases/${id}/tracks`} />
//         <NavItem label="Audio Files" to={`/releases/${id}/audio`} />
//         <NavItem label="Distribution" to={`/releases/${id}/distribution`} />
//         <NavItem label="Track Splits" to={`/releases/${id}/track-splits`} />

//         {/* DROPDOWN */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="flex justify-between w-full px-3 py-2 text-gray-300 hover:bg-[#1a1a1a] rounded-md"
//         >
//           Analytics
//           {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//         </button>

//         {open && (
//           <div className="ml-4 mt-1 space-y-1">
//             <NavItem
//               label="Consumption"
//               to={`/releases/${id}/analytics/consumption`}
//             />
//             <NavItem
//               label="Engagement"
//               to={`/releases/${id}/analytics/engagement`}
//             />
//             <NavItem label="Revenue" to={`/releases/${id}/analytics/revenue`} />
//             <NavItem label="Geo" to={`/releases/${id}/analytics/geo`} />
//           </div>
//         )}
//       </nav>
//     </aside>
//   );
// }

// function NavItem({ label, to }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `block px-3 py-2 rounded-md ${
//           isActive
//             ? "bg-[#ff0050]/20 text-[#ff0050]"
//             : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white text-[15px] font-semibold"
//         }`
//       }
//     >
//       {label}
//     </NavLink>
//   );
// }






"use client";

import {
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  FileText,
  Music,
  Disc,
  FolderOpen,
  ListChecks,
  ChartBar,
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export function ReleaseSidebar({
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}: SidebarProps) {
  const { id } = useParams();
  const location = useLocation();
  const pathname = location.pathname;

  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const items = [
    { name: "Overview", href: `/releases/${id}/overview`, icon: FileText },
    { name: "Metadata", href: `/releases/${id}/metadata`, icon: BarChart3 },
    { name: "Tracks", href: `/releases/${id}/tracks_song`, icon: Music },
    // { name: "Audio Files", href: `/releases/${id}/audio`, icon: FolderOpen },
    { name: "Distribution", href: `/releases/${id}/distribution`, icon: Disc },
    {
      name: "Track Splits",
      href: `/releases/${id}/track-splits`,
      icon: ListChecks,
    },
  ];

  const analyticsItems = [
    { name: "Consumption", href: `/releases/${id}/analytics/consumption` },
    { name: "Engagement", href: `/releases/${id}/analytics/engagement` },
    { name: "Revenue", href: `/releases/${id}/analytics/revenue` },
    { name: "Geo", href: `/releases/${id}/analytics/geo` },
  ];

  // Shared renderer
  const renderItem = (item: any) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onCloseMobileMenu}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors 
          ${ 
            isActive 
              ? "bg-[#ff0050]/10 text-[#ff0050]"
              : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
          }
          ${isCollapsed ? "justify-center" : ""}
        `}
      >
        {item.icon && <item.icon className="h-5 w-5" />}
        {!isCollapsed && (
          <span className="text-[15px] font-semibold">{item.name}</span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex h-screen flex-col bg-[#0a0a0a] border-r border-gray-800
        transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          {!isCollapsed ? (
            <Link to={"/releases"}>
              <div className="flex items-center gap-2 group cursor-pointer text-white">
                <ChevronLeft className="h-5 w-5" /> 
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">
                  Back
                </span> 
              </div>
            </Link>
          ) : (
            // <Disc className="h-6 w-6 text-white" />
            // <Close className="h-6 w-6 text-white" />
            <p></p>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            {/* {isCollapsed ? <ChevronRight /> : <ChevronLeft />} */}
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4 cursor-pointer" />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* MAIN ITEMS */}
          <div className="space-y-1">{items.map(renderItem)}</div>

          {/* ANALYTICS DROPDOWN */}
          <div>
            {/* Button */}
            <button
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
              className={`flex w-full items-center justify-between 
              rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-800/50
              ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <ChartBar className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="text-[15px] font-semibold">Analytics</span>
                )}
              </div>

              {!isCollapsed &&
                (analyticsOpen ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                ))}
            </button>

            {/* Dropdown content */}
            {analyticsOpen && !isCollapsed && (
              <div className="ml-6 mt-2 space-y-1">
                {analyticsItems.map((item) =>
                  renderItem({ ...item, icon: null })
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0a0a0a] 
        border-r border-gray-800 transition-transform duration-300 lg:hidden
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <Link to={"/releases"}>
            <div className="flex items-center gap-2 group cursor-pointer text-white">
              <ChevronLeft className="h-5 w-5" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">
                Back
              </span>
            </div>
          </Link>
          <button
            onClick={onCloseMobileMenu}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">{items.map(renderItem)}</div>

          {/* Analytics */}
          <div>
            <button
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-400 hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <ChartBar className="h-5 w-5" />
                <span className="text-[15px] font-semibold">Analytics</span>
              </div>
              {analyticsOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>

            {analyticsOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {analyticsItems.map((item) =>
                  renderItem({ ...item, icon: null })
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
