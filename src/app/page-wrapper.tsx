'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NavigationSimple from '../components/NavigationSimple';
import NeonHero from '../components/NeonHero';
import GalleryPlus from '../components/GalleryPlus';
import TestimonialsMatrix from '../components/TestimonialsMatrix';
import FooterMinimal from '../components/FooterMinimal';
import { Star, Shield, Users, Trophy, Wind, MapPin } from 'lucide-react';
import Link from 'next/link';
import { PACKAGES_DATA, categoryColors } from '../lib/packages';
import PackageCard from '../components/PackageCard';

// Sample gallery images for GalleryPlus
const galleryImages = [
  {
    id: '1',
    src: '/images/dakhla/dakhla-lagoon-1.jpg',
    alt: 'Dakhla Lagoon Kitesurfing',
    caption: 'Perfect flat water conditions',
    category: 'action' as const,
  },
  {
    id: '2',
    src: '/images/dakhla/dakhla-lagoon-2.jpg',
    alt: 'Kitesurfer in Dakhla',
    caption: 'Epic wind sessions',
    category: 'action' as const,
  },
  {
    id: '3',
    src: '/images/dakhla/dakhla-desert-1.jpg',
    alt: 'Sahara Desert meets Ocean',
    caption: 'Where desert meets the sea',
    category: 'landscape' as const,
  },
  {
    id: '4',
    src: '/images/dakhla/dakhla-sunset-1.jpg',
    alt: 'Dakhla Sunset',
    caption: 'Magical golden hour',
    category: 'lifestyle' as const,
  },
  {
    id: '5',
    src: '/images/dakhla/white-dune-1.jpg',
    alt: 'White Dune Dakhla',
    caption: 'Legendary kite spot',
    category: 'action' as const,
  },
  {
    id: '6',
    src: '/images/dakhla/dakhla-camp-1.jpg',
    alt: 'Kite Camp Dakhla',
    caption: 'Ultimate kite experience',
    category: 'lifestyle' as const,
  },
];

export default function HomePageWrapper() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky via-sand to-ocean'>
      <NavigationSimple />
      
      <main>
        <NeonHero />
        
        {/* Quick Stats Section */}
        <section className='py-12 bg-ocean/5'>
          <div className='container mx-auto px-4'>
            <motion.div 
              className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className='flex flex-col items-center space-y-2'>
                <Wind className='w-8 h-8 text-ocean' />
                <div className='text-2xl font-bold text-night'>300+</div>
                <div className='text-sm text-night/70'>Jours de vent</div>
              </div>
              <div className='flex flex-col items-center space-y-2'>
                <Users className='w-8 h-8 text-ocean' />
                <div className='text-2xl font-bold text-night'>1000+</div>
                <div className='text-sm text-night/70'>Riders formés</div>
              </div>
              <div className='flex flex-col items-center space-y-2'>
                <Trophy className='w-8 h-8 text-ocean' />
                <div className='text-2xl font-bold text-night'>15+</div>
                <div className='text-sm text-night/70'>Années d\'expérience</div>
              </div>
              <div className='flex flex-col items-center space-y-2'>
                <Shield className='w-8 h-8 text-ocean' />
                <div className='text-2xl font-bold text-night'>100%</div>
                <div className='text-sm text-night/70'>Sécurité garantie</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Packages Section */}
        <section className='py-16 bg-white'>
          <div className='container mx-auto px-4'>
            <motion.div 
              className='text-center mb-12'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className='text-3xl md:text-4xl font-bold text-night mb-4'>
                Nos Packages Kitesurf
              </h2>
              <p className='text-lg text-night/70 max-w-2xl mx-auto'>
                Découvrez nos formules adaptées à tous les niveaux, du débutant au rider confirmé
              </p>
            </motion.div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {PACKAGES_DATA.slice(0, 6).map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PackageCard 
                    pkg={pkg}
                    categoryColors={{}}
                    categoryIcons={{}}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div 
              className='text-center mt-12'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link 
                href='/packages'
                className='inline-flex items-center space-x-2 bg-ocean text-night px-8 py-3 rounded-full font-semibold hover:bg-ocean/90 transition-colors'
              >
                <span>Voir tous les packages</span>
                <MapPin className='w-5 h-5' />
              </Link>
            </motion.div>
          </div>
        </section>

        <GalleryPlus title="Découvrez Dakhla" images={galleryImages} />
        <TestimonialsMatrix />
      </main>

      <FooterMinimal />
    </div>
  );
}