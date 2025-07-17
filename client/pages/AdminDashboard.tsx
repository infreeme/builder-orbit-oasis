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
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
              <Button variant="outline" size="sm">
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
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline">
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
                      <Button size="sm" variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Timeline
                      </Button>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                    <Button size="sm">View Details</Button>
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
              <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                <Plus className="w-8 h-8 text-primary" />
                <span>Create Project</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                <Users className="w-8 h-8 text-info" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                <BarChart3 className="w-8 h-8 text-accent" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                <Settings className="w-8 h-8 text-muted-foreground" />
                <span>System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
