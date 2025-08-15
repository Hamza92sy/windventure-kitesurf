'use client';

import React from 'react';

interface SimpleMotionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: any;
  animate?: any;
  transition?: any;
  whileInView?: any;
  delay?: number;
  duration?: number;
}

export function SimpleMotion({
  children,
  className = '',
  style = {},
  initial,
  animate,
  transition,
  whileInView,
  delay = 0,
  duration = 0.6,
}: SimpleMotionProps) {
  // Convert framer-motion props to CSS animations
  let animationClass = '';

  if (initial?.opacity === 0 && animate?.opacity === 1) {
    if (initial?.y && animate?.y === 0) {
      animationClass = 'animate-fade-in-up';
    } else if (initial?.x && animate?.x === 0) {
      if (initial.x < 0) {
        animationClass = 'animate-fade-in-left';
      } else {
        animationClass = 'animate-fade-in-right';
      }
    } else {
      animationClass = 'animate-fade-in-up';
    }
  } else if (initial?.scale && animate?.scale === 1) {
    animationClass = 'animate-scale-in';
  }

  const animationStyle = {
    ...style,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };

  return (
    <div className={`${animationClass} ${className}`} style={animationStyle}>
      {children}
    </div>
  );
}

// Simple AnimatePresence replacement
export function SimpleAnimatePresence({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Export as motion for compatibility
export const motion = SimpleMotion;
export const AnimatePresence = SimpleAnimatePresence;
