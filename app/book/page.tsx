"use client";

import { useState } from 'react';
import Link from 'next/link';

// Version ultra-simple sans imports externes
const packages = [
  { id: 'beginner-private', name: 'Beginner Private', price: 720 },
  { id: 'beginner-semi-private', name: 'Beginner Semi-Private', price: 1100 },
  { id: 'exploration', name: 'Exploration Package', price: 1250 },
  { id: 'combined', name: 'Combined Package', price: 1350 }
];

interface BookPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Stripe Product IDs mapping
const STRIPE_PRICE_IDS = {
  'beginner-private': 'price_1Reo9xHUqGxCezEFwTKoXkzJ',
  'beginner-semi-private': 'price_1Reo8SHUqGxCezEF3ca4QL34',
  'exploration': 'price_1ReoC9HUqGxCezEFSDRUrGTz',
  'combined': 'price_1ReoApHUqGxCezEFCuWVKKGB'
} as const;

function BookingFormComplete({ packageData }: { packageData: any }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    participants: 1,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const priceId = STRIPE_PRICE_IDS[packageData.id as keyof typeof STRIPE_PRICE_IDS];
      
      // Call Stripe checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: packageData.id,
          priceId,
          bookingData: formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Package Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{packageData.name}</h3>
          {packageData.id === 'combined' && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Most Popular
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">
            €{packageData.price.toLocaleString()}
            <span className="text-lg font-normal text-gray-600"> per person</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Your Booking
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Start Date *
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Participants *
                </label>
                <select
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests or Questions
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Any dietary requirements, experience level, special occasions, or questions..."
            />
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="font-medium">{packageData.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span className="font-medium">€{packageData.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span className="font-medium">{formData.participants}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">€{(packageData.price * formData.participants).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : `Secure Checkout - €${(packageData.price * formData.participants).toLocaleString()}`}
          </button>

          <p className="text-xs text-gray-500 text-center">
            🔒 Secure payment via Stripe • SSL encrypted • Your data is protected
          </p>
        </form>
      </div>
    </div>
  );
}

export default function BookPage({ searchParams }: BookPageProps) {
  const packageId = (searchParams?.package as string) || '';
  const packageData = packages.find(p => p.id === packageId);

  console.log('🎯 NEXT.JS PROPS SOLUTION:', { packageId, found: packageData?.name, allSearchParams: searchParams });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/packages" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
            ← Back to Packages
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Book Your Kitesurfing Adventure
          </h1>
          <p className="text-xl text-gray-600">
            Complete your booking with our secure payment system
          </p>
        </div>
        
        {!packageData ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">🎯 Select Your Package</h2>
            <p className="text-gray-600 mb-8">Choose from our premium kitesurfing packages:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    €{pkg.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-600"> per person</span>
                  </div>
                  <Link 
                    href={`/book?package=${pkg.id}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                  >
                    Select Package
                  </Link>
                </div>
              ))}
            </div>
            
            <Link href="/packages" className="text-blue-600 hover:text-blue-800 font-medium">
              ← View Detailed Package Information
            </Link>
          </div>
        ) : (
          <BookingFormComplete packageData={packageData} />
        )}
      </div>
    </div>
  );
}