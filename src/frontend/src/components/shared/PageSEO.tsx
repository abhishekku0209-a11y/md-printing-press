import { useEffect } from "react";

interface PageSEOProps {
  title?: string;
  description?: string;
}

export function PageSEO({ title, description }: PageSEOProps) {
  useEffect(() => {
    const siteName = "MD Printing Press";
    document.title = title ? `${title} | ${siteName}` : siteName;

    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) {
      meta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
