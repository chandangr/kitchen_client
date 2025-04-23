import Header from "@/components/Header";
import Onboarding from "@/components/Onboarding";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { getClientData } from "./lib/utils";

const Dashboard = lazy(() => import("@/components/Dashboard"));
const MenuItemPage = lazy(() => import("@/components/MenuItemPage"));
const Orders = lazy(() => import("@/components/Orders"));
const WebsiteBuilder = lazy(() => import("@/components/WebsiteBuilder"));

function App() {
  const defaultProps = {
    headerSection: {
      title: "Welcome to Butthi Cloud Kitchen",
      subtitle: "Delicious, Healthy, and Convenient",
      description:
        "Experience the best in healthy and convenient eating with Butthi Cloud Kitchen. Our mission is to provide nutritious, delicious meals that fit your lifestyle.",
      headerBackground:
        "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98=",
      companyLogo:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzkXYnylTXs-ouy5nPX4UZMmPgkYfkMS7ZoQ&usqp=CAU",
    },
    introSection: {
      introTitle: "ABOUT US",
      introDescription:
        "Butthi Cloud Kitchen is dedicated to making healthy eating easy and enjoyable. Our meals are crafted with fresh, high-quality ingredients to ensure you get the best nutrition without compromising on taste. Whether you are looking for a quick lunch or a hearty dinner, we have something for everyone.",
      introMedia:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    },
    introMediaSection: {
      introImage:
        "https://www.livofy.com/health/wp-content/uploads/2023/05/Add-a-heading-6.png",
    },
    featuredMenuSection: {
      featuredTitle: "OUR MENU",
      featuredDescription:
        "Discover our range of healthy and delicious meals, designed to satisfy your cravings and keep you energized throughout the day.",
      featuredImage:
        "https://img.freepik.com/free-vector/burgers-restaurant-menu-template_23-2149005028.jpg",
    },
    footerSection: {
      location: "123 Healthy Street, Wellness City",
      instagram: "https://instagram.com/butthicloudkitchen",
      facebook: "https://facebook.com/butthicloudkitchen",
    },
  };
  const clientDetails = getClientData();

  const client = {
    name: clientDetails?.name,
    email: clientDetails?.email,
    avatar:
      clientDetails?.avatar ??
      "https://avatars.dicebear.com/api/avataaars/mohammed.svg",
  };

  return (
    <Router basename="/kitchen_client">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <Header user={client} />
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <BreadcrumbNav />
                    </div>
                  </header>
                  <div className="flex items-center gap-2 px-4">
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/menu-item" element={<MenuItemPage />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route
                          path="/website-builder"
                          element={<WebsiteBuilder {...defaultProps} />}
                        />
                      </Routes>
                    </Suspense>
                  </div>
                </SidebarInset>
              </SidebarProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/menu-item" element={<MenuItemPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/website-builder"
              element={<WebsiteBuilder {...defaultProps} />}
            />
          </Route>
        </Route>

        {/* Redirect to login if no route matches */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="*"
          element={
            clientDetails ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
