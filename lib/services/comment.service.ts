import { CommentResponseDTO } from "@/dtos/CommentDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchPosts(): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/comment/all`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}
