"use client"

import React from 'react';
import { CheckCircle, Mail, Calendar, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Request Received!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for choosing WindVenture Dakhla. We've received your booking request and will get back to you within 24 hours.
          </p>

          <div className="bg-cyan-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p className="text-gray-700">Our team will review your request and check availability</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p className="text-gray-700">You'll receive a detailed confirmation email with payment instructions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p className="text-gray-700">Once confirmed, we'll send you all the details for your adventure</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <Mail className="w-5 h-5" />
              <p className="font-medium">Check your email for confirmation</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link 
              href="/packages"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              View More Packages
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need immediate assistance? Contact us at{' '}
              <a href="mailto:contact@windventure.fr" className="text-cyan-600 hover:underline">
                contact@windventure.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}