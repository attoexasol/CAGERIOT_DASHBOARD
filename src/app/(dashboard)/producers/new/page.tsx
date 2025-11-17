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
import { producersService } from '../../../../lib/api';

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

export default function NewProducer() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Music Production',
    email: '',
    phone: '',
    studio: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await producersService.create({
        name: formData.name,
        role: formData.specialty as any,
        email: formData.email,
        phone: formData.phone,
      });
      
      toast.success('Producer added successfully!');
      
      if (router) {
        router.push('/producers');
      } else if (navigate) {
        navigate('/producers');
      } else {
        window.location.href = '/producers';
      }
    } catch (error: any) {
      toast.error('Failed to add producer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/producers" href="/producers">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Add New Producer</h1>
          <p className="text-gray-400">Add a new producer to your network</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Producer Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Producer name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="specialty" className="text-gray-300">
                  Specialty *
                </Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Music Production">Music Production</SelectItem>
                    <SelectItem value="Beat Making">Beat Making</SelectItem>
                    <SelectItem value="Mixing & Mastering">Mixing & Mastering</SelectItem>
                    <SelectItem value="Sound Design">Sound Design</SelectItem>
                    <SelectItem value="Film Scoring">Film Scoring</SelectItem>
                    <SelectItem value="Electronic Production">Electronic Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="producer@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="+1 (555) 000-0000"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="studio" className="text-gray-300">
                  Studio Name
                </Label>
                <Input
                  id="studio"
                  value={formData.studio}
                  onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Studio name"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-300">
                  Biography
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white min-h-32"
                  placeholder="Brief biography (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Adding...' : 'Add Producer'}
            </ButtonPrimary>
            <Link to="/producers" href="/producers" className="flex-1">
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
