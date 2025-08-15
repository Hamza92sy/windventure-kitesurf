// Force redeploy - 30 juillet 2025 - Refonte complète Booking.com style
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Star,
  Shield,
  CheckCircle,
} from 'lucide-react';

// Import des nouveaux composants
import DatePicker from '../../components/DatePicker';
import BookingSummary from '../../components/BookingSummary';
import PaymentButton from '../../components/PaymentButton';

// Types for booking form
interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  participants: number;
  notes: string;
}

// Package configuration (matching packages page)
const PACKAGES_DATA = [
  {
    id: 'beginner-private',
    title: 'Beginner Package (Private)',
    description:
      'One-on-one instruction for complete beginners. Learn at your own pace with personalized attention.',
    price: 720,
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

// Colors by category
const categoryColors = {
  beginner: 'from-emerald-500 to-teal-600',
  advanced: 'from-blue-600 to-indigo-700',
  exploration: 'from-orange-500 to-red-600',
  combined: 'from-purple-600 to-pink-600',
} as const;

function BookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get('package');

  const [selectedPackage, setSelectedPackage] = useState<
    (typeof PACKAGES_DATA)[0] | null
  >(null);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    participants: 1,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Calcul du prix total
  const totalPrice = selectedPackage
    ? selectedPackage.price * formData.participants
    : 0;

  // Find package by ID
  useEffect(() => {
    if (packageId) {
      const pkg = PACKAGES_DATA.find(p => p.id === packageId);
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        router.push('/packages');
      }
    } else {
      router.push('/packages');
    }
  }, [packageId, router]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 1 : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPackage || isSubmitting) return;

      setIsSubmitting(true);
      setError('');

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
          total_price: totalPrice,
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
        setError(
          error.message ||
            'An unexpected error occurred. Please try again or contact us directly.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedPackage, isSubmitting, formData, totalPrice]
  );

  if (!selectedPackage) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading package details...</p>
        </div>
      </div>
    );
  }

  const gradientClass =
    categoryColors[selectedPackage.category as keyof typeof categoryColors];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'
    >
      <div className='container mx-auto px-4 py-6 md:py-8'>
        {/* Back link */}
        <motion.div variants={itemVariants} className='mb-6 md:mb-8'>
          <Link
            href='/packages'
            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors group'
          >
            <motion.span
              className='transform group-hover:-translate-x-1 transition-transform'
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className='w-5 h-5' />
            </motion.span>
            Back to Packages
          </Link>
        </motion.div>

        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
            {/* Main Content - Package Details & Form */}
            <div className='xl:col-span-2 space-y-8'>
              {/* Package Header */}
              <motion.div
                variants={itemVariants}
                className='bg-white rounded-2xl shadow-xl overflow-hidden'
              >
                <div className='relative h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20'>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-6xl opacity-20'>🏄‍♂️</div>
                  </div>
                  {selectedPackage.isPopular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='absolute top-4 right-4'
                    >
                      <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold'>
                        Most Popular ⭐
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className='p-6'>
                  <motion.h1
                    variants={itemVariants}
                    className='text-3xl font-bold text-gray-900 mb-3'
                  >
                    {selectedPackage.title}
                  </motion.h1>

                  <motion.div
                    variants={itemVariants}
                    className='flex items-center gap-2 mb-4'
                  >
                    <div
                      className={`text-4xl font-black bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                    >
                      €{selectedPackage.price.toLocaleString()}
                    </div>
                    <div className='text-sm text-gray-500 font-medium'>
                      per person
                    </div>
                  </motion.div>

                  <motion.p
                    variants={itemVariants}
                    className='text-gray-600 mb-6 leading-relaxed text-lg'
                  >
                    {selectedPackage.description}
                  </motion.p>

                  <motion.div variants={itemVariants} className='space-y-3'>
                    <h3 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                      <CheckCircle className='w-5 h-5 text-green-600' />
                      What&apos;s included:
                    </h3>
                    {selectedPackage.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className='flex items-center gap-3 text-sm'
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} flex-shrink-0`}
                        />
                        <span className='text-gray-700'>{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                variants={itemVariants}
                className='bg-white rounded-2xl shadow-xl p-8'
              >
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
                  <Users className='w-6 h-6 text-blue-600' />
                  Book Your Adventure
                </h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Personal Information */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Personal Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <label
                          htmlFor='firstName'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          First Name *
                        </label>
                        <input
                          type='text'
                          id='firstName'
                          name='firstName'
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50'
                          placeholder='Enter your first name'
                        />
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <label
                          htmlFor='lastName'
                          className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                          Last Name *
                        </label>
                        <input
                          type='text'
                          id='lastName'
                          name='lastName'
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50'
                          placeholder='Enter your last name'
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <label
                        htmlFor='email'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Email Address *
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50'
                        placeholder='your.email@example.com'
                      />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <label
                        htmlFor='phone'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Phone Number *
                      </label>
                      <input
                        type='tel'
                        id='phone'
                        name='phone'
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50'
                        placeholder='+33 6 12 34 56 78'
                      />
                    </motion.div>
                  </div>

                  {/* Trip Details */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Trip Details
                    </h3>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Preferred Date *
                      </label>
                      <DatePicker
                        selectedDate={formData.date}
                        onDateChange={date =>
                          setFormData(prev => ({ ...prev, date }))
                        }
                        participants={formData.participants}
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <label
                        htmlFor='participants'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Number of Participants *
                      </label>
                      <select
                        id='participants'
                        name='participants'
                        required
                        value={formData.participants}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50'
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'person' : 'people'}
                            </option>
                          )
                        )}
                      </select>
                      <p className='text-xs text-gray-500 mt-1'>
                        Maximum 20 participants per day
                      </p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <label
                        htmlFor='notes'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                      >
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id='notes'
                        name='notes'
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50'
                        placeholder='Any special requests, dietary requirements, or questions...'
                      />
                    </motion.div>
                  </div>

                  {/* Payment Button */}
                  <PaymentButton
                    isSubmitting={isSubmitting}
                    error={error}
                    disabled={
                      !formData.date ||
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.email ||
                      !formData.phone
                    }
                  >
                    Continue to Payment
                  </PaymentButton>
                </form>
              </motion.div>
            </div>

            {/* Sidebar - Booking Summary */}
            <motion.div variants={itemVariants} className='xl:col-span-1'>
              <div className='sticky top-8'>
                <BookingSummary
                  packageTitle={selectedPackage.title}
                  price={selectedPackage.price}
                  participants={formData.participants}
                  selectedDate={formData.date}
                  totalPrice={totalPrice}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
