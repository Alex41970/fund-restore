import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CaseProgress } from "@/components/CaseProgress";
import { CaseMessages } from "@/components/CaseMessages";

import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { StatCard } from "@/components/StatCard";
import { toast } from "@/components/ui/sonner";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  Eye, 
  Search,
  Filter,
  BarChart3,
  CheckCircle,
  Hash,
  Calendar,
  Paperclip,
  MessageSquare
} from "lucide-react";

interface CaseRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  status: string;
  user_id: string;
  profiles?: {
    display_name: string;
    first_name: string;
    last_name: string;
  };
}

interface CaseStats {
  total_cases: number;
  in_progress: number;
  resolved: number;
  avg_progress: number;
}

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all cases with user profiles
  const { data: cases, isLoading, error } = useQuery({
    queryKey: ["admin-cases"],
    queryFn: async (): Promise<CaseRow[]> => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          profiles!fk_cases_user_id(display_name, first_name, last_name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any;
    },
  });

  // Fetch case statistics
  const { data: stats } = useQuery({
    queryKey: ["case-stats"],
    queryFn: async (): Promise<CaseStats> => {
      const { data: allCases, error } = await supabase
        .from("cases")
        .select("status, case_progress(calculated_percentage)");
      
      if (error) throw error;

      const total_cases = allCases.length;
      const in_progress = allCases.filter(c => 
        ["in_progress", "pending_client", "under_review"].includes(c.status)
      ).length;
      const resolved = allCases.filter(c => c.status === "resolved").length;
      
      const progressValues = allCases
        .map(c => c.case_progress?.[0]?.calculated_percentage || 0)
        .filter(p => p > 0);
      const avg_progress = progressValues.length > 0 
        ? progressValues.reduce((a, b) => a + b, 0) / progressValues.length 
        : 0;

      return { total_cases, in_progress, resolved, avg_progress };
    },
  });

  // Fetch selected case details
  const { data: selectedCaseData } = useQuery({
    queryKey: ["case-details", selectedCase],
    queryFn: async () => {
      if (!selectedCase) return null;
      
      const [caseData, progressSteps, progressUpdates] = await Promise.all([
        supabase.from("cases").select("*").eq("id", selectedCase).single(),
        supabase.from("case_progress").select("*").eq("case_id", selectedCase).order("step_order"),
        supabase.from("case_progress_updates").select("*").eq("case_id", selectedCase).order("created_at", { ascending: false }),
      ]);

      return {
        case: caseData.data,
        progress: progressSteps.data || [],
        progressUpdates: progressUpdates.data || [],
      };
    },
    enabled: !!selectedCase,
  });

  // Fetch messages separately to match component invalidation
  const { data: selectedCaseMessages } = useQuery({
    queryKey: ["case-messages", selectedCase],
    queryFn: async () => {
      if (!selectedCase) return [];
      
      const { data, error } = await supabase
        .from("case_messages")
        .select("*")
        .eq("case_id", selectedCase)
        .order("created_at");

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCase,
  });

  // Fetch attachments for selected case
  const { data: selectedCaseAttachments } = useQuery({
    queryKey: ["case-attachments", selectedCase],
    queryFn: async () => {
      if (!selectedCase) return [];
      
      const { data, error } = await supabase
        .from("case_attachments")
        .select("*")
        .eq("case_id", selectedCase)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCase,
  });

  // Fetch progress updates separately
  const { data: selectedCaseProgressUpdates } = useQuery({
    queryKey: ["progress-updates", selectedCase],
    queryFn: async () => {
      if (!selectedCase) return [];
      
      const { data, error } = await supabase
        .from("case_progress_updates")
        .select("*")
        .eq("case_id", selectedCase)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCase,
  });

  // Filter cases
  const filteredCases = cases?.filter(c => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesSearch = !searchTerm || 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) || [];

  const handleStatusUpdate = async (caseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("cases")
        .update({ status: newStatus })
        .eq("id", caseId);

      if (error) throw error;
      
      toast.success("Case status updated");
      
      // Invalidate queries to refresh data immediately
      queryClient.invalidateQueries({ queryKey: ["admin-cases"] });
      queryClient.invalidateQueries({ queryKey: ["case-stats"] });
      queryClient.invalidateQueries({ queryKey: ["case-details", caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-messages", caseId] });
      queryClient.invalidateQueries({ queryKey: ["progress-updates", caseId] });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to update case status: ${errorMessage}`);
      console.error("Error updating case status:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard | Case Management</title>
        <meta name="description" content="Comprehensive admin dashboard for managing all cases and client communications." />
        <link rel="canonical" href={window.location.origin + "/admin"} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all cases and track progress across your organization</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={FileText}
              title="Total Cases"
              value={stats.total_cases.toString()}
              description="All cases in system"
              gradient="gradient-primary"
            />
            <StatCard
              icon={Clock}
              title="In Progress"
              value={stats.in_progress.toString()}
              description="Active cases"
              gradient="gradient-success"
            />
            <StatCard
              icon={CheckCircle}
              title="Resolved"
              value={stats.resolved.toString()}
              description="Completed cases"
              gradient="gradient-premium"
            />
            <StatCard
              icon={TrendingUp}
              title="Avg Progress"
              value={`${Math.round(stats.avg_progress)}%`}
              description="Average case completion"
              gradient="gradient-primary"
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Case Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Case Details
            </TabsTrigger>
          </TabsList>

          {/* Cases Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search cases or clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending_client">Pending Client</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Cases Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Cases ({filteredCases.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading cases...</div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    Error loading cases: {String((error as any).message || error)}
                  </div>
                ) : filteredCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No cases found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-3 pr-4 font-medium">Case</th>
                          <th className="py-3 pr-4 font-medium">Client</th>
                          <th className="py-3 pr-4 font-medium">Status</th>
                          <th className="py-3 pr-4 font-medium">Created</th>
                          <th className="py-3 pr-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCases.map((c) => (
                          <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="py-3 pr-4">
                              <div>
                                <div className="font-medium">{c.title}</div>
                                {c.description && (
                                  <div className="text-xs text-muted-foreground truncate max-w-xs">
                                    {c.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="text-muted-foreground">
                                {c.profiles?.display_name || 
                                 `${c.profiles?.first_name || ''} ${c.profiles?.last_name || ''}`.trim() || 
                                 c.user_id.slice(0, 8)}
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <CaseStatusBadge status={c.status} />
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">
                              {new Date(c.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedCase(c.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Select onValueChange={(value) => handleStatusUpdate(c.id, value)}>
                                  <SelectTrigger className="w-auto">
                                    <SelectValue placeholder="Update" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="pending_client">Pending Client</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Case Details View */}
          <TabsContent value="details" className="space-y-6">
            {!selectedCase ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Case Selected</h3>
                  <p className="text-muted-foreground">
                    Select a case from the overview tab to view detailed information
                  </p>
                </CardContent>
              </Card>
            ) : selectedCaseData ? (
              <div className="space-y-6">
                {/* Case Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                        <CardTitle className="break-words">{selectedCaseData.case.title}</CardTitle>
                        <CardDescription className="line-clamp-2 break-words">
                          {selectedCaseData.case.description || "No description provided"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <CaseStatusBadge status={selectedCaseData.case.status} />
                        <Button variant="outline" onClick={() => setSelectedCase(null)}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="case-details">
                        <AccordionTrigger className="text-base font-medium">
                          View Full Case Details
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6">
                          {/* Full Description */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground">Description</h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {selectedCaseData.case.description || "No description provided for this case."}
                            </p>
                          </div>

                          {/* Case Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              <Hash className="h-4 w-4" />
                              Case Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Case ID:</span>
                                  <span className="font-mono text-xs">{selectedCaseData.case.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <CaseStatusBadge status={selectedCaseData.case.status} />
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Progress:</span>
                                  <span className="font-medium">{selectedCaseData.case.progress_percentage || 0}%</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Created:</span>
                                  <span>{new Date(selectedCaseData.case.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Last Update:</span>
                                  <span>{new Date(selectedCaseData.case.updated_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Case Statistics */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Case Statistics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  Messages:
                                </span>
                                <span className="font-medium">{selectedCaseMessages?.length || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  Updates:
                                </span>
                                <span className="font-medium">{selectedCaseData.progressUpdates?.length || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Paperclip className="h-3 w-3" />
                                  Attachments:
                                </span>
                                <span className="font-medium">{selectedCaseAttachments?.length || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Attachments Section */}
                          {selectedCaseAttachments && selectedCaseAttachments.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments
                              </h4>
                              <div className="space-y-2">
                                {selectedCaseAttachments.map((attachment: any) => (
                                  <div 
                                    key={attachment.id} 
                                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">{attachment.file_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {attachment.file_size && `${(attachment.file_size / 1024).toFixed(1)} KB • `}
                                          {new Date(attachment.created_at).toLocaleDateString()}
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

                {/* Case Management Tabs */}
                  <Tabs defaultValue="progress" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="progress">Progress</TabsTrigger>
                      <TabsTrigger value="messages">Messages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="progress">
                      <CaseProgress 
                        caseId={selectedCase}
                        steps={selectedCaseData.progress} 
                        progressPercentage={selectedCaseData.case?.progress_percentage || 0}
                        progressUpdates={selectedCaseData.progressUpdates || []}
                        isAdmin={true}
                      />
                    </TabsContent>

                    <TabsContent value="messages">
                      <CaseMessages 
                        caseId={selectedCase} 
                        messages={selectedCaseMessages || []} 
                        isAdmin={true}
                      />
                    </TabsContent>
                  </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground">Loading case details...</div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
