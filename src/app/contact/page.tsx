'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ContactContent() {
  const searchParams = useSearchParams();
  // const packageId = searchParams.get("package");
  const packageTitle = searchParams.get('title');
  const packagePrice = searchParams.get('price');

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10' />
        <div className='container mx-auto px-4 py-12 md:py-20'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 md:px-6 py-3 mb-6 md:mb-8 shadow-lg'>
              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
              <span className='text-sm font-semibold text-gray-700'>
                We&apos;re Here to Help
              </span>
            </div>
            {packageTitle && (
              <div className='bg-green-100 border border-green-300 rounded-lg p-4 mb-6 max-w-md mx-auto'>
                <h2 className='text-lg font-semibold text-green-800 mb-1'>
                  Package Selected!
                </h2>
                <p className='text-green-700'>{packageTitle}</p>
                {packagePrice && (
                  <p className='text-green-600 font-bold'>
                    €{packagePrice} per person
                  </p>
                )}
              </div>
            )}
            <h1 className='text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-4 md:mb-6 leading-tight'>
              Contact{' '}
              <span className='bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                Windventure
              </span>
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto'>
              Ready to embark on your kitesurfing adventure? Get in touch with
              our expert team in Dakhla, Morocco.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className='container mx-auto px-4 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
            {/* Contact Cards */}
            <div className='space-y-6'>
              {/* WhatsApp */}
              <div className='bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl'>
                    📱
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>WhatsApp</h3>
                </div>
                <p className='text-gray-600 mb-4'>
                  Quick responses and instant communication. Perfect for booking
                  questions and trip planning.
                </p>
                <a
                  href='https://wa.me/212123456789'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform'
                >
                  Message Us on WhatsApp
                </a>
              </div>

              {/* Email */}
              <div className='bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl'>
                    ✉️
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>Email</h3>
                </div>
                <p className='text-gray-600 mb-4'>
                  Detailed inquiries and formal booking confirmations. We
                  respond within 24 hours.
                </p>
                <a
                  href='mailto:info@windventure.fr'
                  className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform'
                >
                  Send Email
                </a>
                <p className='text-sm text-gray-500 mt-2'>
                  info@windventure.fr
                </p>
              </div>

              {/* Phone */}
              <div className='bg-white rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl'>
                    📞
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>Phone</h3>
                </div>
                <p className='text-gray-600 mb-4'>
                  Direct line to our Dakhla office. Available 9 AM - 7 PM
                  (GMT+1).
                </p>
                <a
                  href='tel:+212123456789'
                  className='inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform'
                >
                  Call Now
                </a>
                <p className='text-sm text-gray-500 mt-2'>+212 123 456 789</p>
              </div>
            </div>

            {/* Location & Hours */}
            <div className='bg-white rounded-2xl shadow-xl p-6 md:p-8'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                Our Location
              </h3>

              <div className='space-y-6'>
                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    📍 Address
                  </h4>
                  <p className='text-gray-600'>
                    Dakhla Lagoon
                    <br />
                    Dakhla 73000
                    <br />
                    Morocco
                  </p>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    🕒 Operating Hours
                  </h4>
                  <div className='space-y-1 text-gray-600'>
                    <p>
                      <strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM
                    </p>
                    <p>
                      <strong>Saturday - Sunday:</strong> 8:00 AM - 7:00 PM
                    </p>
                    <p>
                      <strong>Best Conditions:</strong> November - April
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-2'>
                    🌍 Languages
                  </h4>
                  <p className='text-gray-600'>
                    English, French, Arabic, Spanish
                  </p>
                </div>

                <div className='bg-blue-50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-blue-800 mb-2'>
                    💡 Pro Tip
                  </h4>
                  <p className='text-blue-700 text-sm'>
                    Contact us at least 48 hours before your preferred date for
                    the best availability and package options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className='container mx-auto px-4 pb-20'>
        <div className='text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            Ready to Book Your Adventure?
          </h2>
          <p className='text-blue-100 mb-8 text-lg'>
            Browse our packages and book instantly, or contact us for a custom
            experience.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              href='/packages'
              className='bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            >
              View Packages
            </Link>
            <a
              href='https://wa.me/212123456789'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors group'
          >
            <span className='transform group-hover:-translate-x-1 transition-transform'>
              ←
            </span>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
