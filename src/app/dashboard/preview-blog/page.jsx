"use client";

import React from 'react';
import Pre from './page';
import SeeBlog from '@/components/PreviewBlog/PreviewBlog';
import CategoryAdd from '@/components/PreviewBlog/CategoryAdd';

const PreviewBlogContainer = () => {
    return (
        <div className='max-w-6xl mx-auto py-8 flex  gap-8'>
           <div className="w-1/2">
             <SeeBlog/>
           </div>
            <div className="sticky top-9 w-1/2 self-start">
              <CategoryAdd/>
            </div>
        </div>
    );
};

export default PreviewBlogContainer;