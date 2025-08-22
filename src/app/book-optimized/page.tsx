'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Award, Headphones } from 'lucide-react';
import BookingFormOptimized from '@/components/BookingFormOptimized';

export default function BookOptimized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                WindVenture
              </div>
            </Link>
            
            <Link 
              href="/packages"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Packages
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🚀 <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Book Your Adventure
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete your reservation for the ultimate kitesurfing experience in Dakhla.
            <br />
            <strong>✨ NEW: Optimized pricing for up to 4 people!</strong>
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span>5★ Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-purple-600" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <BookingFormOptimized />
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🎯 Why Choose Our Optimized Packages?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  💰 Transparent Pricing Per Person
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No hidden fees or confusing group rates. Our new pricing structure 
                  shows exactly what you pay per person, making it easy to book for 
                  1-4 participants.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  👥 Perfect Group Size (Max 4)
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience premium small-group instruction with maximum 4 people 
                  per session. This ensures personalized attention while maintaining 
                  the fun group dynamic.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🏠 Optimized Accommodation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our accommodation is perfectly sized for up to 4 guests, providing 
                  the ideal balance of comfort, privacy, and social interaction.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🍽️ Culinary Freedom
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Unlike all-inclusive packages, you're free to explore Dakhla's 
                  amazing local cuisine at your own pace and budget, saving you 
                  ~300€ vs competitors.
                </p>
              </div>
            </div>
            
            {/* Business Impact Note */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                🎉 Launch Special - 4 Person Optimization!
              </h3>
              <p className="text-green-700">
                We've optimized our entire system for up to 4 people, resulting in 
                <strong> +60% better value</strong> while maintaining our premium service quality.
                Book now and experience the perfect balance of personalization and group fun!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Questions about your booking? Contact us at{' '}
            <a href="mailto:contact@windventure.fr" className="text-blue-600 hover:underline">
              contact@windventure.fr
            </a>
            {' '}or{' '}
            <a href="tel:+212612345678" className="text-blue-600 hover:underline">
              +212 61 234 5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}