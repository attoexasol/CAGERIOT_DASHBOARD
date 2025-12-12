import { Music } from "lucide-react";

interface ReleaseCardProps {
  id: string | number;
  title: string;
  upc?: string | null;
  digital?: string;
  artist?: string;
  type?: string;
  imageUrl?: string;
}

export function ReleaseCard({ 
  id, 
  title, 
  upc, 
  digital, 
  artist, 
  type, 
  imageUrl 
}: ReleaseCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-3 shadow hover:shadow-xl transition duration-200">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
        {imageUrl && imageUrl !== "/no-image.png" ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Music className="h-16 w-16 text-gray-600" />
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-white font-semibold truncate">{title}</p>
        {artist && <p className="text-gray-400 text-sm truncate">{artist}</p>}
        {upc && <p className="text-gray-400 text-xs truncate">UPC: {upc}</p>}
        <span className="inline-block text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
          {type || "Album"}
        </span>
      </div>
    </div>
  );
}
