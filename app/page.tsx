"use client"

import React from 'react';
import { Calendar, Star, MapPin, Wind, Users, Clock, ArrowRight, Phone, Mail, CheckCircle, Award, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const WindVentureHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Wind className="h-8 w-8 text-cyan-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">WindVenture</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#packages" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Packages</a>
              <a href="#about" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">About</a>
              <a href="#testimonials" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Contact</a>
            </div>
            <Link href="/packages" className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-cyan-50/30">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-6">
              <MapPin className="h-4 w-4" />
              <span className="font-semibold">Dakhla, Morocco - World's Best Kite Spot</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Your Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Kitesurfing</span>
              <br />Adventure Starts Here
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience Dakhla Like Never Before - <span className="font-semibold text-cyan-600">300+ Days of Perfect Wind</span>, 
              Professional Instructors, and the Most Stunning Lagoon on Earth
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/packages" className="inline-flex bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book Your Experience
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/reservations" className="bg-white border-2 border-cyan-600 text-cyan-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition-all duration-300 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600">1000+</div>
                <div className="text-gray-600 mt-1">Happy Riders</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">4.9</span>
                  <Star className="h-7 w-7 text-yellow-400 fill-current" />
                </div>
                <div className="text-gray-600 mt-1">Google Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600">15+</div>
                <div className="text-gray-600 mt-1">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600">300+</div>
                <div className="text-gray-600 mt-1">Windy Days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Dakhla Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Dakhla Advantage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why Dakhla is the ultimate destination for kitesurfers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center mb-4">
                <Wind className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Perfect Wind Conditions</h3>
              <p className="text-gray-600">
                Consistent 15-25 knots winds from April to October. The Venturi effect creates ideal conditions for all skill levels.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Safe Flat Water Lagoon</h3>
              <p className="text-gray-600">
                45km of pristine lagoon with shallow, warm water. Perfect for learning and freestyle. No waves, no worries.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">World-Class Spot</h3>
              <p className="text-gray-600">
                Ranked among the top 5 kitesurfing destinations globally. Host to international competitions and pro riders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gradient-to-b from-white to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Kitesurf Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From complete beginners to advanced riders, we have the perfect package for your skill level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Beginner Private Package */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 group-hover:h-3 transition-all duration-300"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Beginner Private</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">One-on-One</span>
                </div>
                <p className="text-gray-600 mb-6">Master kitesurfing with personalized one-on-one instruction</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">6 hours private training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Private IKO instructor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">All equipment included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Insurance coverage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Beach transfers</span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">€720</div>
                <div className="text-gray-500 mb-6">per person</div>
                <Link href="/book?package=beginner-private" className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Book Beginner Package
                </Link>
              </div>
            </div>

            {/* Beginner Semi-Private Package */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 group-hover:h-3 transition-all duration-300"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Semi-Private</h3>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">2-3 People</span>
                </div>
                <p className="text-gray-600 mb-6">Learn with friends in small groups, perfect balance of attention</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="text-gray-700">Small group (2-3 people)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="text-gray-700">8 hours training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="text-gray-700">Group activities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="text-gray-700">IKO certification</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">€1,100</div>
                <div className="text-gray-500 mb-6">per person</div>
                <Link href="/book?package=beginner-semi-private" className="block w-full text-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Book Semi-Private
                </Link>
              </div>
            </div>

            {/* Combined Package - Most Popular */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform scale-105">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 group-hover:h-3 transition-all duration-300"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-1 rounded-bl-lg font-semibold">
                BEST VALUE
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Combined Package</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                </div>
                <p className="text-gray-600 mb-6">The ultimate experience combining technique mastery with exploration</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">12 hours training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">3 different spots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Video analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Technique & adventure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Complete experience</span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">€1,350</div>
                <div className="text-gray-500 mb-6">per person</div>
                <Link href="/book?package=combined" className="block w-full text-center bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Book Combined Package
                </Link>
              </div>
            </div>

            {/* Exploration Package */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 group-hover:h-3 transition-all duration-300"></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Exploration Package</h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">Adventure</span>
                </div>
                <p className="text-gray-600 mb-6">Discover Dakhla's legendary spots from White Dune to Dragon Island</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">10 hours coaching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Multiple locations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Transport included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Spot variety</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Local insights</span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">€1,250</div>
                <div className="text-gray-500 mb-6">per person</div>
                <Link href="/book?package=exploration" className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Book Exploration Package
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Riders Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied kitesurfers who chose WindVenture Dakhla
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Best kitesurf experience of my life! The instructors are world-class, the lagoon is perfect, and the vibe is amazing. Can't wait to come back!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Sarah Johnson</div>
                  <div className="text-gray-600 text-sm">Professional Rider, UK</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "I went from zero to hero in just one week! The conditions in Dakhla are unbeatable and WindVenture team made learning so easy and fun."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Marc Dubois</div>
                  <div className="text-gray-600 text-sm">Beginner, France</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The combination of perfect wind, flat water, and professional coaching is unmatched. WindVenture exceeded all my expectations!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
                <div>
                  <div className="font-bold text-gray-900">Lisa Chen</div>
                  <div className="text-gray-600 text-sm">Intermediate, Germany</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready for the Adventure of a Lifetime?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join us in Dakhla and discover why it's the world's premier kitesurfing destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/packages" className="inline-flex bg-white text-cyan-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 items-center gap-2">
              <Calendar className="h-5 w-5" />
              Check Availability
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/reservations" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-cyan-600 transition-all duration-300 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wind className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold">WindVenture</span>
              </div>
              <p className="text-gray-400">
                Your premium kitesurfing school in Dakhla, Morocco. Experience the wind like never before.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#packages" className="block text-gray-400 hover:text-white transition-colors">Our Packages</a>
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="#testimonials" className="block text-gray-400 hover:text-white transition-colors">Reviews</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Dakhla, Morocco</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Contact via email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">contact@windventure.fr</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest news and offers
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-500 cursor-pointer transition-colors">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-500 cursor-pointer transition-colors">
                  <span className="text-white font-bold">ig</span>
                </div>
                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-500 cursor-pointer transition-colors">
                  <span className="text-white font-bold">yt</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WindVenture Dakhla. All rights reserved. | Premium Kitesurfing Since 2010</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WindVentureHomepage;