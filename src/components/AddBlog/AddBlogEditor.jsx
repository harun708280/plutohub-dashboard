"use client";

import { useEffect, useRef } from "react";
import editorTools from "@/components/AddBlog/editorTools";

export default function AddBlogEditor({ preview, setBlogData }) {
  const editorRef = useRef(null);

  useEffect(() => {
    let editorInstance;

    const initEditor = async () => {
      if (typeof window === "undefined") return;

      const EditorJS = (await import("@editorjs/editorjs")).default;

      if (!editorRef.current) {
        editorInstance = new EditorJS({
          holder: "editorjs",
          placeholder: "Write your awesome story here...",
          tools: editorTools,
          onChange: async () => {
            try {
              const savedData = await editorInstance.save();
              setBlogData((prev) => ({
                ...prev,
                content: savedData,
                image: preview || "/banner.png",
              }));
            } catch (err) {
              console.error("EditorJS save error:", err);
            }
          },
        });

        editorRef.current = editorInstance;
      }
    };

    initEditor();

    return () => {
      editorRef.current?.destroy?.();
      editorRef.current = null;
    };
  }, [preview, setBlogData]);

  return (
    <div
      id="editorjs"
      className="prose lg:prose-xl mt-6 text-white border-b border-white/20 bg-transparent pb-4 min-h-[300px]"
    />
  );
}
