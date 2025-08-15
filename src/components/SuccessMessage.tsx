'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessMessageProps {
  title: string;
  message: string;
  onClose?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  variant?: 'default' | 'booking' | 'contact' | 'newsletter';
}

export default function SuccessMessage({
  title,
  message,
  onClose,
  autoHide = true,
  autoHideDelay = 5000,
  variant = 'default',
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'booking':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          border: 'border-green-400',
          icon: 'text-green-100',
          text: 'text-green-100',
        };
      case 'contact':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
          border: 'border-blue-400',
          icon: 'text-blue-100',
          text: 'text-blue-100',
        };
      case 'newsletter':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
          border: 'border-purple-400',
          icon: 'text-purple-100',
          text: 'text-purple-100',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          border: 'border-green-400',
          icon: 'text-green-100',
          text: 'text-green-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} ${styles.border} border rounded-lg shadow-xl backdrop-blur-sm`}
          data-testid='success-message'
        >
          <div className='p-4'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <CheckCircle className={`h-6 w-6 ${styles.icon}`} />
              </div>
              <div className='ml-3 flex-1'>
                <h3
                  className='text-sm font-semibold text-white'
                  data-testid='success-title'
                >
                  {title}
                </h3>
                <p
                  className={`mt-1 text-sm ${styles.text}`}
                  data-testid='success-message'
                >
                  {message}
                </p>
              </div>
              <div className='ml-4 flex-shrink-0'>
                <button
                  onClick={handleClose}
                  className={`inline-flex ${styles.text} hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md transition-colors`}
                  data-testid='success-close-button'
                >
                  <span className='sr-only'>Close</span>
                  <X className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
