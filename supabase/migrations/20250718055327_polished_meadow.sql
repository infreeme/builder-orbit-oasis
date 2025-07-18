/*
  # Create Initial Admin User

  1. Creates a default admin user for initial system access
  2. Uses email/password authentication through Supabase Auth
  3. Links to the users table with admin role

  Note: This is for initial setup only. In production, create admin users through the application.
*/

-- This migration should be run after the initial schema
-- It creates a default admin user for initial access

-- Insert admin user (this will need to be done through Supabase Auth in practice)
-- For now, we'll create a placeholder that can be updated when the first admin signs up

INSERT INTO users (
  username,
  name,
  role,
  assigned_projects
) VALUES (
  'admin',
  'System Administrator',
  'admin',
  '{}'
) ON CONFLICT (username) DO NOTHING;