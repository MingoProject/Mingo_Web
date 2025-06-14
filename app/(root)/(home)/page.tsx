// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import Image from "next/image";
// import NoResult from "@/components/shared/NoResult";
// import PostsCard from "@/components/cards/post/PostCard";
// import OpenCreatePost from "@/components/shared/post/OpenCreatePost";
// import FilterPost from "@/components/forms/FilterPost";
// import {
//   fetchPosts,
//   fetchRelevantPosts,
//   fetchTrendingPosts,
// } from "@/lib/services/post.service";
// import { PostResponseDTO } from "@/dtos/PostDTO";
// import { useAuth } from "@/context/AuthContext";
// import { UserBasicInfo } from "@/dtos/UserDTO";
// import {
//   getMyBffs,
//   getMyFollowers,
//   getMyFriends,
// } from "@/lib/services/user.service";
// import FriendRequestCard from "@/components/cards/friend/FriendRequestCard";
// import Input from "@/components/ui/input";
// import FriendCard from "@/components/cards/friend/FriendCardHome";
// import { removeVietnameseTones } from "@/lib/utils";
// import { suggestFriends } from "@/lib/services/friend.service";
// import SuggestedFriendCard from "@/components/cards/friend/SuggestedFriendCard";
// import { FriendResponseDTO } from "@/dtos/FriendDTO";

// export default function Home() {
//   const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
//   const [trendingPostsData, settrendingPostsData] = useState<PostResponseDTO[]>(
//     []
//   );
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   const { profile } = useAuth();
//   const [invitations, setInvitations] = useState<FriendResponseDTO[]>([]);
//   // const [chats, setChats] = useState<any[]>([]);
//   const [combinedFriends, setCombinedFriends] = useState<UserBasicInfo[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [suggestedFriends, setSuggestedFriends] = useState<any[]>([]);

//   const profileBasic: UserBasicInfo = {
//     _id: profile?._id,
//     avatar: profile?.avatar,
//     firstName: profile?.firstName,
//     lastName: profile?.lastName,
//   };

//   const observer = useRef<IntersectionObserver | null>(null);
//   const lastPostRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (isLoading) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           loadMorePosts();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [isLoading, hasMore]
//   );
//   const loadMorePosts = async () => {
//     if (isLoading || !hasMore) return;
//     setIsLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const newPosts = await fetchRelevantPosts(token, page, 5); // truyền page, limit

//       if (newPosts.length < 5) {
//         setHasMore(false); // Không còn bài viết nào nữa
//       }

//       setPostsData((prev) => [...prev, ...newPosts]);
//       setPage((prev) => prev + 1);
//     } catch (err) {
//       console.error("Error loading more posts", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;
//     const loadPosts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const data = await fetchRelevantPosts(token);
//         if (isMounted) {
//           setPostsData(data);
//         }
//       } catch (error) {
//         console.error("Error loading posts:", error);
//       }
//     };
//     loadPosts();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     const loadTrendingPosts = async () => {
//       try {
//         const data = await fetchTrendingPosts();
//         if (isMounted) {
//           settrendingPostsData(data);
//         }
//       } catch (error) {
//         console.error("Error loading posts:", error);
//       }
//     };
//     loadTrendingPosts();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     const myFriends = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         const Followers: FriendResponseDTO[] = await getMyFollowers(userId);

//         if (isMounted) {
//           setInvitations(Followers.slice(0, 2)); // lấy 2 người đầu tiên
//         }
//       } catch (error) {
//         console.error("Error loading posts:", error);
//       }
//     };

//     myFriends();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     const loadFriendsAndBffs = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         const [friendsData, bffsData] = await Promise.all([
//           getMyFriends(userId),
//           getMyBffs(userId),
//         ]);

//         const mergedList = [...bffsData, ...friendsData];

//         if (isMounted) {
//           setCombinedFriends(mergedList);
//         }
//       } catch (error) {
//         console.error("Error loading friends and bffs:", error);
//       }
//     };

