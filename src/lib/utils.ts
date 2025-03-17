import { supabase } from "@/contexts/AuthContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClientData() {
  // @ts-expect-error --  this is preset
  const clientRes = supabase.auth?.storage?.getItem("client");
  // @ts-expect-error --  this is preset
  return clientRes ? JSON.parse(clientRes) : null;
}

export function getAuthUserData() {
  // @ts-expect-error --  this is preset
  const authRes = supabase.auth?.storage?.getItem("user");
  // @ts-expect-error --  this is preset
  return authRes ? JSON.parse(authRes) : null;
}
