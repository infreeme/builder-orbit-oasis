/*
  # Initial Schema for Construction Project Management

  1. New Tables
    - `users` - User accounts with roles and authentication
    - `projects` - Construction projects with phases
    - `phases` - Project phases with ordering and colors
    - `tasks` - Individual tasks within projects/phases
    - `progress_comments` - Progress updates with comments
    - `media_files` - Uploaded images and videos for tasks

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Users can only access data they're authorized for

  3. Features
    - User role management (admin, member, client)
    - Project assignment for clients
    - Task progress tracking with comments
    - Media file management
    - Phase organization with custom colors
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'member', 'client')),
  assigned_projects text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'delayed', 'completed')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  color text NOT NULL DEFAULT '#8B5CF6',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_id uuid REFERENCES phases(id) ON DELETE SET NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'delayed', 'completed')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  due_date date NOT NULL,
  trade text NOT NULL DEFAULT 'General',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Progress comments table
CREATE TABLE IF NOT EXISTS progress_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  comment text NOT NULL,
  previous_progress integer NOT NULL DEFAULT 0,
  new_progress integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Media files table
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  description text,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploaded_by_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data and admins can read all"
  ON users FOR SELECT
  TO authenticated
  USING (
    auth.uid() = auth_user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own data and admins can update all"
  ON users FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = auth_user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Projects policies
CREATE POLICY "Users can read assigned projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND (
        role IN ('admin', 'member') OR 
        (role = 'client' AND id::text = ANY(assigned_projects))
      )
    )
  );

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Phases policies
CREATE POLICY "Users can read phases of accessible projects"
  ON phases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN users u ON u.auth_user_id = auth.uid()
      WHERE p.id = project_id
      AND (
        u.role IN ('admin', 'member') OR 
        (u.role = 'client' AND p.id::text = ANY(u.assigned_projects))
      )
    )
  );

CREATE POLICY "Admins can manage phases"
  ON phases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks policies
CREATE POLICY "Users can read tasks of accessible projects"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN users u ON u.auth_user_id = auth.uid()
      WHERE p.id = project_id
      AND (
        u.role IN ('admin', 'member') OR 
        (u.role = 'client' AND p.id::text = ANY(u.assigned_projects))
      )
    )
  );

CREATE POLICY "Admins can manage all tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Members can update assigned tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'member'
      AND (assigned_to IS NULL OR assigned_to = id)
    )
  );

-- Progress comments policies
CREATE POLICY "Users can read progress comments of accessible tasks"
  ON progress_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN users u ON u.auth_user_id = auth.uid()
      WHERE t.id = task_id
      AND (
        u.role IN ('admin', 'member') OR 
        (u.role = 'client' AND p.id::text = ANY(u.assigned_projects))
      )
    )
  );

CREATE POLICY "Members and admins can create progress comments"
  ON progress_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role IN ('admin', 'member')
    )
  );

-- Media files policies
CREATE POLICY "Users can read media of accessible tasks"
  ON media_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN users u ON u.auth_user_id = auth.uid()
      WHERE t.id = task_id
      AND (
        u.role IN ('admin', 'member') OR 
        (u.role = 'client' AND p.id::text = ANY(u.assigned_projects))
      )
    )
  );

CREATE POLICY "Members and admins can upload media"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role IN ('admin', 'member')
    )
  );

CREATE POLICY "Users can update own media and admins can update all"
  ON media_files FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete own media and admins can delete all"
  ON media_files FOR DELETE
  TO authenticated
  USING (
    uploaded_by = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_phases_project_id ON phases(project_id);
CREATE INDEX IF NOT EXISTS idx_phases_order ON phases(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_phase_id ON tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_progress_comments_task_id ON progress_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_media_files_task_id ON media_files(task_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();