"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

function CancelContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>
          
          {/* Cancel Message */}
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            Booking Cancelled
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Your payment was cancelled and no charges were made to your card.
          </p>
          
          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">What happened?</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• You cancelled the payment process</p>
              <p>• Your booking was not completed</p>
              <p>• No payment was processed</p>
              <p>• Your card was not charged</p>
            </div>
          </div>

          {/* Still Interested Box */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Still interested in kitesurfing?
            </h3>
            <div className="text-sm text-green-800 space-y-2">
              <p>✨ Your package selection is still available</p>
              <p>💰 Prices remain the same</p>
              <p>🏄‍♂️ Amazing Dakhla conditions await</p>
              <p>🤝 Our team is ready to help</p>
            </div>
          </div>

          {/* Why Choose Windventure */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Why thousands choose Windventure</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">🏆 Expert Instructors</span>
                <p className="text-xs mt-1">Certified professionals with years of experience</p>
              </div>
              <div>
                <span className="font-medium">🛡️ Safety First</span>
                <p className="text-xs mt-1">Premium equipment and comprehensive insurance</p>
              </div>
              <div>
                <span className="font-medium">🌟 Perfect Location</span>
                <p className="text-xs mt-1">Dakhla's world-famous lagoon conditions</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {packageId ? (
              <Link 
                href={`/book?package=${packageId}`}
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg"
              >
                Complete Your Booking
              </Link>
            ) : (
              <Link 
                href="/packages"
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg"
              >
                Choose Your Package
              </Link>
            )}
            
            <div className="space-y-2">
              <Link 
                href="/packages"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse all packages
              </Link>
              
              <br />
              
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to homepage
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Need help completing your booking?
            </p>
            <p className="text-sm">
              Contact us at{' '}
              <a 
                href="mailto:hello@windventure.fr" 
                className="text-blue-600 hover:underline font-medium"
              >
                hello@windventure.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}