"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Small delay to show loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find your payment session. Please try booking again.
          </p>
          <Link 
            href="/packages"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            🎉 Thank you for booking with Windventure! Your kitesurfing adventure in Dakhla awaits.
          </p>
          
          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" />
              What happens next?
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>✅ Confirmation email sent to your inbox</p>
              <p>✅ Our team will contact you within 24 hours</p>
              <p>✅ We'll coordinate your arrival and preparation</p>
              <p>✅ Equipment and safety briefing scheduled</p>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-orange-900 mb-3">📋 Important Information</h3>
            <div className="text-sm text-orange-800 space-y-2 text-left">
              <p>• <strong>Weather dependent:</strong> We monitor conditions and will notify you of any changes</p>
              <p>• <strong>Equipment:</strong> All kitesurfing gear is included in your package</p>
              <p>• <strong>What to bring:</strong> Sunscreen, swimwear, towel, and enthusiasm!</p>
              <p>• <strong>Location:</strong> Dakhla Lagoon - exact meeting point will be confirmed</p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">📞 Need assistance?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>hello@windventure.fr</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+212 123 456 789</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg"
            >
              Back to Homepage
            </Link>
            
            <div className="text-center">
              <Link 
                href="/packages"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Book another package
              </Link>
            </div>
          </div>

          {/* Session ID for reference */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Session ID: {sessionId}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Keep this reference for your records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}