import { FileItem, isFile } from "@/components/ui/file-upload";
import { supabase } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { updateClientWebsiteId } from "./clientService";
import { optimizeImage, uploadFileToSupabase } from "./fileUploadService";
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
  website_subtitle: string;
  about_us: string;
  description: string;
  website_logo?: File;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  location?: string;
}

// Function to upload the logo and return the URL
const uploadLogo = async (file: File) => {
  const optimizedFile = await optimizeImage(file); // Call your optimization function
  const filePath = `website-icons/${optimizedFile.name}`;

  // Upload the optimized file to Supabase storage
  const { error } = await supabase.storage
    .from("website-builder-images")
    .upload(filePath, optimizedFile);

  if (error) {
    console.error("Error uploading logo:", error);
    throw new Error("Logo upload failed");
  }

  // Get the public URL of the uploaded file
  const images = await supabase.storage
    .from("website-builder-images")
    .getPublicUrl(filePath);

  return images.data.publicUrl;
};

export const createClientWebsite = async (data: CreateClientWebsiteData) => {
  console.log("data", data);
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
    try {
      // Check if website_logo is provided
      let logoUrl;
      if (data.website_logo) {
        // Assuming data.website_logo is a File object
        logoUrl = await uploadLogo(data.website_logo);
      }
      logoUrl =
        logoUrl ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzkXYnylTXs-ouy5nPX4UZMmPgkYfkMS7ZoQ&usqp=CAU";

      const { error, data: resData } = await supabase
        .from("cloud_kitchen_website")
        .insert([
          {
            website_name: data.website_name,
            website_subtitle: data.website_subtitle,
            about_us: data.about_us,
            description: data.description,
            user_id: userDetails.id,
            website_logo: logoUrl,
            website_data: {
              headerSection: {
                title: `Welcome to ${data.website_name} Cloud Kitchen`,
                subtitle: data.website_subtitle,
                description: data.description,
                headerBackground:
                  "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98=",
                companyLogo: logoUrl,
              },
              introSection: {
                introTitle: "ABOUT US",
                introDescription: data.about_us,
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
                location: data.location || "123 Healthy Street, Wellness City",
                instagram:
                  data.social_links?.instagram ||
                  "https://instagram.com/butthicloudkitchen",
                facebook:
                  data.social_links?.facebook ||
                  "https://facebook.com/butthicloudkitchen",
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
    } catch (error) {
      console.error("Error in createClientWebsite:", error);
      throw error;
    }
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
