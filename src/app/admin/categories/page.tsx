'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, X, FolderOpen, MoreVertical } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';

interface Category {
  _id: string;
  slug: string;
  name: string;
  description: string;
  position: number;
  topicCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Category>>({});
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ name: '', slug: '', description: '', position: 0 });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  useEffect(() => {
    let active = true;
    fetch(apiUrl(`/api/admin/categories?page=${page}&limit=${limit}`))
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success) {
          setCategories(json.data);
          setTotal(json.total || 0);
        }
      })
      .catch(() => {
        if (active) showToast('Failed to load categories', 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, limit, refreshTrigger, showToast]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newData.name || !newData.slug) return;
    setSaving(true);
    try {
      const res = await fetch(apiUrl('/api/admin/categories'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Category created!');
        setShowNew(false);
        setNewData({ name: '', slug: '', description: '', position: 0 });
        setLoading(true);
        setRefreshTrigger((t) => t + 1);
      } else {
        showToast(json.message || 'Failed', 'error');
      }
    } catch {
      showToast('Failed to create category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Category updated!');
        setEditId(null);
        setLoading(true);
        setRefreshTrigger((t) => t + 1);
      } else {
        showToast(json.message || 'Failed', 'error');
      }
    } catch {
      showToast('Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Category deleted');
        setLoading(true);
        setRefreshTrigger((t) => t + 1);
      } else {
        showToast(json.message || 'Failed', 'error');
      }
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat._id);
    setEditData({ name: cat.name, slug: cat.slug, description: cat.description, position: cat.position });
  };

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Categories</h1>
          <p>Organize your topics into categories</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowNew(!showNew)}>
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* New Category Form */}
      {showNew && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <form onSubmit={handleCreate}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Name *</label>
                <input
                  className="admin-form-input"
                  placeholder="e.g. Economy"
                  value={newData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewData({
                      ...newData,
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                    });
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug *</label>
                <input
                  className="admin-form-input"
                  placeholder="economy"
                  value={newData.slug}
                  onChange={(e) => setNewData({ ...newData, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <input
                  className="admin-form-input"
                  placeholder="Short description..."
                  value={newData.description}
                  onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Position</label>
                <input
                  className="admin-form-input"
                  type="number"
                  value={newData.position}
                  onChange={(e) => setNewData({ ...newData, position: Number(e.target.value) })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
                <Save size={14} /> {saving ? 'Saving...' : 'Create'}
              </button>
              <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setShowNew(false)}>
                <X size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Topics</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}>
                      <span className="admin-skeleton" style={{ display: 'inline-block', width: j === 3 ? 120 : 60, height: 16 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty">
                    <FolderOpen size={48} />
                    <p>No categories yet. Create one to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id}>
                  {editId === cat._id ? (
                    <>
                      <td>
                        <input
                          className="admin-form-input"
                          type="number"
                          value={editData.position ?? 0}
                          onChange={(e) => setEditData({ ...editData, position: Number(e.target.value) })}
                          style={{ width: 60 }}
                        />
                      </td>
                      <td>
                        <input
                          className="admin-form-input"
                          value={editData.name ?? ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="admin-form-input"
                          value={editData.slug ?? ''}
                          onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="admin-form-input"
                          value={editData.description ?? ''}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                      </td>
                      <td>{cat.topicCount}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="admin-btn-icon" onClick={() => handleUpdate(cat._id)} title="Save">
                            <Save size={16} />
                          </button>
                          <button className="admin-btn-icon" onClick={() => setEditId(null)} title="Cancel">
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ color: 'var(--admin-text-muted)' }}>{cat.position}</td>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td style={{ color: 'var(--admin-text-muted)', fontFamily: 'var(--font-geist-mono)' }}>{cat.slug}</td>
                      <td style={{ color: 'var(--admin-text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.description || '—'}
                      </td>
                      <td>{cat.topicCount}</td>
                      <td>
                        <details className="admin-action-menu">
                          <summary className="admin-btn-icon" aria-label={`Actions for ${cat.name}`}>
                            <MoreVertical size={16} />
                          </summary>
                          <div className="admin-action-menu-list">
                            <button
                              className="admin-action-menu-item"
                              onClick={() => startEdit(cat)}
                              type="button"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              className="admin-action-menu-item danger"
                              onClick={() => handleDelete(cat._id, cat.name)}
                              type="button"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </details>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>Show</span>
          <select
            className="admin-form-select"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
              setLoading(true);
            }}
            style={{ width: 'auto', padding: '4px 8px', fontSize: 13 }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>records per page</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              setLoading(true);
            }}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Page {page} of {Math.max(1, Math.ceil(total / limit))}
          </span>
          <button
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => {
              setPage((p) => Math.min(Math.ceil(total / limit), p + 1));
              setLoading(true);
            }}
            disabled={page >= Math.ceil(total / limit)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`admin-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </>
  );
}
