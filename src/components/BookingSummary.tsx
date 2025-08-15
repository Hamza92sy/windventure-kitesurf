'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock, Star, Shield } from 'lucide-react';

interface BookingSummaryProps {
  packageTitle: string;
  price: number;
  participants: number;
  selectedDate: string;
  totalPrice: number;
  className?: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  packageTitle,
  price,
  participants,
  selectedDate,
  totalPrice,
  className = '',
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className={`bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200 rounded-2xl p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center'>
            <Star className='w-4 h-4 text-white' />
          </div>
          <h3 className='text-lg font-bold text-gray-900'>Booking Summary</h3>
        </div>
        <p className='text-sm text-gray-600'>You&apos;re booking: {packageTitle}</p>
      </motion.div>

      {/* Package Details */}
      <motion.div variants={itemVariants} className='space-y-4 mb-6'>
        <div className='flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
              <MapPin className='w-5 h-5 text-white' />
            </div>
            <div>
              <p className='font-semibold text-gray-900'>{packageTitle}</p>
              <p className='text-sm text-gray-600'>Dakhla, Morocco</p>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-gray-900'>€{price}</p>
            <p className='text-sm text-gray-500'>per person</p>
          </div>
        </div>

        {/* Date & Participants */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <motion.div
            variants={itemVariants}
            className='flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100'
          >
            <Calendar className='w-5 h-5 text-blue-600' />
            <div>
              <p className='text-sm font-medium text-gray-900'>Date</p>
              <p className='text-sm text-gray-600'>
                {formatDate(selectedDate)}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className='flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100'
          >
            <Users className='w-5 h-5 text-green-600' />
            <div>
              <p className='text-sm font-medium text-gray-900'>Participants</p>
              <p className='text-sm text-gray-600'>
                {participants} {participants === 1 ? 'person' : 'people'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Price Breakdown */}
      <motion.div variants={itemVariants} className='space-y-3 mb-6'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-600'>Package price per person</span>
          <span className='font-medium'>€{price.toLocaleString()}</span>
        </div>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-gray-600'>Number of participants</span>
          <span className='font-medium'>× {participants}</span>
        </div>
        <div className='border-t border-gray-200 pt-3'>
          <div className='flex items-center justify-between'>
            <span className='text-lg font-bold text-gray-900'>Total Price</span>
            <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
              €{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div variants={itemVariants} className='space-y-3'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Shield className='w-4 h-4 text-green-600' />
          <span>Secure payment with Stripe</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Clock className='w-4 h-4 text-blue-600' />
          <span>Instant confirmation</span>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <Star className='w-4 h-4 text-yellow-500' />
          <span>Free cancellation up to 24h before</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingSummary;