//     loadFriendsAndBffs();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     const getSuggestFriends = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const results = await suggestFriends(token);
//         if (isMounted) {
//           setSuggestedFriends(results);
//         }
//       } catch (error) {
//         console.error("Error loading friends and bffs:", error);
//       }
//     };

//     getSuggestFriends();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const filteredFriends = combinedFriends.filter((friend) =>
//     removeVietnameseTones(`${friend.firstName} ${friend.lastName}`).includes(
//       removeVietnameseTones(searchTerm)
//     )
//   );

//   // const [selectedFilter, setSelectedFilter] =
//   //   React.useState<string>("Mới nhất");
//   // const [filteredPosts, setFilteredPosts] = useState<PostResponseDTO[]>([]);

//   // useEffect(() => {
//   //   let isMounted = true;
//   //   const sortedPosts = [...postsData];
//   //   if (selectedFilter === "Mới nhất") {
//   //     sortedPosts.sort(
//   //       (a, b) =>
//   //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   //     );
//   //   } else if (selectedFilter === "Cũ nhất") {
//   //     sortedPosts.sort(
//   //       (a, b) =>
//   //         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//   //     );
//   //   } else if (selectedFilter === "Hot nhất") {
//   //     sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
//   //   }
//   //   if (isMounted) {
//   //     setFilteredPosts(sortedPosts);
//   //   }

//   //   return () => {
//   //     isMounted = false;
//   //   };
//   // }, [selectedFilter, postsData]);

//   return (
//     <div className="background-light800_dark400 mt-[20px] flex w-full pt-[70px] justify-between px-[16px]">
//       <div className="background-light800_dark400 hidden w-[25%] lg:block">
//         {profile && (
//           <div className="flex flex-col gap-[25px]">
//             <div className="mt-3 flex items-center gap-3">
//               <Image
//                 src={profile?.avatar || "/assets/images/capy.jpg"}
//                 alt="Avatar"
//                 width={70}
//                 height={70}
//                 className="size-[70px] rounded-full object-cover"
//               />
//               <div className="text-dark100_light100 font-normal">
//                 <span className="text-[32px] block">
//                   Hello {profile.lastName},
//                 </span>
//                 <span className="text-[16px] block">How are you today?</span>
//               </div>
//             </div>
//             <div>
//               <div className="mb-1 flex justify-between">
//                 <span className="font-semibold text-[16px] text-dark100_light100">
//                   Requests
//                 </span>
//                 <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
//                   See all
//                 </span>
//               </div>
//               <div className="flex flex-col gap-3">
//                 {suggestedFriends.length > 0 &&
//                   suggestedFriends.map((suggestedFriend) => (
//                     <SuggestedFriendCard suggestedFriend={suggestedFriend} />
//                   ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="background-light800_dark400 w-[645px] flex flex-col gap-[15px] justify-center px-3 lg:w-[44%]">
//         <OpenCreatePost me={profile} setPostsData={setPostsData} />

//         <div className="background-light800_dark400 flex w-full flex-col gap-[15px]">
//           {/* {PostsCard.length === 0 ? (
//             <NoResult
//               title="No Result"
//               description="No posts found"
//               link="/"
//               linkTitle="Reload"
//             />
//           ) : (
//             [...postsData]
//               .sort(
//                 (a, b) =>
//                   new Date(b.createdAt).getTime() -
//                   new Date(a.createdAt).getTime()
//               )
//               .map((post) => (
//                 <PostsCard
//                   key={post._id}
//                   post={post}
//                   profileBasic={profileBasic}
//                   setPostsData={setPostsData}
//                 />
//               ))
//           )} */}
//           {postsData.length === 0 ? (
//             <NoResult
//               title="No Result"
//               description="No posts found"
//               link="/"
//               linkTitle="Reload"
//             />
//           ) : (
//             postsData.map((post, index) => {
//               const isLast = index === postsData.length - 1;
//               return (
//                 <div ref={isLast ? lastPostRef : null} key={post._id}>
//                   <PostsCard
//                     post={post}
//                     profileBasic={profileBasic}
//                     setPostsData={setPostsData}
//                   />
//                 </div>
//               );
//             })
//           )}
//           {isLoading && (
//             <p className="text-center text-gray-500">Loading more posts...</p>
//           )}
//         </div>
//       </div>

