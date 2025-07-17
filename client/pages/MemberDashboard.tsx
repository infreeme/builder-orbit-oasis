import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Upload,
  CheckCircle,
  Clock,
  Camera,
  LogOut,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mock assigned tasks
  const assignedTasks = [
    {
      id: "1",
      name: "Foundation Excavation",
      project: "Downtown Office Complex",
      progress: 85,
      status: "in-progress" as const,
      dueDate: "2024-07-15",
      trade: "Earthwork",
      priority: "high" as const,
    },
    {
      id: "2",
      name: "Steel Frame Installation",
      project: "Downtown Office Complex",
      progress: 60,
      status: "in-progress" as const,
      dueDate: "2024-07-20",
      trade: "Structural",
      priority: "medium" as const,
    },
    {
      id: "3",
      name: "Electrical Rough-in",
      project: "Residential Tower Phase 2",
      progress: 30,
      status: "planned" as const,
      dueDate: "2024-08-01",
      trade: "Electrical",
      priority: "low" as const,
    },
  ];

  const recentUploads = [
    {
      id: "1",
      taskName: "Foundation Excavation",
      fileName: "excavation_progress_001.jpg",
      uploadedAt: "2024-07-10",
    },
    {
      id: "2",
      taskName: "Steel Frame Installation",
      fileName: "frame_section_a.jpg",
      uploadedAt: "2024-07-09",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-info text-info-foreground";
      case "planned":
        return "bg-muted text-muted-foreground";
      case "delayed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
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
              <div className="flex items-center justify-center w-10 h-10 bg-info rounded-lg">
                <Calendar className="w-6 h-6 text-info-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Member Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assigned Tasks
                  </p>
                  <p className="text-2xl font-bold">{assignedTasks.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      assignedTasks.filter((t) => t.status === "in-progress")
                        .length
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Recent Uploads
                  </p>
                  <p className="text-2xl font-bold">{recentUploads.length}</p>
                </div>
                <Upload className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Assigned Tasks</h2>
            <Button>
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <div className="space-y-4">
            {assignedTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{task.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.project} • {task.trade}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority} priority
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Media
                          </Button>
                          <Button size="sm" variant="outline">
                            Update Progress
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{upload.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {upload.taskName}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(upload.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                  <Camera className="w-8 h-8 text-info" />
                  <span>Upload Photo</span>
                </Button>
                <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <span>Update Progress</span>
                </Button>
                <Link to="/timeline/1">
                  <Button
                    variant="outline"
                    className="h-auto p-6 flex-col gap-3"
                  >
                    <Calendar className="w-8 h-8 text-primary" />
                    <span>View Timeline</span>
                  </Button>
                </Link>
                <Button variant="outline" className="h-auto p-6 flex-col gap-3">
                  <Clock className="w-8 h-8 text-warning" />
                  <span>Time Tracking</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
