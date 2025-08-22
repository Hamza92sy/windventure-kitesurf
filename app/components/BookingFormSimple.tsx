"use client";
import { useState, useEffect } from 'react';

// Version ultra-simple pour éviter webpack errors
const packages = [
  { id: 'beginner-private', name: 'Beginner Private', price: 720 },
  { id: 'beginner-semi-private', name: 'Beginner Semi-Private', price: 1100 },
  { id: 'exploration', name: 'Exploration Package', price: 1250 },
  { id: 'combined', name: 'Combined Package', price: 1350 }
];

export default function BookingFormSimple() {
  const [packageId, setPackageId] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pkgId = params.get('package') || '';
      console.log('🔍 Package ID detected:', pkgId);
      setPackageId(pkgId);
      
      const pkg = packages.find(p => p.id === pkgId);
      console.log('📦 Package found:', pkg);
      setSelectedPackage(pkg);
    }
  }, []);

  if (!selectedPackage) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">🔍 Package Detection</h2>
        <p className="mb-4">Package ID from URL: <strong>{packageId}</strong></p>
        <p className="text-red-600 mb-4">Package not found or not detected yet</p>
        <a href="/packages" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          ← Back to Packages
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4">✅ Package Detected!</h2>
      <div className="bg-green-50 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-green-800">{selectedPackage.name}</h3>
        <p className="text-2xl font-bold text-green-600">€{selectedPackage.price}</p>
        <p className="text-sm text-gray-600">Package ID: {packageId}</p>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">🎉 Webpack error fixed! Package loading works!</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Continue to Full Booking Form
        </button>
      </div>
    </div>
  );
}