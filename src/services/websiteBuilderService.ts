import { FileItem, isFile } from "@/components/ui/file-upload";
import { supabase } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { updateClientWebsiteId } from "./clientService";
import { uploadFileToSupabase } from "./fileUploadService";
import { UploadFileResponse, WebsiteData } from "./types";
import { authorizeUser } from "./utils";

interface WebsiteBuilderData {
  user_id: string;
  headerSection: {
    title: string;
    subtitle: string;
    description: string;
    headerBackground: string;
    companyLogo: string;
    titleColor: string;
    subtitleColor: string;
    descriptionColor: string;
  };
  introSection: {
    introTitle: string;
    introDescription: string;
    introMedia: string;
    introTitleColor: string;
    introDescriptionColor: string;
  };
  introMediaSection: {
    introImage: string;
  };
  featuredMenuSection: {
    featuredTitle: string;
    featuredDescription: string;
    featuredImage: string;
    featuredTitleColor: string;
    featuredDescriptionColor: string;
  };
  footerSection: {
    location: string;
    instagram: string;
    facebook: string;
  };
}

interface CreateClientWebsiteData {
  website_name: string;
  description: string;
  website_logo?: string;
}

export const createClientWebsite = async (data: CreateClientWebsiteData) => {
  const userDetails = authorizeUser();
  if (!userDetails) return;

  // Check if the user_id already exists in the cloud_kitchen_website table
  const { data: existingWebsite } = await supabase
    .from("cloud_kitchen_website")
    .select("user_id")
    .eq("user_id", userDetails.id)
    .single();

  // Only insert if user_id does not exist
  if (!existingWebsite) {
    const { error, data: resData } = await supabase
      .from("cloud_kitchen_website")
      .insert([
        {
          website_name: data.website_name,
          description: data.description,
          user_id: userDetails.id,
          // website_logo: data.website_logo,
          website_data: {
            headerSection: {
              title: "Welcome to Butthi Cloud Kitchen",
              subtitle: "Delicious, Healthy, and Convenient",
              description:
                "Experience the best in healthy and convenient eating with Butthi Cloud Kitchen. Our mission is to provide nutritious, delicious meals that fit your lifestyle.",
              headerBackground:
                "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98=",
              companyLogo:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzkXYnylTXs-ouy5nPX4UZMmPgkYfkMS7ZoQ&usqp=CAU",
            },
            introSection: {
              introTitle: "ABOUT US",
              introDescription:
                "Butthi Cloud Kitchen is dedicated to making healthy eating easy and enjoyable. Our meals are crafted with fresh, high-quality ingredients to ensure you get the best nutrition without compromising on taste. Whether you are looking for a quick lunch or a hearty dinner, we have something for everyone.",
              introMedia:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
            },
            introMediaSection: {
              introImage:
                "https://www.livofy.com/health/wp-content/uploads/2023/05/Add-a-heading-6.png",
            },
            featuredMenuSection: {
              featuredTitle: "OUR MENU",
              featuredDescription:
                "Discover our range of healthy and delicious meals, designed to satisfy your cravings and keep you energized throughout the day.",
              featuredImage:
                "https://img.freepik.com/free-vector/burgers-restaurant-menu-template_23-2149005028.jpg",
            },
            footerSection: {
              location: "123 Healthy Street, Wellness City",
              instagram: "https://instagram.com/butthicloudkitchen",
              facebook: "https://facebook.com/butthicloudkitchen",
            },
          },
        },
      ])
      .select();

    if (error) {
      toast.error("Failed to create client website.");
      return;
    }
    await updateClientWebsiteId(resData?.[0].id);
    toast.success("Client website created successfully.");
  }
};

export const getClientKitchenWebsiteData = async (id: string) => {
  const { data, error } = await supabase
    .from("cloud_kitchen_website")
    .select("*")
    .eq("user_id", id)
    .single();

  if (error) {
    toast.error("Failed to fetch kitchen website data.");
    throw new Error(error.message);
  }

  return data;
};

export async function saveWebsiteData(
  data: WebsiteBuilderData
): Promise<WebsiteBuilderData> {
  try {
    // Extract user_id from the data
    const userId = data.user_id;

    // Create the website_data object with the new structure
    const websiteData = {
      headerSection: data.headerSection,
      introSection: data.introSection,
      introMediaSection: data.introMediaSection,
      featuredMenuSection: data.featuredMenuSection,
      footerSection: data.footerSection,
    };

    // Update only the website_data column for the specific user_id
    const { data: savedData, error } = await supabase
      .from("cloud_kitchen_website")
      .update({ website_data: websiteData })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return savedData as WebsiteBuilderData;
  } catch (error) {
    console.error("Error saving website data:", error);
    throw error;
  }
}

export async function getWebsiteDataByUserId(
  userId: string
): Promise<WebsiteData | null> {
  try {
    const { data, error } = await supabase
      .from("cloud_kitchen_website")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found
        return null;
      }
      throw error;
    }

    return data as WebsiteData;
  } catch (error) {
    console.error("Error fetching website data:", error);
    throw error;
  }
}

export async function uploadMultipleFiles(
  files: FileItem[]
): Promise<UploadFileResponse[]> {
  try {
    const uploadPromises = files.map((file, index) => {
      if (isFile(file)) {
        return uploadFileToSupabase(
          file,
          "website-builder-images",
          "website-images"
        );
      }
      // If it's already a URL, return a mock response
      return Promise.resolve({
        path: `file-${index + 1}`,
        url: file,
      });
    });

    const results = await Promise.all(uploadPromises);

    // Filter out null values and ensure type safety
    return results.filter(
      (result): result is UploadFileResponse => result !== null
    );
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
}

export const getWebsiteBuilderData = async (
  userId: string
): Promise<WebsiteBuilderData | null> => {
  try {
    const { data, error } = await supabase
      .from("cloud_kitchen_website")
      .select("website_data")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching website builder data:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      user_id: userId,
      ...data.website_data,
    } as WebsiteBuilderData;
  } catch (error) {
    console.error("Error in getWebsiteBuilderData:", error);
    return null;
  }
};
