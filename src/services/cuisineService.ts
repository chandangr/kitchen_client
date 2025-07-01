import { getAuthHeaders } from "./auth";
import { getBackendApiUrl } from "@/utils/environment";

// export const fetchCuisineCategories = async () => {
//   const { data, error } = await supabase.from("cuisine_category").select("*");
//   if (error) {
//     console.error("Error fetching cuisine categories:", error);
//     toast.error("Failed to fetch cuisine categories.");
//     return [];
//   }
//   return data;
// };

export const fetchCuisineCategories = async () => {
  const response = await fetch(`${getBackendApiUrl()}/api/cuisines`, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) return [];
  return await response.json();
};
