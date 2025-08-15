'use client';

import React from 'react';
import Link from 'next/link';
import EnhancedPackageCard from '@/components/EnhancedPackageCard';

// --- PACKAGE DATA ---
const PACKAGES_DATA = [
  {
    id: 'beginner-private',
    title: 'Beginner Package (Private)',
    description:
      'One-on-one instruction for complete beginners. Learn at your own pace with personalized attention.',
    price: 720,
    image: '/images/package-beginner-private.jpg',
    category: 'beginner',
    features: [
      'Private instructor',
      'All equipment included',
      '6 hours training',
      'Safety briefing',
      'Progress assessment',
    ],
  },
  {
    id: 'beginner-semi-private',
    title: 'Beginner Package (Semi-Private)',
    description:
      'Share the experience with a friend. Perfect balance of personal attention and social learning.',
    price: 1100,
    image: '/images/package-beginner-semi.jpg',
    category: 'beginner',
    features: [
      'Small group (2-3 people)',
      'All equipment included',
      '8 hours training',
      'Shared learning experience',
      'Group dynamics',
    ],
  },
  {
    id: 'exploration',
    title: 'Exploration Package',
    description:
      'Discover multiple kitesurfing spots around Dakhla. For intermediate riders looking to expand their horizons.',
    price: 1250,
    image: '/images/package-exploration.jpg',
    category: 'exploration',
    features: [
      'Multiple locations',
      'Transport included',
      '10 hours coaching',
      'Spot variety',
      'Local insights',
    ],
  },
  {
    id: 'combined',
    title: 'Combined Package',
    description:
      'Our most comprehensive offering, blending technique mastery with adventure exploration.',
    price: 1350,
    image: '/images/package-combined.jpg',
    category: 'combined',
    isPopular: true,
    features: [
      'Best of both worlds',
      '12 hours training',
      '3 different spots',
      'Technique & adventure',
      'Complete experience',
    ],
  },
];

const categoryColors = {
  beginner: 'from-emerald-500 to-teal-600',
  advanced: 'from-blue-600 to-indigo-700',
  exploration: 'from-orange-500 to-red-600',
  combined: 'from-purple-600 to-pink-600',
} as const;

const categoryIcons = {
  beginner: '🌊',
  advanced: '⚡',
  exploration: '🗺️',
  combined: '🎯',
} as const;

export default function PackagesContent() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
      <HeroSection />

      {/* Packages Grid */}
      <section className='container mx-auto px-4 pb-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto'>
          {PACKAGES_DATA.map(pkg => (
            <EnhancedPackageCard
              key={pkg.id}
              pkg={pkg}
              categoryColors={categoryColors}
              categoryIcons={categoryIcons}
            />
          ))}
        </div>
      </section>

      <CallToAction />
      <NavigationHome />
    </main>
  );
}

// --- COMPONENTS ---
function HeroSection() {
  return (
    <section className='relative overflow-hidden pt-20'>
      <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10' />
      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='text-center max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 md:px-6 py-3 mb-6 md:mb-8 shadow-lg'>
            <div
              className='w-3 h-3 bg-green-500 rounded-full animate-pulse'
              suppressHydrationWarning
            />
            <span className='text-sm font-semibold text-gray-700'>
              Premium Wind Adventures
            </span>
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-4 md:mb-6 leading-tight'>
            Kitesurf{' '}
            <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
              Packages
            </span>
          </h1>
          <p className='text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto'>
            Embark on the ultimate wind adventure with our expertly crafted
            kitesurfing experiences. From first-time riders to seasoned pros, we
            have the perfect package waiting for you.
          </p>
          <div className='flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-600'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full' />
              <span>Certified Instructors</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full' />
              <span>Premium Equipment</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-orange-500 rounded-full' />
              <span>Perfect Wind Conditions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <div className='text-center mt-16 p-6 md:p-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-2xl max-w-4xl mx-auto'>
      <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
        Ready to Catch the Wind?
      </h2>
      <p className='text-blue-100 mb-6 md:mb-8 text-base md:text-lg'>
        Join hundreds of satisfied adventurers who have discovered the thrill of
        kitesurfing.
      </p>
      <div className='flex flex-wrap justify-center gap-4'>
        <Link
          href='/book'
          className='bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50'
        >
          🏄‍♂️ Book Your Adventure
        </Link>
      </div>
    </div>
  );
}

function NavigationHome() {
  return (
    <section className='container mx-auto px-4 py-12'>
      <div className='text-center'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors group'
        >
          <span className='transform group-hover:-translate-x-1 transition-transform'>
            ←
          </span>
          Back to Home
        </Link>
      </div>
    </section>
  );
}
