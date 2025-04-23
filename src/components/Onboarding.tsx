import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { createClientWebsite } from "@/services/websiteBuilderService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Step 2 Schema
const onboardingSchema = z.object({
  website_name: z.string().nonempty("Website name is required"),
  website_subtitle: z.string().nonempty("Website subtitle is required"),
  description: z.string().nonempty("Description is required"),
  about_us: z.string().nonempty("About Us is required"),
  website_logo: z.any().optional(), // Adjust as needed for file handling
  social_links: z.object({
    instagram: z.string().url("Invalid Instagram URL").optional(),
    twitter: z.string().url("Invalid Twitter URL").optional(),
    facebook: z.string().url("Invalid Facebook URL").optional(),
  }),
  location: z.string().optional(),
});

const Onboarding = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitStep = async (data: any) => {
    try {
      await createClientWebsite(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create website builder:", error);
      // Optionally, you can show a toast notification or an error message here
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Onboarding</h1>
      <Progress value={100} className="w-full mb-4" />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitStep)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl"
        >
          <h2 className="text-xl font-semibold mb-4 col-span-2">
            Website Information:
          </h2>
          <FormField
            control={control}
            name="website_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="website_name">Website Name</FormLabel>
                <FormControl>
                  <Input
                    id="website_name"
                    placeholder="Website Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.website_name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="website_subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="website_subtitle">
                  Website Subtitle
                </FormLabel>
                <FormControl>
                  <Input
                    id="website_subtitle"
                    placeholder="Website Subtitle"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.website_subtitle?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormControl>
                  <Input
                    id="description"
                    placeholder="Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.description?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="about_us"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="about_us">About Us</FormLabel>
                <FormControl>
                  <Input id="about_us" placeholder="About Us" {...field} />
                </FormControl>
                <FormMessage>{errors.about_us?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="website_logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="website_logo">Website Logo</FormLabel>
                <FormControl>
                  <Input id="website_logo" type="file" {...field} />
                </FormControl>
                {/* // @ts-expect-error -- this is preset */}
                <FormMessage>{errors?.website_logo?.message}</FormMessage>
              </FormItem>
            )}
          />
          <h2 className="text-xl font-semibold mb-4 col-span-2">
            Social Links:
          </h2>
          <FormField
            control={control}
            name="social_links.instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="instagram">Instagram</FormLabel>
                <FormControl>
                  <Input
                    id="instagram"
                    placeholder="Instagram URL"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {errors.social_links?.instagram?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="social_links.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="twitter">Twitter</FormLabel>
                <FormControl>
                  <Input id="twitter" placeholder="Twitter URL" {...field} />
                </FormControl>
                <FormMessage>
                  {errors.social_links?.twitter?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="social_links.facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="facebook">Facebook</FormLabel>
                <FormControl>
                  <Input id="facebook" placeholder="Facebook URL" {...field} />
                </FormControl>
                <FormMessage>
                  {errors.social_links?.facebook?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="location">Location</FormLabel>
                <FormControl>
                  <Input id="location" placeholder="Location" {...field} />
                </FormControl>
                <FormMessage>{errors.location?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4 col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Onboarding;
