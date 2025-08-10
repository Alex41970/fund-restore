import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CaseProgress } from "@/components/CaseProgress";
import { CaseMessages } from "@/components/CaseMessages";

import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { toast } from "@/components/ui/sonner";
import { 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Eye,
  Paperclip,
  Calendar,
  BarChart3,
  Hash
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

      // Use progress_percentage from database (set by admin) 
      // Format the response
      return {
        ...data,
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

  // Fetch progress updates
  const { data: progressUpdates } = useQuery({
    queryKey: ["progress-updates", userCase?.id],
    queryFn: async () => {
      if (!userCase?.id) return [];
      const { data, error } = await supabase
        .from("case_progress_updates")
        .select("*")
        .eq("case_id", userCase.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userCase?.id,
  });

  // Fetch case attachments
  const { data: attachments } = useQuery({
    queryKey: ["case-attachments", userCase?.id],
    queryFn: async () => {
      if (!userCase?.id) return [];
      const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("case_id", userCase.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
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
            {/* Case Header - Collapsible */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{userCase.title}</CardTitle>
                    {userCase.description && (
                      <CardDescription className="line-clamp-2">
                        {userCase.description.length > 80 
                          ? `${userCase.description.substring(0, 80)}...` 
                          : userCase.description
                        }
                      </CardDescription>
                    )}
                  </div>
                  <CaseStatusBadge status={userCase.status} />
                </div>
              </CardHeader>
              
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="case-details" className="border-none">
                    <AccordionTrigger className="text-sm font-medium">
                      View Full Case Details
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      {/* Case Description */}
                      {userCase.description && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Description
                          </h4>
                          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {userCase.description}
                          </p>
                        </div>
                      )}
                      
                      {/* Case Metadata */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Case Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Hash className="h-4 w-4" />
                            <span className="font-medium">Case ID:</span>
                            <span className="font-mono">{userCase.id.substring(0, 8)}...</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BarChart3 className="h-4 w-4" />
                            <span className="font-medium">Status:</span>
                            <span className="capitalize">{userCase.status}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Created:</span>
                            <span>{new Date(userCase.created_at).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Last Update:</span>
                            <span>{new Date(userCase.last_update).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-medium">Progress:</span>
                            <span>{Math.round(userCase.progress_percentage)}% Complete</span>
                          </div>
                        </div>
                      </div>

                      {/* Case Statistics */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Case Statistics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium">Messages:</span>
                            <span>{messages?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-medium">Progress Updates:</span>
                            <span>{progressUpdates?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                            <span className="font-medium">Attachments:</span>
                            <span>{attachments?.length || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Case Attachments */}
                      {attachments && attachments.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            Attachments ({attachments.length})
                          </h4>
                          <div className="space-y-2">
                            {attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium text-sm">{attachment.file_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'} • 
                                      Uploaded {new Date(attachment.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-trust-blue/10">
                      <TrendingUp className="h-5 w-5 text-trust-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold">{Math.round(userCase.progress_percentage || 0)}%</p>
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progress" className="space-y-6">
                <CaseProgress 
                  caseId={userCase.id}
                  steps={progressSteps || []} 
                  progressPercentage={userCase.progress_percentage || 0}
                  progressUpdates={progressUpdates || []}
                  isAdmin={false}
                />
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <CaseMessages 
                  caseId={userCase.id} 
                  messages={messages || []} 
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
