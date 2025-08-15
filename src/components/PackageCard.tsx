'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

// 🚨 CURSOR CRITICAL FIX - 2025-07-25 20:35 UTC
// FORCE DEPLOYMENT REFRESH - BUTTON MUST POINT TO /book
// VERCEL: DEPLOY THIS VERSION NOW!
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

interface PackageCardProps {
  pkg: Package;
  categoryColors: Record<string, string>;
  categoryIcons: Record<string, string>;
  className?: string;
  onClick?: () => void;
}

// 🎯 CRITICAL COMPONENT - BUTTON VISIBILITY FIX
export default function PackageCard({
  pkg,
  categoryColors,
  categoryIcons,
  className = '',
  onClick,
}: PackageCardProps) {
  // Hooks must be called before any early returns
  const [isHovered, setIsHovered] = useState(false);
  
  if (!pkg) {
    console.warn('PackageCard: pkg prop is undefined. Not rendering.');
    return null; // Or render a placeholder/error message
  }
  console.log('Rendering PackageCard with pkg:', pkg);
  const gradientClass =
    categoryColors[pkg.category as keyof typeof categoryColors];
  const icon = categoryIcons[pkg.category as keyof typeof categoryIcons];

  // Variants d'animation
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  const badgeVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, 5, -5, 0],
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const,
      },
    },
  };

  const featureVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      className='relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group'
      variants={cardVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      data-testid="package-card"
      role="article"
      aria-labelledby={`package-title-${pkg.id}`}
    >
      {/* Popular Badge avec animation */}
      {pkg.isPopular && (
        <motion.div
          className='absolute top-4 right-4 z-10'
          variants={badgeVariants}
          whileHover='hover'
        >
          <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 md:px-4 py-2 rounded-full text-sm font-bold shadow-lg'>
            Most Popular ⭐
          </div>
        </motion.div>
      )}

      {/* Image avec effet parallaxe */}
      <motion.div
        className='relative h-64 overflow-hidden bg-gray-200'
        variants={imageVariants}
        whileHover='hover'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20' />

        {/* Category Icon avec animation */}
        <motion.div
          className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg'
          whileHover={{
            rotate: 360,
            scale: 1.1,
            transition: { duration: 0.5, ease: 'easeInOut' },
          }}
        >
          {icon}
        </motion.div>

        {/* Overlay avec effet de hover */}
        <motion.div
          className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300'
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </motion.div>

      {/* Content avec animations */}
      <div className='p-6 md:p-8 flex flex-col h-full'>
        <div className='flex-grow'>
          <motion.h3
            id={`package-title-${pkg.id}`}
            className='text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {pkg.title}
          </motion.h3>

          <div className='flex items-center gap-2 mb-4'>
            <motion.div
              className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              €{pkg.price.toLocaleString()}
            </motion.div>
            <div className='text-sm text-gray-500 font-medium'>per person</div>
          </div>

          <p className='text-gray-600 mb-6 leading-relaxed'>
            {pkg.description}
          </p>

          {/* Features avec animations séquentielles */}
          <div className='space-y-2 mb-8'>
            {pkg.features.map((feature, idx) => (
              <motion.div
                key={`${pkg.id}-feature-${idx}`}
                className='flex items-center gap-3 text-sm'
                variants={featureVariants}
                initial='initial'
                animate='animate'
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} flex-shrink-0`}
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
                <span className='text-gray-700'>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🚨 CRITICAL BUTTON - CURSOR URGENT FIX - FORCE DEPLOYMENT! */}
        {/* 🎯 TIMESTAMP: 2025-07-25 20:35 UTC - VERCEL MUST DEPLOY THIS */}
        {/* 🏄‍♂️ BUTTON MUST POINT TO /book NOT /contact */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <Link
            href={`/book?package=${pkg.id}`}
            className='inline-block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 text-center'
            style={{
              display: 'block',
              visibility: 'visible',
              opacity: '1',
              zIndex: '10',
              position: 'relative',
            }}
            aria-label={`Book the ${pkg.title} package for €${pkg.price}`}
            role="button"
          >
            <motion.span
              className='flex items-center justify-center gap-2'
              whileHover={{ gap: '0.75rem' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              🏄‍♂️ Book This Package
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                →
              </motion.span>
            </motion.span>
          </Link>
        </motion.div>
        {/* 🚨 END CRITICAL BUTTON SECTION */}
      </div>
    </motion.div>
  );
}

// 🔧 FORCE DEPLOYMENT: This file updated at 2025-07-25 20:35 UTC
// 📈 Vercel: Cache invalidation required - Deploy NOW!
