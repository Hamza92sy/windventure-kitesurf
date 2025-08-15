'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Wind,
  MapPin,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PACKAGES_DATA } from '../../lib/packages';

const categoryColors = {
  beginner: 'from-emerald-400 via-teal-500 to-cyan-600',
  exploration: 'from-orange-400 via-red-500 to-pink-600',
  combined: 'from-purple-400 via-violet-500 to-indigo-600',
};

const categoryAccents = {
  beginner: 'text-emerald-400',
  exploration: 'text-orange-400',
  combined: 'text-purple-400',
};

export default function Packages() {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' />

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30'
            animate={{
              x: [0, Math.random() * 1920],
              y: [0, Math.random() * 1080],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
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

      <div className='relative z-10'>
        {/* Navigation */}
        <nav className='p-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-white hover:text-cyan-400 font-semibold transition-colors group'
          >
            <motion.span
              className='transform group-hover:-translate-x-1 transition-transform'
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className='w-5 h-5' />
            </motion.span>
            Back to Home
          </Link>
        </nav>

        <div className='max-w-7xl mx-auto px-6 pb-20'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h1 className='text-5xl md:text-7xl font-black mb-6'>
              <span className='text-white'>Choose Your</span>
              <br />
              <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                Adventure
              </span>
            </h1>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
              Discover our carefully crafted kitesurfing packages designed for
              every level, from complete beginners to experienced riders seeking
              new challenges in Dakhla's legendary conditions.
            </p>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='flex items-center justify-center gap-6 mt-8 text-gray-400'
            >
              <div className='flex items-center gap-2'>
                <MapPin className='w-5 h-5 text-cyan-400' />
                <span>Dakhla, Morocco</span>
              </div>
              <div className='w-px h-6 bg-gray-600' />
              <div className='flex items-center gap-2'>
                <Wind className='w-5 h-5 text-cyan-400' />
                <span>300+ Wind Days</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Packages Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto'>
            {PACKAGES_DATA.map((pkg, index) => {
              const gradientClass =
                categoryColors[pkg.category as keyof typeof categoryColors] ||
                categoryColors.beginner;
              const accentClass =
                categoryAccents[pkg.category as keyof typeof categoryAccents] ||
                categoryAccents.beginner;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredPackage(pkg.id)}
                  onHoverEnd={() => setHoveredPackage(null)}
                  className='relative group'
                >
                  <div className='bg-gray-800/50 backdrop-blur-lg rounded-3xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20'>
                    {/* Package Header */}
                    <div
                      className={`relative h-56 bg-gradient-to-br ${gradientClass} bg-opacity-20 overflow-hidden`}
                    >
                      {/* Animated background */}
                      <div className='absolute inset-0 opacity-20'>
                        <motion.div
                          animate={{
                            backgroundPosition:
                              hoveredPackage === pkg.id
                                ? ['0% 0%', '100% 100%']
                                : '0% 0%',
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className='w-full h-full'
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 20% 80%, ${accentClass.replace('text-', '')} 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, ${accentClass.replace('text-', '')} 0%, transparent 50%)
                            `.replace(
                              /text-(\w+)-(\d+)/g,
                              'rgba(var(--$1-$2), 0.3)'
                            ),
                            backgroundSize: '400% 400%',
                          }}
                        />
                      </div>

                      {/* Popular Badge */}
                      {pkg.isPopular && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='absolute top-4 right-4 z-10'
                        >
                          <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1'>
                            <Star className='w-4 h-4 fill-current' />
                            Most Popular
                          </div>
                        </motion.div>
                      )}

                      {/* Category Badge */}
                      <div className='absolute top-4 left-4'>
                        <div
                          className={`px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20`}
                        >
                          <span
                            className={`text-sm font-bold uppercase tracking-wider ${accentClass}`}
                          >
                            {pkg.category}
                          </span>
                        </div>
                      </div>

                      {/* Floating Icon */}
                      <motion.div
                        animate={{
                          y: hoveredPackage === pkg.id ? [-10, 10, -10] : 0,
                          rotate: hoveredPackage === pkg.id ? [0, 5, -5, 0] : 0,
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className='absolute bottom-6 right-6 text-6xl opacity-30'
                      >
                        🏄‍♂️
                      </motion.div>
                    </div>

                    {/* Package Content */}
                    <div className='p-8'>
                      <h2 className='text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors'>
                        {pkg.title}
                      </h2>

                      {/* Price */}
                      <div className='flex items-center gap-3 mb-6'>
                        <div
                          className={`text-4xl font-black bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                        >
                          €{pkg.price.toLocaleString()}
                        </div>
                        <div className='text-gray-400 font-medium'>
                          per person
                        </div>
                      </div>

                      {/* Description */}
                      <p className='text-gray-300 mb-6 leading-relaxed'>
                        {pkg.description}
                      </p>

                      {/* Features */}
                      <div className='space-y-3 mb-8'>
                        <h3 className='font-semibold text-white flex items-center gap-2'>
                          <Sparkles className='w-5 h-5 text-cyan-400' />
                          What's included:
                        </h3>
                        {pkg.features.slice(0, 4).map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className='flex items-center gap-3'
                          >
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass}`}
                            />
                            <span className='text-gray-300 text-sm'>
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                        {pkg.features.length > 4 && (
                          <div className='text-gray-400 text-sm ml-5'>
                            +{pkg.features.length - 4} more features...
                          </div>
                        )}
                      </div>

                      {/* Package Stats */}
                      <div className='grid grid-cols-3 gap-4 mb-8 p-4 bg-black/20 rounded-lg'>
                        <div className='text-center'>
                          <div className={`text-lg font-bold ${accentClass}`}>
                            {pkg.duration || 'Flexible'}
                          </div>
                          <div className='text-gray-400 text-xs'>Duration</div>
                        </div>
                        <div className='text-center'>
                          <div className={`text-lg font-bold ${accentClass}`}>
                            {pkg.maxParticipants || '20'}
                          </div>
                          <div className='text-gray-400 text-xs'>
                            Max People
                          </div>
                        </div>
                        <div className='text-center'>
                          <div
                            className={`text-lg font-bold ${accentClass} capitalize`}
                          >
                            {pkg.difficulty || 'All'}
                          </div>
                          <div className='text-gray-400 text-xs'>Level</div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/packages/${pkg.id}`}
                        className='block w-full'
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full bg-gradient-to-r ${gradientClass} text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden group`}
                        >
                          <span className='relative z-10 flex items-center justify-center gap-2'>
                            ✨ Explore This Package
                          </span>
                          <motion.div
                            className='absolute inset-0 bg-white/20'
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='text-center mt-16'
          >
            <p className='text-gray-400 mb-6'>
              Can't decide? Contact us for personalized recommendations
            </p>
            <Link
              href='/contact'
              className='inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold'
            >
              Get Expert Advice
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
