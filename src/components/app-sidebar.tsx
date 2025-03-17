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
import { Calendar, Home, Inbox, Search } from "lucide-react";
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Cloud Kitchen Client</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="menu-item">
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
  );
}

export default AppSidebar;
