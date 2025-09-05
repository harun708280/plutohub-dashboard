"use client";
import { BlogContext } from "@/context/BlogContext";
import { X } from "lucide-react";
import React, { useContext } from "react";

const CategoryAdd = () => {
  const { blogData, setBlogData } = useContext(BlogContext);
  const CATEGORY_OPTIONS = [
    "UI/UX Design",
    "Apps Design",
    "SaaS",
    "AI Product",
    "Webflow",
    "WordPress",
    "Shopify",
  ];

  const handleCategoryToggle = (category) => {
    setBlogData((prev) => {
      const exists = prev.categories.includes(category);
      if (exists) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== category),
        };
      }
      return { ...prev, categories: [...prev.categories, category] };
    });
  };

  const MAX_CHAR = 200;
  const shortDesc = blogData.shortDesc || "";
  const remaining = MAX_CHAR - shortDesc.length;

  const handleDescChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR) {
      setBlogData((prev) => ({ ...prev, shortDesc: value }));
    }
  };

  return (
    <div className="">
      <div className="blogContent">
        <p className="text-white mb-2 text-lg">Select Categories</p>

        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-3 py-1 rounded-full border ${
                blogData.categories.includes(cat)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-transparent text-white border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {blogData.categories.map((cat, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
            >
              {cat}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => handleCategoryToggle(cat)}
              />
            </span>
          ))}
        </div>

        <div className="mt-5">
          <textarea
            placeholder="Short Description "
            rows={4}
            value={shortDesc}
            onChange={handleDescChange}
            className="w-full resize-none mt-4 text-white placeholder-white opacity-90 border-b border-white/20 bg-transparent pb-2 outline-none"
          />
          <div
            className={`text-sm mt-1 flex justify-end ${
              remaining === 0 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {remaining} characters remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;
