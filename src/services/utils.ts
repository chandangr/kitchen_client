import { getAuthUserData } from "@/lib/utils";

export function authorizeUser() {
  const userDetails = getAuthUserData();

  if (!userDetails) {
    window.location.href = "/login"; // Navigate to login page
    return false;
  }
  return userDetails;
}
