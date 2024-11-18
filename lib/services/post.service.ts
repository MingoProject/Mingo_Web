import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { UserResponseDTO } from "@/dtos/UserDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchPosts(): Promise<PostResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/post/all`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function getCommentsByPostId(
  postId: String
): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-comments?postId=${postId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching comments by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch comments by postId:", error);
    throw error;
  }
}

export async function getAuthorByPostId(
  postId: String
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-author?postId=${postId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching author by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch author by postId:", error);
    throw error;
  }
}
