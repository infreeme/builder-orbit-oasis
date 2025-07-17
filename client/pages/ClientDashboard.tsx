import React from "react";
import { useNavigate } from "react-router-dom";
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

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mock project data for client view
  const assignedProjects = [
    {
      id: "1",
      name: "Downtown Office Complex",
      progress: 68,
      status: "in-progress" as const,
      startDate: "2024-03-01",
      endDate: "2024-08-15",
      totalTasks: 18,
      completedTasks: 12,
      activeMilestones: 3,
      totalBudget: 2500000,
      phases: [
        { name: "Foundation", progress: 100, status: "completed" },
        { name: "Structure", progress: 85, status: "in-progress" },
        { name: "Envelope", progress: 45, status: "in-progress" },
        { name: "Interior", progress: 0, status: "planned" },
      ],
    },
  ];

  const upcomingMilestones = [
    {
      id: "1",
      name: "Structural Inspection",
      type: "inspection" as const,
      date: "2024-07-18",
      status: "pending" as const,
      project: "Downtown Office Complex",
    },
    {
      id: "2",
      name: "Phase 2 Approval",
      type: "approval" as const,
      date: "2024-07-25",
      status: "pending" as const,
      project: "Downtown Office Complex",
    },
    {
      id: "3",
      name: "MEP Systems Handover",
      type: "handover" as const,
      date: "2024-08-01",
      status: "scheduled" as const,
      project: "Downtown Office Complex",
    },
  ];

  const recentUpdates = [
    {
      id: "1",
      title: "Foundation work completed ahead of schedule",
      description: "All foundation work has been completed 3 days early",
      date: "2024-07-12",
      type: "progress",
    },
    {
      id: "2",
      title: "New progress photos uploaded",
      description: "15 new photos added to structural work documentation",
      date: "2024-07-11",
      type: "media",
    },
    {
      id: "3",
      title: "Weather delay notification",
      description: "2-day delay due to severe weather conditions",
      date: "2024-07-10",
      type: "delay",
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
        {assignedProjects.map((project) => (
          <div key={project.id} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Timeline
                </Button>
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
                      <p className="text-2xl font-bold">{project.progress}%</p>
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
        ))}

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
