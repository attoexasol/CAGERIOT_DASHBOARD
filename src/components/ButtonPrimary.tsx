'use client';

import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ButtonPrimaryProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export function ButtonPrimary({
  children,
  icon: Icon,
  onClick,
  href,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonPrimaryProps) {
  const baseClasses = `inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#ff0050] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white transition-colors hover:bg-[#ff0050]/90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${className}`;

  const content = (
    <>
      {Icon && <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />}
      {children}
    </>
  );

  if (href && !disabled) {
    return (
      <Link to={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {content}
    </button>
  );
}
