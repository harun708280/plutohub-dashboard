"use client";
import { createContext, useState } from "react";

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogData, setBlogData] = useState({
     title: "",
    shortDesc: "",  
    content: null,
    image: "/banner.png",
    categories: [], 
  });

  return (
    <BlogContext.Provider value={{ blogData, setBlogData }}>
      {children}
    </BlogContext.Provider>
  );
};
