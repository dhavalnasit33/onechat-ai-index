"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import CategoryForm, { CategoryFormValues } from "@/src/components/admin/categories/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/admin/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (json.success) {
        showToast("Category created!");
        setTimeout(() => router.push("/admin/categories"), 900);
      } else {
        const message = json.message || "Failed to create category";
        setError(message);
        showToast(message, "error");
      }
    } catch (error) {
      const message = "Failed to create category";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/categories">Categories</Link>
        <span className="sep">/</span>
        <span>New Category</span>
      </div>

      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Create New Category</h1>
          <p>Add a new category to organize your topics.</p>
        </div>
        <Link href="/admin/categories" className="admin-btn admin-btn-secondary">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {error && <div className="admin-login-error" style={{ marginBottom: 20 }}>{error}</div>}

      <div className="admin-card">
        <CategoryForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.push("/admin/categories")}
        />
      </div>

      <div className={`admin-toast ${toast.type} ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>
    </>
  );
}
