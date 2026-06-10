// src/components/FaviconLoader.tsx
"use client";

import { useEffect } from "react";
import apiService from "@/src/lib/apiService";

const DEFAULT_FAVICON_URL = "/favicon.ico";

export default function FaviconLoader() {
  useEffect(() => {
    const setFavicon = (url: string) => {
      const rels = ["icon", "shortcut icon", "apple-touch-icon"];
      rels.forEach((rel) => {
        let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = url;
      });
    };

    const fetchFavicon = async () => {
      try {
        const res = await apiService<{
          success: boolean;
          data: { key: "favicon"; value: string };
          message?: string;
        }>("/settings/favicon");

        const url = res.success && res.data?.value ? res.data.value : DEFAULT_FAVICON_URL;
        setFavicon(url);
      } catch {
        setFavicon(DEFAULT_FAVICON_URL);
      }
    };

    fetchFavicon();
  }, []);

  return null;
}