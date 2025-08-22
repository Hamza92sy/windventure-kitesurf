import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Windventure - Kitesurfing School Dakhla',
  description: 'Learn about our passion for kitesurfing in Dakhla, Morocco. Meet our IKO certified team and discover our mission.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About Windventure</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Windventure was founded by passionate kitesurfers from Dakhla, 
            with the goal of growing the local kitesurf community and creating 
            unforgettable experiences for riders from around the world.
          </p>
          
          <h2 className="text-3xl font-bold mt-12 mb-6">Our Mission</h2>
          <p>
            We are dedicated to sharing the magic of Dakhla with kitesurfing 
            enthusiasts from around the world. Our mission is to provide 
            exceptional kitesurfing experiences in one of the most unique 
            locations on Earth, where the Sahara Desert meets the Atlantic Ocean.
          </p>
          
          <h2 className="text-3xl font-bold mt-12 mb-6">Why Choose Windventure?</h2>
          <ul className="space-y-4">
            <li>🏅 <strong>IKO Certified Instructors:</strong> Professional, safe instruction</li>
            <li>🌍 <strong>Local Expertise:</strong> Deep knowledge of Dakhla conditions</li>
            <li>🎯 <strong>Personalized Approach:</strong> Tailored to your skill level</li>
            <li>⚡ <strong>Premium Equipment:</strong> Latest gear for optimal performance</li>
          </ul>
          
          <h2 className="text-3xl font-bold mt-12 mb-6">The Dakhla Experience</h2>
          <p>
            Dakhla offers some of the most consistent wind conditions in the world,
            with 300+ days of wind per year. Our location provides the perfect
            combination of flat water lagoons for beginners and exciting wave spots
            for advanced riders.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-4">Ready to Start Your Adventure?</h3>
            <p className="mb-4">
              Join hundreds of riders who have discovered the magic of Dakhla with Windventure.
            </p>
            <a 
              href="/packages"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Our Packages
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
