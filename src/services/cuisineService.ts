import { supabase } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const fetchCuisineCategories = async () => {
  const { data, error } = await supabase.from("cuisine_category").select("*");
  if (error) {
    console.error("Error fetching cuisine categories:", error);
    toast.error("Failed to fetch cuisine categories.");
    return [];
  }
  return data;
};
