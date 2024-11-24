import { UserResponseDTO, UserRegisterDTO, UserLoginDTO } from "@/dtos/UserDTO";

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
