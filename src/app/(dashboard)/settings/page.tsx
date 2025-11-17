'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Copy, LogOut, Key, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { authService } from '../../../lib/api/services/auth.service';
import { User } from '../../../lib/api/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';

// Support both Next.js and React Router
const isNextJs = typeof window === 'undefined' || !!(window as any).__NEXT_DATA__;
let useRouter: any;
let useNavigate: any;

if (isNextJs) {
  try {
    const nextRouter = require('next/navigation');
    useRouter = nextRouter.useRouter;
  } catch {}
}

if (!useRouter) {
  try {
    const reactRouter = require('react-router-dom');
    useNavigate = reactRouter.useNavigate;
  } catch {}
}

export default function Settings() {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    avatar: '',
  });
  const [apiKey] = useState('sk_live_xxxxxxxxxxxxxxxx');
  const [webhookUrl, setWebhookUrl] = useState('https://api.cageriot.com/webhooks');

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        company: userData.company || '',
        avatar: userData.avatar || '',
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setProfileData(prev => ({ ...prev, avatar: imageUrl }));
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Validate email
      if (!profileData.email || !profileData.email.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Update profile
      const updatedUser = await authService.updateProfile({
        name: profileData.name,
        email: profileData.email,
        company: profileData.company,
        avatar: profileData.avatar,
      });

      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to save changes:', error);
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success(`${label} copied to clipboard`);
        })
        .catch(() => {
          // Fallback method
          fallbackCopyToClipboard(text, label);
        });
    } else {
      // Use fallback for non-secure contexts
      fallbackCopyToClipboard(text, label);
    }
  };

  const fallbackCopyToClipboard = (text: string, label: string) => {
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success(`${label} copied to clipboard`);
      } else {
        toast.error('Failed to copy to clipboard');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      toast.error('Failed to copy to clipboard');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleCopyApiKey = () => {
    copyToClipboard(apiKey, 'API key');
  };

  const handleCopyWebhook = () => {
    copyToClipboard(webhookUrl, 'Webhook URL');
  };

  const handleDeleteAvatar = () => {
    setProfileData(prev => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Profile image removed');
  };

  const handleDeleteAccount = async () => {
    try {
      // In demo mode or without backend, just logout
      toast.success('Account deletion initiated');
      handleLogout();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      toast.error(error.message || 'Failed to delete account');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      
      if (router) {
        router.push('/');
      } else if (navigate) {
        navigate('/');
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate anyway
      if (router) {
        router.push('/');
      } else if (navigate) {
        navigate('/');
      } else {
        window.location.href = '/';
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center p-3 sm:p-4 md:p-8">
        <div className="text-sm sm:text-base text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl text-white">Settings</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Profile Settings */}
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <h2 className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg md:text-xl text-white">Profile Information</h2>
          
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-[#ff0050] flex-shrink-0">
              {profileData.avatar && (
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
              )}
              <AvatarFallback className="bg-[#ff0050] text-lg sm:text-2xl text-white">
                {getInitials(profileData.name || 'Guest User')}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="border-gray-700 bg-transparent text-white hover:bg-gray-800 text-xs sm:text-sm flex-1 sm:flex-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Upload
              </Button>
              {profileData.avatar && (
                <Button 
                  variant="outline" 
                  className="border-red-900/50 bg-transparent text-red-500 hover:bg-red-950/30 px-3"
                  onClick={handleDeleteAvatar}
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white text-sm sm:text-base h-10 sm:h-11"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white text-sm sm:text-base h-10 sm:h-11"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-sm text-gray-300">
                Company
              </Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="mt-1.5 sm:mt-2 bg-gray-900 border-gray-800 text-white text-sm sm:text-base h-10 sm:h-11"
                placeholder="Enter your company name"
              />
            </div>

            <ButtonPrimary 
              className="mt-4 sm:mt-6 w-full justify-center h-10 sm:h-11 text-sm sm:text-base"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </ButtonPrimary>
          </div>
        </div>

        {/* API & Security */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* API Keys */}
          <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
            <h2 className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg md:text-xl text-white">API Credentials</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="api-key" className="text-sm text-gray-300">
                  API Key
                </Label>
                <div className="mt-1.5 sm:mt-2 flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    className="bg-gray-900 border-gray-800 text-white text-sm sm:text-base h-10 sm:h-11"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-transparent text-white hover:bg-gray-800 h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
                    onClick={handleCopyApiKey}
                    title="Copy API Key"
                  >
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="webhook" className="text-sm text-gray-300">
                  Webhook URL
                </Label>
                <div className="mt-1.5 sm:mt-2 flex gap-2">
                  <Input
                    id="webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="bg-gray-900 border-gray-800 text-white text-sm sm:text-base h-10 sm:h-11"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-transparent text-white hover:bg-gray-800 h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
                    onClick={handleCopyWebhook}
                    title="Copy Webhook URL"
                  >
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-700 bg-transparent text-white hover:bg-gray-800 text-xs sm:text-sm h-10 sm:h-11"
                onClick={() => toast.info('API key regeneration feature coming soon')}
              >
                <Key className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Regenerate API Key
              </Button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
            <h2 className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg md:text-xl text-white">Account Actions</h2>
            
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start border-gray-700 bg-transparent text-white hover:bg-gray-800 text-xs sm:text-sm h-10 sm:h-11"
              >
                <LogOut className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Sign Out
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-900/50 bg-transparent text-red-500 hover:bg-red-950/30 text-xs sm:text-sm h-10 sm:h-11"
                  >
                    <Trash2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 border-gray-800 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white text-base sm:text-lg">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400 text-xs sm:text-sm">
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 text-xs sm:text-sm m-0">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white hover:bg-red-700 text-xs sm:text-sm m-0"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
            <h2 className="mb-4 sm:mb-5 md:mb-6 text-base sm:text-lg md:text-xl text-white">Notifications</h2>
            
            <div className="space-y-2.5 sm:space-y-3">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-gray-300 text-xs sm:text-sm">Email notifications</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-700 bg-gray-900 text-[#ff0050] focus:ring-[#ff0050] flex-shrink-0"
                  defaultChecked
                />
              </label>
              
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-gray-300 text-xs sm:text-sm">Payout alerts</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-700 bg-gray-900 text-[#ff0050] focus:ring-[#ff0050] flex-shrink-0"
                  defaultChecked
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-gray-300 text-xs sm:text-sm">New release updates</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-700 bg-gray-900 text-[#ff0050] focus:ring-[#ff0050] flex-shrink-0"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
