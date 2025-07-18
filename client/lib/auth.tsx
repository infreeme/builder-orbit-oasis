import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "member" | "client";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  assignedProjects?: string[];
  authUserId?: string;
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "planned" | "in-progress" | "delayed" | "completed";
  progress: number;
  phases: ProjectPhase[];
  assignedMembers: string[];
  assignedClients: string[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  color: string;
}

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "planned" | "in-progress" | "delayed" | "completed";
  assignedTo?: string;
  dependencies?: string[];
  milestones: Milestone[];
  media: Media[];
  trade: string;
}

export interface Milestone {
  id: string;
  name: string;
  type: "inspection" | "approval" | "handover";
  date: string;
  completed: boolean;
}

export interface Media {
  id: string;
  url: string;
  type: "image" | "video";
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    userData: {
      username: string;
      name: string;
      role: UserRole;
      assignedProjects?: string[];
    }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  React.useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      if (userProfile) {
        setUser({
          id: userProfile.id,
          username: userProfile.username,
          name: userProfile.name,
          role: userProfile.role as UserRole,
          assignedProjects: userProfile.assigned_projects,
          authUserId: userProfile.auth_user_id,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    userData: {
      username: string;
      name: string;
      role: UserRole;
      assignedProjects?: string[];
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Create the user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            auth_user_id: authData.user.id,
            username: userData.username,
            name: userData.name,
            role: userData.role,
            assigned_projects: userData.assignedProjects || [],
          });

        if (profileError) {
          // Clean up auth user if profile creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          return { success: false, error: profileError.message };
        }

        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
