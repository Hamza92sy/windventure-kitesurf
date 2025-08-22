import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PACKAGES_DATA } from '@/data/packages-optimized';
import { CheckCircle, Clock, Users, Star, ArrowRight, Calendar, MapPin } from 'lucide-react';

interface PackagePageProps {
  params: {
    slug: string;
  };
}

export default function PackagePage({ params }: PackagePageProps) {
  const pkg = PACKAGES_DATA.find(p => p.id === params.slug);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <Link href="/packages" className="hover:text-blue-600">Packages</Link>
            <span>→</span>
            <span className="text-gray-900 font-medium">{pkg.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/packages" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to All Packages
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Package Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              {pkg.isPopular && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                  ⭐ Most Popular Package
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {pkg.name}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {pkg.description}
              </p>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-semibold">{pkg.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Max Participants</div>
                    <div className="font-semibold">{pkg.maxParticipants || 'Flexible'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                    <div className="font-semibold capitalize">{pkg.difficulty}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Includes */}
            {pkg.included && pkg.included.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Package Details</h2>
                <div className="space-y-3">
                  {pkg.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {pkg.features && pkg.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Features</h2>
                <div className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {pkg.included && pkg.included.length > 3 && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Services</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {pkg.included.slice(3).map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-cyan-600" />
                      <span className="text-gray-800 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    €{pkg.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600">per person</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold capitalize">{pkg.category}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold capitalize">{pkg.difficulty}</span>
                  </div>
                </div>

                <Link 
                  href={`/book?package=${pkg.id}`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 group"
                >
                  Book This Package
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Free cancellation up to 48h before your adventure
                  </p>
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Need Help?</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Instant booking confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Dakhla, Morocco</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <h4 className="font-bold text-gray-900 mb-2">#1 Rated in Dakhla</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Over 1000+ satisfied customers and 4.9★ average rating
                  </p>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all packages
export async function generateStaticParams() {
  return PACKAGES_DATA.map((pkg) => ({
    slug: pkg.id,
  }));
}