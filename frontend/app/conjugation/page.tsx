'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { verbsApi } from '@/lib/api';
import Link from 'next/link';

interface Verb {
  id: number;
  infinitive: string;
  group: string;
  irregularity_type: string | null;
}

interface Conjugations {
  yo: string;
  tu: string;
  el: string;
  nosotros: string;
  vosotros: string;
  ellos: string;
}

const TENSES = [
  { value: 'presente', label: 'Present' },
  { value: 'preterito', label: 'Preterite' },
  { value: 'imperfecto', label: 'Imperfect' },
  { value: 'futuro', label: 'Future' },
];

const PERSONS = [
  { value: 'yo', label: 'yo' },
  { value: 'tu', label: 'tú' },
  { value: 'el', label: 'él/ella/usted' },
  { value: 'nosotros', label: 'nosotros' },
  { value: 'vosotros', label: 'vosotros' },
  { value: 'ellos', label: 'ellos/ellas/ustedes' },
];

function ConjugationContent() {
  const { token } = useAuth();
  const [verb, setVerb] = useState<Verb | null>(null);
  const [tense, setTense] = useState('presente');
  const [currentPerson, setCurrentPerson] = useState('yo');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const loadNewVerb = async () => {
    if (!token) return;
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');

    try {
      const response = await verbsApi.getRandom(token);
      setVerb(response.data);
      // Randomly select a person
      const randomPerson = PERSONS[Math.floor(Math.random() * PERSONS.length)];
      setCurrentPerson(randomPerson.value);
    } catch (error) {
      console.error('Error loading verb:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewVerb();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !verb) return;

    try {
      const response = await verbsApi.check(token, {
        infinitive: verb.infinitive,
        tense,
        person: currentPerson,
        answer: userAnswer,
      });

      const isCorrect = response.data.correct;
      setScore({
        correct: score.correct + (isCorrect ? 1 : 0),
        total: score.total + 1,
      });

      setFeedback({
        correct: isCorrect,
        message: isCorrect
          ? '¡Correcto! 🎉'
          : `Incorrect. The correct answer is: ${response.data.correctAnswer}`,
      });

      if (isCorrect) {
        setTimeout(() => {
          loadNewVerb();
        }, 1500);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const handleSkip = () => {
    loadNewVerb();
  };

  const personLabel = PERSONS.find(p => p.value === currentPerson)?.label || currentPerson;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                ESET
              </Link>
              <span className="ml-4 text-gray-600">/ Conjugation Practice</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                Score: {score.correct}/{score.total}
                {score.total > 0 && (
                  <span className="ml-2 text-gray-500">
                    ({Math.round((score.correct / score.total) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tense
            </label>
            <select
              value={tense}
              onChange={(e) => setTense(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {TENSES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading verb...</div>
            </div>
          ) : verb ? (
            <>
              <div className="text-center mb-8">
                <div className="text-sm text-gray-500 mb-2">Conjugate:</div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {verb.infinitive}
                </div>
                <div className="text-lg text-gray-600">
                  {personLabel}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                    disabled={feedback?.correct === true}
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-md ${
                      feedback.correct
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!userAnswer.trim() || feedback?.correct === true}
                    className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">No verb loaded</div>
              <button
                onClick={loadNewVerb}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Load Verb
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ConjugationPage() {
  return (
    <ProtectedRoute>
      <ConjugationContent />
    </ProtectedRoute>
  );
}
