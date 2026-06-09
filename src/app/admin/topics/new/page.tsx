"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiUrl } from "@/src/lib/basePath";
import TopicForm from "@/src/components/admin/topics/TopicForm";
import { TopicFormValues } from "@/src/components/admin/topics/TopicForm";

export default function NewTopicPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl('/api/admin/categories?all=true'))
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      });
  }, []);

  const handleSubmit = async (values: TopicFormValues) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await fetch(apiUrl('/api/admin/topics'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      
      if (json.success) {
        // Optionally show success toast here if you implement one
        router.push(`/admin/topics/${json.data._id}`);
      } else {
        setError(json.message || 'Failed to create topic');
      }
    } catch (e: any) {
      setError('Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="admin-breadcrumbs">
        <Link href="/admin/topics">Topics</Link>
        <span className="sep">/</span>
        <span>New Topic</span>
      </div>

      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Create New Topic</h1>
          <p>Add a new data topic with charts and sources</p>
        </div>
        <Link href="/admin/topics" className="admin-btn admin-btn-secondary">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {error && <div className="admin-login-error" style={{ marginBottom: 20 }}>{error}</div>}

      <div className="admin-card">
        <TopicForm
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => router.push("/admin/topics")}
        />
      </div>
    </>
  );
}