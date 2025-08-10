import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CaseProgress } from "@/components/CaseProgress";
import { CaseMessages } from "@/components/CaseMessages";
import { CaseRequirements } from "@/components/CaseRequirements";
import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { toast } from "@/components/ui/sonner";
import { 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Eye
} from "lucide-react";

interface CaseRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  status: string;
}

interface CaseDetails extends CaseRow {
  progress_percentage: number;
  last_update: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  // Fetch user's case (single case per user)
  const { data: userCase, isLoading } = useQuery({
    queryKey: ["user-case", user?.id],
    queryFn: async (): Promise<CaseDetails | null> => {
      if (!user?.id) {
        console.log("No user ID available:", user);
        return null;
      }
      
      console.log("Querying cases for user:", user.id);
      
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error querying cases:", error);
        throw error;
      }
      if (!data) return null;

      // Calculate progress percentage based on completed steps
      const { data: progressData } = await supabase
        .from("case_progress")
        .select("status")
        .eq("case_id", data.id);

      const totalSteps = progressData?.length || 0;
      const completedSteps = progressData?.filter(step => step.status === "completed").length || 0;
      const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

      // Format the response
      return {
        ...data,
        progress_percentage: progressPercentage,
        last_update: data.updated_at
      };
    },
    enabled: !!user,
  });

  // Fetch case progress steps
  const { data: progressSteps } = useQuery({
    queryKey: ["case-progress", userCase?.id],
    queryFn: async () => {
      if (!userCase?.id) return [];
      const { data, error } = await supabase
        .from("case_progress")
        .select("*")
        .eq("case_id", userCase.id)
        .order("step_order");
      if (error) throw error;
      return data;
    },
    enabled: !!userCase?.id,
  });

  // Fetch case messages
  const { data: messages } = useQuery({
    queryKey: ["case-messages", userCase?.id],
    queryFn: async () => {
      if (!userCase?.id) return [];
      const { data, error } = await supabase
        .from("case_messages")
        .select("*")
        .eq("case_id", userCase.id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!userCase?.id,
  });

  // Fetch case requirements
  const { data: requirements } = useQuery({
    queryKey: ["case-requirements", userCase?.id],
    queryFn: async () => {
      if (!userCase?.id) return [];
      const { data, error } = await supabase
        .from("case_requirements")
        .select("*")
        .eq("case_id", userCase.id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!userCase?.id,
  });

  const canSubmit = useMemo(() => title.trim().length > 2, [title]);

  const handleCreate = async () => {
    if (!user) return;
    if (!canSubmit) return toast.error("Please enter a title (min 3 chars)");

    const { data: inserted, error } = await supabase
      .from("cases")
      .insert({ title, description: description || null, user_id: user.id })
      .select("id")
      .maybeSingle();

    if (error) return toast.error(error.message);
    if (!inserted) return;

    const caseId = inserted.id;

    if (files && files.length && caseId) {
      for (const file of Array.from(files)) {
        const filePath = `${user.id}/${caseId}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage
          .from("case-attachments")
          .upload(filePath, file, { contentType: file.type });
        if (upErr) {
          toast.error(`Upload failed: ${file.name}`);
          continue;
        }
        await supabase.from("attachments").insert({
          case_id: caseId,
          user_id: user.id,
          size: file.size,
          content_type: file.type,
          file_path: filePath,
          file_name: file.name,
        });
      }
    }

    setTitle("");
    setDescription("");
    setFiles(null);
    toast.success("Case created");
    qc.invalidateQueries({ queryKey: ["user-case", user.id] });
  };

  // If user has no case, show creation form
  if (!isLoading && !userCase) {
    return (
      <main className="min-h-screen bg-background">
        <Helmet>
          <title>Dashboard | Create Your Case</title>
          <meta name="description" content="Create your case to get started with our recovery services." />
          <link rel="canonical" href={window.location.origin + "/dashboard"} />
        </Helmet>

        <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">Create your case to get started with our recovery services.</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Create Your Case</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Input 
                  placeholder="Case title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
                <Textarea 
                  placeholder="Describe your situation (optional)" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                <input
                  aria-label="Attachments"
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="text-sm text-muted-foreground"
                />
                <Button onClick={handleCreate} disabled={!canSubmit} className="w-full">
                  Create Case
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard | Your Case</title>
        <meta name="description" content="Track your case progress and communicate with our team." />
        <link rel="canonical" href={window.location.origin + "/dashboard"} />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Loading your case...</div>
          </div>
        ) : userCase ? (
          <>
            {/* Case Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{userCase.title}</h1>
                  {userCase.description && (
                    <p className="text-muted-foreground">{userCase.description}</p>
                  )}
                </div>
                <CaseStatusBadge status={userCase.status} />
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Created {new Date(userCase.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {Math.round(userCase.progress_percentage)}% Complete
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Last update {new Date(userCase.last_update).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-trust-blue/10">
                      <TrendingUp className="h-5 w-5 text-trust-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold">{Math.round(userCase.progress_percentage)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning-amber/10">
                      <CheckSquare className="h-5 w-5 text-warning-amber" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requirements</p>
                      <p className="text-2xl font-bold">{requirements?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success-green/10">
                      <MessageSquare className="h-5 w-5 text-success-green" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Messages</p>
                      <p className="text-2xl font-bold">{messages?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="progress" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="requirements" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Requirements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-6">
                <CaseProgress 
                  steps={progressSteps || []} 
                  progressPercentage={userCase.progress_percentage} 
                />
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <CaseMessages 
                  caseId={userCase.id} 
                  messages={messages || []} 
                  isAdmin={false}
                />
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <CaseRequirements 
                  caseId={userCase.id} 
                  requirements={requirements || []} 
                  isAdmin={false}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            Something went wrong loading your case.
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
