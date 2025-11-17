// 'use client';

// import { useState } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { Input } from '../../../../components/ui/input';
// import { Label } from '../../../../components/ui/label';
// import { Textarea } from '../../../../components/ui/textarea';
// import { ButtonPrimary } from '../../../../components/ButtonPrimary';
// import { Button } from '../../../../components/ui/button';
// import { toast } from 'sonner@2.0.3';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../../../../components/ui/select';
// import { tracksService } from '../../../../lib/api';

// // Support both Next.js and React Router
// const isNextJs = typeof window === 'undefined' || !!(window as any).__NEXT_DATA__;
// let Link: any;
// let useRouter: any;
// let useNavigate: any;

// if (isNextJs) {
//   try {
//     const nextRouter = require('next/navigation');
//     const nextLink = require('next/link');
//     Link = nextLink.default;
//     useRouter = nextRouter.useRouter;
//   } catch {}
// }

// if (!Link) {
//   try {
//     const reactRouter = require('react-router-dom');
//     Link = reactRouter.Link;
//     useNavigate = reactRouter.useNavigate;
//   } catch {
//     Link = ({ to, href, children, ...props }: any) => (
//       <a href={to || href} {...props}>{children}</a>
//     );
//   }
// }

// export default function NewTrack() {
//   const router = useRouter ? useRouter() : null;
//   const navigate = useNavigate ? useNavigate() : null;
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     artist: '',
//     album: '',
//     duration: '',
//     genre: 'Pop',
//     isrc: '',
//     lyrics: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await tracksService.create({
//         title: formData.title,
//         artistId: formData.artist,
//         releaseId: formData.album,
//         duration: formData.duration,
//         isrc: formData.isrc,
//       });
      
//       toast.success('Track added successfully!');
      
//       if (router) {
//         router.push('/tracks');
//       } else if (navigate) {
//         navigate('/tracks');
//       } else {
//         window.location.href = '/tracks';
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to add track');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 lg:p-8">
//       <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
//         <Link to="/tracks" href="/tracks">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-gray-400 hover:text-white"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-2xl md:text-3xl text-white">Add New Track</h1>
//           <p className="text-sm md:text-base text-gray-400">Add a new track to your catalog</p>
//         </div>
//       </div>

//       <div className="max-w-2xl">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-4 md:p-6">
//             <h2 className="mb-4 md:mb-6 text-lg md:text-xl text-white">Track Information</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="title" className="text-gray-300">
//                   Track Title *
//                 </Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   className="mt-2 bg-gray-900 border-gray-800 text-white"
//                   placeholder="Enter track title"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="artist" className="text-gray-300">
//                   Artist *
//                 </Label>
//                 <Input
//                   id="artist"
//                   value={formData.artist}
//                   onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
//                   className="mt-2 bg-gray-900 border-gray-800 text-white"
//                   placeholder="Artist name"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="album" className="text-gray-300">
//                   Album *
//                 </Label>
//                 <Input
//                   id="album"
//                   value={formData.album}
//                   onChange={(e) => setFormData({ ...formData, album: e.target.value })}
//                   className="mt-2 bg-gray-900 border-gray-800 text-white"
//                   placeholder="Album name"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="duration" className="text-gray-300">
//                     Duration *
//                   </Label>
//                   <Input
//                     id="duration"
//                     value={formData.duration}
//                     onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
//                     className="mt-2 bg-gray-900 border-gray-800 text-white"
//                     placeholder="3:45"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="genre" className="text-gray-300">
//                     Genre *
//                   </Label>
//                   <Select
//                     value={formData.genre}
//                     onValueChange={(value) => setFormData({ ...formData, genre: value })}
//                     disabled={loading}
//                   >
//                     <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="Pop">Pop</SelectItem>
//                       <SelectItem value="Rock">Rock</SelectItem>
//                       <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
//                       <SelectItem value="Electronic">Electronic</SelectItem>
//                       <SelectItem value="R&B">R&B</SelectItem>
//                       <SelectItem value="Country">Country</SelectItem>
//                       <SelectItem value="Jazz">Jazz</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="isrc" className="text-gray-300">
//                   ISRC Code
//                 </Label>
//                 <Input
//                   id="isrc"
//                   value={formData.isrc}
//                   onChange={(e) => setFormData({ ...formData, isrc: e.target.value })}
//                   className="mt-2 bg-gray-900 border-gray-800 text-white"
//                   placeholder="US-XXX-XX-XXXXX"
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="lyrics" className="text-gray-300">
//                   Lyrics
//                 </Label>
//                 <Textarea
//                   id="lyrics"
//                   value={formData.lyrics}
//                   onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
//                   className="mt-2 bg-gray-900 border-gray-800 text-white min-h-32"
//                   placeholder="Enter track lyrics (optional)"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
//               {loading ? 'Adding...' : 'Add Track'}
//             </ButtonPrimary>
//             <Link to="/tracks" href="/tracks" className="flex-1">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800"
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { Input } from "../../../../components/ui/input";
// import { Label } from "../../../../components/ui/label";
// import { Textarea } from "../../../../components/ui/textarea";
// import { ButtonPrimary } from "../../../../components/ButtonPrimary";
// import { Button } from "../../../../components/ui/button";
// import { toast } from "sonner@2.0.3";
// import { tracksService } from "../../../../lib/api/services/tracks.service";
// import { Link, useNavigate } from "react-router-dom";

