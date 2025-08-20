'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  PlayIcon,
  PauseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Thompson',
      location: 'London, UK',
      trip: '7-day Kite Adventure',
      date: 'March 2024',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b789?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      quote:
        "Windventure made my kiting dreams come true! The conditions in Dakhla are absolutely perfect - consistent winds, flat water, and endless space. The team's expertise and local knowledge made all the difference.",
      highlight: 'Perfect wind conditions',
      experience: 'kite_lessons',
      social: '@sarahkites',
    },
    {
      id: 2,
      name: 'Marco Rodriguez',
      location: 'Barcelona, Spain',
      trip: 'Desert Safari & Kite Combo',
      date: 'February 2024',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
      image:
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3',
      quote:
        'The combination of kitesurfing and desert exploration was incredible. Watching the sunset over the Sahara after an epic kite session - pure magic! The bivouac experience under the stars was unforgettable.',
      highlight: 'Sahara sunset magic',
      experience: 'desert_combo',
      social: '@marco_adventures',
    },
    {
      id: 3,
      name: 'Lisa Chen',
      location: 'San Francisco, USA',
      trip: 'Solo Female Traveler Package',
      date: 'January 2024',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
      quote:
        'As a solo female traveler, I felt completely safe and welcome. The Windventure team took care of everything - from airport pickup to finding the best kite spots. The lagoon is paradise for learning!',
      highlight: 'Safe solo adventure',
      experience: 'solo_package',
      social: '@lisa_wanderlust',
    },
    {
      id: 4,
      name: 'Tom & Emma Wilson',
      location: 'Manchester, UK',
      trip: 'Honeymoon Special',
      date: 'December 2023',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3',
      quote:
        "Our honeymoon in Dakhla was beyond perfect! Private kite lessons, romantic sunset dinners, and exploring the lagoon together. Windventure created memories we'll treasure forever.",
      highlight: 'Perfect honeymoon',
      experience: 'honeymoon',
      social: '@wilsontravels',
    },
    {
      id: 5,
      name: 'Ahmed El Mansouri',
      location: 'Casablanca, Morocco',
      trip: 'Advanced Freestyle Camp',
      date: 'November 2023',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop&ixlib=rb-4.0.3',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      quote:
        'The freestyle conditions at White Dune are world-class! Perfect wind, shallow water, and soft landings. I learned more in one week here than in months elsewhere. The local guides know every secret spot.',
      highlight: 'World-class freestyle',
      experience: 'freestyle_camp',
      social: '@ahmed_kite',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section id='testimonials' className='testimonials-section' ref={ref}>
      <div className='testimonials-background'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTestimonial}
            className='testimonials-bg-image'
            style={{ backgroundImage: `url('${currentTestimonial?.image}')` }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className='testimonials-bg-overlay' />
      </div>

      <div className='windventure-container'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className='windventure-title windventure-title--section text-white'>
            Stories from Paradise
          </h2>
          <p className='windventure-subtitle max-w-3xl mx-auto text-white opacity-90'>
            Hear from adventurers who discovered the magic of Dakhla with
            Windventure. Real stories from real travelers living their kite
            dreams.
          </p>
        </motion.div>

        <div className='testimonials-container'>
          {/* Main Testimonial */}
          <motion.div
            className='testimonials-main'
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTestimonial}
                className='testimonials-card'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className='testimonials-card-content'>
                  <div className='testimonials-quote'>
                    <svg
                      className='testimonials-quote-icon'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z' />
                    </svg>
                    <p>{currentTestimonial?.quote}</p>
                  </div>

                  <div className='testimonials-author'>
                    <div className='testimonials-avatar'>
                      <img
                        src={currentTestimonial?.avatar}
                        alt={currentTestimonial?.name || ''}
                      />
                    </div>
                    <div className='testimonials-author-info'>
                      <h4>{currentTestimonial?.name}</h4>
                      <div className='testimonials-author-details'>
                        <span className='testimonials-location'>
                          {React.createElement(MapPinIcon as any, { className: 'w-4 h-4' })}
                          {currentTestimonial?.location}
                        </span>
                        <span className='testimonials-date'>
                          {React.createElement(CalendarIcon as any, { className: 'w-4 h-4' })}
                          {currentTestimonial?.date}
                        </span>
                      </div>
                      <div className='testimonials-trip'>
                        {currentTestimonial?.trip}
                      </div>
                      <div className='testimonials-social'>
                        {currentTestimonial?.social}
                      </div>
                    </div>
                    <div className='testimonials-rating'>
                      {[...Array(5)].map((_, i) => (
                        React.createElement(StarSolidIcon as any, {
                          key: i,
                          className: `w-5 h-5 ${
                            i < (currentTestimonial?.rating || 0)
                              ? 'text-dakhla-sunrise'
                              : 'text-gray-300'
                          }`
                        })
                      ))}
                    </div>
                  </div>

                  <div className='testimonials-highlight'>
                    <span className='testimonials-highlight-badge'>
                      {currentTestimonial?.highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className='testimonials-navigation'>
              <button
                className='testimonials-nav-btn'
                onClick={prevTestimonial}
              >
                {React.createElement(ChevronLeftIcon as any, { className: 'w-5 h-5' })}
              </button>

              <div className='testimonials-controls'>
                <button
                  className='testimonials-play-pause'
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? (
                    React.createElement(PauseIcon as any, { className: 'w-4 h-4' })
                  ) : (
                    React.createElement(PlayIcon as any, { className: 'w-4 h-4' })
                  )}
                </button>
                <span className='testimonials-counter'>
                  {activeTestimonial + 1} / {testimonials.length}
                </span>
              </div>

              <button
                className='testimonials-nav-btn'
                onClick={nextTestimonial}
              >
                {React.createElement(ChevronRightIcon as any, { className: 'w-5 h-5' })}
              </button>
            </div>
          </motion.div>

          {/* Testimonial Thumbnails */}
          <motion.div
            className='testimonials-thumbnails'
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                className={`testimonials-thumbnail ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => {
                  setActiveTestimonial(index);
                  setIsAutoPlaying(false);
                }}
              >
                <div className='testimonials-thumbnail-avatar'>
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </div>
                <div className='testimonials-thumbnail-info'>
                  <span className='testimonials-thumbnail-name'>
                    {testimonial.name}
                  </span>
                  <span className='testimonials-thumbnail-location'>
                    {testimonial.location}
                  </span>
                </div>
                <div className='testimonials-thumbnail-rating'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    React.createElement(StarSolidIcon as any, { key: i, className: 'w-3 h-3' })
                  ))}
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          position: relative;
          padding: 8rem 0;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .testimonials-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .testimonials-bg-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: absolute;
          inset: 0;
        }

        .testimonials-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(30, 58, 138, 0.8) 0%,
            rgba(64, 224, 208, 0.6) 50%,
            rgba(255, 107, 53, 0.7) 100%
          );
          backdrop-filter: blur(2px);
        }

        .testimonials-container {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          align-items: start;
        }

        .testimonials-main {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .testimonials-card {
          position: relative;
        }

        .testimonials-card-content {
          padding: 3rem;
        }

        .testimonials-quote {
          margin-bottom: 2rem;
          position: relative;
        }

        .testimonials-quote-icon {
          width: 40px;
          height: 40px;
          color: var(--dakhla-turquoise);
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .testimonials-quote p {
          font-size: 1.25rem;
          line-height: 1.7;
          color: var(--charcoal);
          font-style: italic;
          margin: 0;
        }

        .testimonials-author {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .testimonials-avatar {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 3px solid var(--dakhla-turquoise);
          flex-shrink: 0;
        }

        .testimonials-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .testimonials-author-info {
          flex: 1;
        }

        .testimonials-author-info h4 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.25rem;
        }

        .testimonials-author-details {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .testimonials-location,
        .testimonials-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: var(--stone-dark);
        }

        .testimonials-trip {
          font-size: 0.9rem;
          color: var(--dakhla-turquoise);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .testimonials-social {
          font-size: 0.8rem;
          color: var(--stone-dark);
          opacity: 0.8;
        }

        .testimonials-rating {
          display: flex;
          gap: 0.25rem;
        }

        .testimonials-highlight {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
        }

        .testimonials-highlight-badge {
          background: var(--gradient-sunset);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .testimonials-navigation {
          background: var(--dune-light);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .testimonials-nav-btn {
          width: 40px;
          height: 40px;
          background: var(--gradient-ocean);
          border: none;
          border-radius: var(--radius-full);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform var(--transition-smooth);
        }

        .testimonials-nav-btn:hover {
          transform: scale(1.1);
        }

        .testimonials-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .testimonials-play-pause {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 2px solid var(--dakhla-turquoise);
          border-radius: var(--radius-full);
          color: var(--dakhla-turquoise);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }

        .testimonials-play-pause:hover {
          background: var(--dakhla-turquoise);
          color: white;
        }

        .testimonials-counter {
          font-size: 0.9rem;
          color: var(--stone-dark);
          font-weight: 600;
        }

        .testimonials-thumbnails {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .testimonials-thumbnail {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
          border-radius: var(--radius-lg);
          padding: 1rem;
          cursor: pointer;
          transition: all var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-align: left;
        }

        .testimonials-thumbnail:hover,
        .testimonials-thumbnail.active {
          background: white;
          border-color: var(--dakhla-turquoise);
          transform: translateX(8px);
          box-shadow: var(--shadow-md);
        }

        .testimonials-thumbnail-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          overflow: hidden;
          flex-shrink: 0;
        }

        .testimonials-thumbnail-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .testimonials-thumbnail-info {
          flex: 1;
        }

        .testimonials-thumbnail-name {
          display: block;
          font-weight: 600;
          color: var(--dakhla-ocean-deep);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .testimonials-thumbnail-location {
          display: block;
          font-size: 0.8rem;
          color: var(--stone-dark);
        }

        .testimonials-thumbnail-rating {
          display: flex;
          gap: 0.25rem;
          color: var(--dakhla-sunrise);
        }

        @media (max-width: 1024px) {
          .testimonials-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .testimonials-thumbnails {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 1rem;
          }

          .testimonials-thumbnail {
            min-width: 250px;
          }
        }

        @media (max-width: 768px) {
          .testimonials-section {
            padding: 4rem 0;
          }

          .testimonials-card-content {
            padding: 2rem;
          }

          .testimonials-quote p {
            font-size: 1.1rem;
          }

          .testimonials-author {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .testimonials-author-details {
            justify-content: center;
          }

          .testimonials-highlight {
            position: static;
            margin-top: 1rem;
            text-align: center;
          }
        }

        .text-dakhla-sunrise {
          color: var(--dakhla-sunrise);
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
