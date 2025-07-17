import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "member" | "client";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  assignedProjects?: string[];
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
    username: string,
    password: string,
    role: UserRole,
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock data for demo purposes
const mockUsers: User[] = [
  { id: "1", username: "admin", role: "admin", name: "John Admin" },
  {
    id: "2",
    username: "member1",
    role: "member",
    name: "Mike Worker",
    assignedProjects: ["1"],
  },
  {
    id: "3",
    username: "client1",
    role: "client",
    name: "Sarah Client",
    assignedProjects: ["1"],
  },
];

const mockCredentials = {
  admin: { username: "admin", password: "admin123" },
  member: { username: "member1", password: "member123" },
  client: { username: "client1", password: "client123" },
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    username: string,
    password: string,
    role: UserRole,
  ): Promise<boolean> => {
    // Mock authentication
    const credentials = mockCredentials[role];
    if (
      credentials.username === username &&
      credentials.password === password
    ) {
      const userData = mockUsers.find(
        (u) => u.username === username && u.role === role,
      );
      if (userData) {
        setUser(userData);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
