'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
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
import { performersService } from '../../../../lib/api';

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

export default function NewPerformer() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instrument: 'Vocals',
    email: '',
    phone: '',
    nationality: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await performersService.create({
        name: formData.name,
        instrument: formData.instrument,
        email: formData.email,
        phone: formData.phone,
      });
      
      toast.success('Performer added successfully!');
      
      if (router) {
        router.push('/performers');
      } else if (navigate) {
        navigate('/performers');
      } else {
        window.location.href = '/performers';
      }
    } catch (error: any) {
      toast.error('Failed to add performer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/performers" href="/performers">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Add New Performer</h1>
          <p className="text-gray-400">Add a new performer to your roster</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Performer Information</h2>
            
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
                  placeholder="Performer name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="instrument" className="text-gray-300">
                  Instrument/Role *
                </Label>
                <Select
                  value={formData.instrument}
                  onValueChange={(value) => setFormData({ ...formData, instrument: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Vocals">Vocals</SelectItem>
                    <SelectItem value="Guitar">Guitar</SelectItem>
                    <SelectItem value="Bass">Bass</SelectItem>
                    <SelectItem value="Drums">Drums</SelectItem>
                    <SelectItem value="Piano">Piano</SelectItem>
                    <SelectItem value="Keyboard">Keyboard</SelectItem>
                    <SelectItem value="Violin">Violin</SelectItem>
                    <SelectItem value="Saxophone">Saxophone</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
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
                  placeholder="performer@example.com"
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
                <Label htmlFor="nationality" className="text-gray-300">
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="e.g., American, British, etc."
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Adding...' : 'Add Performer'}
            </ButtonPrimary>
            <Link to="/performers" href="/performers" className="flex-1">
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
