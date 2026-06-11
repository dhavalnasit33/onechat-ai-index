"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import IconUploadField from "@/src/components/admin/IconUploadField";
import { categorySchema, type CategoryFormValues } from "@/src/types";

interface CategoryFormProps {
  initialData?: CategoryFormValues | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      position: initialData?.position ?? 0,
      iconUrl: initialData?.iconUrl || "",
      keyphrase: (initialData as any)?.keyphrase || "",
      metaTitle: (initialData as any)?.metaTitle || "",
      metaDescription: (initialData as any)?.metaDescription || "",
      featuredImage: (initialData as any)?.featuredImage || "",
    },
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(initialData?.slug));

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  useEffect(() => {
    if (!isSlugTouched || watchedSlug === "") {
      const nextSlug = generateSlug(watchedName || "");
      setValue("slug", nextSlug, { shouldDirty: true, shouldValidate: true });
    }
  }, [watchedName, watchedSlug, isSlugTouched, setValue]);

  const watchedIconUrl = watch("iconUrl") as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Category Details</h3>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Name *</label>
            <input
              className="admin-form-input"
              placeholder="e.g. Economy"
              {...register("name")}
            />
            {errors.name && (
              <p className="admin-form-error">{errors.name.message}</p>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Slug</label>
            <input
              className="admin-form-input"
              placeholder="economy"
              style={{ fontFamily: "var(--font-geist-mono)" }}
              {...register("slug", {
                onChange: (event) => {
                  setIsSlugTouched(true);
                  setValue("slug", event.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              })}
            />
            <p className="admin-form-hint">
              This is generated from the name and can be edited.
            </p>
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              placeholder="Brief category description..."
              {...register("description")}
            />
          </div>

          <div className="admin-form-group" style={{ maxWidth: 200 }}>
            <label className="admin-form-label">Position</label>
            <input
              className="admin-form-input"
              type="number"
              {...register("position", { valueAsNumber: true })}
            />
            {errors.position?.message && (
              <p className="admin-form-error">{errors.position.message}</p>
            )}
          </div>
        </div>

        <IconUploadField
          value={watchedIconUrl ?? ""}
          onChange={(url) => setValue("iconUrl", url, { shouldDirty: true, shouldValidate: true })}
          folder="onechatai-index-category-icons"
          label="Category Icon"
          disabled={isSubmitting}
        />
      </div>

      <div className="admin-form-section" style={{ marginTop: 24 }}>
        <h3 className="admin-form-section-title">SEO & Metadata</h3>
        
        <div className="admin-form-group">
          <label className="admin-form-label">Focus Keyphrase</label>
          <input
            className="admin-form-input"
            placeholder="e.g. economy statistics, generative AI"
            {...register("keyphrase")}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">Meta Title</label>
            <input
              className="admin-form-input"
              placeholder="e.g. Economy Statistics | AI Behavior Index"
              {...register("metaTitle")}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Meta Description</label>
            <textarea
              className="admin-form-textarea"
              placeholder="e.g. Search and explore in-depth AI statistics regarding the economy..."
              {...register("metaDescription")}
            />
          </div>
        </div>

        <IconUploadField
          value={watch("featuredImage") ?? ""}
          onChange={(url) => setValue("featuredImage", url, { shouldDirty: true, shouldValidate: true })}
          folder="onechatai-index-category-images"
          label="Featured Image (OG Share Image)"
          disabled={isSubmitting}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : <><Save size={16} /> Save Category</>}
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
