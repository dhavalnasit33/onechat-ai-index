'use client';

import { useState, useEffect } from 'react';
import { Globe, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import { DashboardData } from '@/src/types';

import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/src/components/admin/ui/Table';
import { Card } from '@/src/components/admin/ui/Card';

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
      <div className="admin-stat-grid" style={{ marginBottom: 24 }}>
        <Card className="p-6">
          <p className="admin-stat-label">Total Embeds</p>
          <p className="admin-stat-value">
            {loading ? (
              <span className="admin-skeleton" style={{ display: 'inline-block', width: 60, height: 28 }} />
            ) : (
              data?.totalEmbeds?.toLocaleString() ?? '0'
            )}
          </p>
          <p className="admin-stat-sub">
            <BarChart3 size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} /> All time
          </p>
        </Card>

        <Card className="p-6">
          <p className="admin-stat-label">Unique Domains</p>
          <p className="admin-stat-value">
            {loading ? (
              <span className="admin-skeleton" style={{ display: 'inline-block', width: 40, height: 28 }} />
            ) : (
              data?.uniqueDomains ?? '0'
            )}
          </p>
          <p className="admin-stat-sub">
            <Globe size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} /> Referring sites
          </p>
        </Card>

        <Card className="p-6">
          <p className="admin-stat-label">Embeds Today</p>
          <p className="admin-stat-value">
            {loading ? (
              <span className="admin-skeleton" style={{ display: 'inline-block', width: 40, height: 28 }} />
            ) : (
              data?.embedsToday ?? '0'
            )}
          </p>
          <p className="admin-stat-sub">
            <TrendingUp size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} /> Last 24 hours
          </p>
        </Card>
      </div>

      {/* Top Referring Domains Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Hits</TableHead>
              <TableHead>Unique Charts</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><span className="admin-skeleton" style={{ display: 'inline-block', width: 180, height: 16 }} /></TableCell>
                  <TableCell><span className="admin-skeleton" style={{ display: 'inline-block', width: 40, height: 16 }} /></TableCell>
                  <TableCell><span className="admin-skeleton" style={{ display: 'inline-block', width: 30, height: 16 }} /></TableCell>
                  <TableCell><span className="admin-skeleton" style={{ display: 'inline-block', width: 100, height: 16 }} /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', color: 'var(--admin-danger)' }}>{error}</TableCell>
              </TableRow>
            ) : data?.topDomains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="admin-empty">
                    <Globe size={48} />
                    <p>No embed data yet. Charts will appear here once they are embedded on other sites.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.topDomains.map((d) => (
                <TableRow key={d.domain}>
                  <TableCell>
                    <span style={{ fontWeight: 600 }}>{d.domain}</span>
                  </TableCell>
                  <TableCell>{d.count.toLocaleString()}</TableCell>
                  <TableCell>{d.uniqueCharts}</TableCell>
                  <TableCell style={{ color: 'var(--admin-text-muted)' }}>
                    <Clock size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} />
                    {new Date(d.lastSeen).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
