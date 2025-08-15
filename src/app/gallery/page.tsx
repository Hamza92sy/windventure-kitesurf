import DakhlaGallery from "@/components/DakhlaGallery";


export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dakhla-blue-600 via-lagoon-turquoise-400 to-sahara-gold-400">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Dakhla{" "}
              <span className="bg-gradient-to-r from-sahara-gold-400 to-sahara-gold-600 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Discover the breathtaking beauty of Morocco&apos;s kitesurfing paradise
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <DakhlaGallery />

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-ocean">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Dakhla by the Numbers
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "365", label: "Days of Wind", icon: "💨" },
                { number: "40km", label: "Lagoon Length", icon: "📏" },
                { number: "25°C", label: "Average Temp", icon: "🌡️" },
                { number: "1000+", label: "Happy Riders", icon: "🏄‍♂️" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Tips Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Photography{" "}
              <span className="bg-gradient-to-r from-dakhla-blue-600 to-lagoon-turquoise-400 bg-clip-text text-transparent">
                Tips
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of your Dakhla experience with these photography tips
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "📸",
                title: "Golden Hour Magic",
                tip: "Shoot during sunrise and sunset for warm, dramatic lighting that enhances the lagoon's colors.",
                time: "6:30-8:00 AM & 6:00-7:30 PM"
              },
              {
                icon: "🌊",
                title: "Capture the Contrast",
                tip: "Frame shots that show the contrast between the turquoise lagoon and golden desert sands.",
                time: "All day"
              },
              {
                icon: "🦩",
                title: "Wildlife Photography",
                tip: "Use a telephoto lens to capture flamingos and other wildlife without disturbing them.",
                time: "Early morning"
              },
              {
                icon: "🏄‍♂️",
                title: "Action Shots",
                tip: "Use a fast shutter speed (1/1000s+) to freeze kitesurf action and water spray.",
                time: "Mid-day"
              },
              {
                icon: "🛩️",
                title: "Aerial Perspectives",
                tip: "Drone shots reveal the lagoon's massive scale and intricate patterns in the sand.",
                time: "Check regulations"
              },
              {
                icon: "📱",
                title: "Phone Photography",
                tip: "Even smartphones can capture stunning shots - use HDR mode for high contrast scenes.",
                time: "Any time"
              }
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {tip.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {tip.tip}
                </p>
                <div className="bg-white rounded-lg p-3 text-center">
                  <span className="text-sm font-medium text-gray-600">
                    Best Time: {tip.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Create Your Own{" "}
              <span className="bg-gradient-to-r from-dakhla-blue-600 to-lagoon-turquoise-400 bg-clip-text text-transparent">
                Memories
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Book your Dakhla kitesurfing adventure and capture your own amazing photos in this incredible destination.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/packages"
                className="bg-gradient-to-r from-dakhla-blue-600 to-lagoon-turquoise-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                🏄‍♂️ Book Your Trip
              </a>
              <a
                href="/contact"
                className="bg-white text-dakhla-blue-600 border-2 border-dakhla-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-dakhla-blue-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              >
                📞 Ask About Photography Tours
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}