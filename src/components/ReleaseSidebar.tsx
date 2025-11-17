import { NavLink, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
export function ReleaseSidebar() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-64 bg-[#0d0d0d] border-r border-gray-800 p-5 overflow-y-auto">
      <Link to={"/releases"}>
        <h2 className="text-xl font-semibold mb-6 text-gray-100 cursor-pointer">
          <ChevronLeft />
        </h2>
      </Link>

      <nav className="space-y-1">
        <NavItem label="Overview" to={`/releases/${id}/overview`} />
        <NavItem label="Metadata" to={`/releases/${id}/metadata`} />
        <NavItem label="Tracks" to={`/releases/${id}/tracks`} />
        <NavItem label="Distribution" to={`/releases/${id}/distribution`} />
        <NavItem label="Track Splits" to={`/releases/${id}/track-splits`} />

        {/* DROPDOWN */}
        <button
          onClick={() => setOpen(!open)}
          className="flex justify-between w-full px-3 py-2 text-gray-300 hover:bg-[#1a1a1a] rounded-md"
        >
          Analytics
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {open && (
          <div className="ml-4 mt-1 space-y-1">
            <NavItem
              label="Consumption"
              to={`/releases/${id}/analytics/consumption`}
            />
            <NavItem
              label="Engagement"
              to={`/releases/${id}/analytics/engagement`}
            />
            <NavItem label="Revenue" to={`/releases/${id}/analytics/revenue`} />
            <NavItem label="Geo" to={`/releases/${id}/analytics/geo`} />
          </div>
        )}
      </nav>
    </aside>
  );
}

function NavItem({ label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md ${
          isActive
            ? "bg-[#ff0050]/20 text-[#ff0050]"
            : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white text-[15px] font-semibold"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
