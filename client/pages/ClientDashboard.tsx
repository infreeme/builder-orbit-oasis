import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Eye,
  BarChart3,
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileImage,
  Milestone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/data-context";
import MediaGallery from "@/components/MediaGallery";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { projects, tasks } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get projects and calculate stats from real data
  const assignedProjects = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project === project.name);
    const completedTasks = projectTasks.filter(
      (task) => task.status === "completed",
    );
    const overallProgress =
      projectTasks.length > 0
        ? Math.round(
            projectTasks.reduce((sum, task) => sum + task.progress, 0) /
              projectTasks.length,
          )
        : 0;

    return {
      ...project,
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      activeMilestones: 0, // Can be calculated from task milestones
      overallProgress,
      phases: [], // Can be generated from tasks grouped by trade
    };
  });

  // Generate upcoming milestones from tasks (can be expanded)
  const upcomingMilestones = tasks
    .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
    .slice(0, 5)
    .map((task) => ({
      id: task.id,
      name: `${task.name} Due`,
      type: "inspection" as const,
      date: task.dueDate,
      status: "pending" as const,
      project: task.project,
    }));

  // Generate recent updates from task progress changes
  const recentUpdates = tasks
    .filter((task) => task.progress > 0)
    .slice(0, 5)
    .map((task, index) => ({
      id: task.id,
      title: `${task.name} Progress Update`,
      description: `Task progress updated to ${task.progress}%`,
      date: new Date().toISOString().split("T")[0], // Would be actual update date in real app
      type: task.status === "completed" ? "progress" : "update",
    }));

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

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "inspection":
        return <Eye className="w-4 h-4" />;
      case "approval":
        return <CheckCircle className="w-4 h-4" />;
      case "handover":
        return <Milestone className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
                <Eye className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Client Dashboard</h1>
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
        {/* Projects Overview */}
        {assignedProjects.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                No Projects Available
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don't have access to any projects yet. Contact your
                administrator to be assigned to a project.
              </p>
            </CardContent>
          </Card>
        ) : (
          assignedProjects.map((project) => (
            <div key={project.id} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <div className="flex gap-3">
                  <Link to="/timeline/1">
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Timeline
                    </Button>
                  </Link>
                  <Button variant="outline">
                    <FileImage className="w-4 h-4 mr-2" />
                    Project Gallery
                  </Button>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Overall Progress
                        </p>
                        <p className="text-2xl font-bold">
                          {project.progress}%
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Tasks Completed
                        </p>
                        <p className="text-2xl font-bold">
                          {project.completedTasks}/{project.totalTasks}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Active Milestones
                        </p>
                        <p className="text-2xl font-bold">
                          {project.activeMilestones}
                        </p>
                      </div>
                      <Milestone className="w-8 h-8 text-info" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Completion Date
                        </p>
                        <p className="text-lg font-bold">
                          {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-accent" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Phases */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Project Phases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.phases.map((phase, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{phase.name}</span>
                            <Badge className={getStatusColor(phase.status)}>
                              {phase.status}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">
                            {phase.progress}%
                          </span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}

        {/* Media Gallery Section */}
        <MediaGallery />

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Milestone className="w-5 h-5" />
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground">
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {milestone.project}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(milestone.date).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {milestone.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-info rounded-full text-info-foreground mt-1">
                      {update.type === "progress" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {update.type === "media" && (
                        <FileImage className="w-4 h-4" />
                      )}
                      {update.type === "delay" && (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{update.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {update.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(update.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
