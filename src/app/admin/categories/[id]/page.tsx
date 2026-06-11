"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import CategoryForm from "@/src/components/admin/categories/CategoryForm";
import { CategoryDetails, CategoryFormValues } from "@/src/types";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/src/components/admin/ui/AlertDialog";
import { toast } from "@/src/hooks/use-toast";

export default function CategoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(apiUrl(`/api/admin/categories/${id}`))
      .then((res) => res.json())
      .then((json) => {
        if (active) {
          if (json.success) {
            setCategory(json.data);
          } else {
            toast({ title: json.message || "Category not found", variant: "destructive" });
          }
        }
      })
      .catch(() => {
        if (active) toast({ title: "Failed to load category", variant: "destructive" });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (json.success) {
        toast({ title: "Category saved!", variant: "default" });
        setCategory((prev) => (prev ? { ...prev, ...values } : prev));
        setTimeout(() => router.push("/admin/categories"), 900);
      } else {
        toast({ title: json.message || "Failed to save", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        toast({ title: "Category deleted successfully", variant: "default" });
        router.push("/admin/categories");
      } else {
        toast({ title: json.message || "Failed to delete", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
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
          <div className="admin-skeleton" style={{ width: "100%", height: 360 }} />
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <div className="admin-empty">
        <p>Category not found</p>
        <Link href="/admin/categories" className="admin-btn admin-btn-secondary" style={{ marginTop: 16 }}>
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/categories">Categories</Link>
        <span className="sep">/</span>
        <span>{category.name}</span>
      </div>

      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>{category.name}</h1>
          <p>
            <span style={{ fontSize: 12, color: "var(--admin-text-dim)", fontFamily: "var(--font-geist-mono)" }}>
              {category.slug}
            </span>
            {category.topicCount !== undefined && (
              <span style={{ color: "var(--admin-text-muted)", marginLeft: 12 }}>
                {category.topicCount} topic{category.topicCount === 1 ? "" : "s"}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin/categories" className="admin-btn admin-btn-secondary">
            <ArrowLeft size={16} /> Back
          </Link>
          <button className="admin-btn admin-btn-danger" onClick={() => setShowDeleteAlert(true)} type="button">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="admin-card">
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{category.name}"? This will permanently remove it. This action cannot be undone.
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
