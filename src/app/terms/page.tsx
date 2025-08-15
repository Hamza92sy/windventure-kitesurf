'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NavigationSimple from '../../components/NavigationSimple';
import FooterMinimal from '../../components/FooterMinimal';

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <NavigationSimple />

      <div className='pt-24 pb-12'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              Terms & Conditions
            </h1>
            <p className='text-lg text-gray-600'>
              Important information about your WindVenture kitesurfing
              experience
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='bg-white rounded-lg shadow-lg p-8'
          >
            <div className='prose prose-lg max-w-none'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                1. Booking & Reservations
              </h2>
              <p className='mb-6'>
                All bookings must be confirmed with a minimum 50% deposit. Full
                payment is required 48 hours before the lesson start date.
                Cancellations made more than 48 hours in advance will receive a
                full refund minus processing fees.
              </p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                2. Safety Requirements
              </h2>
              <ul className='mb-6 space-y-2'>
                <li>• All participants must be able to swim confidently</li>
                <li>
                  • Minimum age requirement: 12 years (with parental consent)
                </li>
                <li>• Maximum weight limit: 120kg</li>
                <li>• Medical conditions must be disclosed before lessons</li>
                <li>• Weather conditions may affect lesson scheduling</li>
              </ul>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                3. Equipment & Liability
              </h2>
              <p className='mb-6'>
                WindVenture provides all necessary equipment including kites,
                boards, harnesses, and safety gear. Participants are responsible
                for any damage to equipment due to negligence. By participating,
                you acknowledge the inherent risks of kitesurfing and waive any
                claims against WindVenture.
              </p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                4. Weather Policy
              </h2>
              <p className='mb-6'>
                Lessons are weather dependent. In case of unsuitable conditions,
                lessons will be rescheduled at no extra cost. If rescheduling is
                not possible, a full refund will be provided.
              </p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                5. Privacy Policy
              </h2>
              <p className='mb-6'>
                We collect personal information necessary for booking and safety
                purposes. Your data is protected and never shared with third
                parties without consent. Photos and videos may be taken during
                lessons for promotional purposes unless you opt out.
              </p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                6. Contact Information
              </h2>
              <p>
                For questions about these terms or to modify your booking,
                contact us at:
                <br />
                Email: info@windventure.ma
                <br />
                Phone: +212 6XX XX XX XX
                <br />
                WhatsApp: Available 9:00 - 18:00
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <FooterMinimal />
    </div>
  );
}
