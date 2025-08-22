"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PACKAGES_DATA } from '@/lib/packages';
import { Calendar, Users, Phone, Mail, CheckCircle } from 'lucide-react';

// Stripe Product IDs mapping
const STRIPE_PRICE_IDS = {
  'beginner-private': 'price_1Reo9xHUqGxCezEFwTKoXkzJ',
  'beginner-semi-private': 'price_1Reo8SHUqGxCezEF3ca4QL34',
  'exploration': 'price_1ReoC9HUqGxCezEFSDRUrGTz',
  'combined': 'price_1ReoApHUqGxCezEFCuWVKKGB'
} as const;

export default function BookingForm() {
  const searchParams = useSearchParams();
  const [packageId, setPackageId] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Wait for searchParams to be available (client-side) - HAMZA'S TIMING FIX
    const timer = setTimeout(() => {
      try {
        const pkgId = searchParams.get('package');
        console.log('=== HAMZA DEBUG FIX ===');
        console.log('Package ID from searchParams:', pkgId);
        console.log('Available packages:', PACKAGES_DATA.map(p => ({id: p.id, title: p.title})));
        
        setPackageId(pkgId);
        
        if (pkgId) {
          const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
          console.log('Found package:', pkg);
          if (pkg) {
            setSelectedPackage(pkg);
            setError('');
          } else {
            setError(`Package "${pkgId}" not found. Available: ${PACKAGES_DATA.map(p => p.id).join(', ')}`);
          }
        } else {
          setError('No package specified in URL');
        }
      } catch (err) {
        console.error('Error loading package:', err);
        setError('Error loading package data');
      } finally {
        setIsLoading(false);
      }
    }, 100); // Small delay to ensure searchParams is ready - HAMZA'S SOLUTION

    return () => clearTimeout(timer);
  }, [searchParams]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      setError('No package selected');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const priceId = STRIPE_PRICE_IDS[selectedPackage.id as keyof typeof STRIPE_PRICE_IDS];
      
      // Call Stripe checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  // Show loading state during hydration - HAMZA'S HYDRATION FIX
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading package details...</p>
        <p className="text-xs text-gray-400 mt-2">Initializing booking form...</p>
      </div>
    );
  }

  // Show error state with helpful info - HAMZA'S DEBUGGING
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-red-800 mb-2">Package Loading Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Debug Info:</strong></p>
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
            <p>Package ID: {packageId || 'None'}</p>
            <p>Available IDs: {PACKAGES_DATA.map(p => p.id).join(', ')}</p>
          </div>
        </div>
        <a href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Choose a Package
        </a>
      </div>
    );
  }

  // Show package not found - HAMZA'S FALLBACK
  if (!selectedPackage) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please select a package to continue</p>
        <a href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          View All Packages
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Package Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{selectedPackage.title}</h3>
          {selectedPackage.isPopular && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Most Popular
            </span>
          )}
        </div>
        <p className="text-gray-700 mb-4">{selectedPackage.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">
            €{selectedPackage.price.toLocaleString()}
            <span className="text-lg font-normal text-gray-600"> per person</span>
          </div>
          {selectedPackage.duration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{selectedPackage.duration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
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
                  <Mail className="inline h-4 w-4 mr-1" />
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
                  <Phone className="inline h-4 w-4 mr-1" />
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
                  <Calendar className="inline h-4 w-4 mr-1" />
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
                  <Users className="inline h-4 w-4 mr-1" />
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
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
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
                <span className="font-medium">{selectedPackage.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span className="font-medium">€{selectedPackage.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span className="font-medium">{formData.participants}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Estimated:</span>
                  <span className="text-blue-600">€{(selectedPackage.price * formData.participants).toLocaleString()}</span>
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
            <CheckCircle className="h-5 w-5" />
            {isSubmitting ? 'Processing Payment...' : `Book Now - €${selectedPackage.price}`}
          </button>

          <p className="text-xs text-gray-500 text-center">
            🔒 Secure payment via Stripe • SSL encrypted • Your data is protected
          </p>
        </form>
      </div>
    </div>
  );
}