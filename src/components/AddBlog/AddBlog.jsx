"use client";

import React, { useState, useContext, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BlogContext } from "@/context/BlogContext";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spin } from "antd";

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
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        New Blog
      </h1>

      <div
        className="mb-6 cursor-pointer w-full h-[400px] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden relative hover:ring-2 hover:ring-indigo-500 transition-all duration-300"
        onClick={() => fileInputRef.current.click()}
      >
        <img
          src={preview}
          alt="Blog Banner"
          className="w-full h-full object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Spin size="large"  />
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
        className="text-3xl font-semibold w-full outline-none resize-none overflow-hidden mb-6 leading-snug placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 bg-transparent transition-colors duration-300"
      />

      <AddBlogEditor preview={preview} setBlogData={setBlogData} />

      <div className="mt-6 flex justify-end">
        <Link href="/dashboard/preview-blog">
          <Button type="submit" className="w-full !text-white" disabled={uploading}>

            {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                     
                    </span>
                  ) : (
                    <span className="flex gap-3 items-center">See Preview  <ArrowUpRight/></span>
                  )}
            
          </Button>
        </Link>
      </div>
    </div>
  );
}
