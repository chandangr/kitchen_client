import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FileInput, FileUploader } from "./ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TagsInput } from "./ui/tags-input";
import { Textarea } from "./ui/textarea";

const dishCategories = [
  "Buffets",
  "Appetizers",
  "Starters",
  "Main Course",
  "Side Dishes",
  "Desserts",
  "Beverages",
  "Soups",
  "Salads",
  "Street dish",
  "Snacks",
  "Breakfast",
  "Lunch",
  "Dinner",
];

const dishTypes = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
];

const dishOccasions = [
  "Special Occasions",
  "Casual Dining",
  "Formal Dining",
  "Regional Street dishs",
  "Local Desserts",
  "Traditional Beverages",
];

const dishDietaries = [
  "Low Carb",
  "Mid Carb",
  "High Carb",
  "Low Fat",
  "Mid Fat",
  "High Fat",
  "Low Protein",
  "Mid Protein",
  "High Protein",
];

const dishCookingMethods = [
  "Grilled",
  "Roasted",
  "Steamed",
  "Tawa Fried",
  "Deep Fried",
  "Pan Fried",
  "Baked",
];

const cuisineTypes = {
  Thai: [
    "Tom Yum Soup",
    "Pad Thai",
    "Green Curry",
    "Massaman Curry",
    "Som Tam (Papaya Salad)",
    "Satay",
    "Tom Kha Kai",
    "Khao Soi",
  ],
  Cuban: [
    "Ropa Vieja",
    "Arroz con Pollo",
    "Lechon Asado",
    "Tostones",
    "Empanadas",
    "Cubano Sandwich",
  ],
  Dutch: [
    "Stroopwafels",
    "Herring",
    "Erwtensoep",
    "Ossenworst",
    "Poffertjes",
    "Hutspot",
  ],
  Greek: [
    "Gyro",
    "Moussaka",
    "Souvlaki",
    "Greek Salad",
    "Spanakopita",
    "Tiropita",
    "Baklava",
  ],
  Irish: [
    "Colcannon",
    "Shepherd's Pie",
    "Irish Stew",
    "Boxty",
    "Soda Bread",
    "Guinness Beef Stew",
  ],
  Swiss: [
    "Fondue",
    "Raclette",
    "Rösti",
    "Bircher Muesli",
    "Zürigeschnätzlets",
    "Tirggel",
  ],
  Welsh: [
    "Bara Brith",
    "Welsh Rarebit",
    "Laverbread",
    "Cawl",
    "Crempogs",
    "Teisen Lap",
  ],
  French: [
    "Escargots",
    "Coq au Vin",
    "Bouillabaisse",
    "Ratatouille",
    "Crème Brûlée",
    "Macarons",
    "Croissants",
  ],
  German: [
    "Sausages (Bratwurst, Currywurst)",
    "Sauerbraten",
    "Schweinshaxe",
    "Spätzle",
    "Schnitzel",
    "Black Forest Cake",
  ],
  Indian: [
    "Punjabi",
    "Kashmiri",
    "Awadhi",
    "Mughlai",
    "Rajasthani",
    "Gujarati",
    "Maharashtrian",
    "Goan",
    "Kerala (Malabar)",
    "Tamil Nadu (Chettinad)",
    "Andhra",
    "Telangana",
    "Bengali",
    "Odia",
    "Assamese",
    "Manipuri",
    "Nagaland (Naga)",
    "Sikkimese",
  ],
  Kenyan: [
    "Ugali",
    "Sukuma Wiki",
    "Nyama Choma",
    "Matooke",
    "Kachumbari",
    "Mandazi",
  ],
  Korean: [
    "Kimchi",
    "Bibimbap",
    "Bulgogi",
    "Jeyuk bokkeum",
    "Naengmyeon",
    "Jjajangmyeon",
    "Jjamppong",
    "Tteokbokki",
    "Mandu",
  ],
  Polish: ["Pierogi", "Bigos", "Zurek", "Kielbasa", "Pączki", "Gołąbki"],
  Belgian: [
    "Waffles",
    "Fries",
    "Moules-Frites",
    "Waterzooi",
    "Carbonade Flamande",
    "Speculoos",
  ],
  Chinese: [
    "Sichuan",
    "Cantonese",
    "Shanghai",
    "Beijing (Peking)",
    "Hunan",
    "Fujian",
    "Xinjiang (Uyghur)",
    "Yunnan",
    "Guangdong",
  ],
  Israeli: ["Falafel", "Shawarma", "Hummus", "Shakshuka", "Sabich", "Boureka"],
  Italian: [
    "Pizza (Margherita, Marinara)",
    "Pasta (Spaghetti, Penne, Lasagna, Ravioli)",
    "Risotto",
    "Gnocchi",
    "Tiramisu",
    "Gelato",
    "Bruschetta",
    "Caprese Salad",
  ],
  Mexican: [
    "Tacos (al Pastor, Carnitas, Birria, Pescado)",
    "Enchiladas",
    "Chilaquiles",
    "Quesadillas",
    "Tamales",
    "Fajitas",
    "Guacamole",
    "Mole (Poblano, Verde)",
    "Pozole",
    "Sopes",
    "Tostadas",
    "Chimichangas",
  ],
  Russian: [
    "Borscht",
    "Beef Stroganoff",
    "Pelmeni",
    "Pirozhki",
    "Blini",
    "Shashlik",
  ],
  Spanish: [
    "Paella",
    "Tapas",
    "Gazpacho",
    "Tortilla Española",
    "Jamón ibérico",
    "Churros con Chocolate",
  ],
  Swedish: [
    "Meatballs",
    "Gravlax",
    "Janssons Frestelse",
    "Kanelbulle",
    "Princess Cake",
    "Västerbottensost",
  ],
  Turkish: ["Doner Kebab", "Lahmacun", "Manti", "Baklava", "Menemen", "Köfte"],
  American: [
    "Burgers",
    "Hot Dogs",
    "Fried Chicken",
    "Barbecue Ribs",
    "Mac and Cheese",
    "Apple Pie",
    "Buffalo Wings",
    "Clam Chowder",
  ],
  Austrian: [
    "Wiener Schnitzel",
    "Sacher Torte",
    "Apple Strudel",
    "Goulash",
    "Tafelspitz",
    "Kaiserschmarren",
  ],
  Egyptian: [
    "Koshari",
    "Ful Medames",
    "Ta'ameya",
    "Shawarma",
    "Mahshi",
    "Umm Ali",
  ],
  Filipino: ["Adobo", "Lechon", "Sinigang", "Sisig", "Lumpia", "Halo-Halo"],
  Georgian: [
    "Khinkali",
    "Khachapuri",
    "Shashlik",
    "Satsivi",
    "Pkhali",
    "Churchkhela",
  ],
  Ghanaian: [
    "Jollof Rice",
    "Fufu",
    "Banku",
    "Groundnut Soup",
    "Kelewele",
    "Waakye",
  ],
  Jamaican: [
    "Jerk Chicken",
    "Curry Goat",
    "Ackee and Saltfish",
    "Callaloo",
    "Fried Dumplings",
    "Patties",
  ],
  Japanese: [
    "Sushi",
    "Ramen",
    "Udon",
    "Soba",
    "Tempura",
    "Yakitori",
    "Tonkatsu",
    "Bento",
    "Kaiseki",
    "Shojin-ryori",
  ],
  Lebanese: ["Shawarma", "Tabbouleh", "Hummus", "Falafel", "Kibbeh", "Baklava"],
  Moroccan: ["Tagine", "Couscous", "Harira", "B'stilla", "Msemen", "Makroud"],
  Nigerian: [
    "Jollof Rice",
    "Suya",
    "Egusi Soup",
    "Akara",
    "Puff-Puff",
    "Efo Riro",
  ],
  Peruvian: [
    "Ceviche",
    "Lomo Saltado",
    "Aji de Gallina",
    "Anticuchos",
    "Causa",
    "Picarones",
  ],
  Scottish: [
    "Haggis",
    "Cullen Skink",
    "Neeps and Tatties",
    "Shortbread",
    "Scotch Egg",
    "Cranachan",
  ],
  Tunisian: ["Couscous", "Harissa", "Shakshuka", "Brik", "Msemen", "Makroud"],
  Brazilian: [
    "Feijoada",
    "Churrasco",
    "Açaí",
    "Pão de Queijo",
    "Moqueca",
    "Coxinha",
  ],
  Dominican: [
    "La Bandera",
    "Sancocho",
    "Chicharrón",
    "Mangú",
    "Arroz con Pollo",
    "Tres Leches Cake",
  ],
  Ethiopian: [
    "Injera",
    "Tibs",
    "Misir Wot",
    "Doro Wot",
    "Sambusa",
    "Ful Medames",
  ],
  Hungarian: [
    "Goulash",
    "Paprikás csirke",
    "Lángos",
    "Halászlé",
    "Dobos Torte",
    "Rántott hús",
  ],
  Malaysian: [
    "Nasi Lemak",
    "Char Kway Teow",
    "Hainanese Chicken Rice",
    "Roti Canai",
    "Laksa",
    "Chilli Crab",
  ],
  Mongolian: ["Boortsog", "Khorkhog", "Bortsik", "Aaruul", "Khuushuur", "Buuz"],
  Taiwanese: [
    "Beef Noodle Soup",
    "Oyster Omelet",
    "Stinky Tofu",
    "Gua Bao",
    "Bubble Tea",
    "Mochi",
  ],
  Australian: [
    "Meat Pie",
    "Fish and Chips",
    "Vegemite on Toast",
    "Chiko Roll",
    "Pavlova",
    "Lamington",
  ],
  Indonesian: [
    "Nasi Goreng",
    "Gado-Gado",
    "Sate",
    "Soto",
    "Martabak",
    "Krupuk",
  ],
  Portuguese: [
    "Bacalhau à Brás",
    "Caldo Verde",
    "Feijoada",
    "Pastéis de Nata",
    "Arroz Doce",
    "Frango Grelhado",
  ],
  "Sri Lankan": [
    "Hoppers",
    "String Hoppers",
    "Pittu",
    "Lamprais",
    "Watalappan",
    "Kottu",
  ],
  Vietnamese: [
    "Pho",
    "Bánh Mì",
    "Gỏi Cuốn (Spring Rolls)",
    "Bánh Xèo",
    "Bún Chả",
    "Gỏi Đu Đu (Papaya Salad)",
    "Bánh Khot",
  ],
  "New Zealand": [
    "Hangi",
    "Pavlova",
    "Fish and Chips",
    "Kumara",
    "Hokey Pokey Ice Cream",
    "Lamb Shanks",
  ],
  Singaporean: [
    "Chilli Crab",
    "Hainanese Chicken Rice",
    "Laksa",
    "Char Kway Teow",
    "Kaya Toast",
    "Bak Kut Teh",
  ],
  "Puerto Rican": [
    "Arroz con Gandules",
    "Alcapurrias",
    "Empanadas",
    "Mofongo",
    "Churrasco",
    "Flan",
  ],
  "South African": [
    "Bobotie",
    "Boerewors",
    "Bunny Chow",
    "Malva Pudding",
    "Sosaties",
    "Melktert",
  ],
  "Middle Eastern": [
    "Persian (Iranian)",
    "Turkish",
    "Lebanese",
    "Syrian",
    "Iraqi",
    "Egyptian",
    "Israeli",
  ],
};

