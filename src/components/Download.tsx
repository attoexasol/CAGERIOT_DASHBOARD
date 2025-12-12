// import { Download } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { releasesService } from "../lib/api/services/releases.service";
// import { tracksService } from "../lib/api/services/tracks.service";
// interface Props {
//   onCSV: () => void;
//   onXLSX: () => void;
//   onTXT: () => void;
//   onAssets: () => void;
//   onCoverArt: () => void;
// }

// export default function DownloadDropdown({
//   onCSV,
//   onXLSX,
//   onTXT,
//   onAssets,
//   onCoverArt,
// }: Props) {
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={menuRef}>
//       {/* BUTTON */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 shadow"
//       >
//         <Download className="w-5 h-5 text-white" />
//       </button>

//       {/* DROPDOWN */}
//       {open && (
//         <div
//           className="absolute right-0 mt-2 bg-gray-700 border border-gray-700 rounded-lg py-2 shadow-xl z-50"
//           style={{ width: "300px" }}
//         >
//           <button
//             onClick={() => {
//               setOpen(false);
//               onCSV();
//             }}
//             className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//           >
//             CSV Metadata
//           </button>

//           <button
//             onClick={() => {
//               setOpen(false);
//               onXLSX();
//             }}
//             className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//           >
//             XLSX Metadata
//           </button>

//           <button
//             onClick={() => {
//               setOpen(false);
//               onTXT();
//             }}
//             className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//           >
//             TXT Metadata
//           </button>

//           <button
//             onClick={() => {
//               setOpen(false);
//               onAssets();
//             }}
//             className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//           >
//             Assets
//           </button>

//           <button
//             onClick={() => {
//               setOpen(false);
//               onCoverArt();
//             }}
//             className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//           >
//             Cover Art
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// DownloadDropdown.tsx

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Download } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { releasesService } from "../lib/api/services/releases.service";
// import { tracksService } from "../lib/api/services/tracks.service";
// import { toast } from "sonner@2.0.3";

// interface Props {
//   releaseId?: string;
//   className?: string;
//   onDownloadStart?: () => void;
//   onDownloadComplete?: () => void;
// }

// export default function DownloadDropdown({
//   releaseId: releaseIdProp,
//   className,
//   onDownloadStart,
//   onDownloadComplete,
// }: Props) {
//   const params = useParams();
//   const releaseId = releaseIdProp ?? (params as any)?.id;

//   const [open, setOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement | null>(null);

//   const [release, setRelease] = useState<any | null>(null);
//   const [tracks, setTracks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   /* ----------------------------------------------------------
//      Load Release + Tracks
//      ---------------------------------------------------------- */
//   useEffect(() => {
//     async function load() {
//       if (!releaseId) return;
//       setLoading(true);

//       try {
//         const r = await releasesService.getById(releaseId);
//         const rel = r?.data ?? r ?? null;
//         setRelease(rel);

//         let trackIds: string[] = [];

//         if (Array.isArray(rel?.tracks)) {
//           if (typeof rel.tracks[0] === "string") {
//             trackIds = rel.tracks;
//           } else {
//             trackIds = rel.tracks
//               .map((t: any) => t.trackId ?? t.id ?? t.track ?? null)
//               .filter(Boolean);
//           }
//         }

//         const loaded: any[] = [];
//         for (const id of trackIds) {
//           try {
//             const tr = await tracksService.getByTrackId(id);
//             loaded.push(tr?.data ?? tr ?? null);
//           } catch {
//             console.warn("Failed track load:", id);
//           }
//         }

//         setTracks(loaded.filter(Boolean));
//       } catch (err) {
//         toast.error("Failed to load release or tracks");
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [releaseId]);

//   /* ----------------------------------------------------------
//      Click outside closes menu
//      ---------------------------------------------------------- */
//   useEffect(() => {
//     function handle(e: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handle);
//     return () => document.removeEventListener("mousedown", handle);
//   }, []);

//   /* ----------------------------------------------------------
//      CSV / XLSX / TXT Builders
//      ---------------------------------------------------------- */
//   function buildCSV(rows: Record<string, any>[]) {
//     if (!rows.length) return "";
//     const headers = Object.keys(rows[0]);

//     const escape = (v: any) => {
//       if (v == null) return "";
//       const s = String(v);
//       if (s.includes(",") || s.includes('"') || s.includes("\n")) {
//         return `"${s.replace(/"/g, '""')}"`;
//       }
//       return s;
//     };

//     const lines = [headers.join(",")];
//     rows.forEach((r) => {
//       lines.push(headers.map((h) => escape(r[h])).join(","));
//     });

//     return lines.join("\r\n");
//   }

//   function escapeXml(str: string) {
//     return str
//       .replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;");
//   }

