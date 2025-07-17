import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/auth";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showTimeTrackingDialog, setShowTimeTrackingDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState([0]);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [timeTrackingData, setTimeTrackingData] = useState({
    startTime: "",
    endTime: "",
    description: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUploadMedia = (taskId?: string) => {
    setSelectedTask(taskId || null);
    setUploadFiles(null);
    setUploadDescription("");
    setShowUploadDialog(true);
  };

  const handleUpdateProgress = (taskId?: string) => {
    if (taskId) {
      const task = assignedTasks.find((t) => t.id === taskId);
      if (task) {
        setProgressValue([task.progress]);
      }
    }
    setSelectedTask(taskId || null);
    setProgressNotes("");
    setShowProgressDialog(true);
  };

  const handleTimeTracking = () => {
    setTimeTrackingData({ startTime: "", endTime: "", description: "" });
    setShowTimeTrackingDialog(true);
  };

  const handleViewTaskDetails = (taskId: string) => {
    console.log("View task details:", taskId);
    // Navigate to task details or open details dialog
    navigate(`/task/${taskId}`);
  };

  const handleSubmitUpload = () => {
    console.log("Uploading media:", {
      taskId: selectedTask,
      files: uploadFiles,
      description: uploadDescription,
    });
    // Add API call to upload media
    setShowUploadDialog(false);
    // Reset form
    setUploadFiles(null);
    setUploadDescription("");
    setSelectedTask(null);
  };

  const handleSubmitProgress = () => {
    console.log("Updating progress:", {
      taskId: selectedTask,
      progress: progressValue[0],
      notes: progressNotes,
    });
    // Add API call to update progress
    setShowProgressDialog(false);
    // Reset form
    setProgressNotes("");
    setProgressValue([0]);
    setSelectedTask(null);
  };

  const handleSubmitTimeTracking = () => {
    console.log("Logging time:", timeTrackingData);
    // Add API call to log time
    setShowTimeTrackingDialog(false);
    // Reset form
    setTimeTrackingData({ startTime: "", endTime: "", description: "" });
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
            <Button onClick={() => handleUploadMedia()}>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUploadMedia(task.id)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Media
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(task.id)}
                          >
                            Update Progress
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleViewTaskDetails(task.id)}
                          >
                            View Details
                          </Button>
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
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-3"
                  onClick={() => handleUploadMedia()}
                >
                  <Camera className="w-8 h-8 text-info" />
                  <span>Upload Photo</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-3"
                  onClick={() => handleUpdateProgress()}
                >
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
                <Button
                  variant="outline"
                  className="h-auto p-6 flex-col gap-3"
                  onClick={handleTimeTracking}
                >
                  <Clock className="w-8 h-8 text-warning" />
                  <span>Time Tracking</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Media Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
              <DialogDescription>
                Upload photos or videos for{" "}
                {selectedTask ? `task ${selectedTask}` : "your tasks"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Task</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedTask || ""}
                  onChange={(e) => setSelectedTask(e.target.value || null)}
                >
                  <option value="">Select a task...</option>
                  {assignedTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name} - {task.project}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Upload Files</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setUploadFiles(e.target.files)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Add a description for your upload..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitUpload}>Upload</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Progress Dialog */}
        <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
              <DialogDescription>
                Update the completion percentage for{" "}
                {selectedTask ? `task ${selectedTask}` : "a task"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!selectedTask && (
                <div className="space-y-2">
                  <Label>Select Task</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select a task...</option>
                    {assignedTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.name} - {task.progress}%
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Progress: {progressValue[0]}%</Label>
                <Slider
                  value={progressValue}
                  onValueChange={setProgressValue}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add notes about the progress update..."
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowProgressDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitProgress}>Update Progress</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Time Tracking Dialog */}
        <Dialog
          open={showTimeTrackingDialog}
          onOpenChange={setShowTimeTrackingDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Time Tracking</DialogTitle>
              <DialogDescription>
                Track time spent on tasks and view your time reports.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Task</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedTask || ""}
                  onChange={(e) => setSelectedTask(e.target.value || null)}
                >
                  <option value="">Select a task...</option>
                  {assignedTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name} - {task.project}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="datetime-local" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the work performed..." />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTimeTrackingDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Logging time...");
                  setShowTimeTrackingDialog(false);
                }}
              >
                Log Time
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
