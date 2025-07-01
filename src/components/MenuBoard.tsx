import { fetchDishItems } from "@/services/dishItemService";
import { getAuthUserData } from "@/lib/utils";
import { DishItem } from "@/components/DishItemDrawer";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface MenuBoardProps {
  height?: string; // Accept height as a prop with optional default
  className?: string; // Allow additional className customization
}

const MenuBoard = ({ height = "100vh", className = "" }: MenuBoardProps) => {
  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishes = async () => {
      const user = getAuthUserData();
      const userId = user?.id;
      if (!userId) {
        setDishes([]);
        setLoading(false);
        return;
      }
      const items = await fetchDishItems(userId);
      setDishes(items);
      setLoading(false);
    };

    loadDishes();
  }, []);

  const groupedDishes = dishes.reduce((acc, dish) => {
    if (!acc[dish.dish_category]) {
      acc[dish.dish_category] = [];
    }
    acc[dish.dish_category].push(dish);
    return acc;
  }, {} as Record<string, DishItem[]>);

  if (loading) {
    return (
      <div className={`text-center p-6 ${className}`}>Loading menu...</div>
    );
  }

  return (
    <div
      className={`bg-black text-white relative overflow-hidden ${className}`}
      style={{
        minHeight: height,
        height: "80%",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center sticky top-0 bg-black/80 backdrop-blur-sm z-10 py-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-wider mb-1">
            MENU
          </h1>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 p-2">
          {/* Left Column - Menu Items */}
          <div className="col-span-1 md:col-span-3">
            {Object.entries(groupedDishes).map(([category, items]) => (
              <div key={category} className="mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-bold text-orange-400 mb-2 md:mb-3 tracking-wider">
                  {category}
                </h2>
                <div className="space-y-2 md:space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-start group hover:bg-white/5 p-1.5 rounded-lg transition-all duration-300"
                    >
                      <div className="flex-1 pr-2">
                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide mb-0.5">
                          {item.dish_name}
                        </h3>
                        <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed">
                          {item.dish_recipe}
                        </p>
                      </div>
                      <div className="text-orange-400 font-bold text-xs md:text-sm whitespace-nowrap">
                        ${Number(item?.dish_price)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Featured Images */}
          <div className="col-span-1 md:col-span-2 relative">
            {Object.entries(groupedDishes).map(
              ([category, items], categoryIndex) =>
                items[0] && (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.2 }}
                    className="relative mb-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-full" />
                      <img
                        src={items[0].dish_image}
                        alt={items[0].dish_name}
                        className="w-full h-32 object-cover rounded-full border-2 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-orange-400 text-white px-2 py-0.5 rounded-full font-bold transform rotate-12 text-[10px] md:text-xs">
                        ${Number(items?.[0]?.dish_price)}
                        <span className="text-[8px] ml-0.5">OFF</span>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 md:mt-6 pt-3 border-t border-gray-800 p-2">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-[10px] md:text-xs"
              >
                www.yourwebsite.com
              </a>
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <i className="fab fa-instagram text-base"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <i className="fab fa-facebook text-base"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <i className="fab fa-twitter text-base"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <i className="fab fa-whatsapp text-base"></i>
                </a>
              </div>
            </div>
            <div className="bg-orange-400 text-white px-3 py-1 rounded-lg font-bold flex items-center space-x-1 text-[10px] md:text-xs">
              <span>FREE DELIVERY</span>
              <span className="text-[8px] px-1.5 py-0.5 bg-white/20 rounded">
                +22 456 8787
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBoard;
