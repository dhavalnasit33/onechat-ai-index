'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';

interface CategoryOption {
  _id: string;
  name: string;
}

export default function NewTopicPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    categoryId: '',
    description: '',
    methodologyNote: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    fetch(apiUrl('/api/admin/categories?all=true'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.categoryId || !form.description) {
      setError('Title, category, and description are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(apiUrl('/api/admin/topics'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/admin/topics/${json.data._id}`);
      } else {
        setError(json.message || 'Failed to create topic');
      }
    } catch {
      setError('Failed to create topic');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return updated;
    });
  };

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/topics">Topics</Link>
        <span className="sep">/</span>
        <span>New Topic</span>
      </div>

      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Create New Topic</h1>
          <p>Add a new data topic with charts and sources</p>
        </div>
        <Link href="/admin/topics" className="admin-btn admin-btn-secondary">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {error && <div className="admin-login-error" style={{ marginBottom: 20 }}>{error}</div>}

      <div className="admin-card">
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Basic Information</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Title *</label>
                <input
                  className="admin-form-input"
                  placeholder="e.g. Global AI Investment Trends"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input
                  className="admin-form-input"
                  placeholder="auto-generated"
                  value={form.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Category *</label>
                <select
                  className="admin-form-select"
                  value={form.categoryId}
                  onChange={(e) => updateField('categoryId', e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  className="admin-form-select"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Description *</label>
              <textarea
                className="admin-form-textarea"
                placeholder="Describe this topic..."
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </div>

          {/* Methodology */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Methodology</h3>
            <div className="admin-form-group">
              <label className="admin-form-label">Methodology Note</label>
              <textarea
                className="admin-form-textarea"
                placeholder="Explain data collection methodology..."
                value={form.methodologyNote}
                onChange={(e) => updateField('methodologyNote', e.target.value)}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">SEO</h3>
            <div className="admin-form-group">
              <label className="admin-form-label">Meta Title</label>
              <input
                className="admin-form-input"
                placeholder="Page title for search engines"
                value={form.metaTitle}
                onChange={(e) => updateField('metaTitle', e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Meta Description</label>
              <textarea
                className="admin-form-textarea"
                placeholder="Description for search engine results..."
                value={form.metaDescription}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                style={{ minHeight: 70 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
              <Save size={16} /> {saving ? 'Creating...' : 'Create Topic'}
            </button>
            <Link href="/admin/topics" className="admin-btn admin-btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
