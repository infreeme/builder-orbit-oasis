import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "planned" | "in-progress" | "delayed" | "completed";
  progress: number;
  description?: string;
  activeTasks: number;
  totalTasks: number;
  members: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "member" | "client";
  password: string;
  assignedProjects?: string[];
}

export interface Task {
  id: string;
  name: string;
  project: string;
  progress: number;
  status: "planned" | "in-progress" | "delayed" | "completed";
  dueDate: string;
  trade: string;
  priority: "high" | "medium" | "low";
  assignedTo?: string;
  media: MediaFile[];
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  taskId: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

interface DataContextType {
  // Projects
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "activeTasks" | "totalTasks" | "members">,
  ) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserByUsername: (username: string) => User | undefined;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "media">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Media
  media: MediaFile[];
  addMedia: (media: Omit<MediaFile, "id" | "uploadedAt">) => void;
  deleteMedia: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);

  // Project functions
  const addProject = (
    projectData: Omit<Project, "id" | "activeTasks" | "totalTasks" | "members">,
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      activeTasks: 0,
      totalTasks: 0,
      members: 0,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...updates } : project,
      ),
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  // User functions
  const addUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // Task functions
  const addTask = (taskData: Omit<Task, "id" | "media">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      media: [],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Media functions
  const addMedia = (mediaData: Omit<MediaFile, "id" | "uploadedAt">) => {
    const newMedia: MediaFile = {
      ...mediaData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
    };
    setMedia((prev) => [...prev, newMedia]);

    // Update task media
    setTasks((prev) =>
      prev.map((task) =>
        task.id === mediaData.taskId
          ? { ...task, media: [...task.media, newMedia] }
          : task,
      ),
    );
  };

  const deleteMedia = (id: string) => {
    const mediaFile = media.find((m) => m.id === id);
    if (mediaFile) {
      setMedia((prev) => prev.filter((m) => m.id !== id));
      setTasks((prev) =>
        prev.map((task) =>
          task.id === mediaFile.taskId
            ? { ...task, media: task.media.filter((m) => m.id !== id) }
            : task,
        ),
      );
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        users,
        addUser,
        updateUser,
        deleteUser,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        media,
        addMedia,
        deleteMedia,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
