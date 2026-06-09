"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Pencil, BarChart3, MoreVertical } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import TopicForm, { TopicFormValues } from "@/src/components/admin/topics/TopicForm";

export default function TopicEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [topic, setTopic] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch(apiUrl(`/api/admin/topics/${id}`)).then((r) => r.json()),
      fetch(apiUrl('/api/admin/categories?all=true')).then((r) => r.json()),
    ]).then(([topicRes, catRes]) => {
      if (topicRes.success) setTopic(topicRes.data);
      if (catRes.success) setCategories(catRes.data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (values: TopicFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/topics/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      
      if (json.success) {
        showToast('Topic saved!');
        setTopic({ ...topic, ...values, categoryId: values.categoryId }); // update local state
      } else {
        showToast(json.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setIsSubmitting(false);
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
          charts: topic.charts.map((c: any) =>
            c._id === chartDbId ? { ...c, status: 'removed' } : c
          ),
        });
        showToast('Chart removed');
      }
    } catch {
      showToast('Failed to delete chart', 'error');
    }
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

  const initialData: TopicFormValues = {
    title: topic.title || "",
    slug: topic.slug || "",
    description: topic.description || "",
    methodologyNote: topic.methodologyNote || "",
    metaTitle: topic.metaTitle || "",
    metaDescription: topic.metaDescription || "",
    ogImageUrl: topic.ogImageUrl || "",
    iconUrl: topic.iconUrl || "",
    status: topic.status || "draft",
    categoryId: typeof topic.categoryId === "object" ? topic.categoryId._id : topic.categoryId,
  };

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
        <TopicForm
          initialData={initialData}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
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
              topic.charts.map((chart: any) => (
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