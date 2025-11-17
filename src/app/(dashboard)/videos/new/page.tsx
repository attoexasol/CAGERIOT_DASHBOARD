'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { ButtonPrimary } from '../../../../components/ButtonPrimary';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { videosService } from '../../../../lib/api';

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

export default function NewVideo() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    videoUrl: '',
    thumbnailUrl: '',
    director: '',
    releaseDate: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await videosService.create({
        title: formData.title,
        artistId: formData.artist,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        director: formData.director,
        releaseDate: formData.releaseDate,
        description: formData.description,
      });
      
      toast.success('Video added successfully!');
      
      if (router) {
        router.push('/videos');
      } else if (navigate) {
        navigate('/videos');
      } else {
        window.location.href = '/videos';
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/videos" href="/videos">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Add New Video</h1>
          <p className="text-gray-400">Add a new music video to your catalog</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Video Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Video Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Enter video title"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="artist" className="text-gray-300">
                  Artist *
                </Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Artist name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="videoUrl" className="text-gray-300">
                  Video URL *
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="https://example.com/video.mp4"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="thumbnailUrl" className="text-gray-300">
                  Thumbnail URL
                </Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="https://example.com/thumbnail.jpg"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="director" className="text-gray-300">
                    Director
                  </Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    placeholder="Director name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="releaseDate" className="text-gray-300">
                    Release Date
                  </Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="mt-2 bg-gray-900 border-gray-800 text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white min-h-32"
                  placeholder="Video description (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Adding...' : 'Add Video'}
            </ButtonPrimary>
            <Link to="/videos" href="/videos" className="flex-1">
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
