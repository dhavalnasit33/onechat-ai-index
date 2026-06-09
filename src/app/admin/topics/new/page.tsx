'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, UploadCloud, X } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import { uploadFileToServer, deleteImage } from '@/src/lib/utils';

interface CategoryOption {
  _id: string;
  name: string;
}

export default function NewTopicPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ── Icon upload state ──────────────────────────────────────────────────────
  const [iconUrl, setIconUrl] = useState('');
  const [iconUploading, setIconUploading] = useState(false);
  const [iconDragging, setIconDragging] = useState(false);
  const [iconError, setIconError] = useState('');
  const iconInputRef = useRef<HTMLInputElement>(null);
  // ──────────────────────────────────────────────────────────────────────────

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

  // ── Icon upload helpers ────────────────────────────────────────────────────
  const handleIconFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setIconError('');
    setIconUploading(true);
    try {
      const url = await uploadFileToServer(file, 'onechatai-index-topic-icons');
      setIconUrl(url);
    } catch (err: any) {
      setIconError(err.message || 'Upload failed');
    } finally {
      setIconUploading(false);
      if (iconInputRef.current) iconInputRef.current.value = '';
    }
  };

  const handleIconRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (iconUrl) {
      try { await deleteImage(iconUrl); } catch { /* ignore */ }
    }
    setIconUrl('');
    if (iconInputRef.current) iconInputRef.current.value = '';
  };
  // ──────────────────────────────────────────────────────────────────────────

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
        body: JSON.stringify({ ...form, iconUrl }), // ← iconUrl included
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

          {/* ── Basic Info ─────────────────────────────────────────────────── */}
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

            {/* ── Icon Upload ─────────────────────────────────────────────── */}
            <div className="admin-form-group">
              <label className="admin-form-label">Topic Icon</label>
              <div
                onClick={() => !iconUploading && iconInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIconDragging(true); }}
                onDragLeave={() => setIconDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIconDragging(false);
                  handleIconFiles(e.dataTransfer.files);
                }}
                style={{
                  border: `2px dashed ${iconDragging ? 'var(--admin-primary, #0468BD)' : 'var(--admin-border, #d7e3f0)'}`,
                  borderRadius: 8,
                  padding: iconUrl ? '12px' : '24px 16px',
                  cursor: iconUploading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: iconDragging ? 'rgba(4,104,189,0.04)' : 'var(--admin-surface, #fff)',
                  transition: 'border-color 0.15s, background 0.15s',
                  minHeight: iconUrl ? 'auto' : 90,
                }}
              >
                <input
                  ref={iconInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => handleIconFiles(e.target.files)}
                  disabled={iconUploading}
                />

                {iconUploading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-text-muted, #8a8a95)' }}>
                    <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: 12 }}>Uploading…</span>
                  </div>
                ) : iconUrl ? (
                  <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <img
                      src={iconUrl}
                      alt="Topic icon preview"
                      style={{ height: 64, width: 64, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--admin-border, #d7e3f0)', background: '#f9fbfd' }}
                    />
                    <button
                      type="button"
                      onClick={handleIconRemove}
                      title="Remove icon"
                      style={{
                        position: 'absolute', top: -8, right: -8,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--admin-danger, #e53935)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff', padding: 0,
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--admin-text-muted, #8a8a95)' }}>
                    <UploadCloud size={24} />
                    <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}>
                      Drag & drop or <strong style={{ color: 'var(--admin-primary, #0468BD)' }}>click to upload</strong>
                      <br />PNG, JPG, SVG, WebP
                    </span>
                  </div>
                )}
              </div>
              {iconError && (
                <p style={{ fontSize: 12, color: 'var(--admin-danger, #e53935)', marginTop: 4 }}>{iconError}</p>
              )}
              {iconUrl && (
                <p style={{ fontSize: 11, color: 'var(--admin-text-dim, #aaa)', marginTop: 4, wordBreak: 'break-all' }}>{iconUrl}</p>
              )}
            </div>
            {/* ────────────────────────────────────────────────────────────── */}

          </div>

          {/* ── Methodology ────────────────────────────────────────────────── */}
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

          {/* ── SEO ────────────────────────────────────────────────────────── */}
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
            <button className="admin-btn admin-btn-primary" type="submit" disabled={saving || iconUploading}>
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