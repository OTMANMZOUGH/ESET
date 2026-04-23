'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { booksApi, vocabularyApi } from '@/lib/api';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  difficulty_level: string;
}

function ReaderListContent() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      if (!token) return;

      try {
        const response = await booksApi.getAll(token, user?.level);
        // The API returns paginated data: { success: true, data: { current_page: 1, data: [...] } }
        const booksArray = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setBooks(booksArray);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [token, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                ESET
              </Link>
              <span className="ml-4 text-gray-600">/ Reader</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Spanish Books</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading books...</div>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <Link
                key={book.id}
                href={`/reader/${book.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">
                    {book.difficulty_level}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No books available yet.</p>
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

export default function ReaderPage() {
  return (
    <ProtectedRoute>
      <ReaderListContent />
    </ProtectedRoute>
  );
}
