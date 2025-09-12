"use server";

import { prisma } from "@/lib/prisma";

/** ---------- Helpers ---------- */
function getString(v) {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Accepts `content` as:
 * 1) multiple inputs with the same name: formData.getAll("content")
 * 2) a single JSON string: '["para1","para2"]'
 * 3) a single newline-separated string
 */
function parseContent(formData) {
  const all = formData.getAll("content");
  if (all.length > 1) {
    return all
      .map((v) => (typeof v === "string" ? v : ""))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const single = getString(formData.get("content"));
  if (!single) return [];
  try {
    const parsed = JSON.parse(single);
    if (Array.isArray(parsed)) {
      return parsed.map((x) => String(x).trim()).filter(Boolean);
    }
  } catch {
    // not JSON — fall through
  }
  // newline-separated fallback
  return single
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** ---------- List Posts ---------- */
export const postList = async (_prevState, _formData) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
        BlogCategory: { select: { id: true, name: true } },
      },
    });

    return {
      success: true,
      msg: "Posts fetched successfully",
      posts,
    };
  } catch (err) {
    console.error("postList error:", err);
    return { success: false, msg: "Failed to fetch posts" };
  }
};

/** ---------- Create Post ---------- */
export const postCreate = async (_prevState, formData) => {
  try {
    const title = getString(formData.get("title"));
    const shortDesc = getString(formData.get("shortDesc"));
    const content = parseContent(formData);
    const authorId = getString(formData.get("authorId")); // optional
    const blogCategoryId = getString(formData.get("blogCategoryId")); // optional

    if (!title || !shortDesc || content.length === 0) {
      return {
        success: false,
        msg: "title, shortDesc and content are required",
      };
    }

    const existing = await prisma.post.findFirst({ where: { title } });
    if (existing) {
      return { success: false, msg: "Post with this title already exists" };
    }

    const created = await prisma.post.create({
      data: {
        title,
        shortDesc,
        content,
        authorId: authorId || null,
        blogCategoryId: blogCategoryId || null,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        BlogCategory: { select: { id: true, name: true } },
      },
    });

    return {
      success: true,
      msg: "Post created successfully",
      post: created,
    };
  } catch (err) {
    console.error("postCreate error:", err);
    return { success: false, msg: "Failed to create post" };
  }
};

/** ---------- Update Post ---------- */
export const postUpdate = async (_prevState, formData) => {
  try {
    const id = getString(formData.get("id"));
    if (!id) return { success: false, msg: "Post id is required" };

    const title = getString(formData.get("title"));
    const shortDesc = getString(formData.get("shortDesc"));
    const authorId = getString(formData.get("authorId"));
    const blogCategoryId = getString(formData.get("blogCategoryId"));

    const rawContent = formData.getAll("content");
    const contentProvided =
      rawContent.length > 0 && rawContent.some((v) => String(v).trim() !== "");
    const content = contentProvided ? parseContent(formData) : undefined;

    const data = {};
    if (title) data.title = title;
    if (shortDesc) data.shortDesc = shortDesc;
    if (contentProvided) data.content = content ?? [];
    if (authorId) data.authorId = authorId;
    if (blogCategoryId) data.blogCategoryId = blogCategoryId;

    if (formData.has("authorId") && !authorId) data.authorId = null;
    if (formData.has("blogCategoryId") && !blogCategoryId) data.blogCategoryId = null;

    if (Object.keys(data).length === 0) {
      return { success: false, msg: "Nothing to update" };
    }

    const updated = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
        BlogCategory: { select: { id: true, name: true } },
      },
    });

    return {
      success: true,
      msg: "Post updated successfully",
      post: updated,
    };
  } catch (err) {
    console.error("postUpdate error:", err);
    return { success: false, msg: "Failed to update post" };
  }
};

/** ---------- Delete Post ---------- */
export const deletePost = async (id) => {
  try {
    const deleted = await prisma.post.delete({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        BlogCategory: { select: { id: true, name: true } },
      },
    });

    return {
      success: true,
      msg: "Post deleted successfully",
      post: deleted,
    };
  } catch (err) {
    console.error("deletePost error:", err);
    return { success: false, msg: "Failed to delete post" };
  }
};

/** ---------- Get Single Post ---------- */
export const getPostById = async (id) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        BlogCategory: { select: { id: true, name: true } },
      },
    });

    if (!post) return { success: false, msg: "Post not found" };

    return {
      success: true,
      msg: "Post fetched successfully",
      post,
    };
  } catch (err) {
    console.error("getPostById error:", err);
    return { success: false, msg: "Failed to fetch post" };
  }
};