//   function buildExcel(rows: Record<string, any>[]) {
//     const headers = Object.keys(rows[0] ?? {});
//     const headerRow =
//       "<Row>" +
//       headers.map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("") +
//       "</Row>";

//     const dataRows = rows
//       .map(
//         (r) =>
//           "<Row>" +
//           headers
//             .map(
//               (h) =>
//                 `<Cell><Data ss:Type="String">${escapeXml(
//                   r[h] != null ? String(r[h]) : ""
//                 )}</Data></Cell>`
//             )
//             .join("") +
//           "</Row>"
//       )
//       .join("");

//     return `<?xml version="1.0"?>
//       <?mso-application progid="Excel.Sheet"?>
//       <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
//         <Worksheet ss:Name="Sheet1">
//           <Table>
//             ${headerRow}
//             ${dataRows}
//           </Table>
//         </Worksheet>
//       </Workbook>`;
//   }

//   function buildTXT(release: any, tr: any[]) {
//     const lines: string[] = [];

//     lines.push(release.title ?? "Untitled");
//     lines.push(`Performed by: ${release.artistDisplayName ?? ""}`);
//     lines.push(`Label: ${release.label ?? ""}`);
//     lines.push(`UPC: ${release.barcode ?? ""}`);
//     lines.push("");
//     lines.push("TRACKS:");

//     tr.forEach((t, i) => {
//       lines.push(`${i + 1}`);
//       lines.push(t.title ?? "Untitled");
//       if (t.composers) lines.push(`Writer: ${t.composers}`);
//       if (t.performers?.length)
//         lines.push("Performed: " + t.performers.map((p: any) => p.name).join(", "));

//       lines.push("");
//     });

//     return lines.join("\r\n");
//   }

//   /* ----------------------------------------------------------
//      Flatten Track → Your required CSV/XLSX format
//      ---------------------------------------------------------- */
//   function flatten(track: any, index: number) {
//     return {
//       ReleaseType: release?.releaseType ?? "Single",
//       ReleaseId: release?._id ?? "",
//       AlbumUPC: release?.barcode ?? "",
//       AlbumId: release?._id ?? "",
//       AlbumArtist: release?.artistDisplayName ?? "",
//       AlbumTitle: release?.title ?? "",
//       AlbumTitleVersion: "",

//       DiscNumber: "00",
//       TrackNumber: index,

//       TrackId: track._id ?? track.id ?? "",
//       TrackTitle: track.title ?? "",
//       TrackTitleVersion: "",

//       TrackArtist: track.artistDisplayName ?? "",

//       TrackISRC: track.isrc ?? "",
//       TrackFileName: track.fileMetadata?.name ?? "",

//       Label: release?.label ?? "",
//       OriginalReleaseDate: release?.releaseDate?.split("T")[0] ?? "",
//       Category: release?.primaryGenre ?? "",
//       Duration:
//         track.duration ??
//         track.fileMetadata?.duration ??
//         track.audioVersions?.[0]?.fileMetadata?.duration ??
//         "",

//       PLineYear: release?.pYear ?? "",
//       PLineText: release?.pLine ?? "",

//       CLineYear: "",
//       CLineText: "",

//       AlbumPriceCode: "",
//       TrackPriceCode: "",

//       Territories: release?.rightsTerritories?.length ? "WW" : "",
//       ExcludedTerritories: release?.rightsTerritoriesExcluded?.join(",") ?? "",
//     };
//   }

//   /* ----------------------------------------------------------
//      Utility: download blob
//      ---------------------------------------------------------- */
//   function download(content: Blob | string, name: string, type: string) {
//     const blob =
//       typeof content === "string"
//         ? new Blob([content], { type })
//         : new Blob([content], { type });

//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");

//     a.href = url;
//     a.download = name;
//     a.click();

//     URL.revokeObjectURL(url);
//   }

//   /* ----------------------------------------------------------
//      Handlers
//      ---------------------------------------------------------- */
//   function handleCSV() {
//     if (!release || !tracks.length) return toast.error("No data");

//     const rows = tracks.map(flatten);
//     const csv = buildCSV(rows);

//     download(csv, `${release.title}_metadata.csv`, "text/csv;charset=utf-8;");
//     setOpen(false);
//   }

//   function handleXLSX() {
//     if (!release || !tracks.length) return toast.error("No data");

//     const rows = tracks.map(flatten);
//     const xml = buildExcel(rows);

//     download(xml, `${release.title}_metadata.xlsx`, "application/vnd.ms-excel");
//     setOpen(false);
//   }

//   function handleTXT() {
//     if (!release || !tracks.length) return toast.error("No data");

//     const txt = buildTXT(release, tracks);
//     download(txt, `${release.title}_metadata.txt`, "text/plain;charset=utf-8;");
//     setOpen(false);
//   }

