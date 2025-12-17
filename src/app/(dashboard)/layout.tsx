// 'use client';

// import { useState } from 'react';
// import { Sidebar } from '../../components/Sidebar';
// import { Header } from '../../components/Header';

// export default function DashboardLayout({
//   children,
  
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-black">
//       {/* Mobile overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 lg:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
      
//       <Sidebar 
//         isMobileMenuOpen={isMobileMenuOpen} 
//         onCloseMobileMenu={() => setIsMobileMenuOpen(false)} 
//       />
      
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
//         <main className="flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }





'use client';

import React, { useState, useEffect } from "react";
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

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

// Helper function to check if token exists in localStorage
function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check Zustand persisted storage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return !!(parsed?.state?.token);
    }
    
    // Also check legacy auth_token for backward compatibility
    return !!localStorage.getItem('auth_token');
  } catch {
    return false;
  }
}

export default function DashboardLayout({ children }) {
  const router = useRouter ? useRouter() : null;
  const navigate = useNavigate ? useNavigate() : null;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check for token on mount
  useEffect(() => {
    const tokenExists = hasToken();
    setIsChecking(false);
    
    if (!tokenExists) {
      // Redirect to login if no token
      if (router) {
        router.push('/');
      } else if (navigate) {
        navigate('/');
      } else {
        window.location.href = '/';
      }
    }
  }, [router, navigate]);

  // Show loading state while checking token
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if no token (redirect will happen)
  if (!hasToken()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-h-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-black min-h-0">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
