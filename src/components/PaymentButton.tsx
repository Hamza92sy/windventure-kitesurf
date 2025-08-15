'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface PaymentButtonProps {
  isSubmitting: boolean;
  error: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  isSubmitting,
  error,
  disabled = false,
  className = '',
  children,
}) => {
  const buttonVariants = {
    idle: {
      scale: 1,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    hover: {
      scale: 1.02,
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    tap: {
      scale: 0.98,
    },
    loading: {
      scale: 1,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  };

  const spinnerVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            variants={errorVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            className='flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg'
          >
            <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
            <p className='text-red-700 text-sm font-medium'>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Button */}
      <motion.button
        type='submit'
        disabled={disabled || isSubmitting}
        variants={buttonVariants}
        initial='idle'
        whileHover={!disabled && !isSubmitting ? 'hover' : 'idle'}
        whileTap={!disabled && !isSubmitting ? 'tap' : 'idle'}
        animate={isSubmitting ? 'loading' : 'idle'}
        className={`w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
          isSubmitting ? 'cursor-wait' : ''
        }`}
      >
        {/* Background Animation */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500'
          initial={{ x: '-100%' }}
          animate={isSubmitting ? { x: '100%' } : { x: '-100%' }}
          transition={{
            duration: 2,
            repeat: isSubmitting ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className='relative flex items-center justify-center gap-3'>
          {isSubmitting ? (
            <>
              <motion.div
                variants={spinnerVariants}
                animate='rotate'
                className='flex-shrink-0'
              >
                <Loader2 className='w-5 h-5' />
              </motion.div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <CreditCard className='w-5 h-5 flex-shrink-0' />
              <span>{children}</span>
            </>
          )}
        </div>

        {/* Success State (if needed) */}
        {!isSubmitting && !error && !disabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='absolute top-2 right-2'
          >
            <CheckCircle className='w-4 h-4 text-green-400' />
          </motion.div>
        )}
      </motion.button>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='text-center'
      >
        <p className='text-xs text-gray-500'>
          🔒 Your payment is secured by Stripe. We never store your card
          details.
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentButton;
