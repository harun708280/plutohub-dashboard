"use server";

import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";
import { signIn, signOut, auth } from "@/auth";
import { revalidatePath } from "next/cache";

/** ---------- Register ---------- */
export const registerUser = async (_prevState, formData) => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      return { success: false, msg: "Required fields are missing" };
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return { success: false, msg: "User already exists" };
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
      select: { id: true, name: true },
    });

    return { success: true, msg: `${created.name} Welcome` };
  } catch (err) {
    console.error("registerUser error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};

/** ---------- Login ---------- */
// export const loginUser = async (_prevState, formData) => {
//   try {
//     const email = formData.get("email");
//     const password = formData.get("password");

//     if (!email || !password) {
//       return { success: false, msg: "Email and password are required" };
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: { id: true, email: true, password: true },
//     });

//     if (!user) {
//       return { success: false, msg: "User doesnt exist, Please Register." };
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return { success: false, msg: "Password didnt match" };
//     }

//     await signIn("credentials", {
//       redirectTo: "/dashboard",
//       email,
//       password,
//     });

//     return { success: true, msg: "Logged in" };
//   } catch (err) {
//     const message =
//       typeof err?.message === "string" ? err.message : "Login failed";
//     console.error("loginUser error:", err);
//     return { success: false, msg: message };
//   }
// };
export const loginUser = async (_prevState, formData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { success: false, msg: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      return { success: false, msg: "User doesn't exist. Please Register." };
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return { success: false, msg: "Password didn't match" };
    }

    
    return { success: true, msg: "Login successful", userId: user.id };
  } catch (err) {
    console.error("loginUser error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};
/** ---------- Logout ---------- */
export const logOut = async () => {
  try {
    await signOut();
  } catch (err) {
    console.error("logOut error:", err);
  }
};

/** ---------- List Users ---------- */
export const userList = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true, // remove if not in schema
      },
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (err) {
    console.error("userList error:", err);
    return [];
  }
};

/** ---------- Get User Profile ---------- */
// export const getUserProfile = async () => {
//   try {
//     const session = await auth();
//     const email = session?.user?.email;
//     if (!email) return { user: null };

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//       },
//     });

//     return { user };
//   } catch (err) {
//     console.error("getUserProfile error:", err);
//     return { user: null };
//   }
// };
