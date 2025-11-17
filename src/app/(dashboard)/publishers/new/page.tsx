'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { ButtonPrimary } from '../../../../components/ButtonPrimary';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { publishersService } from '../../../../lib/api';

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

export default function NewPublisher() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ipi: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await publishersService.create({
        name: formData.name,
        territory: formData.address,
        contact: formData.email,
        website: formData.website,
      });
      
      toast.success('Publisher added successfully!');
      
      if (router) {
        router.push('/publishers');
      } else if (navigate) {
        navigate('/publishers');
      } else {
        window.location.href = '/publishers';
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add publisher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/publishers" href="/publishers">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Add New Publisher</h1>
          <p className="text-gray-400">Add a new music publisher to your network</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Publisher Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Publisher Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Publisher name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="ipi" className="text-gray-300">
                  IPI Number
                </Label>
                <Input
                  id="ipi"
                  value={formData.ipi}
                  onChange={(e) => setFormData({ ...formData, ipi: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="000000000"
                  disabled={loading}
                />
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
                  placeholder="publisher@example.com"
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
                <Label htmlFor="address" className="text-gray-300">
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Street address, city, country"
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
                <Label htmlFor="notes" className="text-gray-300">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white min-h-32"
                  placeholder="Additional notes (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Adding...' : 'Add Publisher'}
            </ButtonPrimary>
            <Link to="/publishers" href="/publishers" className="flex-1">
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
