"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UploadCloud, X } from "lucide-react";
import { deleteImage, uploadFileToServer } from "@/src/lib/utils";

// 1. Zod Validation Schema
export const topicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  methodologyNote: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  iconUrl: z.string().optional(),
status: z.enum(["draft", "published", "archived"]),
});

export type TopicFormValues = z.infer<typeof topicSchema>;

interface TopicFormProps {
  initialData?: TopicFormValues | null;
  categories: { _id: string; name: string }[];
  onSubmit: (values: TopicFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export default function TopicForm({
  initialData,
  categories,
  onSubmit,
  isSubmitting,
  onCancel,
}: TopicFormProps) {
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [draggingIcon, setDraggingIcon] = useState(false);
  const [draggingOg, setDraggingOg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const iconInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      categoryId: initialData?.categoryId || "",
      description: initialData?.description || "",
      methodologyNote: initialData?.methodologyNote || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      ogImageUrl: initialData?.ogImageUrl || "",
      iconUrl: initialData?.iconUrl || "",
      status: initialData?.status || "draft",
    },
  });

  const handleImageDrop = async (files: FileList | null, fieldName: "iconUrl" | "ogImageUrl") => {
    const file = files?.[0];
    if (!file) return;

    setErrorMsg("");
    const isIcon = fieldName === "iconUrl";
    if (isIcon) setIsUploadingIcon(true);
    else setIsUploadingOg(true);

    try {
      const currentImage = watch(fieldName);
      if (currentImage) {
        try { await deleteImage(currentImage); } catch (e) { console.error(e); }
      }

      const uploadedUrl = await uploadFileToServer(file, "onechatai-index-topic-icons");
      setValue(fieldName, uploadedUrl, { shouldDirty: true, shouldValidate: true });
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
    } finally {
      if (isIcon) {
        setIsUploadingIcon(false);
        if (iconInputRef.current) iconInputRef.current.value = "";
      } else {
        setIsUploadingOg(false);
        if (ogInputRef.current) ogInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (e: React.MouseEvent, fieldName: "iconUrl" | "ogImageUrl") => {
    e.stopPropagation();
    const currentImage = watch(fieldName);
    if (currentImage) {
      try { await deleteImage(currentImage); } catch (err) { console.error(err); }
    }
    setValue(fieldName, "", { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMsg && <div className="admin-login-error" style={{ marginBottom: 20 }}>{errorMsg}</div>}

      {/* ── Basic Info ── */}
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Basic Information</h3>
        
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Title *</label>
            <input 
              className="admin-form-input" 
              placeholder="e.g. Global AI Investment Trends" 
              {...register("title")} 
            />
            {errors.title && <p className="admin-form-error">{errors.title.message}</p>}
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Slug</label>
            <input 
              className="admin-form-input" 
              placeholder="auto-generated" 
              style={{ fontFamily: 'var(--font-geist-mono)' }} 
              {...register("slug")} 
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Category *</label>
            <select className="admin-form-select" {...register("categoryId")}>
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="admin-form-error">{errors.categoryId.message}</p>}
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select className="admin-form-select" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description *</label>
          <textarea 
            className="admin-form-textarea" 
            placeholder="Describe this topic..." 
            {...register("description")} 
          />
          {errors.description && <p className="admin-form-error">{errors.description.message}</p>}
        </div>

        {/* ── Icon Upload ── */}
        <div className="admin-form-group">
          <label className="admin-form-label">Topic Icon</label>
          <div
            onClick={() => !isUploadingIcon && iconInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDraggingIcon(true); }}
            onDragLeave={() => setDraggingIcon(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingIcon(false);
              handleImageDrop(e.dataTransfer.files, "iconUrl");
            }}
            style={{
              border: `2px dashed ${draggingIcon ? 'var(--admin-primary, #0468BD)' : 'var(--admin-border, #d7e3f0)'}`,
              borderRadius: 8,
              padding: watch("iconUrl") ? '12px' : '24px 16px',
              cursor: isUploadingIcon ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: draggingIcon ? 'rgba(4,104,189,0.04)' : 'var(--admin-surface, #fff)',
              transition: 'border-color 0.15s, background 0.15s', minHeight: watch("iconUrl") ? 'auto' : 90,
            }}
          >
            <input 
              ref={iconInputRef} 
              type="file" 
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" 
              style={{ display: 'none' }} 
              onChange={(e) => handleImageDrop(e.target.files, "iconUrl")} 
              disabled={isUploadingIcon} 
            />
            
            {isUploadingIcon ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-text-muted, #8a8a95)' }}>
                <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 12 }}>Uploading…</span>
              </div>
            ) : watch("iconUrl") ? (
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <img 
                  src={watch("iconUrl")} 
                  alt="Icon preview" 
                  style={{ height: 64, width: 64, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--admin-border, #d7e3f0)', background: '#f9fbfd' }} 
                />
                <button 
                  type="button" 
                  onClick={(e) => removeImage(e, "iconUrl")} 
                  style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', background: 'var(--admin-danger, #e53935)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--admin-text-muted, #8a8a95)' }}>
                <UploadCloud size={24} />
                <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}>
                  Drag & drop or <strong style={{ color: 'var(--admin-primary, #0468BD)' }}>click to upload</strong><br/>PNG, JPG, SVG, WebP
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Methodology ── */}
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Methodology</h3>
        <div className="admin-form-group">
          <label className="admin-form-label">Methodology Note</label>
          <textarea 
            className="admin-form-textarea" 
            placeholder="Explain data collection methodology..." 
            {...register("methodologyNote")} 
          />
        </div>
      </div>

      {/* ── SEO ── */}
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">SEO</h3>
        <div className="admin-form-group">
          <label className="admin-form-label">Meta Title</label>
          <input 
            className="admin-form-input" 
            placeholder="Page title for search engines" 
            {...register("metaTitle")} 
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Meta Description</label>
          <textarea 
            className="admin-form-textarea" 
            style={{ minHeight: 70 }} 
            placeholder="Description for search engine results..." 
            {...register("metaDescription")} 
          />
        </div>
        
        {/* ── OG Image Upload ── */}
        <div className="admin-form-group">
          <label className="admin-form-label">OG Image Upload</label>
          <div
            onClick={() => !isUploadingOg && ogInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDraggingOg(true); }}
            onDragLeave={() => setDraggingOg(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDraggingOg(false);
              handleImageDrop(e.dataTransfer.files, "ogImageUrl");
            }}
            style={{
              border: `2px dashed ${draggingOg ? 'var(--admin-primary, #0468BD)' : 'var(--admin-border, #d7e3f0)'}`,
              borderRadius: 8,
              padding: watch("ogImageUrl") ? '12px' : '24px 16px',
              cursor: isUploadingOg ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: draggingOg ? 'rgba(4,104,189,0.04)' : 'var(--admin-surface, #fff)',
              transition: 'border-color 0.15s, background 0.15s', minHeight: watch("ogImageUrl") ? 'auto' : 90,
            }}
          >
            <input 
              ref={ogInputRef} 
              type="file" 
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" 
              style={{ display: 'none' }} 
              onChange={(e) => handleImageDrop(e.target.files, "ogImageUrl")} 
              disabled={isUploadingOg} 
            />
            
            {isUploadingOg ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-text-muted, #8a8a95)' }}>
                <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 12 }}>Uploading…</span>
              </div>
            ) : watch("ogImageUrl") ? (
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <img 
                  src={watch("ogImageUrl")} 
                  alt="OG preview" 
                  style={{ height: 82, width: 120, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--admin-border, #d7e3f0)', background: '#f9fbfd' }} 
                />
                <button 
                  type="button" 
                  onClick={(e) => removeImage(e, "ogImageUrl")} 
                  style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', background: 'var(--admin-danger, #e53935)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--admin-text-muted, #8a8a95)' }}>
                <UploadCloud size={24} />
                <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}>
                  Drag & drop or <strong style={{ color: 'var(--admin-primary, #0468BD)' }}>click to upload</strong><br/>PNG, JPG, SVG, WebP
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="admin-btn admin-btn-primary" type="submit" disabled={isSubmitting || isUploadingIcon || isUploadingOg}>
          {isSubmitting ? "Saving..." : (initialData ? "Save Changes" : "Create Topic")}
        </button>
        {onCancel && (
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}