import {
  getAuthorByCommentId,
  getLikesByCommentId,
} from "@/lib/services/comment.service"; // Import các hàm dịch vụ

const fetchDetailedComments = async (comments) => {
  if (!Array.isArray(comments)) {
    console.error("Invalid Comments input. Expected an array.");
    return [];
  }

  const detailedComments = await Promise.all(
    comments.map(async (comment) => {
      try {
        //   const comments = await getCommentsByPostId(post._id);
        const userId = await getAuthorByCommentId(comment._id);
        //   const media = await getMediasByPostId(post._id);
        const likes = await getLikesByCommentId(comment._id);
        return { ...comment, userId, likes };
      } catch (error) {
        console.error(
          `Error fetching details for Comment ${comment._id}:`,
          error
        );
        return { ...comment, author: null, likes: [] };
      }
    })
  );

  return detailedComments;
};

export default fetchDetailedComments;
