import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "./supabase";
import type { Database } from "./supabase";

type Tables = Database['public']['Tables'];

export interface Phase {
  id: string;
  projectId: string;
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
  description?: string;
  startDate: string;
  endDate: string;
  status: "planned" | "in-progress" | "delayed" | "completed";
  progress: number;
  activeTasks: number;
  totalTasks: number;
  members: number;
  phases: Phase[];
  createdBy?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "member" | "client";
  assignedProjects?: string[];
  authUserId?: string;
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
  projectId: string;
  project: string; // Keep for backward compatibility
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
  createdBy?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  taskId: string;
  uploadedBy: string;
  uploadedByName: string;
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
  addMedia: (media: Omit<MediaFile, "id" | "uploadedAt">) => Promise<void>;
  updateMedia: (id: string, updates: Partial<MediaFile>) => void;
  deleteMedia: (id: string) => void;

  // Phases
  addPhase: (projectId: string, phase: Omit<Phase, "id" | "projectId">) => Promise<void>;
  updatePhase: (
    projectId: string,
    phaseId: string,
    updates: Partial<Phase>,
  ) => void;
  deletePhase: (projectId: string, phaseId: string) => void;
  reorderPhases: (projectId: string, phaseIds: string[]) => void;

  // Loading states
  loading: boolean;
  error: string | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  React.useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        loadUsers(),
        loadProjects(),
        loadTasks(),
        loadMedia(),
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at');

    if (error) {
      console.error('Error loading users:', error);
      return;
    }

