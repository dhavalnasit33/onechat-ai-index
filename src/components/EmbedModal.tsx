'use client';

import React, { useState, useEffect } from 'react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartName: string;
  chartId: string;
  categorySlug: string;
  topicSlug: string;
  topicTitle: string;
}

export default function EmbedModal({
  isOpen,
  onClose,
  chartName,
  chartId,
  categorySlug,
  topicSlug,
  topicTitle
}: EmbedModalProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'markdown' | 'citation'>('html');
  const [showToast, setShowToast] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onechatai.ai';

  const getHtmlCode = () => {
    return `<a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId}" target="_blank">
  <img src="${baseUrl}/api/chart-images/${chartId}.png"
       alt="${chartName} — OneChat AI Behavior Index"
       width="600" height="400"
       style="max-width: 100%; height: auto; border: 1px solid #e5e5e5;" />
</a>
<p style="font-size: 11px; color: #666; margin-top: 4px;">
  Source: <a href="${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/" target="_blank">OneChat AI Behavior Index</a>
</p>`;
  };

  const getMarkdownCode = () => {
    return `[![${chartName}](${baseUrl}/api/chart-images/${chartId}.png)](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/#chart-${chartId})

*Source: [OneChat AI Behavior Index](${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/)*`;
  };

  const getCitationCode = () => {
    return `OneChat AI. (2026). "${topicTitle}." AI Behavior Index.
Retrieved from ${baseUrl}/ai-behavior-index/${categorySlug}/${topicSlug}/`;
  };

  const copyCode = async () => {
    let codeToCopy = '';
    if (activeTab === 'html') codeToCopy = getHtmlCode();
    if (activeTab === 'markdown') codeToCopy = getMarkdownCode();
    if (activeTab === 'citation') codeToCopy = getCitationCode();

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard', err);
    }
  };

  return (
    <>
      <div
        className="modal-backdrop open"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h2>Embed this chart</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="modal-body text-left">
            <div className="modal-preview">
              <div className="modal-preview-label">Embedding</div>
              <div className="modal-preview-name">{chartName}</div>
            </div>

            <div className="tab-nav">
              <button
                className={`tab ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button
                className={`tab ${activeTab === 'markdown' ? 'active' : ''}`}
                onClick={() => setActiveTab('markdown')}
              >
                Markdown
              </button>
              <button
                className={`tab ${activeTab === 'citation' ? 'active' : ''}`}
                onClick={() => setActiveTab('citation')}
              >
                Citation
              </button>
            </div>

            {activeTab === 'html' && <pre className="code-block">{getHtmlCode()}</pre>}
            {activeTab === 'markdown' && <pre className="code-block">{getMarkdownCode()}</pre>}
            {activeTab === 'citation' && <pre className="code-block">{getCitationCode()}</pre>}

            <div className="modal-actions">
              <button className="btn-primary font-sans font-semibold" onClick={copyCode}>
                Copy code
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`toast ${showToast ? 'show' : ''}`}>Copied to clipboard!</div>
    </>
  );
}
