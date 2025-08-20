export default function CSSTest() {
  return (
    <div className="min-h-screen bg-red-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">
        🚨 CSS TEST CRITIQUE
      </h1>
      <div className="bg-blue-600 p-6 rounded-lg shadow-xl">
        <p className="text-white text-xl">
          Si vous voyez du ROUGE et du BLEU, Tailwind fonctionne !
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500 p-4 text-white font-bold text-center">
          GREEN BOX
        </div>
        <div className="bg-yellow-500 p-4 text-black font-bold text-center">
          YELLOW BOX
        </div>
        <div className="bg-purple-500 p-4 text-white font-bold text-center">
          PURPLE BOX
        </div>
      </div>
    </div>
  );
}