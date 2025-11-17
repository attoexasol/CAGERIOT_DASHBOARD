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

export default function NewPayout() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    paymentMethod: 'Bank Transfer',
    date: '',
    reference: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payout created successfully!');
      
      if (router) {
        router.push('/payouts');
      } else if (navigate) {
        navigate('/payouts');
      } else {
        window.location.href = '/payouts';
      }
    } catch (error: any) {
      toast.error('Failed to create payout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/payouts" href="/payouts">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl text-white">Create New Payout</h1>
          <p className="text-gray-400">Process a new royalty payout</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="mb-6 text-xl text-white">Payout Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-gray-300">
                  Recipient *
                </Label>
                <Input
                  id="recipient"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="Artist or organization name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-gray-300">
                  Amount *
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="pl-8 bg-gray-900 border-gray-800 text-white"
                    placeholder="0.00"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentMethod" className="text-gray-300">
                  Payment Method *
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2 bg-gray-900 border-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date" className="text-gray-300">
                  Payment Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="reference" className="text-gray-300">
                  Reference Number
                </Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="mt-2 bg-gray-900 border-gray-800 text-white"
                  placeholder="TXN-2024-001"
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
                  placeholder="Additional notes about this payout (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ButtonPrimary type="submit" className="flex-1 justify-center" disabled={loading}>
              {loading ? 'Processing...' : 'Create Payout'}
            </ButtonPrimary>
            <Link to="/payouts" href="/payouts" className="flex-1">
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
