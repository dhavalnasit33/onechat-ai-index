'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import { ImageJob } from '@/src/types';

import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/src/components/admin/ui/Table';
import { Card } from '@/src/components/admin/ui/Card';

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
      <div className="admin-stat-grid" style={{ marginBottom: 24 }}>
        <Card className="p-6">
          <p className="admin-stat-label">Pending / Missing</p>
          <p className="admin-stat-value" style={{ color: 'var(--admin-warning)' }}>
            {loading ? '...' : failedCount}
          </p>
          <p className="admin-stat-sub">
            <Clock size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} /> Static file is missing
          </p>
        </Card>
        <Card className="p-6">
          <p className="admin-stat-label">Completed</p>
          <p className="admin-stat-value" style={{ color: 'var(--admin-success)' }}>
            {loading ? '...' : completedCount}
          </p>
          <p className="admin-stat-sub">
            <CheckCircle size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} /> File exists in public folder
          </p>
        </Card>
        <Card className="p-6">
          <p className="admin-stat-label">Total Active Charts</p>
          <p className="admin-stat-value" style={{ color: 'var(--admin-accent)' }}>
            {loading ? '...' : jobs.length}
          </p>
          <p className="admin-stat-sub">
            <ImageIcon size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} /> Registered in index database
          </p>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chart Title</TableHead>
              <TableHead>Chart ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Rebuilt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="admin-skeleton" style={{ width: '100%', height: 20 }} />
                  </TableCell>
                </TableRow>
              ))
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="admin-empty">
                    <ImageIcon size={48} />
                    <p>No active charts found in database.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.chartId}>
                  <TableCell style={{ fontWeight: 600 }}>{job.title}</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12 }}>{job.chartId}</TableCell>
                  <TableCell>
                    <span className="admin-badge active">{job.chartType}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`admin-badge ${job.status === 'completed' ? 'published' : 'draft'}`}>
                      {job.status === 'completed' ? 'Completed' : 'Missing'}
                    </span>
                  </TableCell>
                  <TableCell style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
                    {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleRebuild(job.chartId)}
                      disabled={rebuilding === job.chartId}
                    >
                      {rebuilding === job.chartId ? 'Generating...' : 'Rebuild'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Toast */}
      <div className={`admin-toast ${toast.type} ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </>
  );
}
