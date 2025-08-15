'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: 'action' | 'landscape' | 'equipment' | 'people';
}

interface GalleryPlusProps {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
  autoPlay?: boolean;
  showCategories?: boolean;
}

const categoryFilters = {
  all: 'All Photos',
  action: 'Action Shots',
  landscape: 'Landscapes',
  equipment: 'Equipment',
  people: 'People & Fun',
};

const categoryColors = {
  action: 'from-red-500 to-orange-500',
  landscape: 'from-blue-500 to-cyan-500',
  equipment: 'from-green-500 to-emerald-500',
  people: 'from-purple-500 to-pink-500',
};

export default function GalleryPlus({
  title,
  subtitle,
  images,
  autoPlay = false,
  showCategories = true,
}: GalleryPlusProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof categoryFilters>('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Filter images by category
  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter(img => img.category === selectedCategory);

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && filteredImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPlaying, filteredImages.length]);

  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      prev => (prev - 1 + filteredImages.length) % filteredImages.length
    );
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section className='py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-6xl font-black mb-6'>
            <span className='text-white'>{title.split(' ')[0]}</span>{' '}
            <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              {title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          {subtitle && (
            <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Category Filters */}
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='flex flex-wrap justify-center gap-4 mb-12'
          >
            {Object.entries(categoryFilters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key as keyof typeof categoryFilters);
                  setCurrentIndex(0);
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Main Gallery */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='lg:col-span-2 relative'
          >
            <div className='relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-800 group'>
              <AnimatePresence mode='wait'>
                {filteredImages.length > 0 && (
                  <motion.div
                    key={`${selectedCategory}-${currentIndex}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className='relative w-full h-full'
                  >
                    <Image
                      src={
                        filteredImages[currentIndex]?.src ||
                        '/images/placeholder.jpg'
                      }
                      alt={filteredImages[currentIndex]?.alt || 'Gallery image'}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 66vw'
                    />

                    {/* Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                    {/* Expand Button */}
                    <button
                      onClick={() => openLightbox(currentIndex)}
                      aria-label='Expand image'
                      className='absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                    >
                      <Maximize2 className='w-5 h-5' />
                    </button>

                    {/* Caption */}
                    {filteredImages[currentIndex]?.caption && (
                      <div className='absolute bottom-4 left-4 right-4'>
                        <p className='text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          {filteredImages[currentIndex].caption}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label='Previous image'
                    className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                  >
                    <ChevronLeft className='w-6 h-6' />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label='Next image'
                    className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                  >
                    <ChevronRight className='w-6 h-6' />
                  </button>
                </>
              )}

              {/* Play/Pause Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                className='absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
              >
                <Play
                  className={`w-5 h-5 ${isPlaying ? 'opacity-50' : 'opacity-100'}`}
                />
              </button>
            </div>

            {/* Progress Indicators */}
            {filteredImages.length > 1 && (
              <div className='flex justify-center mt-6 gap-2'>
                {filteredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-cyan-500 to-blue-600'
                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Thumbnail Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='space-y-4'
          >
            <h3 className='text-xl font-bold text-white mb-4'>Gallery</h3>
            <div className='grid grid-cols-2 lg:grid-cols-1 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar'>
              {filteredImages.map((image, index) => (
                <motion.button
                  key={`thumb-${image.id}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Select image ${index + 1}: ${image.alt}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                    index === currentIndex
                      ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-900'
                      : 'hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-900'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className='object-cover'
                    sizes='150px'
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      index === currentIndex
                        ? 'bg-cyan-500/20'
                        : 'bg-black/20 hover:bg-black/10'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
              onClick={() => setIsLightboxOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className='relative max-w-4xl max-h-full'
                onClick={e => e.stopPropagation()}
              >
                <Image
                  src={
                    filteredImages[lightboxIndex]?.src ||
                    '/images/placeholder.jpg'
                  }
                  alt={filteredImages[lightboxIndex]?.alt || 'Gallery image'}
                  width={1200}
                  height={800}
                  className='object-contain max-h-[80vh] rounded-lg'
                />
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className='absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
