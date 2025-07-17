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
import { useData } from "@/lib/data-context";
import GanttChart from "@/components/GanttChart";

export default function ProjectTimeline() {
  const { user } = useAuth();
  const { projects, tasks } = useData();
  const navigate = useNavigate();

  // Get project data from context - use first project or null if none exist
  const currentProject = projects.length > 0 ? projects[0] : null;

  // Create phases from real tasks data grouped by trade
  const createPhasesFromTasks = () => {
    if (!currentProject || tasks.length === 0) return [];

    // Group tasks by trade to create phases
    const tasksByTrade = tasks
      .filter((task) => task.project === currentProject.name)
      .reduce((acc: any, task) => {
        const trade = task.trade || "General";
        if (!acc[trade]) {
          acc[trade] = [];
        }
        acc[trade].push({
          ...task,
          startDate: new Date(task.dueDate),
          endDate: new Date(task.dueDate),
          mediaCount: task.media?.length || 0,
          milestones: [], // Can be expanded later
          dependencies: [],
        });
        return acc;
      }, {});

    // Convert to phases format
    const tradeColors = [
      "#8B5CF6",
      "#F59E0B",
      "#10B981",
      "#EF4444",
      "#06B6D4",
      "#84CC16",
    ];
    return Object.entries(tasksByTrade).map(([trade, tasksInTrade], index) => ({
      id: `phase-${index}`,
      name: trade,
      color: tradeColors[index % tradeColors.length],
      collapsed: false,
      tasks: tasksInTrade,
    }));
  };

  const [phases, setPhases] = useState<any[]>([]);

  // Update phases when tasks or projects change
  React.useEffect(() => {
    setPhases(createPhasesFromTasks());
  }, [tasks, projects, currentProject]);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);

  // Handle timeline controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleExport = () => {
    // Create export data
    const exportData = {
      project: currentProject?.name || "No Project",
      phases: phases,
      exportDate: new Date().toISOString(),
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      overallProgress: overallProgress,
    };

    // Convert to JSON and download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject?.name || "project"}-timeline-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                    {currentProject?.name || "No project selected"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
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
