import {
  UserResponseDTO,
  UserRegisterDTO,
  UserLoginDTO,
  UpdateUserBioDTO,
  UpdateUserDTO,
  FindUserDTO,
} from "@/dtos/UserDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchUsers(): Promise<UserResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/user/all`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function register(
  userData: UserRegisterDTO
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error registering user");
    }
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error;
  }
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const response = await fetch(`${BASE_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error change password");
    }
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
}

export async function login(userData: UserLoginDTO) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    console.log("token", data.token);

    localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function getMyProfile(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-profile?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching users");
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function getMyPosts(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-posts?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function getMyFriends(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-friends?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching friends");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    throw error;
  }
}

export async function getMyBffs(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-bffs?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching bffs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bffs:", error);
    throw error;
  }
}

export async function getMyFollowings(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-followings?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching followings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch followings:", error);
    throw error;
  }
}

export async function getMyFollowers(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-followers?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching followers");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    throw error;
  }
}

export async function getMyBlocks(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-blocks?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching blocks");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch blocks:", error);
    throw error;
  }
}

export async function uploadAvatar(formData: any, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error upload avatar");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload avatar", err);
  }
}

export async function uploadBackground(formData: any, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/upload-background`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error upload background");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload background", err);
  }
}

export async function updateUserBio(
  params: UpdateUserBioDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/user/update-bio`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Error update bio");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to update bio", err);
  }
}

export async function updateInfo(params: UpdateUserDTO, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Error update bio");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to update bio", err);
  }
}

export async function getMyImages(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-images?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching images");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    throw error;
  }
}

export async function getMyVideos(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-videos?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching videos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    throw error;
  }
}

export async function updateUserStatus(token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/update-status`, {
      method: "PATCH",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error update status");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to update status", err);
  }
}

export async function getUserById(userId: string): Promise<FindUserDTO> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    console.log(
      `${BASE_URL}/user/get-user-by-id?userId=${userId}`,
      "this is url"
    );
    const response = await fetch(
      `${BASE_URL}/user/get-user-by-id?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm Bearer nếu API yêu cầu
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching user by userId: ${response.status}`);
    }

    const data: { userProfile: UserResponseDTO } = await response.json(); // Lấy toàn bộ đối tượng trả về
    const rawData = data.userProfile; // Truy cập vào userProfile

    console.log(rawData, "this is result");

    // Chuyển đổi dữ liệu từ UserResponseDTO sang FindUserDTO
    const result: FindUserDTO = {
      _id: rawData._id,
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      nickName: rawData.nickName,
      avatar: rawData.avatar,
      relation: rawData.relationShip, // Map trường relation từ relationShip
      status: rawData.flag, // Map trường status từ flag
    };

    return result;
  } catch (error) {
    console.error("Failed to fetch user by userId:", error);
    throw error;
  }
}

export async function getMySavedPosts(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-saved-posts?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function getMyLikedPosts(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-liked-posts?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}
