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
        style={{
          border: `2px dashed ${isDragging ? 'var(--admin-primary, #0468BD)' : 'var(--admin-border, #d7e3f0)'}`,
          borderRadius: 8,
          padding: value ? '12px' : '28px 16px',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDragging
            ? 'rgba(4, 104, 189, 0.04)'
            : 'var(--admin-surface, #fff)',
          transition: 'border-color 0.15s, background 0.15s',
          minHeight: value ? 'auto' : 100,
          position: 'relative',
        }}
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--admin-text-muted, #8a8a95)' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 12 }}>Uploading…</span>
          </div>

        ) : value ? (
          /* Preview */
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <img
              src={value}
              alt="Icon preview"
              style={{
                height: 72,
                width: 72,
                objectFit: 'contain',
                borderRadius: 6,
                border: '1px solid var(--admin-border, #d7e3f0)',
                background: '#f9fbfd',
              }}
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              title="Remove icon"
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--admin-danger, #e53935)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                padding: 0,
              }}
            >
              <X size={12} />
            </button>
          </div>

        ) : (
          /* Empty state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--admin-text-muted, #8a8a95)' }}>
            <UploadCloud size={28} />
            <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}>
              Drag & drop or <strong style={{ color: 'var(--admin-primary, #0468BD)' }}>click to upload</strong>
              <br />
              PNG, JPG, SVG, WebP
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