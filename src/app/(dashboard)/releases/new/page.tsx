// "use client";

// import { ArrowLeft } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner@2.0.3";
// import { ButtonPrimary } from "../../../../components/ButtonPrimary";
// import { Button } from "../../../../components/ui/button";
// import { Input } from "../../../../components/ui/input";
// import { Label } from "../../../../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../components/ui/select";
// import { Textarea } from "../../../../components/ui/textarea";
// import { releasesService } from "../../../../lib/api";
// import { logger } from "../../../../lib/logger";

// // Router handling for Next.js or React Router
// const isNextJs =
//   typeof window === "undefined" || !!(window as any).__NEXT_DATA__;
// let Link: any;
// let useRouter: any;
// let useNavigate: any;

// if (isNextJs) {
//   try {
//     const nextRouter = require("next/navigation");
//     const nextLink = require("next/link");
//     Link = nextLink.default;
//     useRouter = nextRouter.useRouter;
//   } catch {}
// }

// if (!Link) {
//   try {
//     const reactRouter = require("react-router-dom");
//     Link = reactRouter.Link;
//     useNavigate = reactRouter.useNavigate;
//   } catch {
//     Link = ({ to, href, children, ...props }: any) => (
//       <a href={to || href} {...props}>
//         {children}
//       </a>
//     );
//   }
// }

// export default function NewRelease() {
//   const router = useRouter ? useRouter() : null;
//   const navigate = useNavigate ? useNavigate() : null;

//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     catNo: "",
//     barcode: "",
//     primaryArtists: "",
//     featuringArtists: "",
//     territories: "",
//     artistDisplayName: "",
//     primaryGenre: "",
//     cLine: "",
//     cYear: new Date().getFullYear(),
//     pLine: "",
//     pYear: new Date().getFullYear(),
//     label: "",
//     format: "Single",
//     releaseDate: "",
//     originalReleaseDate: "",
//     packshot: "",
//   });

//   // Convert date to ISO YYYY-MM-DD
//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return undefined;
//     const d = new Date(dateStr);
//     if (isNaN(d.getTime())) return undefined;
//     return d.toISOString().split("T")[0];
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Prepare payload
//       const payload = {
//         title: formData.title,
//         catNo: formData.catNo || undefined,
//         barcode: formData.barcode || undefined,
//         primaryArtists: formData.primaryArtists
//           ? formData.primaryArtists.split(",").map((s) => s.trim())
//           : [],
//         featuringArtists: formData.featuringArtists
//           ? formData.featuringArtists.split(",").map((s) => s.trim())
//           : [],
//         territories: formData.territories
//           ? formData.territories.split(",").map((s) => s.trim().toUpperCase())
//           : [],
//         artistDisplayName: formData.artistDisplayName || undefined,
//         primaryGenre: formData.primaryGenre || undefined,
//         cLine: formData.cLine || undefined,
//         cYear: Number(formData.cYear) || new Date().getFullYear(),
//         pLine: formData.pLine || undefined,
//         pYear: Number(formData.pYear) || new Date().getFullYear(),
//         label: formData.label || undefined,
//         format: formData.format || "Single",
//         releaseDate: formatDate(formData.releaseDate),
//         originalReleaseDate: formatDate(formData.originalReleaseDate),
//         packshot: formData.packshot || undefined,
//       };

//       console.log("Payload sent to API:", payload);

//       const data = await releasesService.create(payload);
//       logger.log("Release created:", data);
//       toast.success("Release created successfully!");

