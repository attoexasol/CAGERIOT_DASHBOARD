import React, { useState, useEffect } from "react";
import { Music, Image as ImageIcon } from "lucide-react";
import { coverArtService } from "../lib/api";

interface ReleaseCardProps {
  id: string | number;
  title: string;
  upc?: string | null;
  digital?: string;
  artist?: string;
  type?: string;
  imageUrl?: string;
  coverArtUrl?: string; // Support for cover_art_url from API
  description?: string; // For generating prompts
  genre?: string; // For generating prompts
}

/**
 * Generates a prompt/description for the release card
 * Useful for AI generation, metadata, or display purposes
 */
export function generateReleaseCardPrompt(props: ReleaseCardProps): string {
  const { title, artist, type, genre, description } = props;
  
  const parts: string[] = [];
  
  if (title) parts.push(`Title: "${title}"`);
  if (artist) parts.push(`Artist: ${artist}`);
  if (type) parts.push(`Type: ${type}`);
  if (genre) parts.push(`Genre: ${genre}`);
  if (description) parts.push(`Description: ${description}`);
  
  const basePrompt = `Music release card for ${artist ? `${artist}'s` : 'a'} ${type || 'release'}${title ? ` titled "${title}"` : ''}${genre ? ` in the ${genre} genre` : ''}.`;
  
  if (description) {
    return `${basePrompt} ${description}`;
  }
  
  return parts.length > 0 
    ? `Release Card: ${parts.join(' | ')}`
    : basePrompt;
}

export function ReleaseCard({ 
  id, 
  title, 
  upc, 
  digital, 
  artist, 
  type, 
  imageUrl,
  coverArtUrl,
  description,
  genre
}: ReleaseCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [actualCoverArtUrl, setActualCoverArtUrl] = useState<string | null>(null);
  const [fetchingCoverArt, setFetchingCoverArt] = useState(false);
  
  // Check if coverArtUrl is a download endpoint and fetch the actual URL
  useEffect(() => {
    const fetchCoverArtUrl = async () => {
      // If coverArtUrl is already a direct image URL (starts with http/https), use it directly
      if (coverArtUrl && (coverArtUrl.startsWith('http://') || coverArtUrl.startsWith('https://'))) {
        setActualCoverArtUrl(coverArtUrl);
        return;
      }
      
      // If coverArtUrl is a download endpoint, fetch the actual cover_art_url
      if (coverArtUrl && coverArtUrl.includes('/download')) {
        // Extract cover_art_id from the download URL
        const match = coverArtUrl.match(/\/cover_art\/(\d+)\/download/);
        if (match && match[1]) {
          const coverArtId = match[1];
          setFetchingCoverArt(true);
          try {
            console.log(`🔍 Fetching cover_art_url for cover_art_id: ${coverArtId}`);
            const url = await coverArtService.download(coverArtId);
            if (url && url.trim() !== '') {
              console.log(`✅ Got cover_art_url: ${url}`);
              setActualCoverArtUrl(url);
            } else {
              console.warn(`⚠️ cover_art_url is null for cover_art_id: ${coverArtId}`);
              setActualCoverArtUrl(null);
            }
          } catch (error: any) {
            console.warn('Failed to fetch cover art URL:', error.message);
            setActualCoverArtUrl(null);
          } finally {
            setFetchingCoverArt(false);
          }
        } else {
          // Not a valid download endpoint format, use as-is
          setActualCoverArtUrl(coverArtUrl);
        }
      } else if (coverArtUrl) {
        // Use coverArtUrl as-is if it's not a download endpoint
        setActualCoverArtUrl(coverArtUrl);
      } else if (imageUrl) {
        // Fallback to imageUrl if no coverArtUrl
        setActualCoverArtUrl(imageUrl);
      } else {
        setActualCoverArtUrl(null);
      }
    };
    
    fetchCoverArtUrl();
  }, [coverArtUrl, imageUrl]);
  
  // Prioritize actualCoverArtUrl from download endpoint, then coverArtUrl, then imageUrl
  const coverImageUrl = actualCoverArtUrl || coverArtUrl || imageUrl;
  const hasValidImage = coverImageUrl && coverImageUrl !== "/no-image.png" && !imageError;
  
  // Generate prompt for this release card
  const releasePrompt = generateReleaseCardPrompt({
    id,
    title,
    artist,
    type,
    genre,
    description,
    upc,
    digital,
    imageUrl: coverImageUrl
  });

  return (
    <div className="bg-gray-800 rounded-xl p-3 shadow hover:shadow-xl transition duration-200 group">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center relative">
        {hasValidImage && imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-600 w-full h-full" />
          </div>
        ) : null}
        
        {hasValidImage ? (
          <img 
            src={coverImageUrl} 
            alt={`${title}${artist ? ` by ${artist}` : ''} cover art`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Music className="h-16 w-16 mb-2" />
            <span className="text-xs">No Cover Art</span>
          </div>
        )}
        
        {/* Hover overlay with prompt info */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3">
          <div className="text-center text-white text-xs">
            <ImageIcon className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold mb-1">Cover Art</p>
            <p className="text-gray-300 text-[10px] line-clamp-3">
              {releasePrompt}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-white font-semibold truncate" title={title}>{title}</p>
        {artist && (
          <p className="text-gray-400 text-sm truncate" title={artist}>
            {artist}
          </p>
        )}
        {upc && (
          <p className="text-gray-400 text-xs truncate" title={`UPC: ${upc}`}>
            UPC: {upc}
          </p>
        )}
        <span className="inline-block text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
          {type || "Album"}
        </span>
      </div>
      
      {/* Hidden prompt for AI/metadata purposes */}
      <div className="hidden" data-release-prompt={releasePrompt} />
    </div>
  );
}
