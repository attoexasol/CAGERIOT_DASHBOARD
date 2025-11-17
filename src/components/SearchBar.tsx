'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ placeholder = 'Search', value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-500 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg bg-gray-900 py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ff0050]/50"
      />
    </div>
  );
}
