import {
  acceptAddBff,
  acceptAddFriend,
  block,
  requestAddBFF,
  requestAddFriend,
  unBFF,
  unblock,
  unfollowOrRefuseFriendRequest,
  unfriend,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/services/friend.service";
import {
  createNotification,
  deleteNotification,
  getNotification,
} from "@/lib/services/notification.service";
import React from "react";

const RelationModal = ({ relation, onClose, id, setRelation }: any) => {
  const handleRelationAction = async (action: string) => {
    try {
      console.log(`Action: ${action}`);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }
      const userId = localStorage.getItem("userId");
      const params = {
        sender: userId,
        receiver: id,
      };

      switch (action) {
        case "addFriend":
          await requestAddFriend(params, token);
          setRelation("following");
          onClose();
          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "friend_request",
            },
            token
          );
          break;
        case "unfriend":
          await unfriend(params, token);
          setRelation("stranger");
          onClose();
          break;
        case "block":
          await block(params, token);
          setRelation("blocked");
          onClose();
          break;
        case "unBlock":
          await unblock(params, token);
          setRelation("stranger");
          onClose();
          break;
        case "addBFF":
          await requestAddBFF(params, token);
          setRelation("senderRequestBff");
          onClose();
          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "bff_request",
            },
            token
          );
          break;
        case "unBFF":
          await unBFF(params, token);
          setRelation("friend");
          onClose();
          break;
        case "unRequestBff":
          // Cancel the sent BFF request
          await unrequestBffOrRefuseBffRequest(
            {
              sender: userId,
              receiver: id,
            },
            token
          );
          setRelation("friend");
          onClose();
          try {
            const notification = await getNotification(
              userId,
              id,
              "bff_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "refuseRequestBff":
          await unrequestBffOrRefuseBffRequest(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("friend");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "bff_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "unfollow":
          await unfollowOrRefuseFriendRequest(
            {
              sender: userId,
              receiver: id,
            },
            token
          );
          setRelation("stranger");
          onClose();
          try {
            const notification = await getNotification(
              userId,
              id,
              "friend_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "refuseRequestFriend":
          // Refuse a friend request
          await unfollowOrRefuseFriendRequest(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("stranger");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "friend_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          break;
        case "acceptRequestFriend":
          await acceptAddFriend(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("friend");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "friend_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "friend_accept",
            },
            token
          );
          break;
        case "acceptRequestBff":
          await acceptAddBff(
            {
              sender: id,
              receiver: userId,
            },
            token
          );
          setRelation("bff");
          onClose();
          try {
            const notification = await getNotification(
              id,
              userId,
              "bff_request"
            );
            await deleteNotification(notification._id, token);
          } catch (error) {
            console.error("Error fetching notification:", error);
          }

          await createNotification(
            {
              senderId: userId,
              receiverId: id,
              type: "bff_accept",
            },
            token
          );
          break;
        default:
          break;
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  const renderOptions = () => {
    switch (relation) {
      case "stranger":
        return (
          <>
            <button onClick={() => handleRelationAction("addFriend")}>
              Add Friend
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      case "following":
        return (
          <>
            <button onClick={() => handleRelationAction("unfollow")}>
              Unfollow
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      case "friend":
        return (
          <>
            <button onClick={() => handleRelationAction("unfriend")}>
              Unfriend
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("addBFF")}>
              Add Best Friend
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      case "bff":
        return (
          <>
            <button onClick={() => handleRelationAction("unBFF")}>
              Remove Best Friend
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      case "blocked":
        return (
          <button onClick={() => handleRelationAction("unBlock")}>
            Unblock
          </button>
        );
      case "senderRequestBff":
        return (
          <>
            <button onClick={() => handleRelationAction("unRequestBff")}>
              Cancel Best Friend Request
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      case "receiverRequestBff":
        return (
          <>
            <button onClick={() => handleRelationAction("refuseRequestBff")}>
              Refuse Best Friend Request
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("acceptRequestBff")}>
              Accept Best Friend Request
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      case "follower":
        return (
          <>
            <button onClick={() => handleRelationAction("refuseRequestFriend")}>
              Refuse Friend Request
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("acceptRequestFriend")}>
              Accept Friend Request
            </button>
            <hr></hr>
            <button onClick={() => handleRelationAction("block")}>Block</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-dark100_light500 background-light700_dark300 w-[300px] rounded-md  p-5 shadow-md">
        <h2 className="text-lg font-semibold">Relationship options</h2>
        <div className="mt-4 space-y-2">{renderOptions()}</div>
        <button onClick={onClose} className="mt-4 text-blue-500">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default RelationModal;
