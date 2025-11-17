'use client';

import { useState } from 'react';
import { Music, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ButtonPrimary } from '../../components/ButtonPrimary';
import { Button } from '../../components/ui/button';
import { SEO } from '../../components/SEO';
import { toast } from 'sonner@2.0.3';

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

export default function Register() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Account created successfully! Please log in.');
      
      // Navigate to login page
      if (router) {
        router.push('/');
      } else if (navigate) {
        navigate('/');
      } else {
        window.location.href = '/';
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-8">
      <SEO
        title="Register"
        description="Create a new Cage Riot account for music rights management"
        keywords="register, sign up, create account, music rights"
      />
      {/* Blurred spotlight effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-[#ff0050]/20 blur-[120px]" />
      </div>

      {/* Register box */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-800 bg-black/70 p-5 sm:p-6 md:p-8 backdrop-blur-xl">
        {/* Back button */}
        <Link to="/" href="/">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        {/* Logo */}
        <div className="mb-6 sm:mb-8 flex flex-col items-center">
          <div className="mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#ff0050]">
            <Music className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl text-white tracking-tight">CAGE RIOT</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-5">
          <div>
            <Label htmlFor="name" className="text-sm text-gray-300">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500 text-sm sm:text-base h-10 sm:h-11"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500 text-sm sm:text-base h-10 sm:h-11"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="organization" className="text-sm text-gray-300">
              Organization (Optional)
            </Label>
            <Input
              id="organization"
              type="text"
              placeholder="Your Label or Publisher"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500 text-sm sm:text-base h-10 sm:h-11"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500 text-sm sm:text-base h-10 sm:h-11"
              required
              disabled={loading}
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500 text-sm sm:text-base h-10 sm:h-11"
              required
              disabled={loading}
            />
          </div>

          <ButtonPrimary 
            type="submit" 
            className="w-full justify-center h-10 sm:h-11 text-sm sm:text-base" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </ButtonPrimary>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/" href="/" className="text-[#ff0050] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
