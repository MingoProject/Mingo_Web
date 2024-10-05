"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function getUserById(params: any) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
  phone: string;
  birthday: string;
  gender: boolean;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
  phone,
  birthday,
  gender,
}: Params): Promise<void> {
  connectToDatabase();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        phone,
        birthday,
        gender,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`failed to create/update user:${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: "community",
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user:${error.message}`);
  }
}
