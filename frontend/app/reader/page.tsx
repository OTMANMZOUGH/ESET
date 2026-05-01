'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { booksApi } from '@/lib/api';
import Link from 'next/link';

interface Book { id: number; title: string; author: string; difficulty_level: string; }

const LEVEL_COLORS: Record<string, string> = {
  A1: 'from-[var(--olive)] to-[var(--olive-light)]',
  A2: 'from-[var(--olive-light)] to-[var(--saffron)]',
  B1: 'from-[var(--saffron)] to-[var(--saffron-light)]',
  B2: 'from-[var(--terracotta-light)] to-[var(--saffron)]',
  C1: 'from-[var(--terracotta)] to-[var(--terracotta-light)]',
  C2: 'from-[var(--navy)] to-[var(--navy-light)]',
};

function ReaderListContent() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      if (!token) return;
      try {
        const response = await booksApi.getAll(token, user?.level);
        const booksArray = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setBooks(booksArray);
      } catch (error) { console.error('Error loading books:', error); }
      finally { setLoading(false); }
    };
    loadBooks();
  }, [token, user]);

  return (
    <div className="min-h-screen bg-[var(--cream)] tile-pattern">
      <Navbar breadcrumb="Reader" />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--navy)]">Spanish Library</h1>
          <p className="text-[var(--warm-gray)] mt-1">Tap any word while reading for instant translation</p>
        </div>

        {loading ? (
          <div className="py-16"><LoadingSpinner message="Loading books..." /></div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {books.map(book => (
              <Link key={book.id} href={`/reader/${book.id}`} className="group animate-fade-in-up">
                <div className="glass rounded-2xl overflow-hidden border border-[var(--border)] card-hover h-full">
                  {/* Cover accent */}
                  <div className={`h-3 bg-gradient-to-r ${LEVEL_COLORS[book.difficulty_level] || LEVEL_COLORS.A1}`} />
                  <div className="p-6">
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${LEVEL_COLORS[book.difficulty_level] || LEVEL_COLORS.A1} shadow-sm`}>
                        {book.difficulty_level}
                      </span>
                    </div>
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--navy)] mb-1 group-hover:text-[var(--terracotta)] transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-sm text-[var(--warm-gray)]">{book.author}</p>
                    <div className="mt-4 flex items-center text-xs text-[var(--terracotta)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Start reading <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center border border-[var(--border)]">
            <p className="text-[var(--warm-gray)]">No books available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReaderPage() {
  return (<ProtectedRoute><ReaderListContent /></ProtectedRoute>);
}
