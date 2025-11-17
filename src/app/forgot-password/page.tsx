'use client';

import { useState } from 'react';
import { Music, ArrowLeft, Mail } from 'lucide-react';
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

export default function ForgotPassword() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password reset link sent to your email!');
      setEmailSent(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (router) {
      router.push('/');
    } else if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <SEO
        title="Forgot Password"
        description="Reset your Cage Riot password"
        keywords="forgot password, reset password, password recovery"
      />
      {/* Blurred spotlight effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-[#ff0050]/20 blur-[120px]" />
      </div>

      {/* Forgot password box */}
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
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff0050]">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl text-white">CAGE RIOT</h1>
          <p className="text-sm text-gray-500">Reset your password</p>
        </div>

        {!emailSent ? (
          <>
            {/* Instructions */}
            <div className="mb-6 rounded-lg bg-gray-900/50 p-4">
              <p className="text-sm text-gray-400 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-gray-900 border-gray-800 text-white placeholder-gray-500"
                  required
                  disabled={loading}
                />
              </div>

              <ButtonPrimary 
                type="submit" 
                className="w-full justify-center" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </ButtonPrimary>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Remember your password?{' '}
                <Link to="/" href="/" className="text-[#ff0050] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success message */}
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="mb-2 text-xl text-white">Check your email</h2>
              <p className="text-center text-sm text-gray-400">
                We've sent a password reset link to
              </p>
              <p className="text-center text-sm text-white">{email}</p>
            </div>

            <div className="rounded-lg bg-gray-900/50 p-4 mb-6">
              <p className="text-xs text-gray-400 text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <ButtonPrimary 
              onClick={handleBackToLogin} 
              className="w-full justify-center"
            >
              Back to Login
            </ButtonPrimary>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-sm text-gray-400 hover:text-[#ff0050]"
              >
                Try a different email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
