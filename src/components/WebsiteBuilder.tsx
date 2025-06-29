import MenuBoard from "@/components/MenuBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileInput,
  FileItem,
  FileUploader,
  isFile,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  getWebsiteBuilderData,
  saveWebsiteData,
  uploadMultipleFiles,
} from "@/services/websiteBuilderService";
import { getWebsiteUrl } from "@/utils/environment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { HeroBackgroundSection } from "./HeroBackgroundSection";
import { ThreeDCard } from "./ThreeDCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useSidebar } from "./ui/sidebar";

const formSchema = z.object({
  headerSection: z.object({
    title: z.string().nonempty("Title is required"),
    subtitle: z.string().nonempty("Subtitle is required"),
    description: z.string().nonempty("Description is required"),
    headerBackground: z
      .union([z.instanceof(File), z.string()])
      .refine((val) => val !== "", "Header background is required"),
    companyLogo: z
      .union([z.instanceof(File), z.string()])
      .refine((val) => val !== "", "Company logo is required"),
    titleColor: z.string().nonempty("Title color is required"),
    subtitleColor: z.string().nonempty("Subtitle color is required"),
    descriptionColor: z.string().nonempty("Description color is required"),
  }),
  introSection: z.object({
    introTitle: z.string().nonempty("Intro title is required"),
    introDescription: z.string().nonempty("Intro description is required"),
    introMedia: z
      .union([z.instanceof(File), z.string()])
      .refine((val) => val !== "", "Intro media is required"),
    introTitleColor: z.string().nonempty("Intro title color is required"),
    introDescriptionColor: z
      .string()
      .nonempty("Intro description color is required"),
  }),
  introMediaSection: z.object({
    introImage: z
      .union([z.instanceof(File), z.string()])
      .refine((val) => val !== "", "Intro image is required"),
  }),
  featuredMenuSection: z.object({
    featuredTitle: z.string().nonempty("Featured title is required"),
    featuredDescription: z
      .string()
      .nonempty("Featured description is required"),
    featuredImage: z
      .union([z.instanceof(File), z.string()])
      .refine((val) => val !== "", "Featured image is required"),
    featuredTitleColor: z.string().nonempty("Featured title color is required"),
    featuredDescriptionColor: z
      .string()
      .nonempty("Featured description color is required"),
  }),
  footerSection: z.object({
    location: z.string().nonempty("Location is required"),
    instagram: z.string().nonempty("Instagram is required"),
    facebook: z.string().nonempty("Facebook is required"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface WebsiteBuilderProps {
  headerSection: {
    title: string;
    subtitle: string;
    description: string;
    headerBackground: string;
    companyLogo: string;
  };
  introSection: {
    introTitle: string;
    introDescription: string;
    introMedia: string;
  };
  introMediaSection: {
    introImage: string;
  };
  featuredMenuSection: {
    featuredTitle: string;
    featuredDescription: string;
    featuredImage: string;
  };
  footerSection: {
    location: string;
    instagram: string;
    facebook: string;
  };
}

const WebsiteBuilder = (props: WebsiteBuilderProps) => {
  const {
    headerSection,
    introSection,
    introMediaSection,
    featuredMenuSection,
    footerSection,
  } = props;

  const data = useAuth();
  const { toggleSidebar } = useSidebar();
  const authUser = data.authUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headerSection: {
        ...headerSection,
        titleColor: "#000000",
        subtitleColor: "#000000",
        descriptionColor: "#000000",
      },
      introSection: {
        ...introSection,
        introTitleColor: "#000000",
        introDescriptionColor: "#000000",
      },
      introMediaSection,
      featuredMenuSection: {
        ...featuredMenuSection,
        featuredTitleColor: "#000000",
        featuredDescriptionColor: "#000000",
      },
      footerSection: footerSection,
    },
  });

  const [state, setState] = useState({
    isPreview: false,
  });

  useEffect(() => {
    const fetchWebsiteData = async () => {
      if (authUser?.id) {
        try {
          const websiteData = await getWebsiteBuilderData(authUser.id);
          if (websiteData) {
            form.reset({
              headerSection: {
                ...websiteData.headerSection,
                titleColor: websiteData.headerSection.titleColor || "#000000",
                subtitleColor:
                  websiteData.headerSection.subtitleColor || "#000000",
                descriptionColor:
                  websiteData.headerSection.descriptionColor || "#000000",
              },
              introSection: {
                ...websiteData.introSection,
                introTitleColor:
                  websiteData.introSection.introTitleColor || "#000000",
                introDescriptionColor:
                  websiteData.introSection.introDescriptionColor || "#000000",
              },
              introMediaSection: websiteData.introMediaSection,
              featuredMenuSection: {
                ...websiteData.featuredMenuSection,
                featuredTitleColor:
                  websiteData.featuredMenuSection.featuredTitleColor ||
                  "#000000",
                featuredDescriptionColor:
                  websiteData.featuredMenuSection.featuredDescriptionColor ||
                  "#000000",
              },
              footerSection: websiteData.footerSection,
            });
          }
        } catch (error) {
          console.error("Error fetching website data:", error);
          toast.error("Failed to load website data");
        }
      }
    };

    fetchWebsiteData();
  }, []);

  const togglePreview = () => {
    toggleSidebar();
    setState((prevState) => ({
      ...prevState,
      isPreview: !prevState.isPreview,
    }));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Collect all files that need to be uploaded
      const filesToUpload: FileItem[] = [];
      const fileMapping: { [key: string]: number } = {};

      // Add header files
      const companyLogo = values.headerSection.companyLogo;
      const headerBackground = values.headerSection.headerBackground;

      if (companyLogo && isFile(companyLogo)) {
        filesToUpload.push(companyLogo);
        fileMapping["companyLogo"] = filesToUpload.length - 1;
      }
      if (headerBackground && isFile(headerBackground)) {
        filesToUpload.push(headerBackground);
        fileMapping["headerBackground"] = filesToUpload.length - 1;
      }

      // Add intro files
      const introMedia = values.introSection.introMedia;
      if (introMedia && isFile(introMedia)) {
        filesToUpload.push(introMedia);
        fileMapping["introMedia"] = filesToUpload.length - 1;
      }

      // Add intro media section files
      const introImage = values.introMediaSection.introImage;
      if (introImage && isFile(introImage)) {
        filesToUpload.push(introImage);
        fileMapping["introImage"] = filesToUpload.length - 1;
      }

      // Add featured files
      const featuredImage = values.featuredMenuSection.featuredImage;
      if (featuredImage && isFile(featuredImage)) {
        filesToUpload.push(featuredImage);
        fileMapping["featuredImage"] = filesToUpload.length - 1;
      }

      // Upload all files to Supabase
      const uploadedFiles = await uploadMultipleFiles(filesToUpload);
      if (!uploadedFiles) return;

      // Update the form values with the new URLs
      const updatedValues = {
        ...values,
        headerSection: {
          ...values.headerSection,
          companyLogo: isFile(companyLogo)
            ? uploadedFiles[fileMapping["companyLogo"]]?.url
            : companyLogo,
          headerBackground: isFile(headerBackground)
            ? uploadedFiles[fileMapping["headerBackground"]]?.url
            : headerBackground,
        },
        introSection: {
          ...values.introSection,
          introMedia: isFile(introMedia)
            ? uploadedFiles[fileMapping["introMedia"]]?.url
            : introMedia,
        },
        introMediaSection: {
          ...values.introMediaSection,
          introImage: isFile(introImage)
            ? uploadedFiles[fileMapping["introImage"]]?.url
            : introImage,
        },
        featuredMenuSection: {
          ...values.featuredMenuSection,
          featuredImage: isFile(featuredImage)
            ? uploadedFiles[fileMapping["featuredImage"]]?.url
            : featuredImage,
        },
      };

      if (authUser) {
        // Save the website data to Supabase
        const websiteData = {
          user_id: authUser?.id,
          ...updatedValues,
        };
        await saveWebsiteData(websiteData);
      }

      toast.success("Your website has been saved successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error saving your website. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-2 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Website Builder</h1>
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={togglePreview}>
            {state.isPreview ? "Exit Preview" : "Preview"}
          </Button>
          <Button className="ml-2" onClick={form.handleSubmit(onSubmit)}>
            Save & publish
          </Button>
          {authUser?.id && (
            <Button 
              className="ml-2" 
              onClick={() => window.open(getWebsiteUrl(authUser.id), '_blank')}
            >
              View Website
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        {!state.isPreview && (
          <div className="w-full md:w-1/3 p-4 h-auto">
            <Form {...form}>
              <form className="space-y-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="header">
                    <AccordionTrigger>Header</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent>
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold">Visuals</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="headerSection.companyLogo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company logo</FormLabel>
                                    <FormControl>
                                      <FileUploader
                                        value={field.value ? [field.value] : []}
                                        onValueChange={(
                                          files: FileItem[] | null
                                        ) => {
                                          field.onChange(files?.[0] || "");
                                        }}
                                        dropzoneOptions={{
                                          accept: {
                                            "image/*": [
                                              ".png",
                                              ".jpg",
                                              ".jpeg",
                                              ".gif",
                                            ],
                                          },
                                          maxFiles: 1,
                                          maxSize: 5 * 1024 * 1024,
                                          multiple: false,
                                        }}
                                        showPreview
                                      >
                                        <FileInput className="border-2 border-dashed p-4 text-center">
                                          <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                              Drag & drop or click to upload
                                            </p>
                                            <p className="text-xs text-gray-400">
                                              Supports: PNG, JPG, GIF (max 5MB)
                                            </p>
                                          </div>
                                        </FileInput>
                                      </FileUploader>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="headerSection.headerBackground"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Header background</FormLabel>
                                    <FormControl>
                                      <FileUploader
                                        value={field.value ? [field.value] : []}
                                        onValueChange={(
                                          files: FileItem[] | null
                                        ) => {
                                          field.onChange(files?.[0] || "");
                                        }}
                                        dropzoneOptions={{
                                          accept: {
                                            "image/*": [
                                              ".png",
                                              ".jpg",
                                              ".jpeg",
                                              ".gif",
                                            ],
                                            "video/*": [".mp4", ".webm"],
                                          },
                                          maxFiles: 1,
                                          maxSize: 5 * 1024 * 1024,
                                          multiple: false,
                                        }}
                                        showPreview
                                      >
                                        <FileInput className="border-2 border-dashed p-4 text-center">
                                          <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                              Drag & drop or click to upload
                                            </p>
                                            <p className="text-xs text-gray-400">
                                              Supports: PNG, JPG, GIF, MP4, WEBM
                                              (max 5MB)
                                            </p>
                                          </div>
                                        </FileInput>
                                      </FileUploader>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <h3 className="text-lg font-semibold mt-4">Text</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="headerSection.subtitle"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subtitle</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="headerSection.title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="headerSection.description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold">
                                Appearance settings
                              </h3>
                              <div className="flex gap-4">
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="headerSection.titleColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="headerSection.subtitleColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Subtitle Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="headerSection.descriptionColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="intro">
                    <AccordionTrigger>Introduction</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent>
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold mt-4">Text</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="introSection.introTitle"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="introSection.introDescription"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <h3 className="text-lg font-semibold">Visuals</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="introSection.introMedia"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Intro media</FormLabel>
                                    <FormControl>
                                      <FileUploader
                                        value={field.value ? [field.value] : []}
                                        onValueChange={(
                                          files: FileItem[] | null
                                        ) => {
                                          field.onChange(files?.[0] || "");
                                        }}
                                        dropzoneOptions={{
                                          accept: {
                                            "image/*": [
                                              ".png",
                                              ".jpg",
                                              ".jpeg",
                                              ".gif",
                                            ],
                                            "video/*": [".mp4", ".webm"],
                                          },
                                          maxFiles: 1,
                                          maxSize: 5 * 1024 * 1024,
                                          multiple: false,
                                        }}
                                        showPreview
                                      >
                                        <FileInput className="border-2 border-dashed p-4 text-center">
                                          <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                              Drag & drop or click to upload
                                            </p>
                                            <p className="text-xs text-gray-400">
                                              Supports: PNG, JPG, GIF, MP4, WEBM
                                              (max 5MB)
                                            </p>
                                          </div>
                                        </FileInput>
                                      </FileUploader>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold">
                                Appearance settings
                              </h3>
                              <div className="flex gap-4">
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="introSection.introTitleColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="introSection.introDescriptionColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="introImage">
                    <AccordionTrigger>Introduction Image</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent>
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold">Visuals</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="introMediaSection.introImage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Intro image</FormLabel>
                                    <FormControl>
                                      <FileUploader
                                        value={field.value ? [field.value] : []}
                                        onValueChange={(
                                          files: FileItem[] | null
                                        ) => {
                                          field.onChange(files?.[0] || "");
                                        }}
                                        dropzoneOptions={{
                                          accept: {
                                            "image/*": [
                                              ".png",
                                              ".jpg",
                                              ".jpeg",
                                              ".gif",
                                            ],
                                          },
                                          maxFiles: 1,
                                          maxSize: 5 * 1024 * 1024,
                                          multiple: false,
                                        }}
                                        showPreview
                                      >
                                        <FileInput className="border-2 border-dashed p-4 text-center">
                                          <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                              Drag & drop or click to upload
                                            </p>
                                            <p className="text-xs text-gray-400">
                                              Supports: PNG, JPG, GIF (max 5MB)
                                            </p>
                                          </div>
                                        </FileInput>
                                      </FileUploader>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="featuredMenu">
                    <AccordionTrigger>Featured Menu</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent>
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold mt-4">Text</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="featuredMenuSection.featuredTitle"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="featuredMenuSection.featuredDescription"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold">
                                Appearance settings
                              </h3>
                              <div className="flex gap-4">
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="featuredMenuSection.featuredTitleColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="mt-2">
                                  <FormField
                                    control={form.control}
                                    name="featuredMenuSection.featuredDescriptionColor"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description Color</FormLabel>
                                        <FormControl>
                                          <input type="color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="footer">
                    <AccordionTrigger>Footer</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent>
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold mt-4">Text</h3>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="footerSection.location"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="footerSection.instagram"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Instagram</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="mt-2">
                              <FormField
                                control={form.control}
                                name="footerSection.facebook"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Facebook</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          </div>
        )}
        <div
          className={`h-full ${
            state.isPreview ? "w-full p-4" : "w-full md:w-2/3 p-4"
          }`}
        >
          <div
            className={`relative p-4 bg-white rounded ${
              state.isPreview ? "h-screen" : "h-[70vh]"
            }`}
          >
            <HeroBackgroundSection
              title={form.watch("headerSection.title")}
              titleColor={form.watch("headerSection.titleColor")}
              subtitleColor={form.watch("headerSection.subtitleColor")}
              subtitleText={form.watch("headerSection.subtitle")}
              descriptionColor={form.watch("headerSection.descriptionColor")}
              descriptionText={form.watch("headerSection.description")}
              companyLogo={form.watch("headerSection.companyLogo")}
              backgroundImage={form.watch("headerSection.headerBackground")}
            />
          </div>
          <div
            className={`p-4 bg-white rounded flex flex-col md:flex-row ${
              state.isPreview ? "mt-[4rem]" : "mt-[18rem]"
            }`}
          >
            <div
              className={`w-full md:w-1/2 ${state.isPreview ? "h-[60vh]" : "h-[40vh]"}`}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: form.watch("introSection.introTitleColor") }}
              >
                {form.watch("introSection.introTitle")}
              </h2>
              <p
                className="mt-4 overflow-hidden line-clamp-5"
                style={{
                  color: form.watch("introSection.introDescriptionColor"),
                }}
              >
                {form.watch("introSection.introDescription")}
              </p>
              <Button className="mt-4">Read More</Button>
            </div>
            <div className="w-full md:w-1/3 flex justify-center items-center mt-4 md:mt-0">
              {form.watch("introSection.introMedia") && (
                <ThreeDCard
                  buttonText="Read More"
                  imageUrl={form.watch("introSection.introMedia")}
                />
              )}
            </div>
          </div>
          {form.watch("introMediaSection.introImage") && (
            <a
              href="#"
              className="block relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mt-4"
            >
              <motion.img
                src={
                  !isFile(form.watch("introMediaSection.introImage"))
                    ? (form.watch("introMediaSection.introImage") as string)
                    : URL.createObjectURL(
                        form.watch("introMediaSection.introImage") as File
                      )
                }
                width="100%"
                height="100%"
                alt="Intro Image"
                className="object-cover"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </a>
          )}
          {form.watch("featuredMenuSection.featuredImage") && (
            <div
              className={`p-4 bg-white rounded mt-4 flex flex-col md:flex-row ${
                state.isPreview ? "h-[80vh]" : "h-[60vh]"
              }`}
            >
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: form.watch("featuredMenuSection.featuredTitleColor"),
                  }}
                >
                  {form.watch("featuredMenuSection.featuredTitle")}
                </h2>
                <p
                  className="mt-4 overflow-hidden line-clamp-5"
                  style={{
                    color: form.watch(
                      "featuredMenuSection.featuredDescriptionColor"
                    ),
                  }}
                >
                  {form.watch("featuredMenuSection.featuredDescription")}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => (window.location.href = "#")}
                >
                  Full Menu
                </Button>
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <MenuBoard
                  height={state.isPreview ? "70vh" : "50vh"}
                  className="w-full rounded-lg shadow-xl p-4"
                />
              </div>
            </div>
          )}
          <div className="p-4 bg-black text-white rounded shadow mt-4 flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h3 className="text-lg font-semibold">QUICK LINKS</h3>
              <ul className="mt-2">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>Shipping Policy</li>
                <li>Terms and Conditions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">LOCATION</h3>
              <p className="mt-2">{form.watch("footerSection.location")}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">WE ARE SOCIAL</h3>
              <div className="mt-2 flex space-x-4">
                <a
                  href={form.watch("footerSection.instagram")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href={form.watch("footerSection.facebook")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </div>
              <Button className="mt-4">Leave Us Your Feedback</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
