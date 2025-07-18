import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Construction, Users, Eye, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigation will be handled by the auth state change
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Timeline Visualizer
              </h1>
              <p className="text-sm text-muted-foreground">
                Construction Project Management Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Streamline Your Construction Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Manage timelines, track progress, and collaborate effectively with
              our comprehensive project management platform.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Gantt Timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Multi-Role Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Construction className="w-4 h-4" />
                <span>Construction Focused</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Sign In
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Access your construction project dashboard
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Features Overview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-lg">
                <CardContent>
                  <div className="text-center p-4">
                    <Construction className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Admin Control</h4>
                    <p className="text-sm text-muted-foreground">
                      Full project management
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent>
                  <div className="text-center p-4">
                    <Users className="w-8 h-8 mx-auto mb-2 text-info" />
                    <h4 className="font-semibold">Team Members</h4>
                    <p className="text-sm text-muted-foreground">
                      Progress tracking & updates
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent>
                  <div className="text-center p-4">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <h4 className="font-semibold">Client Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Project monitoring
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Setup Notice */}
            <div className="mt-8 p-4 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-info rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-info-foreground text-xs font-bold">
                    i
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-info mb-1">Setup Required</p>
                  <p className="text-muted-foreground">
                    Connect to Supabase using the button in the top right to set up your database. 
                    Then create an admin user account to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
