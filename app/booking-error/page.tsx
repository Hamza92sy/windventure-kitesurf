"use client"

import React from 'react';
import { XCircle, RefreshCw, Mail, ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';

export default function BookingErrorPage() {
  const handleRetry = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Something Went Wrong
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            We couldn't process your booking request at this time. Don't worry, no payment has been charged.
          </p>

          <div className="bg-orange-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What can you do?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Try submitting your request again</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Contact us directly via email</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Call us during business hours</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Us Directly</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:contact@windventure.fr" className="text-cyan-600 hover:underline">
                  contact@windventure.fr
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Response time:</strong> Within 24 hours
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Error Code: {new Date().getTime()} | Please mention this if you contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}