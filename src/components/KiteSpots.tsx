'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  WindIcon,
  WaveIcon,
  SunIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const KiteSpots = () => {
  const [activeSpot, setActiveSpot] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const spots = [
    {
      id: 1,
      name: 'Speed Spot',
      subtitle: 'The Racing Paradise',
      description:
        'Perfect flat water and consistent winds make this the ultimate speed spot. Ideal for racing and high-speed runs with minimal chop.',
      image:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      conditions: {
        wind: '25-35 knots',
        water: 'Flat water',
        depth: '0.3-1m',
        difficulty: 'Intermediate+',
      },
      features: [
        'Speed records',
        'Flat lagoon',
        'Thermal winds',
        'Racing events',
      ],
      bestTime: 'Morning sessions',
      coordinates: '23.7167° N, 15.9333° W',
    },
    {
      id: 2,
      name: 'White Dune',
      subtitle: 'Freestyle Haven',
      description:
        'Surrounded by stunning white sand dunes, this spot offers perfect conditions for freestyle and learning new tricks in crystal clear water.',
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      conditions: {
        wind: '20-30 knots',
        water: 'Shallow & warm',
        depth: '0.5-1.5m',
        difficulty: 'All levels',
      },
      features: [
        'White sand dunes',
        'Warm water',
        'Perfect for learning',
        'Photo opportunities',
      ],
      bestTime: 'All day',
      coordinates: '23.7500° N, 15.9000° W',
    },
    {
      id: 3,
      name: 'Dragon Island',
      subtitle: 'Advanced Challenge',
      description:
        'For experienced kiters seeking adventure. Strong winds and varied conditions around this iconic island formation.',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      conditions: {
        wind: '30-40 knots',
        water: 'Variable',
        depth: '1-3m',
        difficulty: 'Advanced',
      },
      features: [
        'Strong winds',
        'Island exploration',
        'Varied terrain',
        'Wildlife spotting',
      ],
      bestTime: 'Afternoon',
      coordinates: '23.6833° N, 15.8667° W',
    },
    {
      id: 4,
      name: 'Lagoon Entry',
      subtitle: "Beginner's Paradise",
      description:
        'Safe, shallow waters with gentle winds make this the perfect learning spot. Our kite school operates here with certified instructors.',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
      conditions: {
        wind: '15-25 knots',
        water: 'Very shallow',
        depth: '0.2-0.8m',
        difficulty: 'Beginner',
      },
      features: [
        'Kite school',
        'Safe learning',
        'Shallow water',
        'Equipment rental',
      ],
      bestTime: 'Mid-morning',
      coordinates: '23.7000° N, 15.9500° W',
    },
    {
      id: 5,
      name: 'Sunset Point',
      subtitle: 'Evening Magic',
      description:
        'End your day at this spectacular spot where you can kite while watching the sun set over the Sahara Desert dunes.',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3',
      conditions: {
        wind: '18-28 knots',
        water: 'Calm',
        depth: '0.5-2m',
        difficulty: 'All levels',
      },
      features: [
        'Sunset views',
        'Desert backdrop',
        'Calm evenings',
        'Photography',
      ],
      bestTime: 'Sunset',
      coordinates: '23.6667° N, 15.9167° W',
    },
  ];

  const nextSpot = () => {
    setActiveSpot(prev => (prev + 1) % spots.length);
  };

  const prevSpot = () => {
    setActiveSpot(prev => (prev - 1 + spots.length) % spots.length);
  };

  const currentSpot = spots[activeSpot];

  return (
    <section id='spots' className='kite-spots-section' ref={ref}>
      <div className='windventure-container'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className='windventure-title windventure-title--section'>
            Legendary Kite Spots
          </h2>
          <p className='windventure-subtitle max-w-3xl mx-auto'>
            Discover Dakhla's world-renowned kitesurfing spots, each offering
            unique conditions and unforgettable experiences for every skill
            level.
          </p>
        </motion.div>

        <div className='kite-spots-container'>
          {/* Main Spot Display */}
          <motion.div
            className='kite-spots-main'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className='kite-spots-image-container'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeSpot}
                  className='kite-spots-image'
                  style={{ backgroundImage: `url('${currentSpot.image}')` }}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className='kite-spots-image-overlay' />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                className='kite-spots-nav kite-spots-nav--prev'
                onClick={prevSpot}
              >
                <ChevronLeftIcon className='w-6 h-6' />
              </button>
              <button
                className='kite-spots-nav kite-spots-nav--next'
                onClick={nextSpot}
              >
                <ChevronRightIcon className='w-6 h-6' />
              </button>

              {/* Spot Counter */}
              <div className='kite-spots-counter'>
                <span>{activeSpot + 1}</span>
                <span>/</span>
                <span>{spots.length}</span>
              </div>
            </div>

            <div className='kite-spots-content'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeSpot}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className='kite-spots-info'
                >
                  <div className='kite-spots-header'>
                    <h3 className='kite-spots-name'>{currentSpot.name}</h3>
                    <p className='kite-spots-subtitle'>
                      {currentSpot.subtitle}
                    </p>
                  </div>

                  <p className='kite-spots-description'>
                    {currentSpot.description}
                  </p>

                  {/* Conditions Grid */}
                  <div className='kite-spots-conditions'>
                    <div className='kite-spots-condition'>
                      <WindIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Wind</span>
                        <span className='value'>
                          {currentSpot.conditions.wind}
                        </span>
                      </div>
                    </div>
                    <div className='kite-spots-condition'>
                      <WaveIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Water</span>
                        <span className='value'>
                          {currentSpot.conditions.water}
                        </span>
                      </div>
                    </div>
                    <div className='kite-spots-condition'>
                      <SunIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Best Time</span>
                        <span className='value'>{currentSpot.bestTime}</span>
                      </div>
                    </div>
                    <div className='kite-spots-condition'>
                      <MapPinIcon className='w-5 h-5' />
                      <div>
                        <span className='label'>Level</span>
                        <span className='value'>
                          {currentSpot.conditions.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className='kite-spots-features'>
                    {currentSpot.features.map((feature, index) => (
                      <span key={index} className='kite-spots-feature'>
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Spots Thumbnails */}
          <motion.div
            className='kite-spots-thumbnails'
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {spots.map((spot, index) => (
              <button
                key={spot.id}
                className={`kite-spots-thumbnail ${index === activeSpot ? 'active' : ''}`}
                onClick={() => setActiveSpot(index)}
              >
                <div
                  className='kite-spots-thumbnail-image'
                  style={{ backgroundImage: `url('${spot.image}')` }}
                />
                <div className='kite-spots-thumbnail-info'>
                  <span className='kite-spots-thumbnail-name'>{spot.name}</span>
                  <span className='kite-spots-thumbnail-level'>
                    {spot.conditions.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .kite-spots-section {
          padding: 6rem 0;
          background: var(--dune-light);
        }

        .kite-spots-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .kite-spots-main {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          margin-bottom: 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }

        .kite-spots-image-container {
          position: relative;
          overflow: hidden;
        }

        .kite-spots-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
        }

        .kite-spots-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(30, 58, 138, 0.3) 0%,
            rgba(64, 224, 208, 0.2) 100%
          );
        }

        .kite-spots-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-full);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all var(--transition-smooth);
          z-index: 3;
        }

        .kite-spots-nav:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .kite-spots-nav--prev {
          left: 1rem;
        }

        .kite-spots-nav--next {
          right: 1rem;
        }

        .kite-spots-counter {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          z-index: 3;
        }

        .kite-spots-content {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .kite-spots-header {
          margin-bottom: 1.5rem;
        }

        .kite-spots-name {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.5rem;
        }

        .kite-spots-subtitle {
          color: var(--dakhla-turquoise);
          font-weight: 600;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kite-spots-description {
          color: var(--stone-dark);
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .kite-spots-conditions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kite-spots-condition {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .kite-spots-condition svg {
          color: var(--dakhla-turquoise);
          flex-shrink: 0;
        }

        .kite-spots-condition .label {
          display: block;
          font-size: 0.85rem;
          color: var(--stone-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kite-spots-condition .value {
          display: block;
          font-weight: 600;
          color: var(--charcoal);
        }

        .kite-spots-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .kite-spots-feature {
          background: var(--gradient-desert);
          color: var(--stone-dark);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .kite-spots-thumbnails {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .kite-spots-thumbnail {
          background: white;
          border: 3px solid transparent;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-smooth);
          padding: 0;
        }

        .kite-spots-thumbnail:hover,
        .kite-spots-thumbnail.active {
          border-color: var(--dakhla-turquoise);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .kite-spots-thumbnail-image {
          width: 100%;
          height: 100px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .kite-spots-thumbnail-info {
          padding: 1rem;
          text-align: center;
        }

        .kite-spots-thumbnail-name {
          display: block;
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--dakhla-ocean-deep);
          margin-bottom: 0.25rem;
        }

        .kite-spots-thumbnail-level {
          font-size: 0.85rem;
          color: var(--stone-dark);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1024px) {
          .kite-spots-main {
            grid-template-columns: 1fr;
          }

          .kite-spots-image-container {
            height: 300px;
          }

          .kite-spots-content {
            padding: 2rem;
          }

          .kite-spots-conditions {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .kite-spots-content {
            padding: 1.5rem;
          }

          .kite-spots-name {
            font-size: 2rem;
          }

          .kite-spots-thumbnails {
            grid-template-columns: repeat(2, 1fr);
          }

          .kite-spots-nav {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default KiteSpots;
