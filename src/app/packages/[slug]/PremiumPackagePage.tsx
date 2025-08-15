'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Star,
  Shield,
  Wind,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import our new premium components
import NeonHero from '../../../components/NeonHero';
import GalleryPlus from '../../../components/GalleryPlus';
import BookingPro from '../../../components/BookingPro';
import TestimonialsMatrix from '../../../components/TestimonialsMatrix';

// Import existing utilities
import { PACKAGES_DATA, PackageUtils } from '../../../lib/packages';

interface PremiumPackagePageProps {
  slug: string;
}

// Sample gallery images for each package type
const packageGalleries = {
  'beginner-private': [
    {
      id: '1',
      src: '/images/gallery/kitesurf-action-01.webp',
      alt: 'Private kitesurf lesson in Dakhla',
      caption: 'One-on-one instruction in perfect conditions',
      category: 'people' as const,
    },
    {
      id: '2',
      src: '/images/spots/dakhla-spot-01.webp',
      alt: 'Dakhla lagoon for beginners',
      caption: 'Safe and shallow waters perfect for learning',
      category: 'landscape' as const,
    },
    {
      id: '3',
      src: '/images/equipment/kitesurf-gear-01.webp',
      alt: 'Professional kitesurf equipment',
      caption: 'Top-quality equipment included',
      category: 'equipment' as const,
    },
  ],
  'beginner-semi-private': [
    {
      id: '4',
      src: '/images/gallery/kitesurf-action-02.webp',
      alt: 'Group kitesurf lesson',
      caption: 'Learn with friends in small groups',
      category: 'people' as const,
    },
    {
      id: '5',
      src: '/images/spots/dakhla-spot-02.webp',
      alt: 'Group lesson spot in Dakhla',
      caption: 'Perfect conditions for group learning',
      category: 'landscape' as const,
    },
  ],
  exploration: [
    {
      id: '6',
      src: '/images/dakhla/white-dune-real.jpg',
      alt: 'White Dune Dakhla',
      caption: 'Explore the legendary White Dune',
      category: 'landscape' as const,
    },
    {
      id: '7',
      src: '/images/dakhla/dragon-island.jpg',
      alt: 'Dragon Island kitesurfing',
      caption: 'Discover the mystical Dragon Island',
      category: 'action' as const,
    },
  ],
  combined: [
    {
      id: '8',
      src: '/images/gallery/kitesurf-action-03.webp',
      alt: 'Advanced kitesurf moves',
      caption: 'Master advanced techniques',
      category: 'action' as const,
    },
    {
      id: '9',
      src: '/images/spots/dakhla-spot-03.webp',
      alt: 'Multiple kitesurf spots',
      caption: 'Experience various conditions',
      category: 'landscape' as const,
    },
  ],
};

