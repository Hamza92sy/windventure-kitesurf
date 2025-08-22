"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { packagesOptimized, type Package, calculatePackageTotal } from '@/data/packages-optimized';
import { Calendar, Users, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  participants: number;
  specialRequests: string;
}

// Stripe Price IDs optimisés (générés automatiquement)
const STRIPE_PRICE_IDS_OPTIMIZED = {
  'beginner-private': 'price_1QxWvYzABCD12345678901',
  'semi-private-discovery': 'price_1QxWvYzABCD54321012345',
  'semi-private-experience': 'price_1QxWvYzABCD11111222222',
  'exploration-adventure': 'price_1QxWvYzABCD22222333333',
  'combined-ultimate': 'price_1QxWvYzABCD33333444444'
} as const;

export default function BookingFormOptimized() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package');
  const selectedPackage = packagesOptimized.find((p: Package) => p.id === packageId);

  const [formData, setFormData] = useState<BookingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    participants: 1,
    specialRequests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Calcul prix total dynamique
  const totalPrice = selectedPackage ? calculatePackageTotal(selectedPackage.id, formData.participants) : 0;
  
  // Validation participants max
  const maxParticipants = selectedPackage?.maxParticipants || 1;
  const participantsError = formData.participants > maxParticipants;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    
    // Validation
    if (participantsError) {
      setError(`Maximum ${maxParticipants} participants for this package`);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const priceId = STRIPE_PRICE_IDS_OPTIMIZED[selectedPackage.id as keyof typeof STRIPE_PRICE_IDS_OPTIMIZED];
      
      const response = await fetch('/api/checkout/optimized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          priceId,
          participants: formData.participants,
          totalPrice,
          bookingData: formData
        })
      });
      
      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants' ? parseInt(value) : value
    }));
  };

  const getPricingDisplay = () => {
    if (!selectedPackage) return '';
    
    if (selectedPackage.id === 'beginner-private') {
      return `€${selectedPackage.price.toLocaleString()} (forfait 1 personne)`;
    } else {
      return `€${selectedPackage.price.toLocaleString()}/pers × ${formData.participants} = €${totalPrice.toLocaleString()}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {selectedPackage && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{selectedPackage.name}</h3>
            {selectedPackage.isPopular && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                ⭐ Most Popular
              </span>
            )}
          </div>
          <p className="text-gray-700 mb-4">{selectedPackage.shortDescription}</p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-blue-600">
              {getPricingDisplay()}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{selectedPackage.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Max {selectedPackage.maxParticipants} pers</span>
              </div>
            </div>
          </div>
          
          {/* Pricing breakdown pour packages groupe */}
          {selectedPackage.id !== 'beginner-private' && (
            <div className="mt-4 p-4 bg-white/60 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-2">💰 Pricing Breakdown (4 personnes max):</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {[1, 2, 3, 4].map(persons => (
                  <div key={persons} className="text-center p-2 bg-white rounded">
                    <div className="font-semibold">{persons} pers</div>
                    <div className="text-blue-600">€{(selectedPackage.price * persons).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          Complete Your Booking
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!selectedPackage && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please select a package first</p>
            <a href="/packages" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              View Packages
            </a>
          </div>
        )}

        {selectedPackage && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Preferred Start Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Participants *
                </label>
                <select
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    participantsError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {Array.from({ length: maxParticipants }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} participant{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                {participantsError && (
                  <p className="mt-1 text-sm text-red-600">
                    Maximum {maxParticipants} participants for this package
                  </p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special requirements, dietary restrictions, experience level, etc."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Price:</span>
                <span className="text-blue-600">€{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Price includes: Accommodation, equipment, instruction, transport
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || participantsError}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Proceed to Payment - €{totalPrice.toLocaleString()}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}