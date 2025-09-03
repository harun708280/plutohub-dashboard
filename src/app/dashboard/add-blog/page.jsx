"use client";
import AddBlog from "@/components/AddBlog/AddBlog";
import SeeBlog from "@/components/PreviewBlog/PreviewBlog";
import React from "react";

const AddBlogPage = () => {
  return (
    <div className="flex flex-1 flex-col ">
      <div className="flex flex-1 flex-col gap-2 bg-black">
        <div className="flex  gap-4 py-4 md:gap-6 md:py-6 max-w-6xl mx-auto w-full">
         <div className="w-1/2">
           <SeeBlog />
         </div>
          <div className="w-1/2">
            <AddBlog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlogPage;
