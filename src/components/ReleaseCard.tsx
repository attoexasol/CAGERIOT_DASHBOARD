
export function ReleaseCard({ id, title, artist, type, imageUrl }: any) {
  return (
  
    <div className="bg-gray-800 rounded-xl p-3 shadow hover:shadow-xl transition duration-200">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-700">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/no-image.png")}
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-white font-semibold truncate">{title}</p>
        <p className="text-gray-400 text-sm truncate">{artist}</p>
        <span className="text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
          {type}
        </span>
      </div>
    </div>
   
  );
}



