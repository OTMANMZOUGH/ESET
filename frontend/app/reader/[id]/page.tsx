'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { booksApi, vocabularyApi } from '@/lib/api';
import Link from 'next/link';

interface Book { id: number; title: string; author: string; content: string; difficulty_level: string; }

function BookReaderContent() {
  const params = useParams();
  const { token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState(false);

  const bookId = parseInt(params.id as string);

  useEffect(() => {
    const loadBook = async () => {
      if (!token) return;
      try {
        const response = await booksApi.getById(token, bookId);
        setBook(response.data);
      } catch (error) { console.error('Error loading book:', error); }
      finally { setLoading(false); }
    };
    loadBook();
  }, [token, bookId]);

  const handleWordClick = async (word: string) => {
    if (!token) return;
    const cleanWord = word.replace(/[.,;:!?¿¡""\"'()]/g, '').toLowerCase();
    if (!cleanWord) return;
    setSelectedWord(cleanWord);
    setShowTranslation(true);
    setTranslating(true);
    setSaved(false);
    try {
      const response = await booksApi.translate(token, bookId, cleanWord);
      setTranslation(response.data.translation || 'Translation not found');
    } catch (error) {
      console.error('Error translating:', error);
      setTranslation('Translation error');
    } finally { setTranslating(false); }
  };

  const handleSaveWord = async () => {
    if (!token || !selectedWord || !translation) return;
    setSaving(true);
    try {
      await vocabularyApi.add(token, { word: selectedWord, translation, source_book_id: bookId });
      setSaved(true);
    } catch (error) { console.error('Error saving:', error); }
    finally { setSaving(false); }
  };

  const renderContent = (content: string) => {
    return content.split(/(\s+)/).map((word, index) => {
      if (word.trim() === '') return <span key={index}>{word}</span>;
      const isSelected = word.replace(/[.,;:!?¿¡""\"'()]/g, '').toLowerCase() === selectedWord;
      return (
        <span key={index} onClick={() => handleWordClick(word)}
          className={`cursor-pointer rounded px-0.5 transition-all hover:bg-[var(--saffron-light)]/40 ${isSelected ? 'bg-[var(--saffron-light)]/60 text-[var(--terracotta-dark)] font-semibold' : ''}`}>
          {word}
        </span>
      );
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center"><LoadingSpinner message="Loading book..." /></div>;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--warm-gray)] mb-4">Book not found</p>
          <Link href="/reader" className="text-[var(--terracotta)] font-semibold hover:underline">← Back to Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Sticky header */}
      <nav className="glass sticky top-0 z-50 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <Link href="/reader" className="text-[var(--terracotta)] font-semibold text-sm hover:text-[var(--terracotta-dark)] transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Library
            </Link>
            <div className="text-center">
              <div className="font-semibold text-[var(--navy)] text-sm truncate max-w-[200px]">{book.title}</div>
            </div>
            <span className="text-xs font-semibold text-[var(--warm-gray)]">{book.difficulty_level}</span>
          </div>
        </div>
      </nav>

      {/* Reading area */}
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="glass rounded-2xl p-8 sm:p-12 border border-[var(--border)] shadow-lg">
          <div className="mb-8 pb-6 border-b border-[var(--border)]">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--navy)] mb-1">{book.title}</h1>
            <p className="text-[var(--warm-gray)]">by {book.author}</p>
          </div>
          <div className="font-[family-name:var(--font-playfair)] text-lg leading-[2] text-[var(--navy)] selection:bg-[var(--saffron-light)]/40">
            {renderContent(book.content)}
          </div>
        </div>
      </div>

      {/* Translation popup */}
      {showTranslation && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
          <div className="max-w-3xl mx-auto px-4 pb-6">
            <div className="glass rounded-2xl p-5 border border-[var(--border)] shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--navy)]">{selectedWord}</h3>
                  {translating ? (
                    <p className="text-[var(--warm-gray)] mt-1 animate-pulse">Translating...</p>
                  ) : (
                    <p className="text-[var(--terracotta)] font-medium mt-1">{translation}</p>
                  )}
                </div>
                <button onClick={() => setShowTranslation(false)} className="p-1 rounded-lg hover:bg-[var(--cream-dark)] text-[var(--warm-gray)] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <button onClick={handleSaveWord} disabled={saving || saved || translating}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  saved ? 'bg-[var(--success-bg)] text-[var(--success)] border border-green-200'
                    : 'bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50'
                }`}>
                {saved ? '✓ Saved to Vocabulary' : saving ? 'Saving...' : 'Save to Vocabulary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookReaderPage() {
  return (<ProtectedRoute><BookReaderContent /></ProtectedRoute>);
}
