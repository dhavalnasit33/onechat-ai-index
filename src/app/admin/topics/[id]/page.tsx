'use client';

import { useState, useEffect, useRef, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Pencil, Trash2, BarChart3, MoreVertical, Loader2, UploadCloud, X } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import { uploadFileToServer, deleteImage } from '@/src/lib/utils';

interface ChartRow {
  _id: string;
  chartId: string;
  title: string;
  chartType: string;
  position: number;
  status: string;
}

interface TopicData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  methodologyNote: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  iconUrl: string;          // ← NEW
  status: string;
  categoryId: { _id: string; name: string } | string;
  charts: ChartRow[];
  dataPointsCount: number;
  sourceCount: number;
  publishedAt: string;
}

interface CategoryOption {
  _id: string;
  name: string;
}

export default function TopicEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // ── Icon upload state ──────────────────────────────────────────────────────
  const [iconUrl, setIconUrl] = useState('');
  const [iconUploading, setIconUploading] = useState(false);
  const [iconDragging, setIconDragging] = useState(false);
  const [iconError, setIconError] = useState('');
  const iconInputRef = useRef<HTMLInputElement>(null);
  // ──────────────────────────────────────────────────────────────────────────
  // ── OG image upload state ──────────────────────────────────────────────────
  const ogInputRef = useRef<HTMLInputElement>(null);
  const [ogUploading, setOgUploading] = useState(false);
  const [ogDragging, setOgDragging] = useState(false);
  const [ogError, setOgError] = useState('');
  // ──────────────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch(apiUrl(`/api/admin/topics/${id}`)).then((r) => r.json()),
      fetch(apiUrl('/api/admin/categories?all=true')).then((r) => r.json()),
    ]).then(([topicRes, catRes]) => {
      if (topicRes.success) {
        setTopic(topicRes.data);
        setIconUrl(topicRes.data.iconUrl || ''); // ← seed icon from DB
      }
      if (catRes.success) setCategories(catRes.data);
      setLoading(false);
    });
  }, [id]);

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

  const handleOgFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !topic) return;
    setOgError('');
    setOgUploading(true);
    try {
      const url = await uploadFileToServer(file, 'onechatai-index-topic-icons');
      setTopic({ ...topic, ogImageUrl: url });
    } catch (err: any) {
      setOgError(err.message || 'Upload failed');
    } finally {
      setOgUploading(false);
      if (ogInputRef.current) ogInputRef.current.value = '';
    }
  };

  const handleOgRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!topic?.ogImageUrl) return;
    try {
      await deleteImage(topic.ogImageUrl);
    } catch {
      /* ignore */
    }
    setTopic({ ...topic, ogImageUrl: '' });
    if (ogInputRef.current) ogInputRef.current.value = '';
  };
  // ──────────────────────────────────────────────────────────────────────────

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setSaving(true);

    try {
      const catId = typeof topic.categoryId === 'object' ? topic.categoryId._id : topic.categoryId;
      const res = await fetch(apiUrl(`/api/admin/topics/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic.title,
          slug: topic.slug,
          description: topic.description,
          methodologyNote: topic.methodologyNote,
          metaTitle: topic.metaTitle,
          metaDescription: topic.metaDescription,
          ogImageUrl: topic.ogImageUrl,
          iconUrl,              // ← NEW: include in save payload
          status: topic.status,
          categoryId: catId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Topic saved!');
      } else {
        showToast(json.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this topic and all its charts? This cannot be undone.')) return;
    try {
      const res = await fetch(apiUrl(`/api/admin/topics/${id}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/topics');
      } else {
        showToast(json.message || 'Failed to delete', 'error');
      }
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleDeleteChart = async (chartDbId: string) => {
    if (!confirm('Remove this chart?')) return;
    try {
      const res = await fetch(apiUrl(`/api/admin/charts/${chartDbId}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success && topic) {
        setTopic({
          ...topic,
          charts: topic.charts.map((c) =>
            c._id === chartDbId ? { ...c, status: 'removed' } : c
          ),
        });
        showToast('Chart removed');
      }
    } catch {
      showToast('Failed to delete chart', 'error');
    }
  };

  const updateField = (field: string, value: string) => {
    if (!topic) return;
    setTopic({ ...topic, [field]: value });
  };

  if (loading) {
    return (
      <>
        <div className="admin-page-header">
          <div className="admin-skeleton" style={{ width: 300, height: 28, marginBottom: 8 }} />
          <div className="admin-skeleton" style={{ width: 200, height: 16 }} />
        </div>
        <div className="admin-card">
          <div className="admin-skeleton" style={{ width: '100%', height: 400 }} />
        </div>
      </>
    );
  }

  if (!topic) {
    return (
      <div className="admin-empty">
        <p>Topic not found</p>
        <Link href="/admin/topics" className="admin-btn admin-btn-secondary" style={{ marginTop: 16 }}>
          Back to Topics
        </Link>
      </div>
    );
  }

  const catId = typeof topic.categoryId === 'object' ? topic.categoryId._id : topic.categoryId;

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/topics">Topics</Link>
        <span className="sep">/</span>
        <span>{topic.title}</span>
      </div>

      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{topic.title}</h1>
          <p>
            <span className={`admin-badge ${topic.status}`}>{topic.status}</span>
            {' · '}
            <span style={{ fontSize: 12, color: 'var(--admin-text-dim)', fontFamily: 'var(--font-geist-mono)' }}>
              {topic.slug}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/topics" className="admin-btn admin-btn-secondary">
            <ArrowLeft size={16} /> Back
          </Link>
          <button className="admin-btn admin-btn-danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Topic Form */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSave}>

          {/* ── Basic Info ─────────────────────────────────────────────────── */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Basic Information</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Title</label>
                <input className="admin-form-input" value={topic.title} onChange={(e) => updateField('title', e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input className="admin-form-input" value={topic.slug} onChange={(e) => updateField('slug', e.target.value)} style={{ fontFamily: 'var(--font-geist-mono)' }} />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select className="admin-form-select" value={catId} onChange={(e) => updateField('categoryId', e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select className="admin-form-select" value={topic.status} onChange={(e) => updateField('status', e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea className="admin-form-textarea" value={topic.description} onChange={(e) => updateField('description', e.target.value)} />
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
              <textarea className="admin-form-textarea" value={topic.methodologyNote || ''} onChange={(e) => updateField('methodologyNote', e.target.value)} />
            </div>
          </div>

          {/* ── SEO ────────────────────────────────────────────────────────── */}
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">SEO</h3>
            <div className="admin-form-group">
              <label className="admin-form-label">Meta Title</label>
              <input className="admin-form-input" value={topic.metaTitle || ''} onChange={(e) => updateField('metaTitle', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Meta Description</label>
              <textarea className="admin-form-textarea" value={topic.metaDescription || ''} onChange={(e) => updateField('metaDescription', e.target.value)} style={{ minHeight: 70 }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">OG Image URL</label>
              <input className="admin-form-input" value={topic.ogImageUrl || ''} onChange={(e) => updateField('ogImageUrl', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">OG Image Upload</label>
              <div
                onClick={() => !ogUploading && ogInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setOgDragging(true); }}
                onDragLeave={() => setOgDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setOgDragging(false);
                  handleOgFiles(e.dataTransfer.files);
                }}
                style={{
                  border: `2px dashed ${ogDragging ? 'var(--admin-primary, #0468BD)' : 'var(--admin-border, #d7e3f0)'}`,
                  borderRadius: 8,
                  padding: topic.ogImageUrl ? 12 : 24,
                  cursor: ogUploading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: ogDragging ? 'rgba(4,104,189,0.04)' : 'var(--admin-surface, #fff)',
                  transition: 'border-color 0.15s, background 0.15s',
                  minHeight: topic.ogImageUrl ? 'auto' : 90,
                }}
              >
                <input
                  ref={ogInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => handleOgFiles(e.target.files)}
                  disabled={ogUploading}
                />
                {ogUploading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-text-muted, #8a8a95)' }}>
                    <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: 12 }}>Uploading…</span>
                  </div>
                ) : topic.ogImageUrl ? (
                  <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <img
                      src={topic.ogImageUrl}
                      alt="OG image preview"
                      style={{ height: 82, width: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--admin-border, #d7e3f0)', background: '#f9fbfd' }}
                    />
                    <button
                      type="button"
                      onClick={handleOgRemove}
                      title="Remove OG image"
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
              {ogError && <p style={{ fontSize: 12, color: 'var(--admin-danger, #e53935)', marginTop: 4 }}>{ogError}</p>}
              {topic.ogImageUrl && !ogUploading && (
                <p style={{ fontSize: 11, color: 'var(--admin-text-dim, #aaa)', marginTop: 4, wordBreak: 'break-all' }}>{topic.ogImageUrl}</p>
              )}
            </div>
          </div>

          <button className="admin-btn admin-btn-primary" type="submit" disabled={saving || iconUploading}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Topic'}
          </button>

        </form>
      </div>

      {/* ── Charts Section ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Charts</h2>
        <Link href={`/admin/topics/${id}/charts/new`} className="admin-btn admin-btn-primary admin-btn-sm">
          <Plus size={14} /> Add Chart
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Title</th>
              <th>Chart ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topic.charts.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty">
                    <BarChart3 size={36} />
                    <p>No charts yet. Add a chart to this topic.</p>
                  </div>
                </td>
              </tr>
            ) : (
              topic.charts.map((chart) => (
                <tr key={chart._id} style={{ opacity: chart.status === 'removed' ? 0.4 : 1 }}>
                  <td style={{ color: 'var(--admin-text-muted)' }}>{chart.position}</td>
                  <td style={{ fontWeight: 600 }}>{chart.title}</td>
                  <td style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--admin-text-muted)' }}>{chart.chartId}</td>
                  <td><span className="admin-badge active">{chart.chartType}</span></td>
                  <td><span className={`admin-badge ${chart.status}`}>{chart.status}</span></td>
                  <td>
                    <details className="admin-action-menu">
                      <summary className="admin-btn-icon" aria-label={`Actions for ${chart.title}`}>
                        <MoreVertical size={16} />
                      </summary>
                      <div className="admin-action-menu-list">
                        <Link href={`/admin/topics/${id}/charts/${chart._id}`} className="admin-action-menu-item">
                          <Pencil size={14} /> Edit
                        </Link>
                        <button
                          className="admin-action-menu-item danger"
                          onClick={() => handleDeleteChart(chart._id)}
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

      <div className={`admin-toast ${toast.type} ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
}