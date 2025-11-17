
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { releasesService } from "../lib/api/services/releases.service";
import { Release } from "../lib/api/types";

export default function ReleaseDetailLayout() {
  const { id } = useParams();
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    releasesService.getById(id!).then(setRelease);
  }, [id]);

  if (!release) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="flex h-full bg-white text-black">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r bg-gray-50 p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4">Catalog</h2>

        {[
          { label: "Overview", link: "overview" },
          { label: "Metadata", link: "metadata" },
          { label: "Tracks", link: "tracks" },
          { label: "Distribution", link: "distribution" },
        ].map((item) => (
          <NavLink
            key={item.link}
            to={item.link}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        {/* Analytics Group */}
        <details className="mt-4">
          <summary className="px-3 py-2 cursor-pointer rounded hover:bg-gray-100">
            Analytics
          </summary>

          <div className="pl-4 mt-2 space-y-2">
            <NavLink to="analytics/consumption" className="block px-2 py-1">
              Consumption
            </NavLink>
            <NavLink to="analytics/engagement" className="block px-2 py-1">
              Engagement
            </NavLink>
            <NavLink to="analytics/revenue" className="block px-2 py-1">
              Revenue
            </NavLink>
            <NavLink to="analytics/geo" className="block px-2 py-1">
              Geo
            </NavLink>
          </div>
        </details>
      </aside>

      {/* RIGHT PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* All sub-pages load here */}
      </main>
    </div>
  );
}
