import AccountSettingsDrawer from "@/components/AccountSettingsDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthUserData, getClientData } from "@/lib/utils";
import { getClientKitchenWebsiteData } from "@/services/websiteBuilderService";
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { logout } = useAuth();
  const [isAccountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [websiteKitchenData, setWebisteKitchenData] = useState<any>(null);
  const clientDetails = getClientData();

  useEffect(() => {
    const fetchData = async () => {
      const userDetails = getAuthUserData();
      if (!userDetails?.id) return;
      try {
        const data = await getClientKitchenWebsiteData(userDetails?.id);
        setWebisteKitchenData(data);
      } catch (error) {
        console.error("Error fetching kitchen website data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <header className="flex justify-between gap-20 items-center p-4 bg-background shadow-md">
        <div className="flex-1">
          <h1 className="text-xl font-bold">
            {websiteKitchenData?.website_name}
          </h1>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {websiteKitchenData?.description}
          </p>
        </div>
        <div className="flex items-center w-[600]">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center cursor-pointer">
                <Avatar className="mr-2">
                  <AvatarImage src={user?.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAccountDrawerOpen(true)}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {isAccountDrawerOpen && (
        <AccountSettingsDrawer
          isOpen={isAccountDrawerOpen}
          onClose={() => setAccountDrawerOpen(false)}
          initialValues={{
            ...clientDetails,
            phone_number: clientDetails?.phone_number?.toString(),
            age: clientDetails?.age?.toString(),
          }}
        />
      )}
    </>
  );
};

export default Header;
