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




// src/app/(dashboard)/layout.jsx
import React, { useState } from "react";
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
