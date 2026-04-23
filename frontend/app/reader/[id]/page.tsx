'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { booksApi, vocabularyApi } from '@/lib/api';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  content: string;
  difficulty_level: string;
}

function BookReaderContent() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [saving, setSaving] = useState(false);

  const bookId = parseInt(params.id as string);

  useEffect(() => {
    const loadBook = async () => {
      if (!token) return;

      try {
        const response = await booksApi.getById(token, bookId);
        setBook(response.data);
      } catch (error) {
        console.error('Error loading book:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [token, bookId]);

  const handleWordClick = async (word: string) => {
    if (!token) return;

    const cleanWord = word.replace(/[.,;:!?¿¡"""'()]/g, '').toLowerCase();
    setSelectedWord(cleanWord);
    setShowTranslation(true);

    try {
      const response = await booksApi.translate(token, bookId, cleanWord);
      setTranslation(response.data.translation || 'Translation not found');
    } catch (error) {
      console.error('Error translating word:', error);
      setTranslation('Translation error');
    }
  };

  const handleSaveWord = async () => {
    if (!token || !selectedWord || !translation) return;

    setSaving(true);
    try {
      await vocabularyApi.add(token, {
        word: selectedWord,
        translation,
        source_book_id: bookId,
      });
      alert('Word saved to vocabulary!');
    } catch (error) {
      console.error('Error saving word:', error);
      alert('Error saving word');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = (content: string) => {
    const words = content.split(/(\s+)/);
    return words.map((word, index) => {
      if (word.trim() === '') return <span key={index}>{word}</span>;

      return (
        <span
          key={index}
          onClick={() => handleWordClick(word)}
          className="cursor-pointer hover:bg-yellow-200 transition-colors"
        >
          {word}
        </span>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading book...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Book not found</p>
          <Link href="/reader" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/reader" className="text-indigo-600 hover:text-indigo-800">
                ← Books
              </Link>
              <span className="ml-4 text-gray-900 font-semibold">{book.title}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">{book.author}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-gray-600">by {book.author}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded">
              {book.difficulty_level}
            </span>
          </div>

          <div className="prose max-w-none text-lg leading-relaxed text-gray-800">
            {renderContent(book.content)}
          </div>
        </div>

        {showTranslation && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedWord}</h3>
                  <p className="text-gray-600 mt-1">{translation}</p>
                </div>
                <button
                  onClick={() => setShowTranslation(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <button
                onClick={handleSaveWord}
                disabled={saving}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save to Vocabulary'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookReaderPage() {
  return (
    <ProtectedRoute>
      <BookReaderContent />
    </ProtectedRoute>
  );
}