//       <div className="background-light800_dark400 flex-col gap-[25px] hidden items-center justify-center bg-light-600 px-1 md:block md:w-[45%] lg:w-[25%]">
//         <div>
//           <div className="mb-1 flex justify-between">
//             <span className="font-semibold text-[16px] text-dark100_light100">
//               Requests
//             </span>
//             <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
//               See all
//             </span>
//           </div>
//           <div>
//             {invitations.length > 0 &&
//               invitations.map((invitation) => (
//                 <FriendRequestCard
//                   follower={invitation}
//                   profileBasic={profileBasic}
//                 />
//               ))}
//           </div>
//         </div>
//         <div className="mt-[25px]">
//           <div className="mb-1 flex justify-between">
//             <span className="font-semibold text-[16px] text-dark100_light100">
//               Friends
//             </span>
//             <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
//               See all
//             </span>
//           </div>

//           <div className="px-[13px] py-[15px] rounded-[10px] flex flex-col gap-[10px] background-light200_dark200">
//             <div>
//               <Input
//                 iconSrc="iconoir:search"
//                 placeholder="search"
//                 readOnly={false}
//                 cursor="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             {filteredFriends.length > 0 &&
//               filteredFriends.map((friend) => <FriendCard friend={friend} />)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/post/PostCard";
import OpenCreatePost from "@/components/shared/post/OpenCreatePost";
import {
  fetchRelevantPosts,
  fetchTrendingPosts,
} from "@/lib/services/post.service";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { useAuth } from "@/context/AuthContext";
import { UserBasicInfo } from "@/dtos/UserDTO";
import {
  getMyBffs,
  getMyFollowers,
  getMyFriends,
} from "@/lib/services/user.service";
import FriendRequestCard from "@/components/cards/friend/FriendRequestCard";
import Input from "@/components/ui/input";
import FriendCard from "@/components/cards/friend/FriendCardHome";
import { removeVietnameseTones } from "@/lib/utils";
import { suggestFriends } from "@/lib/services/friend.service";
import SuggestedFriendCard from "@/components/cards/friend/SuggestedFriendCard";
import { FriendResponseDTO } from "@/dtos/FriendDTO";

