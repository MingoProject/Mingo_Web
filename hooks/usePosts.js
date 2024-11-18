// import { useState, useEffect } from "react";
// import {
//   fetchPosts,
//   getCommentsByPostId,
//   getAuthorByPostId,
// } from "@/lib/services/post.service"; // Giữ nguyên các import cần thiết

// const usePosts = () => {
//   const [postsData, setPostsData] = useState([]); // Dữ liệu bài viết đã có thông tin chi tiết
//   // const [loading, setLoading] = useState(true);
//   const [posts, setPosts] = useState([]); // Dữ liệu bài viết thô, chưa có bình luận và media

//   useEffect(() => {
//     const loadPosts = async () => {
//       try {
//         const data = await fetchPosts(); // Use async/await for better handling
//         setPosts(data);
//         // console.log("posts", data); // Log the posts data to see it
//         // setLoading(false);
//       } catch (error) {
//         console.error("Error loading posts:", error);
//       }
//     };
//     loadPosts();
//   }, []);

//   useEffect(() => {
//     const fetchPostsData = async () => {
//       const detailedPosts = await Promise.all(
//         posts.map(async (post) => {
//           const comments = await getCommentsByPostId(post._id);
//           const author = await getAuthorByPostId(post._id);
//           return { ...post, comments, author };
//         })
//       );
//       setPostsData(detailedPosts);
//       // setLoading(false);
//       // console.log("Updated postsData:", detailedPosts);
//     };

//     if (posts.length > 0) {
//       fetchPostsData();
//     }
//   }, [posts]);

//   return postsData;
// };

// export default usePosts;

import {
  getCommentsByPostId,
  getAuthorByPostId,
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
        return { ...post, comments, author };
      } catch (error) {
        console.error(`Error fetching details for post ${post._id}:`, error);
        return { ...post, comments: [], author: null }; // Xử lý lỗi bằng cách trả về dữ liệu mặc định
      }
    })
  );

  return detailedPosts;
};

export default fetchDetailedPosts;