//       if (router) router.push("/releases");
//       else if (navigate) navigate("/releases");
//       else window.location.href = "/releases";
//     } catch (error: any) {
//       logger.error("Create release failed:", error.message || error);
//       toast.error(error.message || "Failed to create release");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-8">
//       {/* Header */}
//       <div className="mb-6 flex items-center gap-3 ">
//         <Link to="/releases" href="/releases">
//           <Button variant="ghost" size="icon" className="text-gray-400">
//             <ArrowLeft className="h-5 w-5 " />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-2xl md:text-3xl text-white font-semibold">
//             Create New Release
//           </h1>
//           <p className="text-gray-400 text-sm md:text-base">
//             Add a new release to your catalog
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="max-w-3xl mx-auto">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
//             <h2 className="mb-6 text-xl text-white">Release Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <InputField
//                 label="Title *"
//                 name="title"
//                 value={formData.title}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Catalog No"
//                 name="catNo"
//                 value={formData.catNo}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Barcode"
//                 name="barcode"
//                 value={formData.barcode}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Artist Display Name"
//                 name="artistDisplayName"
//                 value={formData.artistDisplayName}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Primary Artists (comma separated)"
//                 name="primaryArtists"
//                 value={formData.primaryArtists}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Featuring Artists (comma separated)"
//                 name="featuringArtists"
//                 value={formData.featuringArtists}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Territories (comma separated)"
//                 name="territories"
//                 value={formData.territories}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Primary Genre"
//                 name="primaryGenre"
//                 value={formData.primaryGenre}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Label"
//                 name="label"
//                 value={formData.label}
//                 setFormData={setFormData}
//                 loading={loading}
//               />

//               {/* Format */}
//               <div>
//                 <Label className="text-gray-300">Format *</Label>
//                 <Select
//                   value={formData.format}
//                   onValueChange={(value: any) =>
//                     setFormData({ ...formData, format: value })
//                   }
//                   disabled={loading}
//                 >
//                   <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-gray-800 border-gray-700">
//                     <SelectItem value="Single">Single</SelectItem>
//                     <SelectItem value="Album">Album</SelectItem>
//                     <SelectItem value="EP">EP</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <InputField
//                 label="Release Date *"
//                 name="releaseDate"
//                 type="date"
//                 value={formData.releaseDate}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="Original Release Date"
//                 name="originalReleaseDate"
//                 type="date"
//                 value={formData.originalReleaseDate}
//                 setFormData={setFormData}
//                 loading={loading}
//               />

//               <InputField
//                 label="© Line"
//                 name="cLine"
//                 value={formData.cLine}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="© Year"
//                 name="cYear"
//                 type="number"
//                 value={formData.cYear}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="℗ Line"
//                 name="pLine"
//                 value={formData.pLine}
//                 setFormData={setFormData}
//                 loading={loading}
//               />
//               <InputField
//                 label="℗ Year"
//                 name="pYear"
//                 type="number"
//                 value={formData.pYear}
//                 setFormData={setFormData}
//                 loading={loading}
//               />

//               <div className="md:col-span-2">
//                 <Label className="text-gray-300">Packshot (Base64)</Label>
//                 <Textarea
//                   value={formData.packshot}
//                   onChange={(e) =>
//                     setFormData({ ...formData, packshot: e.target.value })
//                   }
//                   placeholder="Paste Base64 encoded image string"
//                   disabled={loading}
//                   className="mt-2 bg-gray-900 border-gray-800 text-white resize-none"
//                   style={{
//                     height: "5rem",
//                     minHeight: "5rem",
//                     maxHeight: "5rem",
//                     overflow: "hidden",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <ButtonPrimary
//               type="submit"
//               className="flex-1 justify-center"
//               disabled={loading}
//             >
//               {loading ? "Creating..." : "Create Release"}
//             </ButtonPrimary>
//             <Link to="/releases" href="/releases" className="flex-1">
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

// // Reusable input field component
// function InputField({
//   label,
//   name,
//   type = "text",
//   value,
//   setFormData,
//   loading,
// }: {
//   label: string;
//   name: string;
//   type?: string;
//   value: any;
//   setFormData: any;
//   loading: boolean;
// }) {
//   return (
//     <div className="w-full">
//       <Label htmlFor={name} className="text-gray-300">
//         {label}
//       </Label>
//       <Input
//         id={name}
//         type={type}
//         value={value}
//         onChange={(e) =>
//           setFormData((prev: any) => ({ ...prev, [name]: e.target.value }))
//         }
//         className="mt-2 bg-gray-900 border-gray-800 text-white"
//         disabled={loading}
//       />
//     </div>
//   );
// }




"use client";

