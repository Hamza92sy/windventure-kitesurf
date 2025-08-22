// NOUVEAU CODE POUR LA SECTION PACKAGES - À COPIER DANS app/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

{/* Packages Section - OPTIMIZED 4 PERSONS */}
<section id="packages" className="py-20 bg-gradient-to-b from-white to-cyan-50/30">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Kitesurf Packages</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        <span className="font-bold text-cyan-600">NEW: Optimized for up to 4 persons</span> - Better pricing, more flexibility
      </p>
      <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
        <CheckCircle className="h-5 w-5" />
        <span className="font-semibold">Save up to €300 vs competitors with mandatory catering</span>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Semi-Private Discovery - 380€ */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 group-hover:h-3 transition-all duration-300"></div>
        <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-bl-lg font-semibold">
          POPULAR
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Semi-Private Discovery</h3>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Max 4</span>
          </div>
          <p className="text-gray-600 mb-6">Perfect for beginners - Learn kitesurfing fundamentals</p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">3 days intensive</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Up to 4 persons</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">All equipment included</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">IKO certification</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">€380</div>
          <div className="text-gray-500 mb-6">
            per person
            <span className="block text-sm text-green-600 mt-1">
              Group of 4: €1,520 total
            </span>
          </div>
          <Link href="/booking-4persons?package=semi-private-discovery" className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Book Discovery
          </Link>
        </div>
      </div>

      {/* Semi-Private Experience - 580€ */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 group-hover:h-3 transition-all duration-300"></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Semi-Private Experience</h3>
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold">Max 4</span>
          </div>
          <p className="text-gray-600 mb-6">Intermediate progression with advanced techniques</p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
              <span className="text-gray-700">5 days complete</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
              <span className="text-gray-700">Advanced techniques</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
              <span className="text-gray-700">Video analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
              <span className="text-gray-700">Small group (max 4)</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">€580</div>
          <div className="text-gray-500 mb-6">
            per person
            <span className="block text-sm text-green-600 mt-1">
              Group of 4: €2,320 total
            </span>
          </div>
          <Link href="/booking-4persons?package=semi-private-experience" className="block w-full text-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Book Experience
          </Link>
        </div>
      </div>

      {/* Semi-Private Exploration - 750€ */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 group-hover:h-3 transition-all duration-300"></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Semi-Private Exploration</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Max 4</span>
          </div>
          <p className="text-gray-600 mb-6">Discover Dakhla's legendary spots and hidden gems</p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">7 days adventure</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">Multiple spots</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">Downwind sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">Local guide included</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">€750</div>
          <div className="text-gray-500 mb-6">
            per person
            <span className="block text-sm text-green-600 mt-1">
              Group of 4: €3,000 total
            </span>
          </div>
          <Link href="/booking-4persons?package=semi-private-exploration" className="block w-full text-center bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Book Exploration
          </Link>
        </div>
      </div>

      {/* Combined Ultimate - 950€ */}
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform scale-105">
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 group-hover:h-3 transition-all duration-300"></div>
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 rounded-bl-lg font-semibold">
          PREMIUM
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Combined Ultimate</h3>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">Max 4</span>
          </div>
          <p className="text-gray-600 mb-6">The complete Dakhla experience - Master every aspect</p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700">10 days complete</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700">All techniques covered</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700">Premium equipment</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span className="text-gray-700">VIP experience</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-semibold">Best value!</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">€950</div>
          <div className="text-gray-500 mb-6">
            per person
            <span className="block text-sm text-green-600 mt-1">
              Group of 4: €3,800 total
            </span>
          </div>
          <Link href="/booking-4persons?package=combined-ultimate" className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Book Ultimate
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>