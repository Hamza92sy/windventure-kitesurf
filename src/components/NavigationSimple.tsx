'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wind, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

const NavigationSimple: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/', icon: Wind },
    { name: 'Packages', href: '/packages', icon: MapPin },
    { name: 'Book', href: '/book', icon: Phone },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-sand/10 backdrop-blur-md border-b border-ocean/20'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='flex items-center space-x-2'
          >
            <div className='w-8 h-8 bg-ocean rounded-lg flex items-center justify-center'>
              <Wind className='w-5 h-5 text-night' />
            </div>
            <span className='text-xl font-bold text-ocean'>Windventure</span>
          </motion.div>

          {/* Menu Desktop */}
          <div className='hidden md:flex items-center space-x-8'>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className='relative group px-4 py-2 text-sand hover:text-ocean transition-colors duration-300'
                >
                  <span className='relative z-10 flex items-center space-x-2'>
                    <item.icon className='w-4 h-4' />
                    <span>{item.name}</span>
                  </span>
                  <div className='absolute inset-0 bg-ocean/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bouton Mobile */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 text-sand hover:text-ocean transition-colors'
            aria-label='Toggle menu'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-sand/95 backdrop-blur-md border-t border-ocean/20'
          >
            <div className='container mx-auto px-4 py-4'>
              <div className='flex flex-col space-y-4'>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className='flex items-center space-x-3 px-4 py-3 text-night hover:text-ocean hover:bg-ocean/10 rounded-lg transition-all duration-300'
                    >
                      <item.icon className='w-5 h-5' />
                      <span className='text-lg'>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavigationSimple;