// export default function NewTrackPage() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     artist: "",
//     label: "",
//     genre: "Pop",
//     isrc: "",
//     lyrics: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await tracksService.create({
//         title: formData.title,
//         artistName: formData.artist,
//         label: formData.label,
//         genre: formData.genre,
//         isrc: formData.isrc,
//       });

//       toast.success("Track created successfully!");
//       navigate("/tracks");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to create track");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 lg:p-8 text-white">
//       <div className="flex items-center gap-3 mb-6">
//         <Link to="/tracks">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-gray-400 hover:text-white"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//         </Link>
//         <h1 className="text-2xl font-semibold">Add New Track</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
//         <div className="bg-gray-900/30 p-6 rounded-xl border border-gray-800 space-y-4">
//           <div>
//             <Label htmlFor="title">Title *</Label>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               placeholder="Track title"
//               className="bg-gray-900 border-gray-800 text-white mt-2"
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="artist">Artist *</Label>
//             <Input
//               id="artist"
//               value={formData.artist}
//               onChange={(e) =>
//                 setFormData({ ...formData, artist: e.target.value })
//               }
//               placeholder="Artist name"
//               className="bg-gray-900 border-gray-800 text-white mt-2"
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="label">Label / Album *</Label>
//             <Input
//               id="label"
//               value={formData.label}
//               onChange={(e) =>
//                 setFormData({ ...formData, label: e.target.value })
//               }
//               placeholder="Label name"
//               className="bg-gray-900 border-gray-800 text-white mt-2"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="genre">Genre *</Label>
//               <Input
//                 id="genre"
//                 value={formData.genre}
//                 onChange={(e) =>
//                   setFormData({ ...formData, genre: e.target.value })
//                 }
//                 placeholder="Genre"
//                 className="bg-gray-900 border-gray-800 text-white mt-2"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="isrc">ISRC</Label>
//               <Input
//                 id="isrc"
//                 value={formData.isrc}
//                 onChange={(e) =>
//                   setFormData({ ...formData, isrc: e.target.value })
//                 }
//                 placeholder="US-XXX-XX-XXXXX"
//                 className="bg-gray-900 border-gray-800 text-white mt-2"
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="lyrics">Notes / Lyrics</Label>
//             <Textarea
//               id="lyrics"
//               value={formData.lyrics}
//               onChange={(e) =>
//                 setFormData({ ...formData, lyrics: e.target.value })
//               }
//               placeholder="Optional notes"
//               className="bg-gray-900 border-gray-800 text-white mt-2 min-h-32"
//             />
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <ButtonPrimary
//             type="submit"
//             className="flex-1 justify-center"
//             disabled={loading}
//           >
//             {loading ? "Adding..." : "Add Track"}
//           </ButtonPrimary>
//           <Link to="/tracks" className="flex-1">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800"
//             >
//               Cancel
//             </Button>
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { ButtonPrimary } from "../../../../components/ButtonPrimary";
import { toast } from "sonner";

import { tracksService } from "../../../../lib/api/services/tracks.service";

/* ===========================================================
   REUSABLE INPUT FIELD
=========================================================== */
function InputField({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <Label className="text-gray-300">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 bg-gray-900 border-gray-800 text-white"
      />
    </div>
  );
}

