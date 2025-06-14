import { CallCreateDTO, CallResponseDTO } from "@/dtos/CallDTO";

const BASE_URL = "http://localhost:3000/api";

// Đầu tiên, định nghĩa các kiểu dữ liệu (types)

export async function createCall(
  callData: CallCreateDTO
): Promise<CallResponseDTO> {
  try {
    console.log(callData, "callData");
    const response = await fetch(`${BASE_URL}/call/createCall`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create call:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create call"
    );
  }
}
