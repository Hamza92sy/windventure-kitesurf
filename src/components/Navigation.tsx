'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: 'Contact', href: '/contact' },
  ];

  // Variants d'animation pour le menu mobile
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Variants pour les éléments du menu
  const menuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  // Variants pour le bouton hamburger
  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <motion.nav
      className='bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo avec animation */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href='/' className='flex items-center gap-2'>
              <motion.div
                className='w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold'
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                W
              </motion.div>
              <span className='text-xl font-bold text-gray-900'>
                Windventure
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation avec animations */}
          <div className='hidden md:flex items-center gap-6'>
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`relative font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      className='absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600'
                      layoutId='activeTab'
                      initial={false}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Bouton WhatsApp avec animation */}
            <motion.a
              href='https://wa.me/212123456789'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold'
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <span className='flex items-center gap-2'>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  📱
                </motion.span>
                WhatsApp
              </span>
            </motion.a>
          </div>

          {/* Mobile Menu Button avec animation */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className='w-6 h-6 flex flex-col justify-center items-center'
              variants={hamburgerVariants}
              animate={isOpen ? 'open' : 'closed'}
            >
              <motion.span
                className='bg-gray-600 block transition-all duration-300 h-0.5 w-6 rounded-sm'
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className='bg-gray-600 block transition-all duration-300 h-0.5 w-6 rounded-sm my-0.5'
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className='bg-gray-600 block transition-all duration-300 h-0.5 w-6 rounded-sm'
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu avec AnimatePresence */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className='md:hidden pb-4'
              variants={mobileMenuVariants}
              initial='closed'
              animate='open'
              exit='closed'
            >
              <div className='flex flex-col gap-2'>
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={menuItemVariants}
                    initial='closed'
                    animate='open'
                    exit='closed'
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`p-3 rounded-lg font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={menuItemVariants}
                  initial='closed'
                  animate='open'
                  exit='closed'
                  transition={{ delay: navigation.length * 0.1 }}
                >
                  <a
                    href='https://wa.me/212123456789'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg font-semibold text-center block'
                    onClick={() => setIsOpen(false)}
                  >
                    <span className='flex items-center justify-center gap-2'>
                      📱 WhatsApp
                    </span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
