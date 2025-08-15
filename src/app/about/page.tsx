'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NavigationSimple from '../../components/NavigationSimple';
import FooterMinimal from '../../components/FooterMinimal';
import { MapPin, Users, Award, Clock } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 to-blue-100'>
      <NavigationSimple />

      {/* Hero Section */}
      <section className='pt-24 pb-12'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <h1 className='text-5xl font-bold text-gray-900 mb-6'>
              About <span className='text-blue-600'>WindVenture</span>
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Discover the magic of kitesurfing in Dakhla, Morocco&apos;s premier
              wind sport destination. We&apos;ve been creating unforgettable
              adventures since 2015.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>
                Our Story
              </h2>
              <p className='text-gray-600 mb-4'>
                Founded by passionate kitesurfers who fell in love with Dakhla's
                incredible conditions, WindVenture has grown from a small local
                operation to Morocco&apos;s most trusted kitesurf school.
              </p>
              <p className='text-gray-600 mb-4'>
                Located in the stunning White Dune lagoon, we offer world-class
                instruction, premium equipment, and personalized experiences for
                riders of all levels.
              </p>
              <p className='text-gray-600'>
                With over 300 days of perfect wind per year and crystal-clear
                waters, Dakhla provides the ideal playground for your kitesurf
                adventure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='relative'
            >
              <Image
                src='/images/hero/dakhla-lagoon-01.webp'
                alt='Dakhla Lagoon'
                width={500}
                height={300}
                className='rounded-lg shadow-xl'
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-blue-600'>
        <div className='container mx-auto px-6'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              { icon: Users, value: '2500+', label: 'Happy Students' },
              { icon: Award, value: '9', label: 'Years Experience' },
              { icon: MapPin, value: '5', label: 'Prime Spots' },
              { icon: Clock, value: '300+', label: 'Wind Days/Year' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='text-center text-white'
              >
                <stat.icon className='w-12 h-12 mx-auto mb-4' />
                <div className='text-3xl font-bold mb-2'>{stat.value}</div>
                <div className='text-blue-200'>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Our Expert Team
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Professional instructors certified by international kitesurf
              organizations, passionate about sharing their love for the sport.
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                name: 'Ahmed Benali',
                role: 'Head Instructor & Founder',
                experience: '12 years experience',
                image: '/images/team/instructor-1.jpg',
              },
              {
                name: 'Sarah Martinez',
                role: 'Advanced Instructor',
                experience: '8 years experience',
                image: '/images/team/instructor-2.jpg',
              },
              {
                name: 'Youssef Tazi',
                role: 'Beginner Specialist',
                experience: '6 years experience',
                image: '/images/team/instructor-3.jpg',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white rounded-lg shadow-lg overflow-hidden'
              >
                <div className='h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center'>
                  <Users className='w-24 h-24 text-white opacity-50' />
                </div>
                <div className='p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    {member.name}
                  </h3>
                  <p className='text-blue-600 font-medium mb-2'>
                    {member.role}
                  </p>
                  <p className='text-gray-600 text-sm'>{member.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterMinimal />
    </div>
  );
}
