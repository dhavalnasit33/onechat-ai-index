"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { topicSchema, type TopicFormValues } from "@/src/types";
import { Input } from "@/src/components/admin/ui/Input";
import { Textarea } from "@/src/components/admin/ui/Textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/admin/ui/Select";
import IconUploadField from "@/src/components/admin/IconUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";

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
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      categoryId: initialData?.categoryId || "",
      description: initialData?.description || "",
      methodologyNote: initialData?.methodologyNote || "",
      aboutData: initialData?.aboutData || "",
      chartCount: initialData?.chartCount || 0, // ← Add this
      sourceCount: initialData?.sourceCount || 0,
      chartLabel: initialData?.chartLabel || "charts",
      metaTitle: initialData?.metaTitle || "",
      keyphrase: (initialData as any)?.keyphrase || "",
      metaDescription: initialData?.metaDescription || "",
      ogImageUrl: initialData?.ogImageUrl || "",
      iconUrl: initialData?.iconUrl || "",
      status: initialData?.status || "draft",
    },
  });

  const titleVal = watch("title");

  React.useEffect(() => {
    if (!initialData) {
      const generatedSlug = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [titleVal, initialData, setValue]);

  return (
   <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      {errorMsg && (
        <div className="admin-login-error" style={{ marginBottom: 20 }}>
          {errorMsg}
        </div>
      )}

      {/* ── Basic Info ── */}
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Basic Information</h3>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Title *</label>
            <Input
              placeholder="e.g. Global AI Investment Trends"
              {...register("title")}
            />
            {errors.title && (
              <p className="admin-form-error">{errors.title.message}</p>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Slug</label>
            <Input
              placeholder="auto-generated"
              style={{
                fontFamily: "var(--font-geist-mono)",
                opacity: 0.6,
                cursor: "not-allowed",
              }}
              {...register("slug")}
              readOnly
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Category *</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="admin-form-error">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Draft" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description *</label>
          <Textarea
            placeholder="Describe this topic..."
            {...register("description")}
          />
          {errors.description && (
            <p className="admin-form-error">{errors.description.message}</p>
          )}
        </div>
        {/* ── Topic Metadata Counters ── */}
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Topic Metadata & Counters</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Total Charts Override</label>
              <Input 
                type="number"
                placeholder="Leave 0 to auto-count" 
                {...register("chartCount")} /* ← CHANGED THIS to chartCount */
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Total Sources Override</label>
              <Input 
                type="number"
                placeholder="Leave 0 for default (6)" 
                {...register("sourceCount")} 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Chart Label Word</label>
              <Input 
                placeholder="e.g. charts, visuals, stats" 
                {...register("chartLabel")} 
              />
            </div>
          </div>
        </div>

        {/* ── Icon Upload ── */}
        <IconUploadField
          value={watch("iconUrl") ?? ""}
          onChange={(url) =>
            setValue("iconUrl", url, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          folder="onechatai-index-topic-icons"
          label="Topic Icon"
          disabled={isSubmitting}
        />
      </div>

      {/* ── Methodology ── */}
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Methodology & About Data</h3>
        <div className="admin-form-group" style={{ marginBottom: 20 }}>
          <label className="admin-form-label">Methodology Note</label>
          <Textarea
            placeholder="Explain data collection methodology..."
            {...register("methodologyNote")}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">
            About This Data (Rich Text Override)
          </label>
          <RichTextEditor
            value={watch("aboutData") ?? ""}
            onChange={(val) =>
              setValue("aboutData", val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="All statistics on this page are compiled from publicly available studies..."
          />
        </div>
      </div>

      {/* ── SEO ── */}
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">SEO</h3>
        <div className="admin-form-group">
          <label className="admin-form-label">Meta Title</label>
          <Input
            placeholder="Page title for search engines"
            {...register("metaTitle")}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Focus Keyphrase</label>
          <Input
            placeholder="e.g. ai investment, global hardware market"
            {...register("keyphrase")}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Meta Description</label>
          <Textarea
            style={{ minHeight: 70 }}
            placeholder="Description for search engine results..."
            {...register("metaDescription")}
          />
        </div>

        <IconUploadField
          value={watch("ogImageUrl") ?? ""}
          onChange={(url) =>
            setValue("ogImageUrl", url, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          folder="onechatai-index-topic-icons"
          label="OG Image (Social Share)"
          disabled={isSubmitting}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          className="admin-btn admin-btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Create Topic"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
