'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { ButtonPrimary } from '../../../../components/ButtonPrimary';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { artistsService } from '../../../../lib/api';

// Support both Next.js and React Router
const isNextJs = typeof window === 'undefined' || !!(window as any).__NEXT_DATA__;
let Link: any;
let useRouter: any;
let useNavigate: any;

if (isNextJs) {
  try {
    const nextRouter = require('next/navigation');
    const nextLink = require('next/link');
    Link = nextLink.default;
    useRouter = nextRouter.useRouter;
  } catch {}
}

if (!Link) {
  try {
    const reactRouter = require('react-router-dom');
    Link = reactRouter.Link;
    useNavigate = reactRouter.useNavigate;
  } catch {
    Link = ({ to, href, children, ...props }: any) => (
      <a href={to || href} {...props}>{children}</a>
    );
  }
}

export default function NewArtist() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    spotify_url: '',
    apple_url: '',
    youtube_url: '',
    soundcloud_url: '',
    instagram_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare request body - only include name and non-empty URL fields
      const requestData: any = {
        name: formData.name.trim(),
      };
      
      // Add optional URL fields only if they have values
      if (formData.spotify_url.trim()) requestData.spotify_url = formData.spotify_url.trim();
      if (formData.apple_url.trim()) requestData.apple_url = formData.apple_url.trim();
      if (formData.youtube_url.trim()) requestData.youtube_url = formData.youtube_url.trim();
      if (formData.soundcloud_url.trim()) requestData.soundcloud_url = formData.soundcloud_url.trim();
      if (formData.instagram_url.trim()) requestData.instagram_url = formData.instagram_url.trim();

      await artistsService.create(requestData);
      
      toast.success('Artist added successfully!');
      
      if (router) {
        router.push('/artists');
      } else if (navigate) {
        navigate('/artists');
      } else {
        window.location.href = '/artists';
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add artist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/artists" href="/artists">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Add New Artist</h1>
          <p className="text-gray-400">Add a new artist to your roster</p>
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Artist Information</h2>
            
            <div className="space-y-6">
              {/* Name field - full width */}
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full bg-gray-900 border-gray-800 text-white"
                  placeholder="Artist name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Social Media URLs - two columns */}
              <div className="pt-4 border-t border-gray-800">
                <h3 className="mb-4 text-lg text-white">Social Media URLs (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="spotify_url" className="text-gray-300">
                        Spotify Profile URL
                      </Label>
                      <Input
                        id="spotify_url"
                        type="url"
                        value={formData.spotify_url}
                        onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                        className="mt-2 w-full bg-gray-900 border-gray-800 text-white"
                        placeholder="https://open.spotify.com/artist/..."
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="apple_url" className="text-gray-300">
                        Apple Music Profile URL
                      </Label>
                      <Input
                        id="apple_url"
                        type="url"
                        value={formData.apple_url}
                        onChange={(e) => setFormData({ ...formData, apple_url: e.target.value })}
                        className="mt-2 w-full bg-gray-900 border-gray-800 text-white"
                        placeholder="https://music.apple.com/artist/..."
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="youtube_url" className="text-gray-300">
                        YouTube URL
                      </Label>
                      <Input
                        id="youtube_url"
                        type="url"
                        value={formData.youtube_url}
                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                        className="mt-2 w-full bg-gray-900 border-gray-800 text-white"
                        placeholder="https://www.youtube.com/..."
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="soundcloud_url" className="text-gray-300">
                        SoundCloud URL
                      </Label>
                      <Input
                        id="soundcloud_url"
                        type="url"
                        value={formData.soundcloud_url}
                        onChange={(e) => setFormData({ ...formData, soundcloud_url: e.target.value })}
                        className="mt-2 w-full bg-gray-900 border-gray-800 text-white"
                        placeholder="https://soundcloud.com/..."
                        disabled={loading}
                      />
                    </div>

                   
                  </div>
                  <div>
                      <Label htmlFor="instagram_url" className="text-gray-300">
                        Instagram URL
                      </Label>
                      <Input
                        id="instagram_url"
                        type="url"
                        value={formData.instagram_url}
                        onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                        className="mt-2 w-full bg-gray-900 border-gray-800 text-white"
                        placeholder="https://www.instagram.com/..."
                        disabled={loading}
                      />
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Adding...' : 'Add Artist'}
            </ButtonPrimary>
            <Link to="/artists" href="/artists" className="flex-1">
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
