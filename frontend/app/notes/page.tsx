'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { notesApi } from '@/lib/api';

interface Note { id: number; title: string; content: string; created_at: string; updated_at: string; }

function NotesContent() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const loadNotes = async () => {
    if (!token) return;
    try {
      const response = await notesApi.getAll(token);
      setNotes(response.data);
    } catch (error) { console.error('Error loading notes:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadNotes(); }, [token]);

  const handleCreate = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setShowEditor(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowEditor(true);
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
      setShowEditor(false);
      await loadNotes();
    } catch (error) { console.error('Error saving note:', error); alert('Error saving note'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Delete this note?')) return;
    try { await notesApi.delete(token, id); await loadNotes(); }
    catch (error) { console.error('Error deleting:', error); }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] tile-pattern">
      <Navbar breadcrumb="Writing Notes" rightContent={
        <button onClick={handleCreate}
          className="px-4 py-2 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
          + New Note
        </button>
      } />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--navy)] mb-4">Your Notes</h2>

            {loading ? (
              <LoadingSpinner size="sm" message="Loading..." />
            ) : notes.length > 0 ? (
              <div className="space-y-3 stagger-children">
                {notes.map(note => (
                  <div key={note.id}
                    className={`glass rounded-xl p-4 cursor-pointer border transition-all animate-fade-in-up card-hover ${
                      editingNote?.id === note.id ? 'border-[var(--terracotta)] shadow-md' : 'border-[var(--border)]'
                    }`}>
                    <div className="flex justify-between items-start gap-2">
                      <div onClick={() => handleEdit(note)} className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--navy)] mb-1 truncate">{note.title || 'Untitled'}</h3>
                        <p className="text-sm text-[var(--warm-gray)] line-clamp-2 leading-relaxed">{note.content}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-2">{new Date(note.updated_at).toLocaleDateString()}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error-bg)] transition-all flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-8 text-center border border-[var(--border)]">
                <div className="text-3xl mb-3">📝</div>
                <p className="text-[var(--warm-gray)] mb-3">No notes yet</p>
                <button onClick={handleCreate} className="text-[var(--terracotta)] font-semibold text-sm hover:underline">
                  Create your first note
                </button>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {showEditor || editingNote ? (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-lg animate-scale-in">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--navy)] mb-5">
                  {editingNote ? 'Edit Note' : 'New Note'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Note title..."
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--navy)] placeholder-[var(--text-muted)] input-glow transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Content</label>
                    <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write in Spanish here..."
                      rows={14}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--navy)] placeholder-[var(--text-muted)] input-glow transition-all font-[family-name:var(--font-playfair)] text-lg leading-relaxed resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving || !formData.title.trim() || !formData.content.trim()}
                      className="flex-1 py-3 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                      {saving ? 'Saving...' : 'Save Note'}
                    </button>
                    <button onClick={() => { setFormData({ title: '', content: '' }); setEditingNote(null); setShowEditor(false); }}
                      className="px-6 py-3 bg-white border border-[var(--border)] text-[var(--warm-gray)] font-semibold rounded-xl hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center border border-[var(--border)] border-dashed">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--navy)] mb-2">Start Writing</h3>
                <p className="text-[var(--warm-gray)] mb-5">Select a note from the list or create a new one.</p>
                <button onClick={handleCreate}
                  className="px-6 py-2.5 bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                  + New Note
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NotesPage() {
  return (<ProtectedRoute><NotesContent /></ProtectedRoute>);
}
