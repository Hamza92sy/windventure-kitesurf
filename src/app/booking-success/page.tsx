'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Verify the session and get booking details
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSessionData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error verifying session:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Verifying your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
            <div className='text-green-500 text-6xl mb-6'>✅</div>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              Booking Confirmed!
            </h1>
            <p className='text-lg text-gray-600 mb-6'>
              Thank you for choosing Windventure! Your kitesurfing adventure is
              confirmed.
            </p>

            {sessionData && (
              <div className='bg-blue-50 p-6 rounded-lg mb-6 text-left'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Booking Details
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>Booking ID:</span>
                    <span className='font-semibold'>
                      {sessionData.booking_id}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Package:</span>
                    <span className='font-semibold'>
                      {sessionData.package_name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Amount Paid:</span>
                    <span className='font-semibold'>
                      €{sessionData.amount_total / 100}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className='text-sm text-gray-600 mb-8'>
              <p>
                📧 A confirmation email has been sent to your email address.
              </p>
              <p>
                📱 Our team will contact you within 24 hours to finalize the
                details.
              </p>
            </div>

            <div className='space-y-4'>
              <Link
                href='/packages'
                className='inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors'
              >
                View All Packages
              </Link>
              <br />
              <Link
                href='/'
                className='inline-block text-blue-600 hover:text-blue-800 transition-colors'
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
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
      <BookingSuccessContent />
    </Suspense>
  );
}
