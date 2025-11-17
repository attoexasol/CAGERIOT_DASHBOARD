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
import { labelsService } from '../../../../lib/api';

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

export default function NewLabel() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Independent',
    email: '',
    phone: '',
    website: '',
    founded: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await labelsService.create({
        name: formData.name,
        type: formData.type as any,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        founded: formData.founded,
        description: formData.description,
      });
      
      toast.success('Label added successfully!');
      
      if (router) {
        router.push('/labels');
      } else if (navigate) {
        navigate('/labels');
      } else {
        window.location.href = '/labels';
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add label');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/labels" href="/labels">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Add New Label</h1>
          <p className="text-gray-400">Add a new record label to your network</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Label Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Label Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Label name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-gray-300">
                  Label Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Independent">Independent</SelectItem>
                    <SelectItem value="Major">Major Label</SelectItem>
                    <SelectItem value="Sub-Label">Sub-Label</SelectItem>
                    <SelectItem value="Imprint">Imprint</SelectItem>
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
                  placeholder="label@example.com"
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
                <Label htmlFor="website" className="text-gray-300">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="https://example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="founded" className="text-gray-300">
                  Founded Year
                </Label>
                <Input
                  id="founded"
                  value={formData.founded}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="2020"
                  disabled={loading}
                />
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
                  placeholder="Label description (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Adding...' : 'Add Label'}
            </ButtonPrimary>
            <Link to="/labels" href="/labels" className="flex-1">
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
