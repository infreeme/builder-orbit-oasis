import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Phase {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  color: string;
  order: number;
}

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
  phases: Phase[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "member" | "client";
  password: string;
  assignedProjects?: string[];
}

export interface ProgressComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  comment: string;
  previousProgress: number;
  newProgress: number;
  timestamp: string;
}

export interface Task {
  id: string;
  name: string;
  project: string;
  progress: number;
  status: "planned" | "in-progress" | "delayed" | "completed";
  startDate: string;
  endDate: string;
  dueDate: string; // Keep for backward compatibility
  trade: string;
  priority: "high" | "medium" | "low";
  assignedTo?: string;
  media: MediaFile[];
  phaseId?: string;
  progressComments: ProgressComment[];
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
  addTask: (task: Omit<Task, "id" | "media" | "progressComments">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskProgress: (
    taskId: string,
    newProgress: number,
    comment: string,
    userId: string,
    userName: string,
  ) => void;

  // Media
  media: MediaFile[];
  addMedia: (media: Omit<MediaFile, "id" | "uploadedAt">) => void;
  updateMedia: (id: string, updates: Partial<MediaFile>) => void;
  deleteMedia: (id: string) => void;

  // Phases
  addPhase: (projectId: string, phase: Omit<Phase, "id">) => void;
  updatePhase: (
    projectId: string,
    phaseId: string,
    updates: Partial<Phase>,
  ) => void;
  deletePhase: (projectId: string, phaseId: string) => void;
  reorderPhases: (projectId: string, phaseIds: string[]) => void;
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

// Initial admin user
const initialAdminUser: User = {
  id: "admin",
  username: "admin",
  role: "admin",
  name: "Administrator",
  password: "admin123",
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([initialAdminUser]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);

  // Project functions
  const addProject = (
    projectData: Omit<
      Project,
      "id" | "activeTasks" | "totalTasks" | "members" | "phases"
    >,
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      activeTasks: 0,
      totalTasks: 0,
      members: 0,
      phases: [],
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

  const getUserByUsername = (username: string) => {
    return users.find((user) => user.username === username);
  };

  // Task functions
  const addTask = (
    taskData: Omit<Task, "id" | "media" | "progressComments">,
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      media: [],
      progressComments: [],
      // If dueDate is provided but startDate/endDate are not, use dueDate as endDate
      startDate: taskData.startDate || taskData.dueDate,
      endDate: taskData.endDate || taskData.dueDate,
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

  const updateTaskProgress = (
    taskId: string,
    newProgress: number,
    comment: string,
    userId: string,
    userName: string,
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const progressComment: ProgressComment = {
            id: Date.now().toString(),
            taskId,
            userId,
            userName,
            comment,
            previousProgress: task.progress,
            newProgress,
            timestamp: new Date().toISOString(),
          };

          return {
            ...task,
            progress: newProgress,
            progressComments: [...task.progressComments, progressComment],
            status:
              newProgress === 100
                ? "completed"
                : newProgress > 0
                  ? "in-progress"
                  : "planned",
          };
        }
        return task;
      }),
    );
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

  const updateMedia = (id: string, updates: Partial<MediaFile>) => {
    setMedia((prev) =>
      prev.map((mediaFile) =>
        mediaFile.id === id ? { ...mediaFile, ...updates } : mediaFile,
      ),
    );

    // Update task media as well
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        media: task.media.map((mediaFile) =>
          mediaFile.id === id ? { ...mediaFile, ...updates } : mediaFile,
        ),
      })),
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

  // Phase functions
  const addPhase = (projectId: string, phaseData: Omit<Phase, "id">) => {
    const newPhase: Phase = {
      ...phaseData,
      id: Date.now().toString(),
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, phases: [...project.phases, newPhase] }
          : project,
      ),
    );
  };

  const updatePhase = (
    projectId: string,
    phaseId: string,
    updates: Partial<Phase>,
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              phases: project.phases.map((phase) =>
                phase.id === phaseId ? { ...phase, ...updates } : phase,
              ),
            }
          : project,
      ),
    );
  };

  const deletePhase = (projectId: string, phaseId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              phases: project.phases.filter((phase) => phase.id !== phaseId),
            }
          : project,
      ),
    );

    // Remove phase assignment from tasks
    setTasks((prev) =>
      prev.map((task) =>
        task.phaseId === phaseId ? { ...task, phaseId: undefined } : task,
      ),
    );
  };

  const reorderPhases = (projectId: string, phaseIds: string[]) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              phases: phaseIds
                .map((phaseId, index) => {
                  const phase = project.phases.find((p) => p.id === phaseId);
                  return phase ? { ...phase, order: index } : phase;
                })
                .filter(Boolean) as Phase[],
            }
          : project,
      ),
    );
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
        updateTaskProgress,
        media,
        addMedia,
        updateMedia,
        deleteMedia,
        getUserByUsername,
        addPhase,
        updatePhase,
        deletePhase,
        reorderPhases,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
