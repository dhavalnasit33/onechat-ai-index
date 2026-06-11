'use client';

import React, { useRef, useState } from 'react';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { uploadFileToServer, deleteImage } from '@/src/lib/utils';

interface IconUploadFieldProps {
  /** Current URL value (controlled) */
  value: string;
  /** Called with the new URL after upload, or '' after removal */
  onChange: (url: string) => void;
  /** Upload folder name on your file server, e.g. "category-icons" */
  folder?: string;
  /** Label shown above the upload zone */
  label?: string;
  /** Whether the parent form is submitting (disables interactions) */
  disabled?: boolean;
}

/**
 * Drop-in icon/image upload field for admin forms.
 * Uses the same uploadFileToServer() + deleteImage() helpers from utils.ts.
 *
 * Usage in your existing category/topic form:
 *
 *   const [iconUrl, setIconUrl] = useState(initialData?.iconUrl || '');
 *
 *   <IconUploadField
 *     value={iconUrl}
 *     onChange={setIconUrl}
 *     folder="category-icons"
 *     label="Category Icon"
 *   />
 *
 * Then include `iconUrl` in the body when you call your save API.
 */
export default function IconUploadField({
  value,
  onChange,
  folder = 'topic-icons',
  label = 'Icon Image',
  disabled = false,
}: IconUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const url = await uploadFileToServer(file, folder);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      // Reset the input so re-uploading the same file works
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    try {
      await deleteImage(value);
    } catch {
      // Ignore delete errors — just clear the field
    }
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="admin-form-group">
      {/* Label */}
      <label className="admin-form-label">{label}</label>

      {/* Drop zone */}
      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={`group flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 relative
          ${disabled || uploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          ${isDragging 
            ? 'border-[var(--admin-accent)] bg-[var(--admin-accent-glow)] scale-[0.99]' 
            : 'border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-accent)] hover:bg-[var(--admin-surface-2)] shadow-sm hover:shadow'
          }
        `}
        style={{ minHeight: value ? 'auto' : 130 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled || uploading}
        />

        {uploading ? (
          /* Uploading spinner */
          <div className="flex flex-col items-center gap-2 text-[var(--admin-text-muted)]">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--admin-accent)]" />
            <span className="text-xs font-medium">Uploading…</span>
          </div>

        ) : value ? (
          /* Preview */
          <div className="relative display-inline-flex">
            <img
              src={value}
              alt="Icon preview"
              className="h-20 w-20 object-contain rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-2 shadow-inner"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              title="Remove icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[var(--admin-danger)] text-white hover:bg-red-600 transition-colors shadow-md flex items-center justify-center cursor-pointer border border-white"
            >
              <X size={12} />
            </button>
          </div>

        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-2.5 text-[var(--admin-text-muted)] text-center">
            <UploadCloud className="h-8 w-8 text-[var(--admin-text-dim)] group-hover:text-[var(--admin-accent)] transition-colors duration-200" />
            <span className="text-xs leading-normal">
              Drag & drop or <strong className="text-[var(--admin-accent)] font-semibold underline-offset-4 group-hover:underline">click to upload</strong>
              <br />
              <span className="text-[var(--admin-text-dim)] text-[11px]">PNG, JPG, SVG, WebP</span>
            </span>
          </div>
        )}
      </div>

      {/* Inline error */}
      {error && (
        <p style={{ fontSize: 12, color: 'var(--admin-danger, #e53935)', marginTop: 4 }}>
          {error}
        </p>
      )}

      {/* Helper: show raw URL below preview so you can verify */}
      {value && !uploading && (
        <p style={{ fontSize: 11, color: 'var(--admin-text-dim, #aaa)', marginTop: 4, wordBreak: 'break-all' }}>
          {value}
        </p>
      )}
    </div>
  );
}