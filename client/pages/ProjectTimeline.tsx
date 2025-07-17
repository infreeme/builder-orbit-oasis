import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Download,
  Settings,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import GanttChart from "@/components/GanttChart";

export default function ProjectTimeline() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock project data
  const projectData = {
    name: "Downtown Office Complex",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-08-15"),
    phases: [
      {
        id: "1",
        name: "Site Preparation & Foundation",
        color: "#8B5CF6",
        collapsed: false,
        tasks: [
          {
            id: "1-1",
            name: "Site Survey & Permits",
            startDate: new Date("2024-03-01"),
            endDate: new Date("2024-03-15"),
            progress: 100,
            status: "completed" as const,
            trade: "Survey",
            assignedTo: "Survey Team A",
            dependencies: [],
            milestones: [
              {
                id: "m1",
                name: "Survey Approval",
                type: "approval" as const,
                date: new Date("2024-03-10"),
                completed: true,
              },
            ],
            mediaCount: 5,
          },
          {
            id: "1-2",
            name: "Excavation & Earthwork",
            startDate: new Date("2024-03-16"),
            endDate: new Date("2024-04-05"),
            progress: 100,
            status: "completed" as const,
            trade: "Earthwork",
            assignedTo: "Excavation Crew",
            dependencies: ["1-1"],
            milestones: [
              {
                id: "m2",
                name: "Excavation Inspection",
                type: "inspection" as const,
                date: new Date("2024-03-30"),
                completed: true,
              },
            ],
            mediaCount: 12,
          },
          {
            id: "1-3",
            name: "Foundation & Footings",
            startDate: new Date("2024-04-06"),
            endDate: new Date("2024-04-25"),
            progress: 100,
            status: "completed" as const,
            trade: "Concrete",
            assignedTo: "Concrete Team",
            dependencies: ["1-2"],
            milestones: [
              {
                id: "m3",
                name: "Foundation Handover",
                type: "handover" as const,
                date: new Date("2024-04-25"),
                completed: true,
              },
            ],
            mediaCount: 8,
          },
        ],
      },
      {
        id: "2",
        name: "Structural Framework",
        color: "#F59E0B",
        collapsed: false,
        tasks: [
          {
            id: "2-1",
            name: "Steel Frame Installation",
            startDate: new Date("2024-04-26"),
            endDate: new Date("2024-06-15"),
            progress: 85,
            status: "in-progress" as const,
            trade: "Structural Steel",
            assignedTo: "Steel Crew A",
            dependencies: ["1-3"],
            milestones: [
              {
                id: "m4",
                name: "Frame Inspection",
                type: "inspection" as const,
                date: new Date("2024-05-30"),
                completed: false,
              },
            ],
            mediaCount: 18,
          },
          {
            id: "2-2",
            name: "Concrete Floors & Deck",
            startDate: new Date("2024-05-15"),
            endDate: new Date("2024-06-30"),
            progress: 60,
            status: "in-progress" as const,
            trade: "Concrete",
            assignedTo: "Concrete Team",
            dependencies: ["2-1"],
            milestones: [],
            mediaCount: 7,
          },
        ],
      },
      {
        id: "3",
        name: "Building Envelope",
        color: "#10B981",
        collapsed: false,
        tasks: [
          {
            id: "3-1",
            name: "Exterior Wall Systems",
            startDate: new Date("2024-06-16"),
            endDate: new Date("2024-07-31"),
            progress: 30,
            status: "in-progress" as const,
            trade: "Envelope",
            assignedTo: "Envelope Specialists",
            dependencies: ["2-1"],
            milestones: [
              {
                id: "m5",
                name: "Waterproofing Test",
                type: "inspection" as const,
                date: new Date("2024-07-15"),
                completed: false,
              },
            ],
            mediaCount: 3,
          },
          {
            id: "3-2",
            name: "Windows & Glazing",
            startDate: new Date("2024-07-01"),
            endDate: new Date("2024-08-15"),
            progress: 10,
            status: "planned" as const,
            trade: "Glazing",
            assignedTo: "Glazing Team",
            dependencies: ["3-1"],
            milestones: [],
            mediaCount: 0,
          },
        ],
      },
      {
        id: "4",
        name: "MEP Systems",
        color: "#EF4444",
        collapsed: true,
        tasks: [
          {
            id: "4-1",
            name: "Electrical Rough-in",
            startDate: new Date("2024-05-01"),
            endDate: new Date("2024-07-15"),
            progress: 45,
            status: "in-progress" as const,
            trade: "Electrical",
            assignedTo: "Electrical Team",
            dependencies: ["2-1"],
            milestones: [],
            mediaCount: 2,
          },
          {
            id: "4-2",
            name: "Plumbing Installation",
            startDate: new Date("2024-05-15"),
            endDate: new Date("2024-07-30"),
            progress: 35,
            status: "in-progress" as const,
            trade: "Plumbing",
            assignedTo: "Plumbing Crew",
            dependencies: ["2-1"],
            milestones: [],
            mediaCount: 1,
          },
        ],
      },
    ],
  };

  const [phases, setPhases] = useState(projectData.phases);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePhaseToggle = (phaseId: string) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? { ...phase, collapsed: !phase.collapsed }
          : phase,
      ),
    );
  };

  const handleTaskClick = (task: any) => {
    console.log("Task clicked:", task);
    // Here you would implement task detail modal or navigation
  };

  // Calculate project stats
  const allTasks = phases.flatMap((phase) => phase.tasks);
  const completedTasks = allTasks.filter(
    (task: any) => task.status === "completed",
  );
  const inProgressTasks = allTasks.filter(
    (task: any) => task.status === "in-progress",
  );
  const delayedTasks = allTasks.filter(
    (task: any) => task.status === "delayed",
  );

  const overallProgress =
    allTasks.length > 0
      ? Math.round(
          allTasks.reduce((sum: number, task: any) => sum + task.progress, 0) /
            allTasks.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/dashboard/${user?.role}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Project Timeline</h1>
                  <p className="text-sm text-muted-foreground">
                    {projectData.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              {user?.role === "admin" && (
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {overallProgress}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Progress
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {completedTasks.length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-info">
                  {inProgressTasks.length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {delayedTasks.length}
                </div>
                <div className="text-sm text-muted-foreground">Delayed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {allTasks.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Phases:</span>
              {phases.map((phase) => (
                <Badge
                  key={phase.id}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handlePhaseToggle(phase.id)}
                  style={{
                    borderColor: phase.color,
                    color: phase.collapsed ? "#666" : phase.color,
                  }}
                >
                  {phase.name} ({phase.tasks.length})
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {projectData.startDate.toLocaleDateString()} -{" "}
            {projectData.endDate.toLocaleDateString()}
          </div>
        </div>

        {/* Gantt Chart */}
        <GanttChart
          phases={phases as any}
          startDate={projectData.startDate}
          endDate={projectData.endDate}
          userRole={user?.role as "admin" | "member" | "client"}
          onTaskClick={handleTaskClick}
          onPhaseToggle={handlePhaseToggle}
        />

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success rounded" />
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-info rounded" />
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded" />
                <span className="text-sm">Delayed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted rounded" />
                <span className="text-sm">Planned</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
