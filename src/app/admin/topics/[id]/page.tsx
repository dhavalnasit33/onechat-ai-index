"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Pencil, BarChart3, MoreVertical } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import TopicForm from "@/src/components/admin/topics/TopicForm";
import { TopicFormValues } from "@/src/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/src/components/admin/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/src/components/admin/ui/DropdownMenu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/src/components/admin/ui/AlertDialog";
import { toast } from "@/src/hooks/use-toast";

export default function TopicEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [topic, setTopic] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showTopicDeleteAlert, setShowTopicDeleteAlert] = useState(false);
  const [isDeletingTopic, setIsDeletingTopic] = useState(false);
  
  const [chartToDelete, setChartToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeletingChart, setIsDeletingChart] = useState(false);

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
        toast({ title: 'Topic saved!', variant: 'default' });
        setTopic({ ...topic, ...values, categoryId: values.categoryId }); // update local state
      } else {
        toast({ title: json.message || 'Failed to save', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopicDeleteConfirm = async () => {
    setIsDeletingTopic(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/topics/${id}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast({ title: 'Topic deleted successfully', variant: 'default' });
        router.push('/admin/topics');
      } else {
        toast({ title: json.message || 'Failed to delete', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    } finally {
      setIsDeletingTopic(false);
      setShowTopicDeleteAlert(false);
    }
  };

  const handleChartDeleteConfirm = async () => {
    if (!chartToDelete) return;
    setIsDeletingChart(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/charts/${chartToDelete.id}`), { method: 'DELETE' });
      const json = await res.json();
      if (json.success && topic) {
        setTopic({
          ...topic,
          charts: topic.charts.map((c: any) =>
            c._id === chartToDelete.id ? { ...c, status: 'removed' } : c
          ),
        });
        toast({ title: 'Chart removed', variant: 'default' });
      } else {
        toast({ title: json.message || 'Failed to delete chart', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to delete chart', variant: 'destructive' });
    } finally {
      setIsDeletingChart(false);
      setChartToDelete(null);
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
          <button className="admin-btn admin-btn-danger" onClick={() => setShowTopicDeleteAlert(true)} type="button">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Chart ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topic.charts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="admin-empty">
                    <BarChart3 size={36} />
                    <p>No charts yet. Add a chart to this topic.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              topic.charts.map((chart: any) => (
                <TableRow key={chart._id} style={{ opacity: chart.status === 'removed' ? 0.4 : 1 }}>
                  <TableCell style={{ color: 'var(--admin-text-muted)' }}>{chart.position}</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>{chart.title}</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--admin-text-muted)' }}>{chart.chartId}</TableCell>
                  <TableCell><span className="admin-badge active">{chart.chartType}</span></TableCell>
                  <TableCell><span className={`admin-badge ${chart.status}`}>{chart.status}</span></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="admin-btn-icon" aria-label={`Actions for ${chart.title}`}>
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/topics/${id}/charts/${chart._id}`}>
                            <Pencil size={14} /> Edit
                          </Link>
                        </DropdownMenuItem>
                        {chart.status !== 'removed' && (
                          <DropdownMenuItem
                            className="text-[var(--admin-danger)] data-[highlighted]:bg-[rgba(239,68,68,0.06)] data-[highlighted]:text-[var(--admin-danger)]"
                            onClick={() => setChartToDelete({ id: chart._id, title: chart.title })}
                          >
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Topic Confirmation Alert Dialog */}
      <AlertDialog open={showTopicDeleteAlert} onOpenChange={setShowTopicDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this topic and all its charts? This will permanently remove it from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingTopic}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e: React.MouseEvent) => { e.preventDefault(); handleTopicDeleteConfirm(); }} disabled={isDeletingTopic}>
              {isDeletingTopic ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Chart Confirmation Alert Dialog */}
      <AlertDialog open={!!chartToDelete} onOpenChange={(open: boolean) => !open && setChartToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Chart</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the chart "{chartToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingChart}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e: React.MouseEvent) => { e.preventDefault(); handleChartDeleteConfirm(); }} disabled={isDeletingChart}>
              {isDeletingChart ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}