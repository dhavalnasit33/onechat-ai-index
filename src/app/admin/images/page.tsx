'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';

interface ImageJob {
  chartId: string;
  title: string;
  chartType: string;
  status: 'completed' | 'failed';
  queuedAt: string;
  completedAt: string | null;
}

export default function AdminImagesPage() {
  const [jobs, setJobs] = useState<ImageJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const fetchJobs = (showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }
    fetch(apiUrl('/api/admin/images'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setJobs(res.data || []);
        }
      })
      .catch(() => showToast('Failed to load image jobs', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs(false);
  }, []);

  const handleRebuild = async (chartId: string) => {
    setRebuilding(chartId);
    try {
      const res = await fetch(apiUrl('/api/admin/images'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartId }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Image generated successfully');
        fetchJobs(true);
      } else {
        showToast(json.message || 'Failed to generate image', 'error');
      }
    } catch {
      showToast('Connection failed', 'error');
    } finally {
      setRebuilding(null);
    }
  };

  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const failedCount = jobs.filter((j) => j.status === 'failed').length;

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Image Rebuild Queue</h1>
          <p>Monitor chart image generation and rendering status</p>
        </div>
        <button className="admin-btn admin-btn-secondary" onClick={() => fetchJobs(true)} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Statuses
        </button>
      </div>

      {/* Stats Panel */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-label">Pending / Missing</p>
          <p className="admin-stat-value" style={{ color: 'var(--admin-warning)' }}>
            {loading ? '...' : failedCount}
          </p>
          <p className="admin-stat-sub">
            <Clock size={12} style={{ display: 'inline', verticalAlign: -1 }} /> Static file is missing
          </p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Completed</p>
          <p className="admin-stat-value" style={{ color: 'var(--admin-success)' }}>
            {loading ? '...' : completedCount}
          </p>
          <p className="admin-stat-sub">
            <CheckCircle size={12} style={{ display: 'inline', verticalAlign: -1 }} /> File exists in public folder
          </p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Total Active Charts</p>
          <p className="admin-stat-value" style={{ color: 'var(--admin-accent)' }}>
            {loading ? '...' : jobs.length}
          </p>
          <p className="admin-stat-sub">
            <ImageIcon size={12} style={{ display: 'inline', verticalAlign: -1 }} /> Registered in index database
          </p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Chart Title</th>
              <th>Chart ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Last Rebuilt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6}>
                    <div className="admin-skeleton" style={{ width: '100%', height: 20 }} />
                  </td>
                </tr>
              ))
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty">
                    <ImageIcon size={48} />
                    <p>No active charts found in database.</p>
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.chartId}>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>{job.chartId}</td>
                  <td>
                    <span className="admin-badge active">{job.chartType}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${job.status === 'completed' ? 'published' : 'draft'}`}>
                      {job.status === 'completed' ? 'Completed' : 'Missing'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
                    {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'Never'}
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleRebuild(job.chartId)}
                      disabled={rebuilding === job.chartId}
                    >
                      {rebuilding === job.chartId ? 'Generating...' : 'Rebuild'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toast */}
      <div className={`admin-toast ${toast.type} ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
}
