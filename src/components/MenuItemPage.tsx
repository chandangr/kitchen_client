import NoDataIcon from "@/components/icons/NoDataIcon";
import { Button } from "@/components/ui/button";
import {
  deleteDishItem,
  fetchDishItems,
  insertDishItem,
  updateDishItem,
} from "@/services/dishItemService";
import { useEffect, useState } from "react";
import { DishItem, default as DishItemDrawer } from "./DishItemDrawer";
import { ThreeDCard } from "./ThreeDCard";
import { getAuthUserData } from "@/lib/utils";

const MenuItemPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<DishItem[]>([]);
  const [selecteDish, setSelecteDish] = useState<DishItem>();

  const user = getAuthUserData();
  const userId = user?.id;

  const handleAddMenuItem = async (newItem: DishItem) => {
    await insertDishItem(newItem);
    if (!userId) return;
    const items = await fetchDishItems(userId);
    setMenuItems(items);
  };

  const handleEditMenuItem = async (updatedItem: DishItem) => {
    if (!selecteDish?.id) return;
    await updateDishItem(selecteDish.id, updatedItem);
    if (!userId) return;
    const items = await fetchDishItems(userId);
    setMenuItems(items);
  };

  const handleDeleteMenuItem = async (id?: string) => {
    if (!id || !userId) return;
    try {
      await deleteDishItem(id, userId);
      const items = await fetchDishItems(userId);
      setMenuItems(items);
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (!userId) return;
      const items = await fetchDishItems(userId);
      setMenuItems(items);
    };
    fetchItems();
  }, [userId]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button onClick={() => setIsDrawerOpen(true)}>Add Menu Item</Button>
      </div>
      {menuItems.length === 0 ? (
        <div className="h-[calc(100vh-150px)] flex flex-col items-center justify-center">
          <NoDataIcon />
          <div className="ant-empty-description">No data</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <ThreeDCard
              key={item.id}
              showActions
              title={item?.dish_name}
              titleBadge={item.dish_category}
              tags={item.dish_tags}
              description={item.dish_recipe}
              imageUrl={
                item.dish_image?.length
                  ? item.dish_image
                  : "https://www.livofy.com/health/wp-content/uploads/2023/05/Add-a-heading-6.png"
              }
              buttonText={item.dish_price}
              onEdit={() => {
                setIsDrawerOpen(true);
                setSelecteDish(item);
              }}
              onDelete={() => handleDeleteMenuItem(item?.id)}
              descriptionList={[
                {
                  title: "Price",
                  value: `${item.dish_price} rs`,
                },
                {
                  title: "Count",
                  value: item?.dish_count ? item.dish_count.toString() : "1",
                },
                { title: "Calorie Count", value: item.dish_calorie_count },
              ]}
            />
          ))}
        </div>
      )}
      {isDrawerOpen && (
        <DishItemDrawer
          onEdit={handleEditMenuItem}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onAdd={handleAddMenuItem}
          initialValues={selecteDish}
          userId={userId}
        />
      )}
    </div>
  );
};

export default MenuItemPage;
