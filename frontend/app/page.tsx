import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--navy-dark)] overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 tile-pattern opacity-30" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--terracotta)] to-[var(--saffron)] opacity-[0.08] blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[var(--saffron)] to-[var(--olive)] opacity-[0.06] blur-3xl" />

      {/* Top nav */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--terracotta)] to-[var(--saffron)] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white tracking-tight">
                ESET
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--saffron)] animate-pulse" />
              <span className="text-sm text-white/70 font-medium">
                Powered by spaced repetition science
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Learn Spanish
              <br />
              <span className="bg-gradient-to-r from-[var(--terracotta-light)] to-[var(--saffron)] bg-clip-text text-transparent">
                the immersive way
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Conjugation drills, interactive reading, smart flashcards — everything you need
              to go from ¡Hola! to fluency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group px-8 py-4 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg"
              >
                Start Learning
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/[0.06] border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg backdrop-blur-sm"
              >
                I have an account
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {/* Card 1 */}
            <div className="group glass-dark rounded-2xl p-6 card-hover animate-fade-in-up cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-light)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white mb-2">
                Conjugation Drills
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Practice every tense with instant feedback. Irregular verbs, stem-changers — we cover it all.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group glass-dark rounded-2xl p-6 card-hover animate-fade-in-up cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--olive)] to-[var(--olive-light)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white mb-2">
                Interactive Reader
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Read real Spanish texts. Tap any word for instant translation and save it to your vocab list.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group glass-dark rounded-2xl p-6 card-hover animate-fade-in-up cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--saffron)] to-[var(--saffron-light)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white mb-2">
                Smart Flashcards
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                SM-2 spaced repetition algorithm shows you words right before you forget them.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group glass-dark rounded-2xl p-6 card-hover animate-fade-in-up cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--navy-light)] to-[var(--navy)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white mb-2">
                Writing Practice
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Write notes, essays, and journal entries in Spanish. Build real-world writing confidence.
              </p>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-24 text-center animate-fade-in">
            <p className="text-sm text-white/30 uppercase tracking-widest mb-6 font-medium">
              Built for serious learners
            </p>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-white/40 mt-1">Spanish Verbs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-sm text-white/40 mt-1">Tenses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">A1–C2</div>
                <div className="text-sm text-white/40 mt-1">All Levels</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">SM-2</div>
                <div className="text-sm text-white/40 mt-1">SRS Algorithm</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white/30">
            © 2026 ESET. Learn Spanish through immersion.
          </p>
        </div>
      </footer>
    </div>
  );
}
