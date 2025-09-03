"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import EditorJS from "@editorjs/editorjs";
import editorTools from "@/lib/editorTools";
import { BlogContext } from "@/context/BlogContext";

// Simple debounce function
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export default function AddBlog() {
  const { blogData, setBlogData } = useContext(BlogContext);

  const [preview, setPreview] = useState(blogData.image || "/banner.png");
  const [title, setTitle] = useState(blogData.title || "");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();
  const editorRef = useRef(null);

  // Debounced Context update for Title
  const updateTitleContext = useRef(
    debounce((value) => {
      setBlogData((prev) => ({
        ...prev,
        title: value,
      }));
    }, 300)
  ).current;

  // Initialize EditorJS
  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        placeholder: "Write your awesome story here...",
        tools: editorTools,
        onChange: async () => {
          try {
            const savedData = await editor.save();
            setBlogData((prev) => ({
              ...prev,
              content: savedData,
              image: preview || "/banner.png",
              title: prev.title || "",
            }));
          } catch (err) {
            console.error("EditorJS save error:", err);
          }
        },
      });
      editorRef.current = editor;
    }

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [preview, setBlogData]);

  const handleTitleChange = (e) => {
    const value = e.target.value || "";
    setTitle(value);
    updateTitleContext(value);
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempPreview = URL.createObjectURL(file);
    setPreview(tempPreview);

    await handleUpload(file, tempPreview);
  };

  const handleUpload = async (file, tempPreview) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const finalUrl = data.url || tempPreview;
      setPreview(finalUrl);

      setBlogData((prev) => ({
        ...prev,
        image: finalUrl,
        title: prev.title || "",
        content: prev.content || null,
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const handleTitleKeyDown = (e) => {
    const input = e.target;
    input.style.height = "auto"; // reset height
    input.style.height = input.scrollHeight + "px"; // expand to fit content
  };

  return (
    <div className="blogContent ">
      <h1 className="text-xl font-bold mb-4 text-white">New Blog</h1>

      <div
        className="mb-4 cursor-pointer w-full h-[400px] border border-white/5 rounded-lg overflow-hidden relative"
        onClick={() => fileInputRef.current.click()}
      >
        <img
          src={preview || "/banner.png"}
          alt="Blog Banner"
          className="w-full h-full object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
      />

      <div className="blog-comment">
        <input
          type="text"
          placeholder="Category"
          value={blogData.category}
          onChange={(e) =>
            setBlogData((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full  py-2 mt-4 outline-none  text-white placeholder-white opacity-90 border-b border-white/20  bg-transparent pb-4"
        />

        <textarea
          placeholder="Blog Title"
          value={title}
          onChange={handleTitleChange}
          onInput={handleTitleKeyDown}
          className="text-3xl font-medium w-full outline-none resize-none overflow-hidden mt-10 leading-tight placeholder:opacity-90 placeholder-white opacity-90 border-b border-white/20 bg-transparent pb-4 text-white"
        />

        <div
          id="editorjs"
          className="prose lg:prose-xl mt-6 text-white border-b border-white/20 bg-transparent pb-4"
        />
      </div>
    </div>
  );
}
