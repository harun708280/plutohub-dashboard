"use client";

import React from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";


const blogData = [
  {
    id: 1,
    title: "The Impact of Technology on the Workplace: How Technology is Changing",
    banner: "https://via.placeholder.com/800x400.png?text=Blog+Banner+1",
    author: {
      name: "Harun Or Rashid",
      avatar: "https://via.placeholder.com/40.png?text=HR",
    },
    likes: 120,
    comments: 15,
  },
  {
    id: 2,
    title: "The Impact of Technology on the Workplace: How Technology is Changing",
    banner: "https://via.placeholder.com/800x400.png?text=Blog+Banner+2",
    author: {
      name: "Arif Ahmed",
      avatar: "https://via.placeholder.com/40.png?text=AA",
    },
    likes: 85,
    comments: 10,
  },
  {
    id: 3,
    title: "The Impact of Technology on the Workplace: How Technology is Changing",
    banner: "https://via.placeholder.com/800x400.png?text=Blog+Banner+3",
    author: {
      name: "Fatema Begum",
      avatar: "https://via.placeholder.com/40.png?text=FB",
    },
    likes: 200,
    comments: 30,
  },
];

const Blog = () => {
  return (
    <div className=" px-4 py-8 space-y-8  w-full">
      {blogData.map((blog) => (
        <div
          key={blog.id}
          className=" rounded-lg overflow-hidden shadow-lg flex w-full border border-white/20"
        >
        
          <div className="relative w-[400px] h-[200px]">
            <Image
              src='/blog-banner.png'
              alt={blog.title}
              fill
              className="object-cover"
              priority={true} 
            />
          </div>

          <div className="p-6">
     
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-10 h-10">
                <Image
                   src='/blog-banner.png'
                  alt={blog.author.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-white font-medium">{blog.author.name}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">{blog.title}</h2>

            
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="flex items-center space-x-1">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{blog.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-5 h-5" />
                <span>{blog.comments}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
