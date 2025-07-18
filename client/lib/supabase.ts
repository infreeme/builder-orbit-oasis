import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (generated from schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          username: string;
          name: string;
          role: 'admin' | 'member' | 'client';
          assigned_projects: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          username: string;
          name: string;
          role: 'admin' | 'member' | 'client';
          assigned_projects?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          username?: string;
          name?: string;
          role?: 'admin' | 'member' | 'client';
          assigned_projects?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          start_date: string;
          end_date: string;
          status: 'planned' | 'in-progress' | 'delayed' | 'completed';
          progress: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          status?: 'planned' | 'in-progress' | 'delayed' | 'completed';
          progress?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          status?: 'planned' | 'in-progress' | 'delayed' | 'completed';
          progress?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      phases: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          start_date: string;
          end_date: string;
          color: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          color?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          color?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          name: string;
          project_id: string;
          phase_id: string | null;
          progress: number;
          status: 'planned' | 'in-progress' | 'delayed' | 'completed';
          start_date: string;
          end_date: string;
          due_date: string;
          trade: string;
          priority: 'high' | 'medium' | 'low';
          assigned_to: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          project_id: string;
          phase_id?: string | null;
          progress?: number;
          status?: 'planned' | 'in-progress' | 'delayed' | 'completed';
          start_date: string;
          end_date: string;
          due_date: string;
          trade?: string;
          priority?: 'high' | 'medium' | 'low';
          assigned_to?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          project_id?: string;
          phase_id?: string | null;
          progress?: number;
          status?: 'planned' | 'in-progress' | 'delayed' | 'completed';
          start_date?: string;
          end_date?: string;
          due_date?: string;
          trade?: string;
          priority?: 'high' | 'medium' | 'low';
          assigned_to?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress_comments: {
        Row: {
          id: string;
          task_id: string;
          user_id: string;
          user_name: string;
          comment: string;
          previous_progress: number;
          new_progress: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          user_id: string;
          user_name: string;
          comment: string;
          previous_progress?: number;
          new_progress?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          user_id?: string;
          user_name?: string;
          comment?: string;
          previous_progress?: number;
          new_progress?: number;
          created_at?: string;
        };
      };
      media_files: {
        Row: {
          id: string;
          task_id: string;
          name: string;
          url: string;
          type: 'image' | 'video';
          description: string | null;
          uploaded_by: string;
          uploaded_by_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          name: string;
          url: string;
          type: 'image' | 'video';
          description?: string | null;
          uploaded_by: string;
          uploaded_by_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          name?: string;
          url?: string;
          type?: 'image' | 'video';
          description?: string | null;
          uploaded_by?: string;
          uploaded_by_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}