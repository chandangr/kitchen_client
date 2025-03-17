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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    reEnterPassword: z.string().min(6, "Re-enter password is required"),
    name: z.string().nonempty("Name is required"),
    age: z.string().min(1, "Age must be a positive number"),
    phone_number: z
      .string()
      .length(10, "Phone number must be 10 digits")
      .regex(/^\d+$/, "Phone number must be numeric"),
    dob: z.string().nonempty("Date of birth is required"),
    nationality: z.string().nonempty("Nationality is required"),
    gender: z.enum(["male", "female", ""], {
      errorMap: () => ({ message: "Gender is required" }),
    }),
    marital_status: z.enum(["single", "married", ""], {
      errorMap: () => ({ message: "Marital status is required" }),
    }),
  })
  .refine((data) => data.password === data.reEnterPassword, {
    message: "Passwords must match",
    path: ["reEnterPassword"],
  });
export interface SignupFormData extends z.infer<typeof signupSchema> {}

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export interface SigninData extends z.infer<typeof signinSchema> {}

export function AuthTabs() {
  const { signup, signin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const loginform = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });
  const {
    control: loginControl,
    handleSubmit: loginFormSubmit,
    formState: { errors: loginErrors },
  } = loginform;

  const signUpform = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      reEnterPassword: "",
      name: "",
      age: "",
      phone_number: "",
      dob: "",
      nationality: "",
      gender: "",
      marital_status: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = signUpform;

  const onSubmit = async (data: SignupFormData | typeof signinSchema) => {
    setIsLoading(true);
    if (activeTab === "signup") {
      const formData = data as SignupFormData;
      try {
        await signup(formData);
        signUpform.reset();
        setActiveTab("login");
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("An error occurred during authentication.");
      } finally {
        setIsLoading(false);
      }
    } else if (activeTab === "login") {
      const formData = data as SigninData;
      try {
        const clientData = await signin(formData.email, formData.password);
        // @ts-expect-error --  it has this field
        if (clientData && clientData?.is_first_time) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("An error occurred during authentication.");
      } finally {
        setIsLoading(false);
      }
      return;
    }
  };

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={() => {
        setActiveTab(activeTab === "login" ? "signup" : "login");
        signUpform.reset();
      }}
    >
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Form {...loginform}>
          {/* // @ts-expect-error -- expected */}
          <form onSubmit={loginFormSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={loginControl}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="login-email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage>{loginErrors.email?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={loginControl}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="login-password">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage>{loginErrors.password?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="signup">
        <Form {...signUpform}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-name">Name</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-name"
                        placeholder="Name"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="reEnterPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-reEnterPassword">
                      Re-enter Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="signup-reEnterPassword"
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.reEnterPassword?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-age">Age</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-age"
                        type="number"
                        placeholder="Age"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.age?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-phone_number">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="signup-phone_number"
                        placeholder="Phone Number"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.phone_number?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-dob">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-dob"
                        type="date"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.dob?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-nationality">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="signup-nationality"
                        placeholder="Nationality"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.nationality?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-gender">Gender</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{errors.gender?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="marital_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="signup-marital_status">
                      Marital Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Marital Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{errors.marital_status?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