//   async function handleCoverArt() {
//     if (!release) return toast.error("No release");

//     try {
//       const url = release.publicPackshot ?? release.coverArt;
//       if (!url) return toast.error("No cover art");

//       const res = await fetch(url);
//       const blob = await res.blob();
//       const ext = blob.type.split("/")[1] ?? "jpg";

//       download(blob, `${release.title}_cover.${ext}`, blob.type);
//     } catch {
//       toast.error("Failed cover download");
//     }

//     setOpen(false);
//   }

//   async function handleAssets() {
//     if (!release) return toast.error("No release");

//     try {
//       const JSZip = (await import("jszip")).default;
//       const { saveAs } = await import("file-saver");

//       const zip = new JSZip();

//       // cover
//       const coverUrl = release.publicPackshot ?? release.coverArt;
//       if (coverUrl) {
//         const r = await fetch(coverUrl);
//         const b = await r.blob();
//         const name = coverUrl.split("/").pop()?.split("?")[0] ?? "cover.jpg";
//         zip.file(`cover/${name}`, b);
//       }

//       // tracks
//       for (const t of tracks) {
//         const url =
//           t.publicFile ??
//           t.audioVersions?.find((v: any) => v.publicFile)?.publicFile ??
//           t.file ??
//           null;

//         if (url) {
//           const r = await fetch(url);
//           const b = await r.blob();

//           const base = url.split("/").pop()?.split("?")[0] ?? "audio.file";
//           const safeTitle = (t.title ?? "track").replace(/[^\w\- ]/g, "_");

//           zip.file(`audio/${safeTitle}_${base}`, b);
//         }
//       }

//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       saveAs(zipBlob, `${release.title}_assets.zip`);
//     } catch (err) {
//       console.error(err);
//       toast.error("ZIP creation failed");
//     }

//     setOpen(false);
//   }

//   /* ----------------------------------------------------------
//      UI
//      ---------------------------------------------------------- */
//   return (
//     <div className={`relative ${className ?? ""}`} ref={menuRef}>
//       <button
//         onClick={() => setOpen((p) => !p)}
//         className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 shadow"
//       >
//         <Download className="w-5 h-5 text-white" />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg py-2 shadow-xl z-50">
//           <div
//             className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//             onClick={handleCSV}
//           >
//             CSV Metadata
//           </div>

//           <div
//             className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//             onClick={handleXLSX}
//           >
//             XLSX Metadata
//           </div>

//           <div
//             className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//             onClick={handleTXT}
//           >
//             TXT Metadata
//           </div>

//           <div
//             className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//             onClick={handleAssets}
//           >
//             Assets (ZIP)
//           </div>

//           <div
//             className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
//             onClick={handleCoverArt}
//           >
//             Cover Art
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner@2.0.3";
import { releasesService } from "../lib/api/services/releases.service";
import { tracksService } from "../lib/api/services/tracks.service";

