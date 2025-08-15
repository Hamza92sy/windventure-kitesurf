'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowUp,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
// import NewsletterForm from '../../components/NewsletterForm';

const FooterMinimal: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/story' },
      { name: 'Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
    ],
    services: [
      { name: 'Kitesurf Lessons', href: '/lessons' },
      { name: 'Equipment Rental', href: '/equipment' },
      { name: 'Guided Tours', href: '/tours' },
      { name: 'Accommodation', href: '/accommodation' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Safety', href: '/safety' },
    ],
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/windventure',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/windventure',
    },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/windventure' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/windventure' },
  ];

  return (
    <footer className='relative bg-sky border-t border-ocean/20'>
      <div className='container mx-auto px-4 relative z-10'>
        {/* Main Footer Content */}
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className='mb-6'
              >
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-10 h-10 bg-ocean rounded-lg flex items-center justify-center'>
                    <Wind className='w-6 h-6 text-night' />
                  </div>
                  <span className='text-2xl font-bold text-ocean'>
                    Windventure
                  </span>
                </div>
                <p className='text-night/70 mb-6 max-w-md'>
                  Experience the ultimate kitesurfing adventure in Dakhla. Where
                  the ocean meets the desert, creating unforgettable moments.
                </p>

                {/* Contact Info */}
                <div className='space-y-3'>
                  <div className='flex items-center space-x-3 text-night/70'>
                    <MapPin className='w-4 h-4 text-ocean' />
                    <span>Dakhla, Western Sahara</span>
                  </div>
                  <div className='flex items-center space-x-3 text-night/70'>
                    <Phone className='w-4 h-4 text-ocean' />
                    <span>+212 123 456 789</span>
                  </div>
                  <div className='flex items-center space-x-3 text-night/70'>
                    <Mail className='w-4 h-4 text-ocean' />
                    <span>hello@windventure.fr</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className='text-lg font-bold text-ocean mb-4 capitalize'>
                  {category}
                </h3>
                <ul className='space-y-3'>
                  {links.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-night/70 hover:text-ocean transition-colors duration-300 group'
                      >
                        <span className='relative'>
                          {link.name}
                          <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-ocean group-hover:w-full transition-all duration-300'></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className='mt-12 pt-8 border-t border-ocean/20'
          >
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='mb-6 md:mb-0'>
                <h4 className='text-lg font-bold text-ocean mb-4'>
                  Follow Our Journey
                </h4>
                <div className='flex space-x-4'>
                  {socialLinks.map(social => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center text-ocean hover:bg-ocean hover:text-night border border-ocean/30 hover:border-ocean transition-all duration-300'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.name}
                    >
                      <social.icon className='w-5 h-5' />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className='text-center md:text-right'>
                <h4 className='text-lg font-bold text-ocean mb-4'>
                  Restez Connectés
                </h4>
                <p className='text-night/70 mb-4'>
                  Recevez nos actualités et offres exclusives
                </p>
                <div className='flex max-w-sm ml-auto'>
                  <input
                    type='email'
                    placeholder='Votre email'
                    className='flex-1 px-4 py-2 rounded-l-lg border border-ocean/30 focus:outline-none focus:border-ocean'
                  />
                  <button className='px-6 py-2 bg-ocean text-night rounded-r-lg hover:bg-ocean/90 transition-colors'>
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className='py-6 border-t border-ocean/20'
        >
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 text-night/70 mb-4 md:mb-0'>
              <span>© 2024 Windventure. Made with</span>
              <Heart className='w-4 h-4 text-red-400 fill-current' />
              <span>in Dakhla</span>
            </div>

            <div className='flex items-center space-x-6 text-sm text-night/70'>
              <Link
                href='/privacy'
                className='hover:text-ocean transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='hover:text-ocean transition-colors'
              >
                Terms of Service
              </Link>
              <Link
                href='/cookies'
                className='hover:text-ocean transition-colors'
              >
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className='fixed bottom-6 right-6 w-12 h-12 bg-ocean rounded-full flex items-center justify-center text-night shadow-lg hover:scale-110 transition-transform duration-300 z-50'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label='Scroll to top'
      >
        <ArrowUp className='w-6 h-6' />
      </motion.button>
    </footer>
  );
};

export default FooterMinimal;