    const mappedUsers: User[] = data.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role as "admin" | "member" | "client",
      assignedProjects: user.assigned_projects,
      authUserId: user.auth_user_id,
    }));

    setUsers(mappedUsers);
  };

  const loadProjects = async () => {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at');

    if (projectsError) {
      console.error('Error loading projects:', projectsError);
      return;
    }

    const { data: phasesData, error: phasesError } = await supabase
      .from('phases')
      .select('*')
      .order('order_index');

    if (phasesError) {
      console.error('Error loading phases:', phasesError);
      return;
    }

    const mappedProjects: Project[] = projectsData.map(project => {
      const projectPhases = phasesData
        .filter(phase => phase.project_id === project.id)
        .map(phase => ({
          id: phase.id,
          projectId: phase.project_id,
          name: phase.name,
          description: phase.description,
          startDate: phase.start_date,
          endDate: phase.end_date,
          color: phase.color,
          order: phase.order_index,
        }));

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.status as "planned" | "in-progress" | "delayed" | "completed",
        progress: project.progress,
        activeTasks: 0, // Will be calculated
        totalTasks: 0, // Will be calculated
        members: 0, // Will be calculated
        phases: projectPhases,
        createdBy: project.created_by,
      };
    });

    setProjects(mappedProjects);
  };

  const loadTasks = async () => {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name)
      `)
      .order('created_at');

    if (tasksError) {
      console.error('Error loading tasks:', tasksError);
      return;
    }

    const { data: commentsData, error: commentsError } = await supabase
      .from('progress_comments')
      .select('*')
      .order('created_at');

    if (commentsError) {
      console.error('Error loading progress comments:', commentsError);
      return;
    }

    const mappedTasks: Task[] = tasksData.map(task => {
      const taskComments = commentsData
        .filter(comment => comment.task_id === task.id)
        .map(comment => ({
          id: comment.id,
          taskId: comment.task_id,
          userId: comment.user_id,
          userName: comment.user_name,
          comment: comment.comment,
          previousProgress: comment.previous_progress,
          newProgress: comment.new_progress,
          timestamp: comment.created_at,
        }));

      return {
        id: task.id,
        name: task.name,
        projectId: task.project_id,
        project: task.project?.name || 'Unknown Project',
        progress: task.progress,
        status: task.status as "planned" | "in-progress" | "delayed" | "completed",
        startDate: task.start_date,
        endDate: task.end_date,
        dueDate: task.due_date,
        trade: task.trade,
        priority: task.priority as "high" | "medium" | "low",
        assignedTo: task.assigned_to,
        phaseId: task.phase_id,
        progressComments: taskComments,
        media: [], // Will be loaded separately
        createdBy: task.created_by,
      };
    });

    setTasks(mappedTasks);
  };

  const loadMedia = async () => {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading media:', error);
      return;
    }

    const mappedMedia: MediaFile[] = data.map(mediaFile => ({
      id: mediaFile.id,
      name: mediaFile.name,
      url: mediaFile.url,
      type: mediaFile.type as "image" | "video",
      taskId: mediaFile.task_id,
      uploadedBy: mediaFile.uploaded_by,
      uploadedByName: mediaFile.uploaded_by_name,
      uploadedAt: mediaFile.created_at,
      description: mediaFile.description,
    }));

    setMedia(mappedMedia);

    // Update tasks with media
    setTasks(prevTasks => 
      prevTasks.map(task => ({
        ...task,
        media: mappedMedia.filter(m => m.taskId === task.id),
      }))
    );
  };

  // Project functions
  const addProject = (
    projectData: Omit<
      Project,
      "id" | "activeTasks" | "totalTasks" | "members" | "phases" | "createdBy"
    >,
  ) => {
    const createProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: projectData.name,
            description: projectData.description,
            start_date: projectData.startDate,
            end_date: projectData.endDate,
            status: projectData.status,
            progress: projectData.progress,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating project:', error);
          return;
        }

        const newProject: Project = {
          id: data.id,
          name: data.name,
          description: data.description,
          startDate: data.start_date,
          endDate: data.end_date,
          status: data.status as "planned" | "in-progress" | "delayed" | "completed",
          progress: data.progress,
          activeTasks: 0,
          totalTasks: 0,
          members: 0,
          phases: [],
          createdBy: data.created_by,
        };

        setProjects((prev) => [...prev, newProject]);
      } catch (err) {
        console.error('Error creating project:', err);
      }
    };

    createProject();
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updateProjectInDB = async () => {
      try {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.startDate) dbUpdates.start_date = updates.startDate;
        if (updates.endDate) dbUpdates.end_date = updates.endDate;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.progress !== undefined) dbUpdates.progress = updates.progress;

        const { error } = await supabase
          .from('projects')
          .update(dbUpdates)
          .eq('id', id);

        if (error) {
          console.error('Error updating project:', error);
          return;
        }

        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? { ...project, ...updates } : project,
          ),
        );
      } catch (err) {
        console.error('Error updating project:', err);
      }
    };

    updateProjectInDB();
  };

  const deleteProject = (id: string) => {
    const deleteProjectFromDB = async () => {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting project:', error);
          return;
        }

        setProjects((prev) => prev.filter((project) => project.id !== id));
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    };

    deleteProjectFromDB();
  };

  // User functions
  const addUser = (userData: Omit<User, "id">) => {
    const createUser = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert({
            username: userData.username,
            name: userData.name,
            role: userData.role,
            assigned_projects: userData.assignedProjects || [],
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating user:', error);
          return;
        }

        const newUser: User = {
          id: data.id,
          username: data.username,
          name: data.name,
          role: data.role as "admin" | "member" | "client",
          assignedProjects: data.assigned_projects,
          authUserId: data.auth_user_id,
        };

        setUsers((prev) => [...prev, newUser]);
      } catch (err) {
        console.error('Error creating user:', err);
      }
    };

    createUser();
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updateUserInDB = async () => {
      try {
        const dbUpdates: any = {};
        if (updates.username) dbUpdates.username = updates.username;
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.role) dbUpdates.role = updates.role;
        if (updates.assignedProjects) dbUpdates.assigned_projects = updates.assignedProjects;

        const { error } = await supabase
          .from('users')
          .update(dbUpdates)
          .eq('id', id);

        if (error) {
          console.error('Error updating user:', error);
          return;
        }

        setUsers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, ...updates } : user)),
        );
      } catch (err) {
        console.error('Error updating user:', err);
      }
    };

    updateUserInDB();
  };

  const deleteUser = (id: string) => {
    const deleteUserFromDB = async () => {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting user:', error);
          return;
        }

        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    };

    deleteUserFromDB();
  };

  const getUserByUsername = (username: string) => {
    return users.find((user) => user.username === username);
  };

  // Task functions
  const addTask = (
    taskData: Omit<Task, "id" | "media" | "progressComments" | "createdBy">,
  ) => {
    const createTask = async () => {
      try {
        // Find project by name to get project ID
        const project = projects.find(p => p.name === taskData.project);
        if (!project) {
          console.error('Project not found:', taskData.project);
          return;
        }

        const { data, error } = await supabase
          .from('tasks')
          .insert({
            name: taskData.name,
            project_id: project.id,
            phase_id: taskData.phaseId,
            progress: taskData.progress,
            status: taskData.status,
            start_date: taskData.startDate || taskData.dueDate,
            end_date: taskData.endDate || taskData.dueDate,
            due_date: taskData.dueDate || taskData.endDate,
            trade: taskData.trade || 'General',
            priority: taskData.priority,
            assigned_to: taskData.assignedTo,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating task:', error);
          return;
        }

        const newTask: Task = {
          id: data.id,
          name: data.name,
          projectId: data.project_id,
          project: taskData.project,
          progress: data.progress,
          status: data.status as "planned" | "in-progress" | "delayed" | "completed",
          startDate: data.start_date,
          endDate: data.end_date,
          dueDate: data.due_date,
          trade: data.trade,
          priority: data.priority as "high" | "medium" | "low",
          assignedTo: data.assigned_to,
          phaseId: data.phase_id,
          progressComments: [],
          media: [],
          createdBy: data.created_by,
        };

        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        console.error('Error creating task:', err);
      }
    };

    createTask();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updateTaskInDB = async () => {
      try {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.startDate) dbUpdates.start_date = updates.startDate;
        if (updates.endDate) dbUpdates.end_date = updates.endDate;
        if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
        if (updates.trade) dbUpdates.trade = updates.trade;
        if (updates.priority) dbUpdates.priority = updates.priority;
        if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
        if (updates.phaseId !== undefined) dbUpdates.phase_id = updates.phaseId;

        const { error } = await supabase
          .from('tasks')
          .update(dbUpdates)
          .eq('id', id);

        if (error) {
          console.error('Error updating task:', error);
          return;
        }

        setTasks((prev) =>
          prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        );
      } catch (err) {
        console.error('Error updating task:', err);
      }
    };

    updateTaskInDB();
  };

  const deleteTask = (id: string) => {
    const deleteTaskFromDB = async () => {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting task:', error);
          return;
        }

        setTasks((prev) => prev.filter((task) => task.id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    };

    deleteTaskFromDB();
  };

  const updateTaskProgress = (
    taskId: string,
    newProgress: number,
    comment: string,
    userId: string,
    userName: string,
  ) => {
    const updateProgress = async () => {
      try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = newProgress === 100 ? "completed" : newProgress > 0 ? "in-progress" : "planned";

        // Update task progress
        const { error: taskError } = await supabase
          .from('tasks')
          .update({ 
            progress: newProgress,
            status: newStatus,
          })
          .eq('id', taskId);

        if (taskError) {
          console.error('Error updating task progress:', taskError);
          return;
        }

        // Add progress comment
        const { data: commentData, error: commentError } = await supabase
          .from('progress_comments')
          .insert({
            task_id: taskId,
            user_id: userId,
            user_name: userName,
            comment,
            previous_progress: task.progress,
            new_progress: newProgress,
          })
          .select()
          .single();

        if (commentError) {
          console.error('Error creating progress comment:', commentError);
          return;
        }

        const progressComment: ProgressComment = {
          id: commentData.id,
          taskId: commentData.task_id,
          userId: commentData.user_id,
          userName: commentData.user_name,
          comment: commentData.comment,
          previousProgress: commentData.previous_progress,
          newProgress: commentData.new_progress,
          timestamp: commentData.created_at,
        };

        setTasks((prev) =>
          prev.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                progress: newProgress,
                status: newStatus,
                progressComments: [...task.progressComments, progressComment],
              };
            }
            return task;
          }),
        );
      } catch (err) {
        console.error('Error updating task progress:', err);
      }
    };

    updateProgress();
  };

  // Media functions
  const addMedia = async (mediaData: Omit<MediaFile, "id" | "uploadedAt">) => {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .insert({
          task_id: mediaData.taskId,
          name: mediaData.name,
          url: mediaData.url,
          type: mediaData.type,
          description: mediaData.description,
          uploaded_by: mediaData.uploadedBy,
          uploaded_by_name: mediaData.uploadedByName,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating media:', error);
        return;
      }

      const newMedia: MediaFile = {
        id: data.id,
        name: data.name,
        url: data.url,
        type: data.type as "image" | "video",
        taskId: data.task_id,
        uploadedBy: data.uploaded_by,
        uploadedByName: data.uploaded_by_name,
        uploadedAt: data.created_at,
        description: data.description,
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
    } catch (err) {
      console.error('Error creating media:', err);
    }
  };

  const updateMedia = (id: string, updates: Partial<MediaFile>) => {
    const updateMediaInDB = async () => {
      try {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;

        const { error } = await supabase
          .from('media_files')
          .update(dbUpdates)
          .eq('id', id);

        if (error) {
          console.error('Error updating media:', error);
          return;
        }

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
      } catch (err) {
        console.error('Error updating media:', err);
      }
    };

    updateMediaInDB();
  };

  const deleteMedia = (id: string) => {
    const deleteMediaFromDB = async () => {
      try {
        const { error } = await supabase
          .from('media_files')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting media:', error);
          return;
        }

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
      } catch (err) {
        console.error('Error deleting media:', err);
      }
    };

    deleteMediaFromDB();
  };

  // Phase functions
  const addPhase = async (projectId: string, phaseData: Omit<Phase, "id" | "projectId">) => {
    try {
      const { data, error } = await supabase
        .from('phases')
        .insert({
          project_id: projectId,
          name: phaseData.name,
          description: phaseData.description,
          start_date: phaseData.startDate,
          end_date: phaseData.endDate,
          color: phaseData.color,
          order_index: phaseData.order,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating phase:', error);
        return;
      }

      const newPhase: Phase = {
        id: data.id,
        projectId: data.project_id,
        name: data.name,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        color: data.color,
        order: data.order_index,
      };

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, phases: [...project.phases, newPhase] }
            : project,
        ),
      );
    } catch (err) {
      console.error('Error creating phase:', err);
    }
  };

  const updatePhase = (
    projectId: string,
    phaseId: string,
    updates: Partial<Phase>,
  ) => {
    const updatePhaseInDB = async () => {
      try {
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.startDate) dbUpdates.start_date = updates.startDate;
        if (updates.endDate) dbUpdates.end_date = updates.endDate;
        if (updates.color) dbUpdates.color = updates.color;
        if (updates.order !== undefined) dbUpdates.order_index = updates.order;

        const { error } = await supabase
          .from('phases')
          .update(dbUpdates)
          .eq('id', phaseId);

        if (error) {
          console.error('Error updating phase:', error);
          return;
        }

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
      } catch (err) {
        console.error('Error updating phase:', err);
      }
    };

    updatePhaseInDB();
  };

  const deletePhase = (projectId: string, phaseId: string) => {
    const deletePhaseFromDB = async () => {
      try {
        const { error } = await supabase
          .from('phases')
          .delete()
          .eq('id', phaseId);

        if (error) {
          console.error('Error deleting phase:', error);
          return;
        }

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
      } catch (err) {
        console.error('Error deleting phase:', err);
      }
    };

    deletePhaseFromDB();
  };

  const reorderPhases = (projectId: string, phaseIds: string[]) => {
    const reorderPhasesInDB = async () => {
      try {
        // Update order for each phase
        const updates = phaseIds.map((phaseId, index) => 
          supabase
            .from('phases')
            .update({ order_index: index })
            .eq('id', phaseId)
        );

        await Promise.all(updates);

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
      } catch (err) {
        console.error('Error reordering phases:', err);
      }
    };

    reorderPhasesInDB();
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
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
