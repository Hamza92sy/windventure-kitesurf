import React from 'react';
import MakeBookingForm from '../components/MakeBookingForm';
import { Wind, Star, Shield, Clock } from 'lucide-react';

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wind className="h-8 w-8 text-cyan-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">WindVenture</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Home</a>
              <a href="/packages" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Packages</a>
              <a href="/about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Reserve Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Kitesurf Adventure</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our predefined packages or create a custom experience tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">4.9/5 Rating</div>
              <div className="text-sm text-gray-600">1000+ Happy Riders</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">100% Safe</div>
              <div className="text-sm text-gray-600">IKO Certified</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Wind className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">300+ Days</div>
              <div className="text-sm text-gray-600">Perfect Wind</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">Quick Reply</div>
              <div className="text-sm text-gray-600">Within 24h</div>
            </div>
          </div>

          <MakeBookingForm />

          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Book with WindVenture?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Expert Instructors</h3>
                <p className="text-gray-600">IKO certified instructors with 10+ years of experience</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Premium Equipment</h3>
                <p className="text-gray-600">Latest Cabrinha & Duotone gear, replaced annually</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Perfect Location</h3>
                <p className="text-gray-600">45km lagoon with flat water and consistent wind</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Full Support</h3>
                <p className="text-gray-600">Airport transfers, accommodation help, and local tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wind className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold">WindVenture</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your premium kitesurfing school in Dakhla, Morocco
            </p>
            <p className="text-gray-400">
              Contact: <a href="mailto:contact@windventure.fr" className="text-cyan-400 hover:underline">contact@windventure.fr</a>
            </p>
            <p className="text-gray-500 text-sm mt-4">
              © 2025 WindVenture Dakhla. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}