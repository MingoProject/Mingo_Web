import {
  getCommentsByPostId,
  getAuthorByPostId,
  getMediasByPostId,
} from "@/lib/services/post.service"; // Import các hàm dịch vụ

const fetchDetailedPosts = async (posts) => {
  if (!Array.isArray(posts)) {
    console.error("Invalid posts input. Expected an array.");
    return [];
  }

  const detailedPosts = await Promise.all(
    posts.map(async (post) => {
      try {
        const comments = await getCommentsByPostId(post._id);
        const author = await getAuthorByPostId(post._id);
        const media = await getMediasByPostId(post._id);
        return { ...post, comments, author, media };
      } catch (error) {
        console.error(`Error fetching details for post ${post._id}:`, error);
        return { ...post, comments: [], author: null, media: [] };
      }
    })
  );

  return detailedPosts;
};

export default fetchDetailedPosts;
