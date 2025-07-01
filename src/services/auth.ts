import { supabase } from "@/contexts/AuthContext";

export async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.access_token) {
    throw new Error("No access token found. User may not be authenticated.");
  }
  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
} 