export default function PremiumPackagePage({ slug }: PremiumPackagePageProps) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof PACKAGES_DATA)[0] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const pkg = PackageUtils.findById(slug);
      if (pkg) {
        setSelectedPackage(pkg);
        setIsLoading(false);
      } else {
        router.push('/packages');
      }
    }
  }, [slug, router]);

  const handleBookingSubmit = async (formData: any) => {
    if (!selectedPackage) return;

    try {
      // Create booking in database
      const bookingData = {
        package_id: selectedPackage.id,
        package_title: selectedPackage.title,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.date,
        participants: formData.participants,
        notes: formData.notes,
        total_price: selectedPackage.price * formData.participants,
        status: 'pending' as const,
      };

      // Create booking in Supabase
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      const { booking } = await response.json();

      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          packageTitle: selectedPackage.title,
          price: selectedPackage.price,
          participants: formData.participants,
          bookingId: booking.id,
        }),
      });

      if (!checkoutResponse.ok)
        throw new Error('Failed to create checkout session');

      const { url } = await checkoutResponse.json();

      // Redirect to Stripe Checkout
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  };

  if (isLoading || !selectedPackage) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4'></div>
          <p className='text-gray-300'>Loading premium experience...</p>
        </div>
      </div>
    );
  }

  // Get hero content based on package
  const getHeroContent = () => {
    const baseContent = {
      title: selectedPackage.title,
      price: selectedPackage.price,
      category: selectedPackage.category as
        | 'beginner'
        | 'exploration'
        | 'combined',
    };

    switch (selectedPackage.id) {
      case 'beginner-private':
        return {
          ...baseContent,
          subtitle: 'Master the Art of Flight with Personal Guidance',
          description:
            "Experience the ultimate learning journey with dedicated one-on-one instruction in Dakhla's pristine lagoon. Your personal instructor will guide you from first steps to confident riding.",
        };
      case 'beginner-semi-private':
        return {
          ...baseContent,
          subtitle: 'Learn Together, Soar Together',
          description:
            'Share the adventure with friends while receiving expert instruction in small groups. Perfect balance of personal attention and social energy.',
        };
      case 'exploration':
        return {
          ...baseContent,
          subtitle: "Discover Dakhla's Hidden Gems",
          description:
            'Journey through legendary spots from the mystical White Dune to Dragon Island. Explore where few have ventured and experience conditions that dreams are made of.',
        };
      case 'combined':
        return {
          ...baseContent,
          subtitle: 'The Ultimate Dakhla Experience',
          description:
            "Master your technique while exploring breathtaking locations. The perfect fusion of skill development and adventure across Dakhla's most spectacular spots.",
        };
      default:
        return {
          ...baseContent,
          subtitle: 'Experience Dakhla Like Never Before',
          description:
            "Discover the magic of kitesurfing in one of the world's most beautiful destinations.",
        };
    }
  };

  const heroContent = getHeroContent();
  const galleryImages =
    packageGalleries[selectedPackage.id as keyof typeof packageGalleries] || [];

  return (
    <div className='min-h-screen bg-slate-900'>
      {/* Navigation */}
      <nav className='absolute top-0 left-0 right-0 z-50 p-6'>
        <Link
          href='/packages'
          className='inline-flex items-center gap-2 text-white hover:text-cyan-400 font-semibold transition-colors group'
        >
          <motion.span
            className='transform group-hover:-translate-x-1 transition-transform'
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className='w-5 h-5' />
          </motion.span>
          Back to Packages
        </Link>
      </nav>

      {/* Hero Section */}
      <NeonHero
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        description={heroContent.description}
        price={heroContent.price}
        category={heroContent.category}
      />

      {/* Package Details Section */}
      <section className='py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Package Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className='text-3xl font-bold text-white mb-6'>
                What Makes This Special
              </h3>

              {/* Features Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
                {selectedPackage.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className='flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm'
                  >
                    <div className='w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full' />
                    <span className='text-gray-300'>{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Package Stats */}
              <div className='grid grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='text-2xl font-black text-cyan-400 mb-1'>
                    {selectedPackage.duration}
                  </div>
                  <div className='text-gray-400 text-sm'>Duration</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-black text-cyan-400 mb-1'>
                    {selectedPackage.maxParticipants || '20'}
                  </div>
                  <div className='text-gray-400 text-sm'>Max People</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-black text-cyan-400 mb-1'>
                    {selectedPackage.difficulty || 'All'}
                  </div>
                  <div className='text-gray-400 text-sm'>Level</div>
                </div>
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700'
            >
              <h4 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
                <Star className='w-5 h-5 text-yellow-400' />
                Package Highlights
              </h4>

              {selectedPackage.highlights && (
                <div className='space-y-4'>
                  {selectedPackage.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className='flex items-start gap-3'
                    >
                      <div className='w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        <div className='w-2 h-2 bg-white rounded-full' />
                      </div>
                      <span className='text-gray-300'>{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Safety Badge */}
              <div className='mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
                <div className='flex items-center gap-3 text-green-400'>
                  <Shield className='w-5 h-5' />
                  <span className='font-semibold'>
                    Fully Insured & Certified
                  </span>
                </div>
                <p className='text-green-300/80 text-sm mt-1'>
                  All activities include comprehensive insurance and certified
                  instruction.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <GalleryPlus
          title='Experience Preview'
          subtitle='See what awaits you in this incredible adventure'
          images={galleryImages}
          autoPlay={true}
          showCategories={true}
        />
      )}

      {/* Testimonials */}
      <TestimonialsMatrix />

      {/* Booking Section */}
      <section className='py-20 bg-gradient-to-br from-gray-900 to-slate-900'>
        <div className='max-w-7xl mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Ready for Your{' '}
              <span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
                Adventure?
              </span>
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
              Book your {selectedPackage.title.toLowerCase()} and experience the
              magic of Dakhla
            </p>
          </motion.div>

          <BookingPro
            packageId={selectedPackage.id}
            packageTitle={selectedPackage.title}
            packagePrice={selectedPackage.price}
            maxParticipants={selectedPackage.maxParticipants}
            onSubmit={handleBookingSubmit}
            isSubmitting={false}
          />
        </div>
      </section>

      {/* Location Info */}
      <section className='py-16 bg-slate-900'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='flex items-center justify-center gap-6 text-gray-300'
          >
            <div className='flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-cyan-400' />
              <span>Dakhla, Morocco</span>
            </div>
            <div className='w-px h-8 bg-gray-600' />
            <div className='flex items-center gap-2'>
              <Wind className='w-5 h-5 text-cyan-400' />
              <span>300+ Wind Days/Year</span>
            </div>
            <div className='w-px h-8 bg-gray-600' />
            <div className='flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-cyan-400' />
              <span>Year-Round Season</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
