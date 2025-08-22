"use client"

import React, { useState } from 'react';
import { Calendar, Users, Mail, User, MessageSquare, Package, DollarSign, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
  dates: string;
  guests: string;
  budget: string;
  package?: string;
  level?: string;
}

export default function MakeBookingForm() {
  const [formType, setFormType] = useState<'custom' | 'package'>('package');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    dates: '',
    guests: '1',
    budget: '',
    package: '',
    level: 'beginner'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/make-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType,
          ...formData
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        window.location.href = '/booking-confirmation';
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Book Your Kitesurf Adventure</h2>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFormType('package')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              formType === 'package' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Package className="inline-block w-5 h-5 mr-2" />
            Predefined Packages
          </button>
          <button
            onClick={() => setFormType('custom')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              formType === 'custom' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="inline-block w-5 h-5 mr-2" />
            Custom Request
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formType === 'package' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline-block w-4 h-4 mr-1" />
                Select Package
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Choose a package...</option>
                <option value="beginner-private">Beginner Private (6h) - €720</option>
                <option value="semi-private">Semi-Private (8h) - €1,100</option>
                <option value="combined">Combined Package (12h) - €1,350</option>
                <option value="exploration">Exploration Package (10h) - €1,250</option>
              </select>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline-block w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline-block w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                Preferred Dates
              </label>
              <input
                type="text"
                name="dates"
                value={formData.dates}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., March 15-22, 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline-block w-4 h-4 mr-1" />
                Number of Guests
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                max="8"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {formType === 'package' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="beginner">Beginner - Never tried before</option>
                <option value="intermediate">Intermediate - Can ride upwind</option>
                <option value="advanced">Advanced - Freestyle/Wave riding</option>
              </select>
            </div>
          )}

          {formType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline-block w-4 h-4 mr-1" />
                  Approximate Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="e.g., €2000-3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline-block w-4 h-4 mr-1" />
                  Describe Your Dream Trip
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  required={formType === 'custom'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Tell us about your ideal kitesurfing experience, special requirements, accommodation preferences..."
                />
              </div>
            </>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Something went wrong. Please try again or contact us directly at contact@windventure.fr
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isSubmitting ? 'Submitting...' : formType === 'package' ? 'Book Package' : 'Request Custom Quote'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need immediate assistance? Email us at <a href="mailto:contact@windventure.fr" className="text-cyan-600 hover:underline">contact@windventure.fr</a></p>
        </div>
      </div>
    </div>
  );
}