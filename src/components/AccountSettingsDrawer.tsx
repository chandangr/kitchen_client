import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { updateClient } from "@/services/clientService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().nonempty("Name is required"),
  age: z.string().min(1, "Age must be a positive number"),
  phone_number: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must be numeric"),
  dob: z.string().nonempty("Date of birth is required"),
  nationality: z.string().nonempty("Nationality is required"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  marital_status: z.enum(["single", "married"], {
    errorMap: () => ({ message: "Marital status is required" }),
  }),
});

export interface AccountSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: any; // Adjust according to your user data structure
}

const AccountSettingsDrawer = ({
  isOpen,
  onClose,
  initialValues,
}: AccountSettingsDrawerProps) => {
  const accountform = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: initialValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = accountform;

  const onSubmit = async (data: any) => {
    await updateClient(data);
    onClose();
  };

  useEffect(() => {
    if (initialValues) {
      accountform.reset(initialValues);
    }
  }, [initialValues, accountform]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[70%]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Edit your account settings and update your profile information
          </DialogDescription>
        </DialogHeader>
        <Form {...accountform}>
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
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors?.email?.message}</FormMessage>
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
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{errors.age?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                disabled
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
                    <FormMessage>{errors?.gender?.message}</FormMessage>
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
            <Button type="submit" disabled={!accountform.formState?.isDirty}>
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsDrawer;