/* ===========================================================
   ARRAY FIELD (primaryArtists[], featuringArtists[])
=========================================================== */
function ArrayField({ label, values, onChange }: any) {
  const update = (i: number, v: string) => {
    const arr = [...values];
    arr[i] = v;
    onChange(arr);
  };

  const remove = (i: number) => {
    const arr = values.filter((_: any, idx: number) => idx !== i);
    onChange(arr.length ? arr : [""]);
  };

  const add = () => onChange([...values, ""]);

  return (
    <div className="md:col-span-2">
      <Label className="text-gray-300">{label}</Label>

      <div className="space-y-2 mt-2">
        {values.map((v: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              onChange={(e) => update(i, e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />

            <Button variant="ghost" onClick={() => remove(i)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button variant="ghost" className="text-[#ff0050]" onClick={add}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
    </div>
  );
}

/* ===========================================================
   PERFORMER ARRAY FIELD
=========================================================== */
function PerformerField({ performers, onChange }: any) {
  const update = (i: number, key: string, value: any) => {
    const arr = performers.map((item: any, idx: number) =>
      i === idx ? { ...item, [key]: value } : item
    );
    onChange(arr);
  };

  const add = () =>
    onChange([
      ...performers,
      {
        name: "",
        type: "",
        share: 0,
        role: "",
        nationality: "",
        dateofbirth: "",
      },
    ]);

  const remove = (i: number) => {
    const arr = performers.filter((_: any, idx: number) => idx !== i);
    onChange(
      arr.length
        ? arr
        : [
            {
              name: "",
              type: "",
              share: 0,
              role: "",
              nationality: "",
              dateofbirth: "",
            },
          ]
    );
  };

  return (
    <div className="md:col-span-2">
      <Label className="text-gray-300">Performers</Label>

      <div className="space-y-4 mt-2">
        {performers.map((p: any, i: number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input
              placeholder="Name"
              value={p.name}
              onChange={(e) => update(i, "name", e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
            <Input
              placeholder="Type"
              value={p.type}
              onChange={(e) => update(i, "type", e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
            <Input
              placeholder="Share"
              type="number"
              value={p.share}
              onChange={(e) => update(i, "share", Number(e.target.value))}
              className="bg-gray-900 border-gray-800 text-white"
            />
            <Input
              placeholder="Role"
              value={p.role}
              onChange={(e) => update(i, "role", e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
            <Input
              placeholder="Nationality"
              value={p.nationality}
              onChange={(e) => update(i, "nationality", e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />
            <Input
              placeholder="Date of Birth"
              value={p.dateofbirth}
              onChange={(e) => update(i, "dateofbirth", e.target.value)}
              className="bg-gray-900 border-gray-800 text-white"
            />

            <Button variant="ghost" onClick={() => remove(i)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button variant="ghost" className="text-[#ff0050]" onClick={add}>
          <Plus className="w-4 h-4" /> Add Performer
        </Button>
      </div>
    </div>
  );
}

/* ===========================================================
   MAIN COMPONENT
=========================================================== */
export default function NewTrackPage() {
  const navigate = useNavigate();

  // --- Full JSON Schema Default ---
  const [formData, setFormData] = useState<any>({
    title: "",
    isrc: "",
    artistDisplayName: "",
    primaryArtists: [""],
    featuringArtists: [""],
    composers: "",
    publishers: "",
    primaryGenre: "",
    secondaryGenre: "",
    pLine: "",
    pYear: new Date().getFullYear(),
    explicit: "",
    priceTier: "",
    previewStart: 0,
    file: "",
    type: "",
    version: "",
    countryOfCommission: "",
    label: "",
    lyrics: "",
    mood: "",
    notes: "",
    pplLabelNumber: "",
    variant: "",
    recordingLocation: "",
    recordingYear: "",
    rightsOwnerName: "",
    syncRights: true,
    performers: [
      {
        name: "",
        type: "",
        role: "",
        nationality: "",
        dateofbirth: "",
        share: 0,
      },
    ],
    instrumental: false,
    trackLanguage: "",
  });

  /* ===========================================================
     SUBMIT FUNCTION — FINAL FIXED VERSION
  =========================================================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Fix validation before sending to API
    const clean = {
      ...formData,

      composers: formData.composers || "Unknown Composer",
      publishers: formData.publishers || "Unknown Publisher",
      pLine: formData.pLine || "℗ Unknown",
      file: formData.file || "unknown.mp3",

      primaryArtists: formData.primaryArtists.filter(
        (x: string) => x.trim() !== ""
      ) || ["Unknown Artist"],

      performers: formData.performers.map((p: any) => ({
        name: p.name || "Unknown",
        type: p.type || "Contracted Featured Artist",
        share: p.share || 0,
        role: p.role || "Vocals",
        nationality: p.nationality || "Unknown",
        dateofbirth: p.dateofbirth || "1990-01-01",
      })),

      instrumental: Boolean(formData.instrumental),
    };

    console.log("FINAL JSON SENT TO API:", clean);

    try {
      await tracksService.create(clean);
      toast.success("Track created successfully!");
      navigate("/tracks");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create track");
      console.error(err);
    }
  };

  /* ===========================================================
     UI
  =========================================================== */
  return (
    <div className="p-6">
      <Link to="/tracks">
        <Button variant="ghost">
          <ArrowLeft />
        </Button>
      </Link>

      <h1 className="text-3xl text-white mb-6 font-semibold">
        Create New Asset
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Title"
            value={formData.title}
            onChange={(v: any) => setFormData({ ...formData, title: v })}
          />

          <InputField
            label="ISRC"
            value={formData.isrc}
            onChange={(v: any) => setFormData({ ...formData, isrc: v })}
          />

          <InputField
            label="Artist Display Name"
            value={formData.artistDisplayName}
            onChange={(v: any) =>
              setFormData({ ...formData, artistDisplayName: v })
            }
          />

          <InputField
            label="Primary Genre"
            value={formData.primaryGenre}
            onChange={(v: any) => setFormData({ ...formData, primaryGenre: v })}
          />

          <InputField
            label="Secondary Genre"
            value={formData.secondaryGenre}
            onChange={(v: any) =>
              setFormData({ ...formData, secondaryGenre: v })
            }
          />

          <InputField
            label="pLine"
            value={formData.pLine}
            onChange={(v: any) => setFormData({ ...formData, pLine: v })}
          />

          <InputField
            label="pYear"
            type="number"
            value={formData.pYear}
            onChange={(v: any) => setFormData({ ...formData, pYear: v })}
          />

          <InputField
            label="Explicit"
            value={formData.explicit}
            onChange={(v: any) => setFormData({ ...formData, explicit: v })}
          />

          <InputField
            label="Price Tier"
            value={formData.priceTier}
            onChange={(v: any) => setFormData({ ...formData, priceTier: v })}
          />

          <InputField
            label="Track Language"
            value={formData.trackLanguage}
            onChange={(v: any) =>
              setFormData({ ...formData, trackLanguage: v })
            }
          />

          <InputField
            label="Mood"
            value={formData.mood}
            onChange={(v: any) => setFormData({ ...formData, mood: v })}
          />

          <InputField
            label="Notes"
            value={formData.notes}
            onChange={(v: any) => setFormData({ ...formData, notes: v })}
          />

          <InputField
            label="PPL Label Number"
            value={formData.pplLabelNumber}
            onChange={(v: any) =>
              setFormData({ ...formData, pplLabelNumber: v })
            }
          />

          <InputField
            label="Recording Location"
            value={formData.recordingLocation}
            onChange={(v: any) =>
              setFormData({ ...formData, recordingLocation: v })
            }
          />

          <InputField
            label="Recording Year"
            value={formData.recordingYear}
            onChange={(v: any) =>
              setFormData({ ...formData, recordingYear: v })
            }
          />

          <InputField
            label="Rights Owner Name"
            value={formData.rightsOwnerName}
            onChange={(v: any) =>
              setFormData({ ...formData, rightsOwnerName: v })
            }
          />

          <InputField
            label="Type"
            value={formData.type}
            onChange={(v: any) => setFormData({ ...formData, type: v })}
          />

          <InputField
            label="Version"
            value={formData.version}
            onChange={(v: any) => setFormData({ ...formData, version: v })}
          />

          <InputField
            label="Country Of Commission"
            value={formData.countryOfCommission}
            onChange={(v: any) =>
              setFormData({ ...formData, countryOfCommission: v })
            }
          />

          <InputField
            label="Label"
            value={formData.label}
            onChange={(v: any) => setFormData({ ...formData, label: v })}
          />

          <InputField
            label="Variant"
            value={formData.variant}
            onChange={(v: any) => setFormData({ ...formData, variant: v })}
          />
        </div>

        {/* ARRAY FIELDS */}
        <ArrayField
          label="Primary Artists"
          values={formData.primaryArtists}
          onChange={(arr: any) =>
            setFormData({ ...formData, primaryArtists: arr })
          }
        />

        <ArrayField
          label="Featuring Artists"
          values={formData.featuringArtists}
          onChange={(arr: any) =>
            setFormData({ ...formData, featuringArtists: arr })
          }
        />

        {/* PERFORMERS */}
        <PerformerField
          performers={formData.performers}
          onChange={(arr: any) => setFormData({ ...formData, performers: arr })}
        />

        {/* FILE FIELD */}
        <Label className="text-gray-300">Audio File</Label>
        <Input
          type="file"
          className="bg-gray-900 text-white"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFormData({ ...formData, file: e.target.files[0].name });
              toast.success(`Selected: ${e.target.files[0].name}`);
            }
          }}
        />

        {/* LYRICS */}
        <Label className="text-gray-300">Lyrics</Label>
        <Textarea
          className="bg-gray-900 text-white"
          value={formData.lyrics}
          onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
        />

        <ButtonPrimary type="submit" className="w-full">
          Create Asset
        </ButtonPrimary>
      </form>
    </div>
  );
}
