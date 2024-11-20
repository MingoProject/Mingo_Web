import { MediaCreateDTO, MediaResponseDTO } from "@/dtos/MediaDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// export async function createMedia(
//   params: MediaCreateDTO,
//   token: string
// ): Promise<MediaResponseDTO> {
//   try {
//     const response = await fetch(`${BASE_URL}/media/create-media`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(params),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Error creating media");
//     }

//     const data: MediaResponseDTO = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to create media:", error);
//     throw error;
//   }
// }

export async function createMedia(
  formData: FormData,
  token: string
): Promise<MediaResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/media/create-media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Gửi FormData thay vì JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data: MediaResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}
