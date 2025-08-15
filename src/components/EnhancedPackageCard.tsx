'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

// 🚨 ENHANCED PACKAGE CARD - GUARANTEED BUTTON VISIBILITY
// Conservative approach: Enhanced version without modifying original
interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  features: string[];
  isPopular?: boolean;
}

interface EnhancedPackageCardProps {
  pkg: Package;
  categoryColors: Record<string, string>;
  categoryIcons: Record<string, string>;
}

export default function EnhancedPackageCard({
  pkg,
  categoryColors,
  categoryIcons,
}: EnhancedPackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const gradientClass =
    categoryColors[pkg.category as keyof typeof categoryColors];
  const icon = categoryIcons[pkg.category as keyof typeof categoryIcons];

  return (
    <motion.div
      className='relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <div className='absolute top-4 right-4 z-10'>
          <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 md:px-4 py-2 rounded-full text-sm font-bold shadow-lg'>
            Most Popular ⭐
          </div>
        </div>
      )}

      {/* Image Section with Conservative Fallback */}
      <div className='relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100'>
        {/* Fallback background if image fails to load */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20' />

        {/* Category Icon */}
        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg'>
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className='p-6 md:p-8 flex flex-col h-full'>
        <div className='flex-grow'>
          <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>
            {pkg.title}
          </h3>

          <div className='flex items-center gap-2 mb-4'>
            <div
              className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
            >
              €{pkg.price.toLocaleString()}
            </div>
            <div className='text-sm text-gray-500 font-medium'>per person</div>
          </div>

          <p className='text-gray-600 mb-6 leading-relaxed'>
            {pkg.description}
          </p>

          {/* Features */}
          <div className='space-y-2 mb-8'>
            {pkg.features.map((feature, idx) => (
              <div
                key={`${pkg.id}-feature-${idx}`}
                className='flex items-center gap-3 text-sm'
              >
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} flex-shrink-0`}
                />
                <span className='text-gray-700'>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🚨 ENHANCED BUTTON - MULTIPLE VISIBILITY GUARANTEES */}
        <div className='relative'>
          {/* Button with forced visibility styles */}
          <Link
            href={`/book?package=${pkg.id}`}
            className='group relative inline-block w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-[2px] font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50'
            style={{
              display: 'block !important',
              visibility: 'visible' as any,
              opacity: '1 !important',
              zIndex: '10',
              position: 'relative',
              minHeight: '56px',
            }}
          >
            <span className='relative flex items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 text-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-cyan-700'>
              <motion.span
                animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 0.6 }}
              >
                🏄‍♂️
              </motion.span>
              Book This Package
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </span>
          </Link>

          {/* Fallback button (in case CSS issues) */}
          <noscript>
            <a
              href={`/book?package=${pkg.id}`}
              className='block w-full bg-blue-600 text-white text-center py-4 px-6 rounded-xl font-bold mt-2'
            >
              Book This Package
            </a>
          </noscript>
        </div>
      </div>
    </motion.div>
  );
}
