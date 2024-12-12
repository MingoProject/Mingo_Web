const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function checkRelation(
  stUser: string | undefined,
  ndUser: string | undefined
) {
  try {
    console.log(
      `${BASE_URL}/relation/check-relation?stUser=${stUser}&ndUser=${ndUser}`,
      "URL"
    );
    console.log(stUser, ndUser, "URL Ìnor");
    const response = await fetch(
      `${BASE_URL}/relation/check-relation?stUser=${stUser}&ndUser=${ndUser}`
    );
    if (!response.ok) {
      throw new Error("Error fetching relation");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch relation:", error);
    throw error;
  }
}
