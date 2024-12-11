import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { createMedia } from "@/lib/services/media.service";
import { createPost } from "@/lib/services/post.service";
import { PostCreateDTO } from "@/dtos/PostDTO";
import { getMyBffs, getMyFriends } from "@/lib/services/user.service";
import { createNotification } from "@/lib/services/notification.service";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  createGroup,
  getListChat,
  getListGroupChat,
} from "@/lib/services/message.service";
import { useChatItemContext } from "@/context/ChatItemContext";

const CreateGroup = ({ onClose, me }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [avatar, setAvatar] = useState("");
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext(); // State lưu trữ các cuộc trò chuyện đã lọc

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const friendsData = await getMyFriends(me._id);
        const bffsData = await getMyBffs(me._id);
        const combinedFriends = [...bffsData, ...friendsData];

        const uniqueFriends = combinedFriends.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f._id === friend._id)
        );

        if (isMounted) {
          setFriends(uniqueFriends);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTagFriend = (friend: any) => {
    setMembers((prev) => {
      if (prev.some((f) => f._id === friend._id)) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    try {
      const groupData = {
        membersIds: [...members.map((friend) => friend._id), me._id],
        leaderId: me._id,
        groupName: newName,
        groupAva: avatar || "",
      };

      const res = await createGroup(groupData);
      console.log(res, "gi ma create hoai");
      if (res) {
        const fetchChats = async () => {
          try {
            const normalChats = await getListChat();
            const groupChats = await getListGroupChat();

            const combinedChats = [...normalChats, ...groupChats];
            setAllChat(combinedChats);
            setFilteredChat(combinedChats);
          } catch (error) {
            console.error("Error loading chats:", error);
          }
        };
        fetchChats();
      }

      if (members && members.length > 0) {
        for (const friend of members) {
          const notificationParams = {
            senderId: me._id,
            receiverId: friend._id,
            type: "tags",
            postId: res._id,
          };

          await createNotification(notificationParams, token);
        }
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      alert("Group created failed!");

      setError(err.message || "Error creating group");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFriendsDropdown = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.getElementById("friendsDropdown")?.classList.toggle("hidden");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="background-light700_dark300 w-1/2 rounded-lg py-6 shadow-md">
          <div className="flex pr-5">
            <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Create Group
            </div>
            <Icon
              icon="ic:round-close"
              className="text-dark100_light500 ml-auto size-8"
              onClick={onClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="mx-6">
            <div className="w-full py-10">
              <input
                type="text"
                placeholder="Group name"
                className="background-light800_dark400 text-dark100_light500  outline-none ml-3 h-[40px] w-full rounded-md pl-3 text-[20px] font-bold"
                value={newName}
                onChange={handleInputChange}
              />
            </div>

            <div className="text-dark100_light500 flex items-center">
              <span className="text-sm text-primary-100">Choose friends</span>
              <div className="relative mb-4 ml-auto">
                <button
                  type="button"
                  className="rounded bg-primary-100 px-4 py-2 text-white"
                  onClick={handleToggleFriendsDropdown}
                >
                  Select Friends
                </button>
                <div
                  id="friendsDropdown"
                  className="absolute right-0 z-10 mt-2 hidden max-h-64 w-64 overflow-y-auto rounded-lg bg-white shadow-lg"
                >
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                      onClick={() => toggleTagFriend(friend)}
                    >
                      <input
                        type="checkbox"
                        checked={members.some((f) => f._id === friend._id)}
                        readOnly
                        className="mr-2"
                      />
                      <Image
                        width={40}
                        height={40}
                        src={friend?.avatar || "/assets/images/capy.jpg"}
                        alt="Avatar"
                        className="mr-2 size-10 rounded-full"
                      />
                      <span className="">
                        {friend.firstName} {friend.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {members.length > 0 && (
              <div className="text-dark100_light500 mt-4">
                <p className="text-sm text-gray-600">Members:</p>
                <div className="flex flex-wrap">
                  {members.map((friend) => (
                    <div
                      key={friend._id}
                      className="m-1 flex items-center rounded-full bg-primary-100 px-3 py-1 text-white"
                    >
                      <Image
                        width={40}
                        height={40}
                        src={friend?.avatar || "/assets/images/capy.jpg"}
                        alt="Avatar"
                        className="mr-2 size-10 rounded-full"
                      />
                      {friend.firstName} {friend.lastName}
                      <button
                        className="ml-2 text-sm"
                        onClick={() => toggleTagFriend(friend)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="mt-10 w-full rounded bg-primary-100 p-2 text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateGroup;
