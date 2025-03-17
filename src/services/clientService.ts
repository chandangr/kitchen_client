import { SignupFormData } from "@/components/AuthTabs";
import { supabase } from "@/contexts/AuthContext";
import { Session } from "@supabase/supabase-js";
import console from "console";
import { toast } from "sonner";
import { authorizeUser } from "./utils";
export async function createClientAfterSignUp(
  clientData: SignupFormData,
  session?: Session
) {
  const { data, error } = await supabase
    .from("client")
    .insert([
      {
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
      },
    ])
    .select();

  if (error) {
    console.error("Error creating client:", error);
    toast.error("Failed to create client.");
    throw new Error(error.message);
  }

  toast.success("Client created successfully.");
  return data;
}

export const updateClientWebsiteId = async (cloudKitchenId: string) => {
  const userDetails = authorizeUser();
  if (!userDetails) return;
  const { error } = await supabase
    .from("client")
    .update({ cloud_kitchen_website_id: cloudKitchenId, is_first_time: false })
    .eq("user_id", userDetails?.id);

  if (error) {
    console.error("Error updating client:", error);
    toast.error("Failed to update client.");
    throw new Error(error.message);
  }
  toast.success("Client updated successfully.");
};

export const insertClientData = async (data: SignupFormData) => {
  const { error } = await supabase
    .from("client")
    .insert([
      {
        ...data,
        dob: "234234",
        cloud_kitchen_website_id: null,
      },
    ])
    .select();

  if (error) {
    toast.error("Failed to insert client data.");
    return error;
  }
  toast.success("Client data inserted successfully.");
};

export const updateClient = async (clientData: Partial<SignupFormData>) => {
  const userDetails = authorizeUser();
  if (!userDetails) return;

  const { error, data } = await supabase
    .from("client")
    .update(clientData)
    .eq("user_id", userDetails.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating client:", error);
    toast.error("Failed to update client.");
    throw new Error(error.message);
  }
  // @ts-expect-error --  this is preset
  supabase.auth?.storage?.setItem("client", JSON.stringify(data));
  toast.success("Client updated successfully.");
};
