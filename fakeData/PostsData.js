const posts = [
  {
    postId: "101",
    author: "1", // Huỳnh
    content: "Hôm nay thật tuyệt vời khi hoàn thành xong dự án của mình!",
    media: ["1"],
    createdAt: new Date(),
    location: "Hồ Chí Minh",
    privacy: "public",
    allowedUsers: [],
    likes: ["2", "3", "5"],
    shares: ["3"],
    comments: ["201", "202"],
  },
  {
    postId: "102",
    author: "2", // Minh
    content: "Một ngày đẹp trời để đi chụp ảnh!",
    media: ["2"],
    createdAt: new Date(),
    location: "Hà Nội",
    privacy: "friends",
    allowedUsers: ["1", "3", "4"],
    likes: ["1", "3"],
    shares: ["4"],
    comments: ["203", "204"],
  },
  {
    postId: "103",
    author: "3", // Anh
    content: "Đang tận hưởng chuyến du lịch tuyệt vời tại Đà Lạt!",
    media: ["3"],
    createdAt: new Date(),
    location: "Đà Lạt",
    privacy: "public",
    allowedUsers: [],
    likes: ["1", "4", "5"],
    shares: ["2"],
    comments: ["205"],
  },
  {
    postId: "104",
    author: "4", // Thảo
    content: "Món ăn này thật sự ngon không thể cưỡng lại!",
    media: ["4"],
    createdAt: new Date(),
    location: "Cần Thơ",
    privacy: "friends",
    allowedUsers: ["1", "3", "5"],
    likes: ["1", "2", "5"],
    shares: [],
    comments: ["206", "207"],
  },
  {
    postId: "105",
    author: "5", // Linh
    content: "Đọc sách mỗi ngày giúp mình thư giãn và mở rộng kiến thức.",
    media: ["5"],
    createdAt: new Date(),
    location: "Bình Dương",
    privacy: "public",
    allowedUsers: [],
    likes: ["3", "4"],
    shares: ["1"],
    comments: ["208"],
  },
  {
    postId: "106",
    author: "6", // Nam
    content: "Buổi tập bóng đá hôm nay thật tuyệt!",
    media: ["6"],
    createdAt: new Date(),
    location: "Hải Phòng",
    privacy: "public",
    allowedUsers: [],
    likes: ["1", "3", "4"],
    shares: ["2"],
    comments: ["209", "210"],
  },
];

export default posts;
