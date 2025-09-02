"use client";

import { useContext } from "react";
import { BlogContext } from "@/context/BlogContext";

const SeeBlog = () => {
  const { blogData } = useContext(BlogContext);

  if (!blogData) return <p>No blog data available</p>;

  // Function to safely render list items
  const renderItem = (item) => {
    if (typeof item === "string") return item;

    if (typeof item === "object") {
      // EditorJS checklist structure
      if ("content" in item) return item.content;
      if ("text" in item) return item.text;
      return JSON.stringify(item); // fallback safety
    }

    return String(item);
  };

  const renderBlock = (block, index) => {
    if (!block?.type || !block?.data) return null;

    switch (block.type) {
      case "header": {
        const HeaderTag = `h${block.data.level || 2}`;
        return (
          <HeaderTag key={index} className="my-4 font-bold text-gray-800">
            {block.data.text}
          </HeaderTag>
        );
      }

      case "paragraph":
        return (
          <p key={index} className="my-2 text-gray-700 leading-relaxed">
            {block.data.text}
          </p>
        );

      case "list": {
        const items = block.data?.items || [];

        if (block.data.style === "ordered") {
          return (
            <ol key={index} className="ml-6 list-decimal my-2">
              {items.map((item, i) => (
                <li key={i}>{renderItem(item)}</li>
              ))}
            </ol>
          );
        } else if (block.data.style === "checklist") {
          return (
            <ul key={index} className="ml-6 my-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item?.meta?.checked ?? false}
                    readOnly
                    className="w-4 h-4"
                  />
                  <span>{renderItem(item)}</span>
                </li>
              ))}
            </ul>
          );
        } else {
          return (
            <ul key={index} className="ml-6 list-disc my-2">
              {items.map((item, i) => (
                <li key={i}>{renderItem(item)}</li>
              ))}
            </ul>
          );
        }
      }

      case "image":
        return block.data?.file?.url ? (
          <div key={index} className="my-4">
            <img
              src={block.data.file.url}
              alt={block.data.caption || "Blog Image"}
              className="w-full rounded-md object-cover"
            />
            {block.data.caption && (
              <p className="text-sm text-gray-500 mt-1">
                {block.data.caption}
              </p>
            )}
          </div>
        ) : null;

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-gray-300 pl-4 italic my-4"
          >
            {block.data.text}
            {block.data.caption && (
              <cite className="block mt-1">— {block.data.caption}</cite>
            )}
          </blockquote>
        );

      case "code":
        return (
          <pre
            key={index}
            className="bg-gray-100 rounded p-3 overflow-x-auto my-4 font-mono text-sm"
          >
            {block.data.code}
          </pre>
        );

      case "table":
        return (
          <div key={index} className="overflow-x-auto my-4">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <tbody>
                {block.data?.content?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="border border-gray-300 p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{blogData.title}</h1>

      {blogData.image && (
        <img
          src={blogData.image}
          alt={blogData.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}

      {blogData.content?.blocks?.length > 0 &&
        blogData.content.blocks.map((block, index) =>
          renderBlock(block, index)
        )}
    </div>
  );
};

export default SeeBlog;
