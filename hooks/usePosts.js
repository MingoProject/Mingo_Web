import {
  getAuthorByPostId,
  getMediasByPostId,
  getTagsByPostId,
} from "@/lib/services/post.service";

const fetchDetailedPosts = async (posts) => {
  if (!Array.isArray(posts)) {
    console.error("Invalid posts input. Expected an array.");
    return [];
  }

  const detailedPosts = await Promise.all(
    posts.map(async (post) => {
      try {
        const author = await getAuthorByPostId(post._id);
        const media = await getMediasByPostId(post._id);
        const tags = await getTagsByPostId(post._id);
        return { ...post, author, media, tags };
      } catch (error) {
        console.error(`Error fetching details for post ${post._id}:`, error);
        return {
          ...post,
          author: null,
          media: [],
          tags: [],
        };
      }
    })
  );

  return detailedPosts;
};

export default fetchDetailedPosts;
