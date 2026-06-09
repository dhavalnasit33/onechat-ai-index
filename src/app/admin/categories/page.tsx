"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MoreVertical, Pencil, Trash2, BarChart3 } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";

interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  position: number;
  topicCount: number;
  updatedAt?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(apiUrl(`/api/admin/categories?page=${page}&limit=${limit}`))
      .then((res) => res.json())
      .then((json) => {
        if (!active) return;
        if (json.success) {
          setCategories(json.data);
          setTotal(json.total || 0);
        } else {
          showToast(json.message || "Failed to load categories", "error");
        }
      })
      .catch(() => {
        if (active) showToast("Failed to load categories", "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        setCategories((items) => items.filter((item) => item._id !== id));
        setTotal((count) => Math.max(0, count - 1));
        showToast("Category deleted");
      } else {
        showToast(json.message || "Failed to delete category", "error");
      }
    } catch {
      showToast("Failed to delete category", "error");
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));
  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  return (
    <>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Categories</h1>
          <p>Manage the categories that organize your topics.</p>
        </div>
        <Link href="/admin/categories/new" className="admin-btn admin-btn-primary">
          <Plus size={16} /> New Category
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Topics</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <td key={colIndex}>
                      <span
                        className="admin-skeleton"
                        style={{ display: "inline-block", width: colIndex === 1 ? 180 : 60, height: 16 }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="admin-empty">
                    <BarChart3 size={48} />
                    <p>No categories found. Create one to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id}>
                  <td style={{ color: "var(--admin-text-muted)" }}>{category.position}</td>
                  <td>
                    <Link
                      href={`/admin/categories/${category._id}`}
                      style={{ color: "var(--admin-text)", fontWeight: 600, textDecoration: "none" }}
                    >
                      {category.name}
                    </Link>
                    <div style={{ fontSize: 11, color: "var(--admin-text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                      {category.slug}
                    </div>
                  </td>
                  <td style={{ color: "var(--admin-text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                    {category.slug}
                  </td>
                  <td
                    style={{
                      color: "var(--admin-text-muted)",
                      maxWidth: 240,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {category.description || "—"}
                  </td>
                  <td>{category.topicCount}</td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <details className="admin-action-menu">
                      <summary className="admin-btn-icon" aria-label={`Actions for ${category.name}`}>
                        <MoreVertical size={16} />
                      </summary>
                      <div className="admin-action-menu-list">
                        <Link href={`/admin/categories/${category._id}`} className="admin-action-menu-item">
                          <Pencil size={14} /> Edit
                        </Link>
                        <button
                          className="admin-action-menu-item danger"
                          type="button"
                          onClick={() => handleDelete(category._id, category.name)}
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

      {total > limit && (
        <div className="flex justify-between items-center mt-4">
          <p style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>
            Showing {from} to {to} of {total} categories
          </p>
          <div className="flex items-center gap-1.5">
            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Page {page} of {pageCount}
            </span>
            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount || loading}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className={`admin-toast ${toast.type} ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>
    </>
  );
}
