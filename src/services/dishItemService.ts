import { DishItem } from "@/components/DishItemDrawer";
import { getAuthHeaders } from "./auth";
import { getBackendApiUrl } from "@/utils/environment";

export const insertDishItem = async (data: DishItem) => {
  await fetch(`${getBackendApiUrl()}/api/dish`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const updateDishItem = async (id: string, data: DishItem) => {
  await fetch(`${getBackendApiUrl()}/api/dish/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const fetchDishItems = async (userId: string): Promise<DishItem[]> => {
  const response = await fetch(`${getBackendApiUrl()}/api/dishes/${userId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) return [];
  return await response.json();
};

export const deleteDishItem = async (id: string, user_id: string) => {
  await fetch(`${getBackendApiUrl()}/api/dish/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ user_id }),
  });
};
