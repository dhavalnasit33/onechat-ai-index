"use client";

import React, { useRef, useEffect, useState } from "react";
import { Bold, Italic, Link2, Link2Off, Trash } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "e.g. Source: Pew Research Center, 2024",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync value from parent to innerHTML (only if they actually differ to prevent cursor jump)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const addLink = () => {
    const url = prompt("Enter source URL:");
    if (url) {
      // Basic check to prepend https:// if missing
      const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      executeCommand("createLink", formattedUrl);

      // Post-process links inside the editor to ensure target="_blank"
      if (editorRef.current) {
        const links = editorRef.current.querySelectorAll("a");
        links.forEach((link) => {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
          // Add default styling class or inline styles to link inside editor
          link.style.color = "#6C56E5";
          link.style.textDecoration = "underline";
        });
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div
      className={`relative w-full rounded-lg border bg-white overflow-hidden transition-all duration-200 ${
        isFocused
          ? "border-[#6C56E5] ring-2 ring-[#6C56E5]/10 shadow-[0_0_0_2px_rgba(108,86,229,0.1)]"
          : "border-[#d7e3f0]"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 bg-[#f8fafc] border-b border-[#e2e8f0] p-2">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1.5 rounded text-gray-600 hover:bg-[#eaf2fb] hover:text-[#6C56E5] transition-colors"
          title="Bold"
        >
          <Bold size={15} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1.5 rounded text-gray-600 hover:bg-[#eaf2fb] hover:text-[#6C56E5] transition-colors"
          title="Italic"
        >
          <Italic size={15} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 rounded text-gray-600 hover:bg-[#eaf2fb] hover:text-[#6C56E5] transition-colors"
          title="Insert Link"
        >
          <Link2 size={15} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("unlink")}
          className="p-1.5 rounded text-gray-600 hover:bg-[#eaf2fb] hover:text-[#6C56E5] transition-colors"
          title="Remove Link"
        >
          <Link2Off size={15} strokeWidth={2.5} />
        </button>
        <div className="w-px h-5 bg-[#e2e8f0] mx-1"></div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear source formatting?")) {
              executeCommand("removeFormat");
            }
          }}
          className="p-1.5 rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
          title="Clear formatting"
        >
          <Trash size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={() => {
          handleInput();
          setIsFocused(false);
        }}
        onFocus={() => setIsFocused(true)}
        className="min-h-[84px] p-3 text-sm text-[#1e293b] outline-none leading-relaxed select-text font-sans [&_a]:text-[#6C56E5] [&_a]:underline [&_a]:font-medium"
        style={{
          minHeight: "84px",
        }}
      />

      {/* Placeholder helper for contentEditable */}
      {!value && !isFocused && (
        <div className="absolute top-[49px] left-3 text-gray-400 text-sm pointer-events-none select-none font-sans">
          {placeholder}
        </div>
      )}
    </div>
  );
}