export default function DownloadDropdown() {
  const { id } = useParams();
  const releaseId = id;
 
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [release, setRelease] = useState<any | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    if (!releaseId) return;
    (async () => {
      try {
        const r = await releasesService.getById(releaseId);
        const rel = r?.data ?? r;
        setRelease(rel);
        console.log(r);
        let trackIds: string[] = rel?.tracks?.map((t: any) => t.trackId) ?? [];

        const loaded: any[] = [];
        for (const tid of trackIds) {
          try {
            const t = await tracksService.getByTrackId(tid);
            loaded.push(t?.data ?? t);
          } catch {
            console.warn("Track fetch failed:", tid);
          }
        }
        setTracks(loaded);
      } catch {
        toast.error("Failed to load release");
      }
    })();
  }, [releaseId]);

  // Close on outside click
  useEffect(() => {
    const f = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);

  /* -----------------------------------------
      CSV Export
  ------------------------------------------ */
  function flatten(track: any, index: number) {
    return {
      ReleaseType: release?.format ?? "Single",
      ReleaseId: release?._id ?? "",
      AlbumUPC: release?.barcode ?? "",
      AlbumId: release?._id ?? "",
      AlbumArtist: release?.artistDisplayName ?? "",
      AlbumTitle: release?.title ?? "",
      AlbumTitleVersion: "",
      DiscNumber: "00",
      TrackNumber: index + 1,
      TrackId: track._id ?? "",
      TrackTitle: track.title ?? "",
      TrackArtist: track.artistDisplayName ?? "",
      TrackISRC: track.isrc ?? "",
      TrackFileName: track.fileMetadata?.name ?? "",
      Label: release?.label ?? "",
      OriginalReleaseDate: release?.releaseDate?.split("T")[0] ?? "",
      Category: release?.primaryGenre ?? "",
      Duration: track.duration ?? track.fileMetadata?.duration ?? "",
      PLineYear: release?.pYear ?? "",
      PLineText: release?.pLine ?? "",
      Territories: release?.territories?.length ? "WW" : "",
      ExcludedTerritories: release?.territoriesExcluded?.join(",") ?? "",
    };
  }

  function handleCSV() {
    const rows = tracks.map(flatten);
    const header = Object.keys(rows[0]).join(",");
    const body = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([header + "\n" + body], {
      type: "text/csv;charset=utf-8;",
    });

    downloadFile(blob, `${release.title}_metadata.csv`);
    setOpen(false);
  }

  /* -----------------------------------------
      XLS (Excel XML) FIXED — NO SECURITY BLOCK
  ------------------------------------------ */
  function handleXLS() {
    const rows = tracks.map(flatten);
    const headers = Object.keys(rows[0]);

    const xml =
      `<?xml version="1.0"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
      <Worksheet ss:Name="Sheet1"><Table>` +
      `<Row>` +
      headers
        .map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`)
        .join("") +
      `</Row>` +
      rows
        .map(
          (r) =>
            `<Row>` +
            headers
              .map(
                (h) =>
                  `<Cell><Data ss:Type="String">${String(
                    r[h] ?? ""
                  )}</Data></Cell>`
              )
              .join("") +
            `</Row>`
        )
        .join("") +
      `</Table></Worksheet></Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });

    downloadFile(blob, `${release.title}_metadata.xls`);
    setOpen(false);
  }

  /* -----------------------------------------
      TXT
  ------------------------------------------ */
  function handleTXT() {
    const txt =
      `${release.title}\n` +
      `Artist: ${release.artistDisplayName}\n` +
      `Label: ${release.label}\n\nTRACKS:\n\n` +
      tracks
        .map(
          (t, i) =>
            `${i + 1}. ${t.title}\nWriter: ${
              t.composers ?? "-"
            }\nPerformed: ${t.performers?.map((p: any) => p.name).join(", ")}\n`
        )
        .join("\n");

    const blob = new Blob([txt], { type: "text/plain" });

    downloadFile(blob, `${release.title}_metadata.txt`);
    setOpen(false);
  }

  /* -----------------------------------------
      COVER ART FIX — FOLLOW REDIRECT
  ------------------------------------------ */
  async function handleCoverArt() {
    try {
      const url =
        release.publicPackshot || release.packshot || release.coverArt || null;
      console.log(url);

      if (!url) return toast.error("No cover art found");

      const res = await fetch(url, { redirect: "follow" });
      console.log(res);

      if (!res.ok) return toast.error("Cover fetch failed");

      const blob = await res.blob();
      downloadFile(blob, `${release.title}_cover.${blob.type.split("/")[1]}`);
    } catch {
      toast.error("Failed cover download");
    }
    setOpen(false);
  }

  /* -----------------------------------------
      ZIP FIX — IGNORE FAILED FETCHES
  ------------------------------------------ */
  async function handleAssets() {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // cover
      const coverURL =
        release.publicPackshot || release.packshot || release.coverArt;
      if (coverURL) {
        try {
          const r = await fetch(coverURL, { redirect: "follow" });
          zip.file("cover/cover.jpg", await r.blob());
        } catch {}
      }

      // audio files
      for (const t of tracks) {
        let url =
          t.publicFile ||
          t.audioVersions?.find((v: any) => v.publicFile)?.publicFile ||
          null;

        if (!url) continue;

        try {
          const r = await fetch(url, { redirect: "follow" });
          if (!r.ok) continue;

          const blob = await r.blob();
          const safe = t.title.replace(/[^\w\- ]/g, "_");

          zip.file(`audio/${safe}.audio`, blob);
        } catch {}
      }

      const blob = await zip.generateAsync({ type: "blob" });
      downloadFile(blob, `${release.title}_assets.zip`);
    } catch {
      toast.error("ZIP creation failed");
    }
    setOpen(false);
  }

  /* -----------------------------------------
      UTILITY
  ------------------------------------------ */
  function downloadFile(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
  }

  /* -----------------------------------------
      UI
  ------------------------------------------ */
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 shadow"
      >
        <Download className="w-5 h-5 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg py-2 shadow-xl z-50">
          <div
            onClick={handleCSV}
            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
          >
            CSV
          </div>
          <div
            onClick={handleXLS}
            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
          >
            XLS
          </div>
          <div
            onClick={handleTXT}
            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
          >
            TXT
          </div>
          <div
            onClick={handleAssets}
            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
          >
            Assets ZIP
          </div>
          <div
            onClick={handleCoverArt}
            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
          >
            Cover Art
          </div>
        </div>
      )}
    </div>
  );
}
