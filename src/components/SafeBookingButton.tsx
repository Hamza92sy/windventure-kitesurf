'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface SafeBookingButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const SafeBookingButton: React.FC<SafeBookingButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-xl focus:ring-cyan-500',
    secondary:
      'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-xl focus:ring-orange-500',
    outline:
      'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white focus:ring-cyan-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Garantir que le bouton est toujours visible
  const buttonStyle: CSSProperties = {
    display: 'inline-flex',
    visibility: 'visible',
    opacity: 1,
    zIndex: 50,
    position: 'relative',
    cursor: 'pointer',
    textDecoration: 'none',
    border: 'none',
    outline: 'none',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className={buttonClasses}
        style={buttonStyle}
        onClick={onClick}
        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow =
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {children}
      </Link>
    </motion.div>
  );
};

export default SafeBookingButton;

// Composant de fallback si Framer Motion ne se charge pas
export const SafeBookingButtonFallback: React.FC<SafeBookingButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-xl focus:ring-cyan-500',
    secondary:
      'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-xl focus:ring-orange-500',
    outline:
      'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white focus:ring-cyan-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <Link
      href={href}
      className={buttonClasses}
      onClick={onClick}
      style={
        {
          display: 'inline-flex',
          visibility: 'visible',
          opacity: 1,
          zIndex: 50,
          position: 'relative',
          cursor: 'pointer',
          textDecoration: 'none',
          border: 'none',
          outline: 'none',
        } as CSSProperties
      }
    >
      {children}
    </Link>
  );
};
