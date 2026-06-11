"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MoreVertical, Pencil, Trash2, BarChart3 } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import { CategoryRow } from "@/src/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/src/components/admin/ui/Table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/src/components/admin/ui/DropdownMenu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/src/components/admin/ui/AlertDialog";
import { toast } from "@/src/hooks/use-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
          toast({ title: json.message || "Failed to load categories", variant: "destructive" });
        }
      })
      .catch(() => {
        if (active) toast({ title: "Failed to load categories", variant: "destructive" });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, limit]);

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${categoryToDelete.id}`), { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        setCategories((items) => items.filter((item) => item._id !== categoryToDelete.id));
        setTotal((count) => Math.max(0, count - 1));
        toast({ title: "Category deleted", variant: "default" });
      } else {
        toast({ title: json.message || "Failed to delete category", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete category", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <span
                        className="admin-skeleton"
                        style={{ display: "inline-block", width: colIndex === 1 ? 180 : 60, height: 16 }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="admin-empty">
                    <BarChart3 size={48} />
                    <p>No categories found. Create one to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell style={{ color: "var(--admin-text-muted)" }}>{category.position}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/categories/${category._id}`}
                      style={{ color: "var(--admin-text)", fontWeight: 600, textDecoration: "none" }}
                    >
                      {category.name}
                    </Link>
                    <div style={{ fontSize: 11, color: "var(--admin-text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                      {category.slug}
                    </div>
                  </TableCell>
                  <TableCell style={{ color: "var(--admin-text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                    {category.slug}
                  </TableCell>
                  <TableCell
                    style={{
                      color: "var(--admin-text-muted)",
                      maxWidth: 240,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>{category.topicCount}</TableCell>
                  <TableCell style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="admin-btn-icon" aria-label={`Actions for ${category.name}`}>
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/categories/${category._id}`}>
                            <Pencil size={14} /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[var(--admin-danger)] data-[highlighted]:bg-[rgba(239,68,68,0.06)] data-[highlighted]:text-[var(--admin-danger)]"
                          onClick={() => setCategoryToDelete({ id: category._id, name: category.name })}
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

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open: boolean) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.name}"? This will permanently remove it. This action cannot be undone.
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
