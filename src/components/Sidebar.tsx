"use client";

import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Disc3,
  DollarSign,
  Headphones,
  Home,
  Mic2,
  Music,
  PenTool,
  Settings,
  Users,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, section: "ASSETS" },
  { name: "Releases", href: "/releases", icon: Music, section: "ASSETS" },
  //  { name: 'Asset', href: '/assets', icon: Music, section: 'ASSETS' },
  { name: "Tracks", href: "/tracks", icon: BarChart3, section: "ASSETS" },
  { name: "Videos", href: "/videos", icon: Video, section: "ASSETS" },
  { name: "Artists", href: "/artists", icon: Users, section: "CONTRIBUTORS" },
  {
    name: "Performers",
    href: "/performers",
    icon: Mic2,
    section: "CONTRIBUTORS",
  },
  {
    name: "Producers & Engineers",
    href: "/producers",
    icon: Headphones,
    section: "CONTRIBUTORS",
  },
  { name: "Writers", href: "/writers", icon: PenTool, section: "CONTRIBUTORS" },
  {
    name: "Publishers",
    href: "/publishers",
    icon: Building2,
    section: "CONTRIBUTORS",
  },
  { name: "Labels", href: "/labels", icon: Disc3, section: "CONTRIBUTORS" },
  {
    name: "Royalties",
    href: "/royalties",
    icon: DollarSign,
    section: "FINANCIAL",
  },
  { name: "Payouts", href: "/payouts", icon: CreditCard, section: "FINANCIAL" },
  { name: "Settings", href: "/settings", icon: Settings, section: "SETTINGS" },
];

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export function Sidebar({
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const sections = [
    {
      name: "ASSETS",
      items: navigation.filter((item) => item.section === "ASSETS"),
    },
    {
      name: "CONTRIBUTORS",
      items: navigation.filter((item) => item.section === "CONTRIBUTORS"),
    },
    {
      name: "FINANCIAL",
      items: navigation.filter((item) => item.section === "FINANCIAL"),
    },
    {
      name: "SETTINGS",
      items: navigation.filter((item) => item.section === "SETTINGS"),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex h-screen flex-col bg-[#0a0a0a] border-r border-gray-800 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-14"
              src="../../src/assets/img/cage riot logo.png"
              alt=""
            />
            {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff0050]">
              <Music className="h-5 w-5 text-white" />
            </div> */}
            {!isCollapsed && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white">CAGE RIOT</span>
                </div>
                <span className="text-xs text-gray-500">
                  {" "}
                  Partner Dashboard
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.name} className="mb-6">
              {!isCollapsed && (
                <div className="mb-2 px-3 text-xs text-gray-500">
                  {section.name}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-[#ff0050]/10 text-[#ff0050]"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      } ${isCollapsed ? "justify-center" : ""}`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && (
                        <span className="text-[15px] font-semibold">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0a0a0a] border-r border-gray-800 transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff0050]">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white">CAGE RIOT</span>
              </div>
              <span className="text-xs text-gray-500">Rights Platform</span>
            </div>
          </div>
          <button
            onClick={onCloseMobileMenu}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.name} className="mb-6">
              <div className="mb-2 px-3 text-xs text-gray-500">
                {section.name}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onCloseMobileMenu}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-[#ff0050]/10 text-[#ff0050]"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-[15px] font-semibold">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
