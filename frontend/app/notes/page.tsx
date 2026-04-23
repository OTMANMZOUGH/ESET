'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { notesApi } from '@/lib/api';
import Link from 'next/link';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

function NotesContent() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  const loadNotes = async () => {
    if (!token) return;

    try {
      const response = await notesApi.getAll(token);
      setNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [token]);

  const handleCreate = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    try {
      if (editingNote) {
        await notesApi.update(token, editingNote.id, formData);
      } else {
        await notesApi.create(token, formData);
      }

      setFormData({ title: '', content: '' });
      setEditingNote(null);
      await loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesApi.delete(token, id);
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                ESET
              </Link>
              <span className="ml-4 text-gray-600">/ Writing Notes</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                + New Note
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Notes</h2>

            {loading ? (
              <div className="text-gray-500">Loading notes...</div>
            ) : notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map(note => (
                  <div
                    key={note.id}
                    className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow ${
                      editingNote?.id === note.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div onClick={() => handleEdit(note)} className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {note.title || 'Untitled'}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {note.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(note.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500 mb-4">No notes yet</p>
                <button
                  onClick={handleCreate}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Create your first note
                </button>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Note title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write in Spanish here..."
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.title.trim() || !formData.content.trim()}
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Note'}
                  </button>
                  {(editingNote || formData.title || formData.content) && (
                    <button
                      onClick={() => {
                        setFormData({ title: '', content: '' });
                        setEditingNote(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <NotesContent />
    </ProtectedRoute>
  );
}
