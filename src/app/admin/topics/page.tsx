'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, BarChart3, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { apiUrl } from '@/src/lib/basePath';
import { TopicRow } from '@/src/types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/src/components/admin/ui/Table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/src/components/admin/ui/DropdownMenu';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/src/components/admin/ui/AlertDialog';
import { Input } from '@/src/components/admin/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/admin/ui/Select';
import { toast } from '@/src/hooks/use-toast';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [topicToDelete, setTopicToDelete] = useState<TopicRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

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

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(apiUrl(`/api/admin/topics/${topicToDelete._id}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setTopics((items) => items.filter((item) => item._id !== topicToDelete._id));
        setTotal((count) => Math.max(0, count - 1));
        toast({ title: 'Topic deleted', variant: 'default' });
      } else {
        toast({ title: json.message || 'Failed to delete', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to delete topic', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setTopicToDelete(null);
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
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)', zIndex: 10 }}
          />
          <Input
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
        
        <Select value={statusFilter} onValueChange={(val: string) => { setStatusFilter(val); setPage(1); setLoading(true); }}>
          <SelectTrigger style={{ minWidth: 140 }}>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter || 'all'} onValueChange={(val: string) => { setCategoryFilter(val === 'all' ? '' : val); setPage(1); setLoading(true); }}>
          <SelectTrigger style={{ minWidth: 160 }}>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topics Table */}
      <div className="admin-table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Points</TableHead>
              <TableHead>Sources</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <span
                        className="admin-skeleton"
                        style={{ display: 'inline-block', width: j === 0 ? 200 : 60, height: 16 }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="admin-empty">
                    <BarChart3 size={48} />
                    <p>No topics found. Create one to start adding charts.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              topics.map((topic) => (
                <TableRow key={topic._id}>
                  <TableCell>
                    <Link
                      href={`/admin/topics/${topic._id}`}
                      style={{ color: 'var(--admin-text)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      {topic.title}
                    </Link>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-dim)', fontFamily: 'var(--font-geist-mono)' }}>
                      {topic.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontSize: 12 }}>
                      {topic.categoryId?.name || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`admin-badge ${topic.status}`}>{topic.status}</span>
                  </TableCell>
                  <TableCell>{topic.dataPointsCount}</TableCell>
                  <TableCell>{topic.sourceCount}</TableCell>
                  <TableCell style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>
                    {new Date(topic.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="admin-btn-icon" aria-label={`Actions for ${topic.title}`}>
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/topics/${topic._id}`}>
                            <Pencil size={14} /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[var(--admin-danger)] data-[highlighted]:bg-[rgba(239,68,68,0.06)] data-[highlighted]:text-[var(--admin-danger)]"
                          onClick={() => setTopicToDelete(topic)}
                        >
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!topicToDelete} onOpenChange={(open: boolean) => !open && setTopicToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the topic "{topicToDelete?.title}" and all its charts? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDeleteConfirm(); }} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
