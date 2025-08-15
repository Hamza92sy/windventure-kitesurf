'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDownIcon, PlayIcon } from '@heroicons/react/24/outline';

const WindventureHero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 },
    });
  }, [controls]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('why-dakhla');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='windventure-hero'>
      {/* Background Video/Image */}
      <div className='windventure-hero__media'>
        {isVideoPlaying ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className='windventure-hero__video'
            poster='/images/hero/dakhla-hero.jpg'
          >
            <source src='/videos/dakhla-kite.mp4' type='video/mp4' />
          </video>
        ) : (
          <div className='windventure-hero__image-container'>
            <div
              className='windventure-hero__image'
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
              }}
            >
              <div className='windventure-hero__image-overlay' />
            </div>

            {/* Play Button Overlay */}
            <motion.button
              className='windventure-hero__play-btn'
              onClick={() => setIsVideoPlaying(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <PlayIcon className='w-8 h-8' />
              <span>Experience Dakhla</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Hero Content */}
      <div className='windventure-hero__content'>
        <div className='windventure-container'>
          <motion.div
            className='windventure-hero__text'
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
          >
            {/* Animated Wind SVG */}
            <motion.div
              className='windventure-hero__wind-lines'
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <svg viewBox='0 0 200 40' className='windventure-wind-svg'>
                <motion.path
                  d='M10,20 Q50,5 100,20 T190,20'
                  stroke='currentColor'
                  strokeWidth='2'
                  fill='none'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                />
                <motion.path
                  d='M10,30 Q60,15 120,25 T190,30'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  fill='none'
                  opacity='0.7'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 2 }}
                />
                <motion.path
                  d='M10,10 Q40,25 90,15 T190,10'
                  stroke='currentColor'
                  strokeWidth='1'
                  fill='none'
                  opacity='0.5'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.4, duration: 2 }}
                />
              </svg>
            </motion.div>

            <motion.h1
              className='windventure-title windventure-title--hero'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Windventure
            </motion.h1>

            <motion.p
              className='windventure-hero__tagline'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Born where the desert meets the sea
            </motion.p>

            <motion.p
              className='windventure-hero__description'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Discover the magic of Dakhla's endless winds, pristine lagoons,
              and golden dunes. Your premium kitesurfing adventure awaits.
            </motion.p>

            <motion.div
              className='windventure-hero__actions'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <motion.a
                href='#book'
                className='windventure-btn windventure-btn--hero'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Your Kite Trip
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    fillRule='evenodd'
                    d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </motion.a>

              <motion.a
                href='#spots'
                className='windventure-btn windventure-btn--secondary'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Spots
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className='windventure-hero__stats'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <div className='windventure-hero__stat'>
                <span className='windventure-hero__stat-number'>300+</span>
                <span className='windventure-hero__stat-label'>
                  Wind Days/Year
                </span>
              </div>
              <div className='windventure-hero__stat'>
                <span className='windventure-hero__stat-number'>25°C</span>
                <span className='windventure-hero__stat-label'>
                  Average Temp
                </span>
              </div>
              <div className='windventure-hero__stat'>
                <span className='windventure-hero__stat-number'>1000+</span>
                <span className='windventure-hero__stat-label'>
                  Happy Kiters
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          className='windventure-hero__scroll'
          onClick={scrollToNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          whileHover={{ y: 5 }}
        >
          <span>Discover Dakhla</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDownIcon className='w-6 h-6' />
          </motion.div>
        </motion.button>
      </div>

      <style jsx>{`
        .windventure-hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .windventure-hero__media {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .windventure-hero__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .windventure-hero__image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .windventure-hero__image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .windventure-hero__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            rgba(30, 58, 138, 0.3) 0%,
            rgba(64, 224, 208, 0.2) 50%,
            rgba(255, 107, 53, 0.3) 100%
          );
        }

        .windventure-hero__play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 1rem 2rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .windventure-hero__play-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .windventure-hero__content {
          position: relative;
          z-index: 2;
          width: 100%;
          text-align: center;
          color: white;
        }

        .windventure-hero__text {
          max-width: 800px;
          margin: 0 auto;
        }

        .windventure-hero__wind-lines {
          margin-bottom: 2rem;
          opacity: 0.8;
        }

        .windventure-wind-svg {
          width: 200px;
          height: 40px;
          color: var(--dakhla-turquoise);
          margin: 0 auto;
        }

        .windventure-hero__tagline {
          font-family: var(--font-serif);
          font-size: clamp(1.25rem, 3vw, 2rem);
          font-style: italic;
          color: var(--dakhla-turquoise);
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .windventure-hero__description {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          line-height: 1.6;
          margin-bottom: 3rem;
          opacity: 0.95;
          font-weight: 300;
        }

        .windventure-hero__actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          align-items: center;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }

        .windventure-hero__stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .windventure-hero__stat {
          text-align: center;
        }

        .windventure-hero__stat-number {
          display: block;
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 400;
          color: var(--dakhla-turquoise);
          margin-bottom: 0.25rem;
        }

        .windventure-hero__stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .windventure-hero__scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .windventure-hero__scroll:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .windventure-hero {
            min-height: 600px;
          }

          .windventure-hero__actions {
            flex-direction: column;
            gap: 1rem;
          }

          .windventure-hero__stats {
            gap: 2rem;
          }

          .windventure-hero__stat-number {
            font-size: 1.5rem;
          }

          .windventure-wind-svg {
            width: 150px;
            height: 30px;
          }
        }
      `}</style>
    </section>
  );
};

export default WindventureHero;
