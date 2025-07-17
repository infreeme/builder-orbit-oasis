import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  LogOut,
  Construction,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showManageUsersDialog, setShowManageUsersDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [newUserData, setNewUserData] = useState({
    name: "",
    username: "",
    email: "",
    role: "member",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNewProject = () => {
    setNewProjectData({
      name: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setShowNewProjectDialog(true);
  };

  const handleManageUsers = () => {
    setNewUserData({ name: "", username: "", email: "", role: "member" });
    setShowManageUsersDialog(true);
  };

  const handleSettings = () => {
    setShowSettingsDialog(true);
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setEditingProject(project);
      setShowEditProjectDialog(true);
    }
  };

  const handleViewProjectDetails = (projectId: string) => {
    console.log("View project details:", projectId);
    // Navigate to project details page
    navigate(`/project/${projectId}`);
  };

  const handleViewAnalytics = () => {
    console.log("View analytics");
    // Navigate to analytics page or open analytics dialog
  };

  const handleCreateProject = () => {
    console.log("Creating project:", newProjectData);
    // Add API call to create project
    setShowNewProjectDialog(false);
    // Reset form
    setNewProjectData({
      name: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleAddUser = () => {
    console.log("Adding user:", newUserData);
    // Add API call to create user
    setShowManageUsersDialog(false);
    // Reset form
    setNewUserData({ name: "", username: "", email: "", role: "member" });
  };

  const handleUpdateProject = () => {
    console.log("Updating project:", editingProject);
    // Add API call to update project
    setShowEditProjectDialog(false);
    setEditingProject(null);
  };

  // Mock project data
  const projects = [
    {
      id: "1",
      name: "Downtown Office Complex",
      progress: 68,
      status: "in-progress" as const,
      endDate: "2024-08-15",
      activeTasks: 12,
      totalTasks: 18,
      members: 6,
    },
    {
      id: "2",
      name: "Residential Tower Phase 2",
      progress: 25,
      status: "delayed" as const,
      endDate: "2024-12-20",
      activeTasks: 8,
      totalTasks: 24,
      members: 4,
    },
    {
      id: "3",
      name: "Shopping Center Renovation",
      progress: 90,
      status: "in-progress" as const,
      endDate: "2024-06-30",
      activeTasks: 2,
      totalTasks: 15,
      members: 3,
    },
  ];

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "in-progress").length,
    delayedProjects: projects.filter((p) => p.status === "delayed").length,
    completedTasks: projects.reduce(
      (acc, p) => acc + (p.totalTasks - p.activeTasks),
      0,
    ),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-info text-info-foreground";
      case "delayed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <Construction className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <Clock className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Delayed Projects
                  </p>
                  <p className="text-2xl font-bold">{stats.delayedProjects}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed Tasks
                  </p>
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <div className="flex gap-3">
              <Button onClick={handleNewProject}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" onClick={handleManageUsers}>
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Due: {new Date(project.endDate).toLocaleDateString()}
                        </span>
                        <span>{project.members} members</span>
                        <span>
                          {project.activeTasks} of {project.totalTasks} tasks
                          active
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Link to="/timeline/1">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Timeline
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProject(project.id)}
                      >
                        Edit
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleViewProjectDetails(project.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3"
                onClick={handleNewProject}
              >
                <Plus className="w-8 h-8 text-primary" />
                <span>Create Project</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3"
                onClick={handleManageUsers}
              >
                <Users className="w-8 h-8 text-info" />
                <span>Add User</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3"
                onClick={handleViewAnalytics}
              >
                <BarChart3 className="w-8 h-8 text-accent" />
                <span>View Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-6 flex-col gap-3"
                onClick={handleSettings}
              >
                <Settings className="w-8 h-8 text-muted-foreground" />
                <span>System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New Project Dialog */}
        <Dialog
          open={showNewProjectDialog}
          onOpenChange={setShowNewProjectDialog}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Enter the details for your new construction project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project-name" className="text-right">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  className="col-span-3"
                  value={newProjectData.name}
                  onChange={(e) =>
                    setNewProjectData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  className="col-span-3"
                  value={newProjectData.startDate}
                  onChange={(e) =>
                    setNewProjectData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  className="col-span-3"
                  value={newProjectData.endDate}
                  onChange={(e) =>
                    setNewProjectData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Project description"
                  className="col-span-3"
                  value={newProjectData.description}
                  onChange={(e) =>
                    setNewProjectData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNewProjectDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Users Dialog */}
        <Dialog
          open={showManageUsersDialog}
          onOpenChange={setShowManageUsersDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Manage Users</DialogTitle>
              <DialogDescription>
                Add new users or manage existing user permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Add New User</h4>
                <div className="grid gap-2">
                  <Input
                    placeholder="Full Name"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Username"
                    value={newUserData.username}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                  >
                    <option value="member">Member</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button className="w-full" onClick={handleAddUser}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowManageUsersDialog(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>System Settings</DialogTitle>
              <DialogDescription>
                Configure system preferences and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Information</Label>
                <Input
                  placeholder="Company Name"
                  defaultValue="ABC Construction"
                />
                <Input placeholder="Company Address" />
              </div>
              <div className="space-y-2">
                <Label>Project Defaults</Label>
                <Input
                  placeholder="Default Project Duration (days)"
                  type="number"
                  defaultValue="90"
                />
              </div>
              <div className="space-y-2">
                <Label>Notification Settings</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    defaultChecked
                  />
                  <Label htmlFor="email-notifications">
                    Email notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="delay-alerts" defaultChecked />
                  <Label htmlFor="delay-alerts">Delay alerts</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSettingsDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Saving settings...");
                  setShowSettingsDialog(false);
                }}
              >
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
