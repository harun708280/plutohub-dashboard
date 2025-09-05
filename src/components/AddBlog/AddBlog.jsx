"use client";

import React, { useState, useContext, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BlogContext } from "@/context/BlogContext";
import { ArrowUpRight } from "lucide-react";
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const AddBlogEditor = dynamic(() => import("./AddBlogEditor"), { ssr: false });

export default function AddBlog() {
  const { blogData, setBlogData } = useContext(BlogContext);

  const [title, setTitle] = useState(blogData.title || "");
  const [preview, setPreview] = useState(blogData.image || "/banner.png");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const updateTitleContext = useRef(
    debounce((value) => {
      setBlogData((prev) => ({ ...prev, title: value }));
    }, 300)
  ).current;

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    updateTitleContext(value);
  };

  const handleTitleResize = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempPreview = URL.createObjectURL(file);
    setPreview(tempPreview);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const finalUrl = data.url || tempPreview;
      setPreview(finalUrl);

      setBlogData((prev) => ({ ...prev, image: finalUrl }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="blogContent">
      <h1 className="text-xl font-bold mb-4 text-white">New Blog</h1>

      <div
        className="mb-4 cursor-pointer w-full h-[400px] border border-white/5 rounded-lg overflow-hidden relative"
        onClick={() => fileInputRef.current.click()}
      >
        <img
          src={preview}
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
        onChange={handleFileChange}
      />

      <textarea
        placeholder="Blog Title"
        value={title}
        onChange={handleTitleChange}
        onInput={handleTitleResize}
        className="text-3xl font-medium w-full outline-none resize-none overflow-hidden mt-10 leading-tight placeholder:opacity-90 placeholder-white opacity-90 border-b border-white/20 bg-transparent pb-4 text-white"
      />

      <AddBlogEditor preview={preview} setBlogData={setBlogData} />

      <div className="mt-6 flex justify-end">
        <Link href="/dashboard/preview-blog">
          <button className="theme_btn">
            {" "}
            See Preview{" "}
            <div className="arrow_icon">
              <ArrowUpRight />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}
