'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wind, MapPin } from 'lucide-react';

interface NeonHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  category?: 'beginner' | 'exploration' | 'combined';
  backgroundImage?: string;
}

const categoryGradients = {
  beginner: 'from-emerald-400 via-teal-500 to-cyan-600',
  exploration: 'from-orange-400 via-red-500 to-pink-600',
  combined: 'from-purple-400 via-violet-500 to-indigo-600',
};

const categoryAccents = {
  beginner: 'text-emerald-400',
  exploration: 'text-orange-400',
  combined: 'text-purple-400',
};

export default function NeonHero({
  title = "Dakhla Kitesurf Adventure",
  subtitle = "Discover the Magic of Morocco",
  description = "Experience world-class kitesurfing in the pristine waters of Dakhla Lagoon",
  price = 850,
  category = "exploration",
  backgroundImage,
}: NeonHeroProps) {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900'>
      {/* Animated Background */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' />

        {/* Animated Particles */}
        <div className='absolute inset-0'>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${categoryGradients[category]} rounded-full opacity-60`}
              animate={{
                x: [0, Math.random() * 1920],
                y: [0, Math.random() * 1080],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5,
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>

        {/* Neon Grid */}
        <div className='absolute inset-0 opacity-20'>
          <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern
                id='grid'
                width='100'
                height='100'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M 100 0 L 0 0 0 100'
                  fill='none'
                  stroke={`url(#gradient-${category})`}
                  strokeWidth='1'
                />
              </pattern>
              <linearGradient
                id={`gradient-${category}`}
                x1='0%'
                y1='0%'
                x2='100%'
                y2='100%'
              >
                <stop
                  offset='0%'
                  stopColor='currentColor'
                  className={categoryAccents[category]}
                />
                <stop offset='100%' stopColor='transparent' />
              </linearGradient>
            </defs>
            <rect width='100%' height='100%' fill='url(#grid)' />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 max-w-6xl mx-auto px-6 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className='inline-flex items-center gap-2 mb-6'
          >
            <div
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${categoryGradients[category]} bg-opacity-20 border border-opacity-30 backdrop-blur-sm`}
            >
              <span
                className={`text-sm font-bold uppercase tracking-wider ${categoryAccents[category]}`}
              >
                {category} Package
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='text-5xl md:text-7xl font-black mb-4'
          >
            <span className='text-white'>{title.split(' ')[0]}</span>
            <br />
            <span
              className={`bg-gradient-to-r ${categoryGradients[category]} bg-clip-text text-transparent`}
            >
              {title.split(' ').slice(1).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className='text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto font-light'
          >
            {subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className='text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed'
          >
            {description}
          </motion.p>

          {/* Price Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className='mb-10'
          >
            <div className='inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-black bg-opacity-50 backdrop-blur-lg border border-gray-700'>
              <span className='text-gray-400 text-sm'>Starting from</span>
              <span
                className={`text-4xl font-black bg-gradient-to-r ${categoryGradients[category]} bg-clip-text text-transparent`}
              >
                €{price.toLocaleString()}
              </span>
              <span className='text-gray-400 text-sm'>per person</span>
            </div>
          </motion.div>

          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className='flex items-center justify-center gap-3 text-gray-300'
          >
            <MapPin className='w-5 h-5 text-cyan-400' />
            <span className='text-lg'>Dakhla Lagoon, Morocco</span>
            <Wind className='w-5 h-5 text-cyan-400' />
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className='absolute top-1/4 left-10 opacity-30'
          >
            <Sparkles className='w-12 h-12 text-cyan-400' />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
            className='absolute top-1/3 right-10 opacity-30'
          >
            <Wind className='w-10 h-10 text-purple-400' />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent' />
    </section>
  );
}
