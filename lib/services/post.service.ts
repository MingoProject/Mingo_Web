import { PostCreateDTO, PostResponseDTO } from "@/dtos/PostDTO";

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

export async function fetchTrendingPosts(): Promise<PostResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/post/get-trending-posts`);
    if (!response.ok) {
      throw new Error("Error fetching trending posts");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch trending posts:", error);
    throw error;
  }
}

export async function fetchRelevantPosts(
  token: string | null,
  page: number = 1,
  limit: number = 5
): Promise<PostResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-relevant-posts?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error fetching posts");
    }

    const data: PostResponseDTO[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function createPost(
  params: PostCreateDTO,
  token: string
): Promise<PostResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/post/create-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data: PostResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function editPost(
  params: PostCreateDTO,
  postId: string,
  token: string
): Promise<PostResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/post/update?postId=${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data: PostResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function likePost(postId: string, token: string) {
  try {
    if (!postId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(`${BASE_URL}/post/like?postId=${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error like post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like post:", error);
    throw error;
  }
}

export async function dislikePost(postId: string, token: string) {
  try {
    if (!postId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(`${BASE_URL}/post/dislike?postId=${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error dislike post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to dislike post:", error);
    throw error;
  }
}

export async function deletePost(postId: string, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/post/delete?postId=${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error;
  }
}

export async function getPostByPostId(postId: String) {
  try {
    const response = await fetch(`${BASE_URL}/post/get-post?postId=${postId}`);
    if (!response.ok) {
      throw new Error("Error fetching post by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch post by postId:", error);
    throw error;
  }
}

export async function savePost(postId: string, token: string) {
  try {
    if (!postId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/post/save-post?postId=${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error save post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to save post:", error);
    throw error;
  }
}

export async function unsavePost(postId: string, token: string) {
  try {
    if (!postId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/post/unsave-post?postId=${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error unsave post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to unsave post:", error);
    throw error;
  }
}
