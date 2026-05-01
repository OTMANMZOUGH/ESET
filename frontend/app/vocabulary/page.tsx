'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { vocabularyApi } from '@/lib/api';
import Link from 'next/link';

interface VocabularyWord { id: number; word: string; translation: string; mastery_level: number; next_review_at: string | null; }
interface Stats { total: number; new: number; learning: number; mastered: number; due_today: number; }

const MASTERY_COLORS = ['bg-gray-300', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'];

function VocabularyContent() {
  const { token } = useAuth();
  const [dueWords, setDueWords] = useState<VocabularyWord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const loadData = async () => {
    if (!token) return;
    try {
      const [dueResponse, statsResponse] = await Promise.all([
        vocabularyApi.getDue(token, 20),
        vocabularyApi.getStats(token),
      ]);
      setDueWords(dueResponse.data);
      setStats(statsResponse.data);
    } catch (error) { console.error('Error loading vocabulary:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [token]);

  const handleReview = async (correct: boolean) => {
    if (!token || !currentWord) return;
    setReviewing(true);
    try {
      await vocabularyApi.review(token, currentWord.id, correct);
      if (currentIndex < dueWords.length - 1) {
        setCurrentIndex(currentIndex + 1); setShowAnswer(false);
      } else {
        await loadData(); setCurrentIndex(0); setShowAnswer(false);
      }
    } catch (error) { console.error('Error reviewing:', error); }
    finally { setReviewing(false); }
  };

  const currentWord = dueWords[currentIndex];

  if (loading) {
    return <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center"><LoadingSpinner message="Loading vocabulary..." /></div>;
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] tile-pattern">
      <Navbar breadcrumb="Vocabulary Review" />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats bar */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 stagger-children">
            {[
              { label: 'Total', value: stats.total, color: 'text-[var(--navy)]' },
              { label: 'New', value: stats.new, color: 'text-blue-600' },
              { label: 'Learning', value: stats.learning, color: 'text-[var(--saffron-dark)]' },
              { label: 'Mastered', value: stats.mastered, color: 'text-[var(--success)]' },
              { label: 'Due Today', value: stats.due_today, color: 'text-[var(--terracotta)]' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center border border-[var(--border)] animate-fade-in-up">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs font-medium text-[var(--warm-gray)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Flashcard */}
        {dueWords.length > 0 ? (
          <div className="animate-scale-in">
            <div className="text-center mb-4 text-sm text-[var(--warm-gray)] font-medium">
              Card {currentIndex + 1} of {dueWords.length}
            </div>

            <div className="perspective">
              <div className={`flip-card-inner ${showAnswer ? 'flipped' : ''}`} style={{ minHeight: '340px', position: 'relative' }}>
                {/* Front */}
                <div className="flip-card-front absolute inset-0 glass rounded-2xl border border-[var(--border)] shadow-lg flex flex-col items-center justify-center p-8">
                  <p className="text-sm font-medium text-[var(--warm-gray)] uppercase tracking-wider mb-4">Spanish</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl font-bold text-[var(--navy)] mb-6">{currentWord.word}</h2>
                  {/* Mastery dots */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < currentWord.mastery_level ? MASTERY_COLORS[currentWord.mastery_level] : 'bg-[var(--sand)]'}`} />
                    ))}
                  </div>
                  <button onClick={() => setShowAnswer(true)}
                    className="mt-8 w-full max-w-xs py-3.5 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all">
                    Reveal Answer
                  </button>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 glass rounded-2xl border border-[var(--border)] shadow-lg flex flex-col items-center justify-center p-8">
                  <p className="text-sm font-medium text-[var(--warm-gray)] uppercase tracking-wider mb-2">Spanish</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--navy)] mb-4">{currentWord.word}</h2>
                  <div className="w-16 h-0.5 bg-[var(--sand)] rounded-full mb-4" />
                  <p className="text-sm font-medium text-[var(--warm-gray)] uppercase tracking-wider mb-2">Translation</p>
                  <h3 className="text-3xl font-bold text-[var(--terracotta)] mb-8">{currentWord.translation}</h3>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <button onClick={() => handleReview(false)} disabled={reviewing}
                      className="py-3 bg-[var(--error-bg)] text-[var(--error)] border border-red-200 font-semibold rounded-xl hover:bg-red-100 transition-all disabled:opacity-50">
                      {reviewing ? '...' : 'Again ✕'}
                    </button>
                    <button onClick={() => handleReview(true)} disabled={reviewing}
                      className="py-3 bg-[var(--success-bg)] text-[var(--success)] border border-green-200 font-semibold rounded-xl hover:bg-green-100 transition-all disabled:opacity-50">
                      {reviewing ? '...' : 'Good ✓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center border border-[var(--border)] shadow-lg animate-scale-in">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--navy)] mb-3">All caught up!</h2>
            <p className="text-[var(--warm-gray)] mb-6">No words due for review right now.</p>
            <Link href="/reader" className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
              Read to discover new words
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function VocabularyPage() {
  return (<ProtectedRoute><VocabularyContent /></ProtectedRoute>);
}