const formSchema = z.object({
  dish_name: z.string().nonempty("Dish name is required."),
  dish_image: z.string().optional(),
  dish_recipe: z.string().nonempty("Dish recipe is required."),
  dish_calorie_count: z.string().nonempty("Calories is required."),
  dish_price: z.string().nonempty("Price is required."),
  dish_tags: z.array(z.string()).nonempty("Tags is required."),
  dish_category: z.string().nonempty("Dish category is required."),
  dish_type: z.string().nonempty("Dish type is required."),
  dish_occasion: z.string().nonempty("Dish occasion is required."),
  dish_dietary: z.string().nonempty("Dish dietary is required."),
  dish_cooking_methods: z
    .string()
    .nonempty("Dish cooking methods are required."),
  cuisine_type: z.string().nonempty("Cuisine type is required."),
  cuisine: z.string().nonempty("Cuisine is required."),
});

const cuisineList = Object.keys(cuisineTypes).map((cuisine) => cuisine);

export type DishItem = { id: string } & z.infer<typeof formSchema>;

export type DishItemDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: DishItem) => void;
  onEdit: (data: DishItem) => void;
  initialValues?: Partial<DishItem>;
};

const DishItemDrawer = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  initialValues,
}: DishItemDrawerProps) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  console.log("initialValues", initialValues);

  const form = useForm<DishItem>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      dish_calorie_count: initialValues?.dish_calorie_count?.toString(),
      dish_price: initialValues?.dish_price?.toString(),
    },
  });

  const onSubmit = async (values: DishItem) => {
    try {
      if (initialValues) {
        onEdit(values);
      } else {
        onAdd(values);
      }
      form.reset();
      onClose();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const isCuisinePresent = !!cuisineTypes?.[form.getValues("cuisine")];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Edit Dish Item" : "Add Dish Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-1 max-h-[calc(100vh-200px)] overflow-auto"
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dish_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name of your dish."
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dish_calorie_count"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Calorie Count</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter dish calorie count"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dish_price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter price"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Cuisine</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange?.(val);
                          form.setValue("cuisine_type", "");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine types" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineList.map((cuisine, index) => (
                            <SelectItem key={index} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cuisine_type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Cuisine Type</FormLabel>
                      <Select
                        disabled={!isCuisinePresent}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine types" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes?.[form.getValues("cuisine")]?.map(
                            (cuisine, index) => (
                              <SelectItem key={index} value={cuisine}>
                                {cuisine}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dish_dietary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Dish Dietary</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dish dietary options" />
                        </SelectTrigger>
                        <SelectContent>
                          {dishDietaries.map((dietary, index) => (
                            <SelectItem key={index} value={dietary}>
                              {dietary}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dish_category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dish categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishCategories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dish_type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dish types" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishTypes.map((type, index) => (
                          <SelectItem key={index} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dish_occasion"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Occasion</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dish occasions" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishOccasions.map((occasion, index) => (
                          <SelectItem key={index} value={occasion}>
                            {occasion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dish_cooking_methods"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Cooking Methods</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cooking methods" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishCookingMethods.map((method, index) => (
                          <SelectItem key={index} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dish_tags"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Add tags</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field?.value ?? []}
                        onValueChange={(tags) => {
                          form.setValue("dish_tags", tags);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dish_recipe"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Recipe (Summary)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter dish recipe (Summary)"
                        className="resize-none min-h-[115px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dish_image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Dish Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneConfig}
                        className="relative bg-background rounded-lg p-2"
                      >
                        <FileInput
                          id="fileInput"
                          className="outline-dashed outline-1 outline-slate-500"
                          {...field}
                        >
                          <div className="flex items-center justify-center flex-col p-8 w-full ">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                          </div>
                        </FileInput>
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={!form.formState.isDirty && !!initialValues}
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DishItemDrawer;
