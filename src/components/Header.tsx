'use client';

import { Search, Moon, Sun, Menu } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(true);
  const { user } = useAuth();

  // Determine if we should show the Impersonating badge
  // Only show if:
  // 1. User is an admin (role === 'admin')
  // 2. User is impersonating another account (check for impersonatedUserId in localStorage or user object)
  const shouldShowImpersonating = () => {
    if (!user) return false;
    
    // Don't show for artist accounts
    const userRole = (user as any).role?.toLowerCase() || '';
    if (userRole === 'artist') return false;
    
    // Only show if user is admin and is impersonating
    const isAdmin = userRole === 'admin' || userRole === 'administrator';
    if (!isAdmin) return false;
    
    // Check if impersonating (could be stored in localStorage or as a field on user)
    const impersonatedUserId = localStorage.getItem('impersonated_user_id');
    const isImpersonating = impersonatedUserId && impersonatedUserId !== user.id;
    
    return isImpersonating;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <header className="flex h-14 sm:h-16 items-center justify-between border-b border-gray-800 bg-[#0a0a0a] px-3 sm:px-4 md:px-6 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onOpenMobileMenu}
        className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0 mx-2 sm:mx-3 lg:mx-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-lg bg-gray-900 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff0050]/50"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0">
        {shouldShowImpersonating() && (
          <Badge
            variant="secondary"
            className="hidden md:flex bg-[#ff0050]/10 text-[#ff0050] hover:bg-[#ff0050]/20 border-0 text-xs whitespace-nowrap"
          >
            Impersonating
          </Badge>
        )}

        {/* <button
          onClick={() => setDarkMode(!darkMode)}
          className="hidden sm:flex rounded-lg p-1.5 sm:p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          {darkMode ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button> */}

        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 cursor-pointer border-2 border-[#ff0050] flex-shrink-0">
          <AvatarFallback className="bg-[#ff0050] text-white text-xs sm:text-sm">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
