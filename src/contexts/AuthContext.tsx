import { SignupFormData } from "@/components/AuthTabs";
import { createClientAfterSignUp } from "@/services/clientService";
import { createClient, Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { getBackendApiUrl } from "@/utils/environment";

const VITE_SUPERBASE_URL = "https://qvkgwzkfbsahxyooshan.supabase.co";
const VITE_SUPERBASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2a2d3emtmYnNhaHh5b29zaGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODUyMDIsImV4cCI6MjA1NzE2MTIwMn0.on4OutbcDoj4bb1vDOc2ZmX1LwJYLqvt9QrUTz-zdsA";

const supabaseUrl = VITE_SUPERBASE_URL;
const supabaseAnonKey = VITE_SUPERBASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SessionData = {
  clientId?: string;
} & Session;

type AuthContextType = {
  isAuthenticated: boolean;
  signup: (formData: SignupFormData) => Promise<boolean>;
  signin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  authUser: User | undefined;
  session?: SessionData;
  setSessionData?: (session: SessionData) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User>();
  const [session, setSession] = useState<SessionData | undefined>();

  // Load session data from localStorage on initial render
  React.useEffect(() => {
    const storedSession = localStorage.getItem("session");
    const storedUser = localStorage.getItem("user");
    if (storedSession && storedUser) {
      setSession(JSON.parse(storedSession));
      setAuthUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const setSessionData = (session: SessionData) => {
    setSession(session);
    setAuthUser(session.user);
    setIsAuthenticated(!!session.user);
    // Store session and user in localStorage
    localStorage.setItem("session", JSON.stringify(session));
    localStorage.setItem("user", JSON.stringify(session.user));
  };

  const signup = async (formdata: SignupFormData) => {
    try {
      const response = await fetch(`${getBackendApiUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formdata.email, password: formdata.password })
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(`Signup failed: ${error.error}`);
        return false;
      }
      const data = await response.json();
      if (data?.session) {
        const clientData = await createClientAfterSignUp(
          formdata,
          data?.session
        );
        // @ts-expect-error --  this is preset
        supabase.auth?.storage?.setItem("client", JSON.stringify(clientData));
        // Store session and user in localStorage
        localStorage.setItem("session", JSON.stringify(data.session));
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      toast.success("User signed up successfully.");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup error occurred.");
      return false;
    }
  };

  const signin = async (email: string, password: string): Promise<any> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const errorMessage = typeof error === 'object' && error && 'message' in error ? (error as { message: string }).message : 'No session returned.';
        toast.error(`Signin failed: ${errorMessage}`);
        return;
      }

      let clientData = null;
      try {
        clientData = await (await import("@/services/clientService")).getClientByUserId(data.user.id);
      } catch (clientError: unknown) {
        const clientErrorMessage = typeof clientError === 'object' && clientError && 'message' in clientError ? (clientError as { message: string }).message : String(clientError);
        console.error("Error fetching client data:", clientErrorMessage);
        toast.error(`Error fetching client data: ${clientErrorMessage}`);
        return;
      }

      toast.success("User logged in successfully.");
      setSession(data?.session);
      // @ts-expect-error --  this is preset
      supabase.auth?.storage?.setItem("client", JSON.stringify(clientData));
      // Store session and user in localStorage
      localStorage.setItem("session", JSON.stringify(data.session));
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthUser(data?.user);
      setIsAuthenticated(!!data?.user);

      return clientData;
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("Signin error occurred.");
      return;
    }
  };

  const logout = () => {
    toast.success("User logging out...");
    supabase.auth.signOut();
    // @ts-expect-error --  this is preset
    supabase.auth?.storage?.removeItem("client");
    // Clear localStorage
    localStorage.removeItem("session");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setSession(undefined);
    setAuthUser(undefined);
    window.location.href = "/kitchen_client/"; // Navigate to login page after signup
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        session,
        authUser,
        signup,
        signin,
        logout,
        setSessionData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
