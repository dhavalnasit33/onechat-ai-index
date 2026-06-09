'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, BarChart3, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';

interface TopicRow {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  dataPointsCount: number;
  sourceCount: number;
  categoryId: { _id: string; name: string; slug: string } | null;
  updatedAt: string;
}

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  // Fetch categories for the filter
  useEffect(() => {
    fetch(apiUrl('/api/admin/categories?all=true'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      });
  }, []);

  // Fetch topics
  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (categoryFilter) params.set('categoryId', categoryFilter);
    params.set('page', String(page));
    params.set('limit', String(limit));

    fetch(apiUrl(`/api/admin/topics?${params.toString()}`))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setTopics(res.data);
          setTotal(res.total || 0);
        }
      })
      .finally(() => setLoading(false));
  }, [statusFilter, searchQuery, categoryFilter, page, limit]);

  const handleDelete = async (topic: TopicRow) => {
    if (!confirm(`Delete topic "${topic.title}" and all its charts? This cannot be undone.`)) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/topics/${topic._id}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setTopics((items) => items.filter((item) => item._id !== topic._id));
        setTotal((count) => Math.max(0, count - 1));
        showToast('Topic deleted');
      } else {
        showToast(json.message || 'Failed to delete', 'error');
      }
    } catch {
      showToast('Failed to delete topic', 'error');
    }
  };

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Topics</h1>
          <p>Manage your data topics and their charts</p>
        </div>
        <Link href="/admin/topics/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> New Topic
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)' }}
          />
          <input
            className="admin-form-input"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
              setLoading(true);
            }}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          className="admin-form-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
            setLoading(true);
          }}
          style={{ minWidth: 140 }}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          className="admin-form-select"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
            setLoading(true);
          }}
          style={{ minWidth: 160 }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Topics Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Data Points</th>
              <th>Sources</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j}>
                      <span
                        className="admin-skeleton"
                        style={{ display: 'inline-block', width: j === 0 ? 200 : 60, height: 16 }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : topics.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="admin-empty">
                    <BarChart3 size={48} />
                    <p>No topics found. Create one to start adding charts.</p>
                  </div>
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic._id}>
                  <td>
                    <Link
                      href={`/admin/topics/${topic._id}`}
                      style={{ color: 'var(--admin-text)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      {topic.title}
                    </Link>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-dim)', fontFamily: 'var(--font-geist-mono)' }}>
                      {topic.slug}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12 }}>
                      {topic.categoryId?.name || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${topic.status}`}>{topic.status}</span>
                  </td>
                  <td>{topic.dataPointsCount}</td>
                  <td>{topic.sourceCount}</td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
                    {new Date(topic.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <details className="admin-action-menu">
                      <summary className="admin-btn-icon" aria-label={`Actions for ${topic.title}`}>
                        <MoreVertical size={16} />
                      </summary>
                      <div className="admin-action-menu-list">
                        <Link href={`/admin/topics/${topic._id}`} className="admin-action-menu-item">
                          <Pencil size={14} /> Edit
                        </Link>
                        <button
                          className="admin-action-menu-item danger"
                          onClick={() => handleDelete(topic)}
                          type="button"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
    
{total > limit && (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
    <p style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
      Showing {Math.min((page - 1) * limit + 1, total)} to{" "}
      {Math.min(page * limit, total)} of {total} topics
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        className="admin-btn admin-btn-secondary admin-btn-sm"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1 || loading}
      >
        Previous
      </button>
      <span style={{ fontSize: 13, fontWeight: 600 }}>
        Page {page} of {Math.max(1, Math.ceil(total / limit))}
      </span>
      <button
        className="admin-btn admin-btn-secondary admin-btn-sm"
        onClick={() => setPage((p) => Math.min(Math.ceil(total / limit), p + 1))}
        disabled={page >= Math.ceil(total / limit) || loading}
      >
        Next
      </button>
    </div>
  </div>
)}

      <div className={`admin-toast ${toast.type} ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
}
