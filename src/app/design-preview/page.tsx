import UXNotes from '@/components/UXNotes';

export default function DesignPreviewPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center'>
      <div className='text-center max-w-2xl mx-auto p-8'>
        <h1 className='text-4xl font-bold mb-4 text-gray-800'>
          🎨 Windventure Design System
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          Complete Dakhla desert-ocean theme implementation with:
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left'>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-blue-600 mb-2'>
              ✨ Hero Section
            </h3>
            <p className='text-sm text-gray-600'>
              Immersive desert-ocean atmosphere
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-orange-600 mb-2'>
              🏄‍♂️ Kite Spots
            </h3>
            <p className='text-sm text-gray-600'>
              Interactive slider with 5 legendary locations
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-green-600 mb-2'>
              🌅 Experiences
            </h3>
            <p className='text-sm text-gray-600'>
              Safari, Boat Trip, Bivouac options
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='font-semibold text-purple-600 mb-2'>
              💬 Testimonials
            </h3>
            <p className='text-sm text-gray-600'>
              Dynamic client photos & stories
            </p>
          </div>
        </div>
        <div className='mt-8'>
          <p className='text-sm text-gray-500'>
            Design system successfully implemented on design-preview branch
          </p>
        </div>
      </div>

      {/* Composant UXNotes pour collecter les retours */}
      <UXNotes page='design-preview' />
    </div>
  );
}
