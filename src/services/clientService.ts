import { SignupFormData } from "@/components/AuthTabs";
import { Session } from "@supabase/supabase-js";
import { getAuthHeaders } from "./auth";
import { getBackendApiUrl } from "@/utils/environment";

export async function createClientAfterSignUp(clientData: SignupFormData, session: Session) {
  const response = await fetch(`${getBackendApiUrl()}/api/client`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({
      name: clientData.name,
      email: clientData.email,
      age: clientData?.age,
      nationality: clientData?.nationality,
      phone_number: clientData.phone_number,
      gender: clientData?.gender,
      marital_status: clientData?.marital_status,
      dob: clientData.dob,
      user_id: session?.user?.id,
      cloud_kitchen_website_id: null,
    }),
  });
  return response.ok ? await response.json() : null;
}

export const updateClientWebsiteId = async (cloudKitchenId: string, user_id: string) => {
  await fetch(`${getBackendApiUrl()}/api/client/website`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ user_id, cloud_kitchen_website_id: cloudKitchenId }),
  });
};

export const insertClientData = async (data: unknown) => {
  await fetch(`${getBackendApiUrl()}/api/client/insert`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const updateClient = async (clientData: unknown) => {
  await fetch(`${getBackendApiUrl()}/api/client`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(clientData),
  });
};

export const getClientByUserId = async (user_id: string) => {
  const response = await fetch(`${getBackendApiUrl()}/api/client/${user_id}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch client data');
  }
  return await response.json();
};
