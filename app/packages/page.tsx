"use client";

import React from 'react';
import Link from 'next/link';
import { PACKAGES_DATA } from '@/data/packages-optimized';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Kitesurfing Adventure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the best of Dakhla with our carefully crafted packages. 
            From beginner lessons to advanced exploration adventures.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PACKAGES_DATA.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Package Badge */}
              {pkg.isPopular && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-center font-bold">
                  ⭐ Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{pkg.description}</p>
                
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  €{pkg.price.toLocaleString()}
                </div>
                <p className="text-gray-500 mb-6">per person</p>
                
                {pkg.duration && (
                  <p className="text-sm text-gray-600 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Duration: {pkg.duration}
                  </p>
                )}

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                  {pkg.features?.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {pkg.features && pkg.features.length > 3 && (
                    <p className="text-sm text-gray-500 italic">
                      +{pkg.features?.length ? pkg.features.length - 3 : 0} more features
                    </p>
                  )}
                </div>
                
                <Link 
                  href={`/book?package=${pkg.id}`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-bold text-lg group-hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Book This Package
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-blue-100 mb-6">
              Our experts are here to help you select the perfect package for your skill level and goals.
            </p>
            <a 
              href="#contact" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}