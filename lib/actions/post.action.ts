"use server";

import Post from "@/database/post.model";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPost({ text, author, communityId, path }: Params) {
  try {
    await connectToDatabase();

    const createPost = await Post.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { posts: createPost._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating post:${error.message}`);
  }
}