import { ArrowLeft, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { ButtonPrimary } from "../../../../components/ButtonPrimary";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { releasesService } from "../../../../lib/api";

const isNextJs =
  typeof window === "undefined" || !!(window as any).__NEXT_DATA__;
let Link: any;
let useRouter: any;
let useNavigate: any;

if (isNextJs) {
  try {
    const nextRouter = require("next/navigation");
    const nextLink = require("next/link");
    Link = nextLink.default;
    useRouter = nextRouter.useRouter;
  } catch {}
}

if (!Link) {
  try {
    const reactRouter = require("react-router-dom");
    Link = reactRouter.Link;
    useNavigate = reactRouter.useNavigate;
  } catch {
    Link = ({ to, href, children, ...props }: any) => (
      <a href={to || href} {...props}>
        {children}
      </a>
    );
  }
}

export default function NewRelease() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;

  const initialState = {
    title: "",
    catNo: "",
    barcode: "",
    primaryArtists: [] as string[],
    featuringArtists: [] as string[],
    territories: [] as string[],
    artistDisplayName: "",
    primaryGenre: "",
    cLine: "",
    cYear: new Date().getFullYear(),
    pLine: "",
    pYear: new Date().getFullYear(),
    label: "",
    format: "Single",
    releaseDate: "",
    originalReleaseDate: "",
    packshot: "",
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [packshotName, setPackshotName] = useState<string>("");

  // handle image upload
  const handlePackshotUpload = (file: File) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      img.src = e.target.result as string;

      img.onload = () => {
        if (img.width !== img.height) {
          toast.error("Packshot must be square!");
          return;
        }
        setFormData((prev) => ({
          ...prev,
          packshot: e.target?.result as string,
        }));
        setPackshotName(file.name);
        toast.success("Packshot uploaded!");
      };
    };

    reader.readAsDataURL(file);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        catNo: formData.catNo || undefined,
        barcode: formData.barcode || undefined,
        primaryArtists: formData.primaryArtists.map((s) => s.trim()),
        featuringArtists: formData.featuringArtists.map((s) => s.trim()),
        territories: formData.territories.map((s) => s.trim().toUpperCase()),
        artistDisplayName: formData.artistDisplayName || undefined,
        primaryGenre: formData.primaryGenre || undefined,
        cLine: formData.cLine || undefined,
        cYear: Number(formData.cYear),
        pLine: formData.pLine || undefined,
        pYear: Number(formData.pYear),
        label: formData.label || undefined,
        format: formData.format || "Single",
        releaseDate: formatDate(formData.releaseDate),
        originalReleaseDate: formatDate(formData.originalReleaseDate),
        packshot: formData.packshot || undefined,
      };

      console.log("Payload sent to API:", payload);

      const data = await releasesService.create(payload);
      console.log("✅ Release created:", data);
      toast.success("Release created successfully!");

      // ✅ Reset form after success
      setFormData(initialState);
      setPackshotName("");
    } catch (error: any) {
      console.error("❌ Create release failed:", error.message || error);
      toast.error(error.message || "Failed to create release");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link to="/releases" href="/releases">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl text-white font-semibold">
            Create New Release
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Add a new release to your catalog
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Release Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Title *"
                name="title"
                value={formData.title}
                onChange={(v) => setFormData({ ...formData, title: v })}
                loading={loading}
              />
              <InputField
                label="Catalog No"
                name="catNo"
                value={formData.catNo}
                onChange={(v) => setFormData({ ...formData, catNo: v })}
                loading={loading}
              />
              <InputField
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={(v) => setFormData({ ...formData, barcode: v })}
                loading={loading}
              />
              <InputField
                label="Artist Display Name"
                name="artistDisplayName"
                value={formData.artistDisplayName}
                onChange={(v) =>
                  setFormData({ ...formData, artistDisplayName: v })
                }
                loading={loading}
              />
              <InputField
                label="Label"
                name="label"
                value={formData.label}
                onChange={(v) => setFormData({ ...formData, label: v })}
                loading={loading}
              />

              <ArrayInputField
                label="Primary Artists"
                values={formData.primaryArtists}
                onChange={(arr) =>
                  setFormData({ ...formData, primaryArtists: arr })
                }
                loading={loading}
              />
              <ArrayInputField
                label="Featuring Artists"
                values={formData.featuringArtists}
                onChange={(arr) =>
                  setFormData({ ...formData, featuringArtists: arr })
                }
                loading={loading}
              />

              {/* Territories */}
              <div className="md:col-span-2">
                <Label className="text-gray-300">Territories</Label>
                <Select
                  value=""
                  onValueChange={(value: string) =>
                    setFormData((prev) => {
                      const alreadySelected = prev.territories.includes(value);
                      const updated = alreadySelected
                        ? prev.territories.filter((t) => t !== value)
                        : [...prev.territories, value];
                      return { ...prev, territories: updated };
                    })
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue
                      placeholder={
                        formData.territories.length > 0
                          ? formData.territories.join(", ")
                          : "Select territories"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {["US", "GB", "AU", "CA", "FR", "DE"].map((code) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex justify-between w-full">
                          <span>{code}</span>
                          {formData.territories.includes(code) && (
                            <span className="text-green-400 ml-2">✔</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genre & Format */}
              <div>
                <Label className="text-gray-300">Primary Genre *</Label>
                <Select
                  value={formData.primaryGenre}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, primaryGenre: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 max-h-48 overflow-y-auto scroll-smooth rounded-md shadow-lg">
                    <SelectItem value="Electronic">Electronic</SelectItem>
                    <SelectItem value="Folk">Folk</SelectItem>
                    <SelectItem value="Hip Hop/Rap">Hip Hop/Rap</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Latin">Latin</SelectItem>
                    <SelectItem value="New Age">New Age</SelectItem>
                    <SelectItem value="Opera">Opera</SelectItem>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="R&B/Soul">R&B/Soul</SelectItem>
                    <SelectItem value="Reggae">Reggae</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Spoken Word">Spoken Word</SelectItem>
                    <SelectItem value="Soundtrack">Soundtrack</SelectItem>
                    <SelectItem value="Vocal">Vocal</SelectItem>
                    <SelectItem value="World">World</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Format *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, format: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Album">Album</SelectItem>
                    <SelectItem value="EP">EP</SelectItem>
                    <SelectItem value="EP">Compilation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <InputField
                label="Release Date *"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(v) => setFormData({ ...formData, releaseDate: v })}
                loading={loading}
              />
              <InputField
                label="Original Release Date"
                name="originalReleaseDate"
                type="date"
                value={formData.originalReleaseDate}
                onChange={(v) =>
                  setFormData({ ...formData, originalReleaseDate: v })
                }
                loading={loading}
              />

              {/* C & P Lines */}
              <InputField
                label="© Line"
                name="cLine"
                value={formData.cLine}
                onChange={(v) => setFormData({ ...formData, cLine: v })}
                loading={loading}
              />
              <InputField
                label="© Year"
                name="cYear"
                type="number"
                value={formData.cYear}
                onChange={(v) => setFormData({ ...formData, cYear: Number(v) })}
                loading={loading}
              />
              <InputField
                label="℗ Line"
                name="pLine"
                value={formData.pLine}
                onChange={(v) => setFormData({ ...formData, pLine: v })}
                loading={loading}
              />
              <InputField
                label="℗ Year"
                name="pYear"
                type="number"
                value={formData.pYear}
                onChange={(v) => setFormData({ ...formData, pYear: Number(v) })}
                loading={loading}
              />

              {/* Packshot */}
              <div className="md:col-span-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gray-400" /> Packshot (Square)
                </Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handlePackshotUpload(e.target.files[0])
                  }
                  disabled={loading}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ButtonPrimary
              type="submit"
              className="flex-1 justify-center"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Release"}
            </ButtonPrimary>
            <Link to="/releases" href="/releases" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800"
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Input Field
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  loading,
}: {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (v: any) => void;
  loading: boolean;
}) {
  return (
    <div className="w-full">
      <Label htmlFor={name} className="text-gray-300">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 bg-gray-900 border-gray-800 text-white"
        disabled={loading}
      />
    </div>
  );
}

// Array Input Field
function ArrayInputField({
  label,
  values,
  onChange,
  loading,
}: {
  label: string;
  values: string[];
  onChange: (arr: string[]) => void;
  loading: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.split(",").map((s) => s.trim()));
  };

  return (
    <div className="w-full">
      <Label className="text-gray-300">{label}</Label>
      <Input
        type="text"
        value={values.join(",")}
        onChange={handleChange}
        className="mt-2 bg-gray-900 border-gray-800 text-white"
        placeholder="Comma separated values"
        disabled={loading}
      />
    </div>
  );
}
