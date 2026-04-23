'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { vocabularyApi } from '@/lib/api';
import Link from 'next/link';

interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  mastery_level: number;
  next_review_at: string | null;
}

interface Stats {
  total: number;
  new: number;
  learning: number;
  mastered: number;
  due_today: number;
}

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
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleReview = async (correct: boolean) => {
    if (!token || !currentWord) return;

    setReviewing(true);
    try {
      await vocabularyApi.review(token, currentWord.id, correct);

      // Move to next word
      if (currentIndex < dueWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Finished all reviews
        await loadData();
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error('Error reviewing word:', error);
    } finally {
      setReviewing(false);
    }
  };

  const currentWord = dueWords[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading vocabulary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                ESET
              </Link>
              <span className="ml-4 text-gray-600">/ Vocabulary Review</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.learning}</div>
              <div className="text-sm text-gray-600">Learning</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.due_today}</div>
              <div className="text-sm text-gray-600">Due Today</div>
            </div>
          </div>
        )}

        {/* Flashcard Review */}
        {dueWords.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6 text-center text-sm text-gray-500">
              Card {currentIndex + 1} of {dueWords.length}
            </div>

            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">Spanish</div>
                <div className="text-5xl font-bold text-gray-900 text-center">
                  {currentWord.word}
                </div>
              </div>

              {showAnswer && (
                <div className="mb-8">
                  <div className="text-sm text-gray-500 mb-2 text-center">Translation</div>
                  <div className="text-3xl text-indigo-600 text-center">
                    {currentWord.translation}
                  </div>
                </div>
              )}
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
              >
                Show Answer
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleReview(false)}
                  disabled={reviewing}
                  className="py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  {reviewing ? 'Processing...' : 'Again'}
                </button>
                <button
                  onClick={() => handleReview(true)}
                  disabled={reviewing}
                  className="py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {reviewing ? 'Processing...' : 'Good'}
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
              Mastery Level: {currentWord.mastery_level}/5
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No words due for review! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You've completed all your vocabulary reviews for now.
            </p>
            <Link
              href="/reader"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Read to discover new words
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function VocabularyPage() {
  return (
    <ProtectedRoute>
      <VocabularyContent />
    </ProtectedRoute>
  );
}
