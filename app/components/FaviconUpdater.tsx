"use client";

import { useEffect } from "react";

const LOGO_SOURCE = "/doodle/assets/jf-logo.png";

export default function FaviconUpdater() {
  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;

      const size = 64;
      const padding = 5;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.fillStyle = "#f7f0dd";
      context.fillRect(0, 0, size, size);

      const scale = Math.min(
        (size - padding * 2) / image.naturalWidth,
        (size - padding * 2) / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;

      context.drawImage(
        image,
        (size - width) / 2,
        (size - height) / 2,
        width,
        height,
      );

      canvas.toBlob((blob) => {
        if (!blob || cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        document
          .querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="shortcut icon"]')
          .forEach((link) => link.remove());

        const icon = document.createElement("link");
        icon.rel = "icon";
        icon.type = "image/png";
        icon.sizes = "64x64";
        icon.href = objectUrl;
        document.head.appendChild(icon);
      }, "image/png");
    };

    image.src = `${LOGO_SOURCE}?favicon=${Date.now()}`;

    return () => {
      cancelled = true;
      image.onload = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return null;
}
