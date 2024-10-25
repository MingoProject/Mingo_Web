import { useState, useEffect } from "react";
import posts from "../fakeData/PostsData";
import comments from "../fakeData/CommentData";
import media from "../fakeData/MediaData";
import users from "../fakeData/UsersData";

const usePosts = () => {
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    console.log("Posts:", posts);
    console.log("Comments:", comments);
    console.log("Media:", media);
    console.log("Users:", users);

    const fetchPostsData = () => {
      const detailedPosts = posts.map((post) => {
        // Tìm thông tin người dùng tương ứng với author
        const userInfo =
          users.find((user) => user.userId === post.author) || null;

        const postComments = comments.filter(
          (comment) => comment.postId === post.postId
        );

        const postMedia = media.filter((item) => item.postId === post.postId);

        // Lấy thông tin người dùng cho likes
        const likedUsers = post.likes
          .map((userId) => users.find((user) => user.userId === userId))
          .filter(Boolean); // Lọc ra những người dùng không tồn tại

        // Lấy thông tin người dùng cho shares
        const sharedUsers = post.shares
          .map((userId) => users.find((user) => user.userId === userId))
          .filter(Boolean); // Lọc ra những người dùng không tồn tại

        return {
          ...post,
          author: userInfo, // Thay đổi author thành object user
          comments: postComments,
          media: postMedia,
          likes: likedUsers, // Thay đổi likes thành mảng IUser
          shares: sharedUsers, // Thay đổi shares thành mảng IUser
        };
      });

      setPostsData(detailedPosts);
    };

    fetchPostsData();
  }, []);

  // useEffect để theo dõi sự thay đổi của postsData và log ra khi nó được cập nhật
  useEffect(() => {
    console.log("Updated postsData in usePosts:", postsData);
  }, [postsData]); // Mỗi khi postsData thay đổi, sẽ log ra giá trị mới

  return postsData;
};

export default usePosts;
