const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createMedia(file: File, caption: string, token: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    const response = await fetch(`${BASE_URL}/media/create-media`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Upload error:", error.message);
    throw error;
  }
}
