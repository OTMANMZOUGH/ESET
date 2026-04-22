import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            ESET
          </h1>
          <p className="text-2xl text-white/90 mb-4">
            Spanish Language Learning Platform
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
            Master Spanish through conjugation practice, immersive reading, and spaced repetition vocabulary system
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Conjugation Practice</h3>
              <p className="text-white/80">Master verb conjugations with intelligent exercises</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Interactive Reader</h3>
              <p className="text-white/80">Read Spanish texts with instant translations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Smart Vocabulary</h3>
              <p className="text-white/80">Spaced repetition system for lasting retention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
