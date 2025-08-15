'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  fallbackText?: string;
}

export default function SafeImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  fallbackSrc = '/images/dakhla/dakhla-lagoon-1.jpg',
  fallbackText = 'Dakhla Kitesurfing',
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleError = () => {
    if (!imageError) {
      setImageError(true);
    } else {
      setFallbackError(true);
    }
  };

  // Si les deux images échouent, afficher un placeholder stylisé
  if (fallbackError) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className='text-center text-white p-4'>
          <div className='text-4xl mb-2'>🏄‍♂️</div>
          <div className='text-sm font-medium'>{fallbackText}</div>
          <div className='text-xs opacity-75'>Dakhla, Morocco</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imageError ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: 'auto',
      }}
    />
  );
}
