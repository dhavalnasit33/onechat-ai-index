"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import CategoryForm from "@/src/components/admin/categories/CategoryForm";
import { CategoryDetails, CategoryFormValues } from "@/src/types";

export default function CategoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    let active = true;

    fetch(apiUrl(`/api/admin/categories/${id}`))
      .then((res) => res.json())
      .then((json) => {
        if (active) {
          if (json.success) {
            setCategory(json.data);
          } else {
            showToast(json.message || "Category not found", "error");
          }
        }
      })
      .catch(() => {
        if (active) showToast("Failed to load category", "error");
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
        showToast("Category saved!");
        setCategory((prev) => (prev ? { ...prev, ...values } : prev));
        setTimeout(() => router.push("/admin/categories"), 900);
      } else {
        showToast(json.message || "Failed to save", "error");
      }
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this category? This cannot be undone.")) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        router.push("/admin/categories");
      } else {
        showToast(json.message || "Failed to delete", "error");
      }
    } catch {
      showToast("Failed to delete", "error");
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
          <button className="admin-btn admin-btn-danger" onClick={handleDelete} type="button">
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

      <div className={`admin-toast ${toast.type} ${toast.show ? "show" : ""}`}>{toast.message}</div>
    </>
  );
}
