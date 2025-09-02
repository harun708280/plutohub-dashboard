"use client";
import AddBlog from '@/components/AddBlog/AddBlog';
import SeeBlog from '@/components/SeeBlog/SeeBlog';
import React from 'react';

const AddBlogPage = () => {
    return (
        <div className="flex flex-1 flex-col ml-8">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex  gap-4 py-4 md:gap-6 md:py-6">
                <SeeBlog/>
             <AddBlog/>
            </div>
          </div>
        </div>
    );
};

export default AddBlogPage;