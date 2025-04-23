import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getClientData } from "@/lib/utils";
import { ArrowLeft, Calendar, Home, Inbox, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./app-sidebar.css";
import { NavUser } from "./ui/nav-user";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Menu Items",
    url: "/menu-item",
    icon: Inbox,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: Calendar,
  },
  {
    title: "Website Builder",
    url: "/website-builder",
    icon: Search,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const clientDetails = getClientData();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="md:hidden p-1 absolute top-4 left-2 z-50"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6 text-gray-800" />
      </button>
      <Sidebar collapsible="icon" open={isOpen} {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="m-0 p-0">
              <button
                className="md:hidden"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <span className="ml-4">Cloud Kitchen Client</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        onClick={toggleSidebar}
                        className="menu-item"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: clientDetails?.name,
              email: clientDetails?.email,
              avatar:
                clientDetails?.avatar ??
                "https://avatars.dicebear.com/api/avataaars/mohammed.svg",
            }}
          />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export default AppSidebar;