export default function Home() {
  const [postsData, setPostsData] = useState<PostResponseDTO[]>([]);
  const [trendingPostsData, setTrendingPostsData] = useState<PostResponseDTO[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { profile } = useAuth();
  const [invitations, setInvitations] = useState<FriendResponseDTO[]>([]);
  const [combinedFriends, setCombinedFriends] = useState<UserBasicInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestedFriends, setSuggestedFriends] = useState<any[]>([]);

  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const newPosts = await fetchRelevantPosts(token, page, 5);

      if (newPosts.length < 5) {
        setHasMore(false);
      }

      setPostsData((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error loading more posts", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mergedPosts = () => {
    const result = [];
    let trendingIndex = 0;

    for (let i = 0; i < postsData.length; i++) {
      result.push({ ...postsData[i], isTrending: false });

      if ((i + 1) % 4 === 0 && trendingIndex < trendingPostsData.length) {
        result.push({ ...trendingPostsData[trendingIndex], isTrending: true });
        trendingIndex++;
      }
    }

    return result;
  };

  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await fetchRelevantPosts(token);
        if (isMounted) {
          setPostsData(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadTrendingPosts = async () => {
      try {
        const data = await fetchTrendingPosts();
        if (isMounted) {
          setTrendingPostsData(data);
        }
      } catch (error) {
        console.error("Error loading trending posts:", error);
      }
    };
    loadTrendingPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const myFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const Followers: FriendResponseDTO[] = await getMyFollowers(userId);

        if (isMounted) {
          setInvitations(Followers.slice(0, 2));
        }
      } catch (error) {
        console.error("Error loading invitations:", error);
      }
    };

    myFriends();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadFriendsAndBffs = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const [friendsData, bffsData] = await Promise.all([
          getMyFriends(userId),
          getMyBffs(userId),
        ]);

        const mergedList = [...bffsData, ...friendsData];

        if (isMounted) {
          setCombinedFriends(mergedList);
        }
      } catch (error) {
        console.error("Error loading friends and bffs:", error);
      }
    };

    loadFriendsAndBffs();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const getSuggestFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const results = await suggestFriends(token);
        if (isMounted) {
          setSuggestedFriends(results);
        }
      } catch (error) {
        console.error("Error loading suggested friends:", error);
      }
    };

    getSuggestFriends();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFriends = combinedFriends.filter((friend) =>
    removeVietnameseTones(`${friend.firstName} ${friend.lastName}`).includes(
      removeVietnameseTones(searchTerm)
    )
  );

  return (
    <div className="background-light800_dark400 mt-[20px] flex w-full pt-[70px] justify-between px-[16px]">
      <div className="background-light800_dark400 hidden w-[25%] lg:block">
        {profile && (
          <div className="flex flex-col gap-[25px]">
            <div className="mt-3 flex items-center gap-3">
              <Image
                src={profile?.avatar || "/assets/images/capy.jpg"}
                alt="Avatar"
                width={70}
                height={70}
                className="size-[70px] rounded-full object-cover"
              />
              <div className="text-dark100_light100 font-normal">
                <span className="text-[32px] block">
                  Hello {profile.lastName},
                </span>
                <span className="text-[16px] block">How are you today?</span>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="font-semibold text-[16px] text-dark100_light100">
                  Requests
                </span>
                <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
                  See all
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {suggestedFriends.length > 0 &&
                  suggestedFriends.map((suggestedFriend) => (
                    <SuggestedFriendCard suggestedFriend={suggestedFriend} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="background-light800_dark400 w-[645px] flex flex-col gap-[15px] justify-center px-3 lg:w-[44%]">
        <OpenCreatePost me={profile} setPostsData={setPostsData} />

        <div className="background-light800_dark400 flex w-full flex-col gap-[15px]">
          {postsData.length === 0 ? (
            <NoResult
              title="No Result"
              description="No posts found"
              link="/"
              linkTitle="Reload"
            />
          ) : (
            mergedPosts().map((post, index) => {
              const isLast = index === mergedPosts().length - 1;
              return (
                <div ref={isLast ? lastPostRef : null} key={post._id}>
                  <PostsCard
                    post={post}
                    profileBasic={profileBasic}
                    setPostsData={setPostsData}
                    isTrending={post.isTrending}
                  />
                </div>
              );
            })
          )}
          {isLoading && (
            <p className="text-center text-gray-500">Loading more posts...</p>
          )}
        </div>
      </div>

      <div className="background-light800_dark400 flex-col gap-[25px] hidden items-center justify-center bg-light-600 px-1 md:block md:w-[45%] lg:w-[25%]">
        <div>
          <div className="mb-1 flex justify-between">
            <span className="font-semibold text-[16px] text-dark100_light100">
              Requests
            </span>
            <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
              See all
            </span>
          </div>
          <div>
            {invitations.length > 0 &&
              invitations.map((invitation) => (
                <FriendRequestCard
                  follower={invitation}
                  profileBasic={profileBasic}
                />
              ))}
          </div>
        </div>
        <div className="mt-[25px]">
          <div className="mb-1 flex justify-between">
            <span className="font-semibold text-[16px] text-dark100_light100">
              Friends
            </span>
            <span className="font-normal text-[14px] text-primary-100 hover:underline cursor-pointer ">
              See all
            </span>
          </div>

          <div className="px-[13px] py-[15px] rounded-[10px] flex flex-col gap-[10px] background-light200_dark200">
            <div>
              <Input
                iconSrc="iconoir:search"
                placeholder="search"
                readOnly={false}
                cursor="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredFriends.length > 0 &&
              filteredFriends.map((friend) => <FriendCard friend={friend} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
