'use client';

import { useState, useEffect } from 'react';
import { Globe, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import { DashboardData } from '@/src/types';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(apiUrl('/api/admin/embed-logs'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
        else setError(res.message || 'Failed to load');
      })
      .catch(() => setError('Failed to connect'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1>Backlink Dashboard</h1>
        <p>Track where your charts are being embedded across the web</p>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <p className="admin-stat-label">Total Embeds</p>
          <p className="admin-stat-value">
            {loading ? (
              <span className="admin-skeleton" style={{ display: 'inline-block', width: 60, height: 28 }} />
            ) : (
              data?.totalEmbeds?.toLocaleString() ?? '0'
            )}
          </p>
          <p className="admin-stat-sub">
            <BarChart3 size={12} style={{ display: 'inline', verticalAlign: -1 }} /> All time
          </p>
        </div>

        <div className="admin-stat-card">
          <p className="admin-stat-label">Unique Domains</p>
          <p className="admin-stat-value">
            {loading ? (
              <span className="admin-skeleton" style={{ display: 'inline-block', width: 40, height: 28 }} />
            ) : (
              data?.uniqueDomains ?? '0'
            )}
          </p>
          <p className="admin-stat-sub">
            <Globe size={12} style={{ display: 'inline', verticalAlign: -1 }} /> Referring sites
          </p>
        </div>

        <div className="admin-stat-card">
          <p className="admin-stat-label">Embeds Today</p>
          <p className="admin-stat-value">
            {loading ? (
              <span className="admin-skeleton" style={{ display: 'inline-block', width: 40, height: 28 }} />
            ) : (
              data?.embedsToday ?? '0'
            )}
          </p>
          <p className="admin-stat-sub">
            <TrendingUp size={12} style={{ display: 'inline', verticalAlign: -1 }} /> Last 24 hours
          </p>
        </div>
      </div>

      {/* Top Referring Domains Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Hits</th>
              <th>Unique Charts</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><span className="admin-skeleton" style={{ display: 'inline-block', width: 180, height: 16 }} /></td>
                  <td><span className="admin-skeleton" style={{ display: 'inline-block', width: 40, height: 16 }} /></td>
                  <td><span className="admin-skeleton" style={{ display: 'inline-block', width: 30, height: 16 }} /></td>
                  <td><span className="admin-skeleton" style={{ display: 'inline-block', width: 100, height: 16 }} /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--admin-danger)' }}>{error}</td>
              </tr>
            ) : data?.topDomains.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="admin-empty">
                    <Globe size={48} />
                    <p>No embed data yet. Charts will appear here once they are embedded on other sites.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.topDomains.map((d) => (
                <tr key={d.domain}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{d.domain}</span>
                  </td>
                  <td>{d.count.toLocaleString()}</td>
                  <td>{d.uniqueCharts}</td>
                  <td style={{ color: 'var(--admin-text-muted)' }}>
                    <Clock size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} />
                    {new Date(d.lastSeen).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
