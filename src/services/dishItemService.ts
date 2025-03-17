import { DishItem } from "@/components/DishItemDrawer";
import { supabase } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { authorizeUser } from "./utils";

export const insertDishItem = async (data: DishItem) => {
  const userDetails = authorizeUser();
  if (!userDetails) return;
  const { error } = await supabase
    .from("dish_item")
    .insert([{ ...data, user_id: userDetails?.id }]);
  if (error) {
    console.error("Error inserting dish item:", error);
    toast.error("Failed to insert dish item.");
    throw new Error("Failed to insert dish item");
  }
  toast.success("New dish created successfully.");
};

export const updateDishItem = async (id: string, data: DishItem) => {
  const userDetails = authorizeUser();
  if (!userDetails) return;
  const { error } = await supabase
    .from("dish_item")
    .update({ ...data })
    .eq("id", id)
    .eq("user_id", userDetails?.id);
  if (error) {
    console.error("Error updating dish item:", error);
    toast.error("Failed to update dish item.");
    throw new Error("Failed to update dish item");
  }
  toast.success("Dish updated successfully.");
};

export const fetchDishItems = async (): Promise<DishItem[]> => {
  const userDetails = authorizeUser();
  if (!userDetails) return [];
  const { data, error } = await supabase
    .from("dish_item")
    .select("*")
    .eq("user_id", userDetails?.id);
  if (error) {
    console.error("Error fetching dish items:", error);
    toast.error("Failed to fetch dish items.");
    return [];
  }
  return data;
};

export const deleteDishItem = async (id: string) => {
  const userDetails = authorizeUser();
  if (!userDetails) return;

  const { error } = await supabase
    .from("dish_item")
    .delete()
    .eq("id", id)
    .eq("user_id", userDetails?.id);

  if (error) {
    console.error("Error deleting dish item:", error);
    toast.error("Failed to delete dish item.");
    throw new Error("Failed to delete dish item");
  }
  toast.success("Dish item deleted successfully.");
};
