'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

// Images Matrix Dakhla avec alt tags SEO-friendly
const galleryImages = [
  {
    src: '/images/dakhla/dakhla-lagoon-1.jpg',
    alt: 'Kitesurfer riding the crystal clear waters of Dakhla Lagoon at golden hour',
    title: 'Dakhla Lagoon Paradise',
    description: 'Crystal clear waters meet endless desert horizons',
  },
  {
    src: '/images/dakhla/dakhla-lagoon-2.jpg',
    alt: 'Aerial view of Dakhla Lagoon showing the perfect wind conditions for kitesurfing',
    title: 'Perfect Wind Conditions',
    description: 'Consistent trade winds create ideal kitesurfing conditions',
  },
  {
    src: '/images/dakhla/white-dune-1.jpg',
    alt: 'Majestic white sand dunes of Dakhla desert landscape at sunset',
    title: 'Desert Majesty',
    description: 'Where ocean meets desert in perfect harmony',
  },
  {
    src: '/images/dakhla/white-dune-2.jpg',
    alt: "Panoramic view of Dakhla's white dunes stretching towards the Atlantic Ocean",
    title: 'Ocean Meets Desert',
    description: 'The unique landscape that makes Dakhla legendary',
  },
];

// Composant Particules Matrix
const MatrixParticles = () => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60'
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Composant Effet Glassmorphism avec Bordures Néon
const GlassmorphismCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Bordures néon animées */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-magenta-500 p-[2px] animate-pulse'>
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-magenta-500/20 blur-sm'></div>
      </div>

      {/* Contenu glassmorphism */}
      <div className='relative bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl'>
        {children}
      </div>
    </div>
  );
};

const DakhlaGallery: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Motion values pour les effets 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const nextImage = useCallback(() => {
    setIndex(prevIndex => (prevIndex + 1) % galleryImages.length);
  }, []);

  const prevImage = useCallback(() => {
    setIndex(
      prevIndex => (prevIndex - 1 + galleryImages.length) % galleryImages.length
    );
  }, []);

  // Auto-play avec pause au hover
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % galleryImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAutoPlaying, nextImage, prevImage]);

  // Swipe handlers pour mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      className='relative w-full py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden'
      aria-label='Dakhla Lagoon Gallery'
    >
      {/* Particules Matrix */}
      <MatrixParticles />

      {/* Grille de fond Matrix */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20'></div>

      <div className='container mx-auto px-4 relative z-10'>
        {/* Titre Matrix */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl md:text-6xl font-bold text-white mb-4'>
            <span className='bg-gradient-to-r from-cyan-400 via-purple-500 to-magenta-500 bg-clip-text text-transparent animate-pulse'>
              DAKHLA MATRIX
            </span>
          </h2>
          <p className='text-xl text-cyan-400/80 max-w-2xl mx-auto'>
            Where the digital realm meets the natural world
          </p>
        </motion.div>

        {/* Contrôles de lecture */}
        <div className='flex justify-center mb-8'>
          <GlassmorphismCard className='inline-block'>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className='flex items-center gap-2 px-6 py-3 text-white hover:text-cyan-400 transition-colors'
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span className='hidden sm:inline'>
                {isAutoPlaying ? 'Pause' : 'Play'}
              </span>
            </button>
          </GlassmorphismCard>
        </div>

        {/* Galerie principale */}
        <div
          className='relative h-[400px] md:h-[600px] max-w-5xl mx-auto'
          {...swipeHandlers}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence initial={false} mode='wait'>
            <motion.div
              key={index}
              className='absolute inset-0 w-full h-full'
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -45 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                type: 'spring',
                stiffness: 100,
              }}
              style={{ rotateX, rotateY }}
            >
              <GlassmorphismCard className='w-full h-full'>
                <div className='relative w-full h-full p-2'>
                  <Image
                    src={galleryImages[index]?.src || ''}
                    alt={galleryImages[index]?.alt || ''}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
                    className='rounded-xl object-cover'
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />

                  {/* Overlay avec informations */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl'>
                    <div className='absolute bottom-6 left-6 right-6'>
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-2xl md:text-3xl font-bold text-white mb-2'
                      >
                        {galleryImages[index]?.title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='text-cyan-400/90 text-lg'
                      >
                        {galleryImages[index]?.description}
                      </motion.p>
                    </div>
                  </div>

                  {/* Indicateur de chargement */}
                  {isLoading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl'>
                      <div className='w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin'></div>
                    </div>
                  )}
                </div>
              </GlassmorphismCard>
            </motion.div>
          </AnimatePresence>

          {/* Boutons de navigation */}
          <motion.button
            onClick={prevImage}
            className='absolute top-1/2 -translate-y-1/2 left-4 md:-left-16 p-4 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300 z-20 border border-cyan-400/30 hover:border-cyan-400'
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            aria-label='Previous image'
          >
            <ChevronLeft size={28} />
          </motion.button>

          <motion.button
            onClick={nextImage}
            className='absolute top-1/2 -translate-y-1/2 right-4 md:-right-16 p-4 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300 z-20 border border-cyan-400/30 hover:border-cyan-400'
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label='Next image'
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>

        {/* Indicateurs de navigation */}
        <div className='flex justify-center mt-8 space-x-4'>
          {galleryImages.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                index === i
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-400/50'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to image ${i + 1}`}
            >
              {index === i && (
                <motion.div
                  className='absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500'
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Informations d'accessibilité */}
        <div className='text-center mt-8 text-gray-400 text-sm'>
          <p>
            Use arrow keys ← → to navigate • Space to play/pause •<br />
            Swipe on mobile
          </p>
        </div>
      </div>
    </section>
  );
};

export default DakhlaGallery;
