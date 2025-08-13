import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CaseProgress } from "@/components/CaseProgress";
import { CaseMessages } from "@/components/CaseMessages";
import AttachmentViewer from "@/components/AttachmentViewer";

import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { StatCard } from "@/components/StatCard";
import { AdminInvoiceManager } from "@/components/AdminInvoiceManager";
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
  MessageSquare,
  Shield,
  UserCheck,
  UserX,
  Settings,
  CreditCard,
  Trash2
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

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  profiles?: {
    display_name: string;
    first_name: string;
    last_name: string;
  };
  user_roles: Array<{
    role: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

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
        .select("status, progress_percentage");
      
      if (error) throw error;

      const total_cases = allCases.length;
      const in_progress = allCases.filter(c => 
        ["in_progress", "pending_client", "under_review"].includes(c.status)
      ).length;
      const resolved = allCases.filter(c => c.status === "resolved").length;
      
      const progressValues = allCases
        .map(c => c.progress_percentage || 0)
        .filter(p => p > 0);
      const avg_progress = progressValues.length > 0 
        ? progressValues.reduce((a, b) => a + b, 0) / progressValues.length 
        : 0;

      return { total_cases, in_progress, resolved, avg_progress };
    },
  });

  // Fetch selected case details
  const { data: selectedCaseData, isLoading: caseDetailsLoading, error: caseDetailsError } = useQuery({
    queryKey: ["case-details", selectedCase],
    queryFn: async () => {
      if (!selectedCase) return null;
      
      try {
        const [caseData, progressSteps, progressUpdates] = await Promise.all([
          supabase.from("cases").select("*").eq("id", selectedCase).single(),
          supabase.from("case_progress").select("*").eq("case_id", selectedCase).order("step_order"),
          supabase.from("case_progress_updates").select("*").eq("case_id", selectedCase).order("created_at", { ascending: false }),
        ]);

        // If case exists, fetch the profile separately
        let profile = null;
        if (caseData.data?.user_id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("display_name, first_name, last_name, phone_number, email")
            .eq("id", caseData.data.user_id)
            .single();
          profile = profileData;
        }

        return {
          case: { ...caseData.data, profiles: profile },
          progress: progressSteps.data || [],
          progressUpdates: progressUpdates.data || [],
        };
      } catch (error) {
        console.error("Error fetching case details:", error);
        throw error;
      }
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
        .from("attachments")
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

  // Fetch all users with roles
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<UserWithRoles[]> => {
      // First get all user_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");
      
      if (rolesError) throw rolesError;

      // Then get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, first_name, last_name")
        .order("display_name", { ascending: true });
      
      if (profilesError) throw profilesError;
      
      // Combine the data
      const usersWithRoles = (profiles || []).map(profile => {
        const roles = (userRoles || [])
          .filter(role => role.user_id === profile.id)
          .map(role => ({ role: role.role }));
        
        return {
          id: profile.id,
          email: `User ${profile.id.slice(0, 8)}`, // Fallback display
          created_at: new Date().toISOString(),
          profiles: {
            display_name: profile.display_name,
            first_name: profile.first_name,
            last_name: profile.last_name,
          },
          user_roles: roles,
        };
      });
      
      return usersWithRoles;
    },
  });

  // Filter users
  const filteredUsers = users?.filter(u => {
    const matchesSearch = !userSearchTerm || 
      u.profiles?.display_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.profiles?.first_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.profiles?.last_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

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
      
      toast.success(t("admin.notifications.statusUpdated"));
      
      // Invalidate queries to refresh data immediately
      queryClient.invalidateQueries({ queryKey: ["admin-cases"] });
      queryClient.invalidateQueries({ queryKey: ["case-stats"] });
      queryClient.invalidateQueries({ queryKey: ["case-details", caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-messages", caseId] });
      queryClient.invalidateQueries({ queryKey: ["progress-updates", caseId] });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`${t("admin.notifications.statusUpdateFailed")}: ${errorMessage}`);
      console.error("Error updating case status:", error);
    }
  };

  const handleRoleUpdate = async (userId: string, action: 'add' | 'remove') => {
    try {
      // Check if this would leave the system without any admins
      if (action === 'remove') {
        const adminCount = users?.filter(u => 
          u.user_roles.some(r => r.role === 'admin')
        ).length || 0;
        
        if (adminCount <= 1) {
          toast.error(t("admin.notifications.cannotRemoveLastAdmin"));
          return;
        }
      }

      if (action === 'add') {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: 'admin' });
        
        if (error) throw error;
        toast.success(t("admin.notifications.userPromoted"));
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        
        if (error) throw error;
        toast.success(t("admin.notifications.adminRemoved"));
      }
      
      // Refresh users data
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`${t("admin.notifications.roleUpdateFailed")}: ${errorMessage}`);
      console.error("Error updating user role:", error);
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{t("admin.title")} | Case Management</title>
        <meta name="description" content={t("admin.description")} />
        <link rel="canonical" href={window.location.origin + "/admin"} />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
          <p className="text-muted-foreground">{t("admin.subtitle")}</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={FileText}
              title={t("admin.stats.totalCases")}
              value={stats.total_cases.toString()}
              description={t("admin.stats.allCases")}
              gradient="gradient-primary"
            />
            <StatCard
              icon={Clock}
              title={t("admin.stats.inProgress")}
              value={stats.in_progress.toString()}
              description={t("admin.stats.activeCases")}
              gradient="gradient-success"
            />
            <StatCard
              icon={CheckCircle}
              title={t("admin.stats.resolved")}
              value={stats.resolved.toString()}
              description={t("admin.stats.completedCases")}
              gradient="gradient-premium"
            />
            <StatCard
              icon={TrendingUp}
              title={t("admin.stats.avgProgress")}
              value={`${Math.round(stats.avg_progress)}%`}
              description={t("admin.stats.averageCompletion")}
              gradient="gradient-primary"
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("admin.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("admin.tabs.details")}
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("admin.tabs.invoices")}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("admin.tabs.users")}
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
            ) : caseDetailsLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground">Loading case details...</div>
                </CardContent>
              </Card>
            ) : caseDetailsError ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-destructive">
                    Error loading case details: {String((caseDetailsError as any).message || caseDetailsError)}
                  </div>
                </CardContent>
              </Card>
            ) : selectedCaseData && selectedCaseData.case ? (
              <div className="space-y-6">
                {/* Case Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 space-y-2">
                         <CardTitle className="break-words">{selectedCaseData.case?.title || 'Unknown Case'}</CardTitle>
                         <CardDescription className="break-words">
                           {selectedCaseData.case?.description 
                             ? (selectedCaseData.case.description.length > 20 
                               ? `${selectedCaseData.case.description.substring(0, 20)}...` 
                               : selectedCaseData.case.description)
                             : "No description provided"
                           }
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                         <CaseStatusBadge status={selectedCaseData.case?.status || 'unknown'} />
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
                            <Textarea 
                              readOnly 
                              value={selectedCaseData.case?.description || "No description provided for this case."}
                              className="min-h-[120px] resize-none bg-muted/30 text-foreground"
                              rows={6}
                            />
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
                                   <span className="font-mono text-xs">{selectedCaseData.case?.id || 'Unknown'}</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Status:</span>
                                   <CaseStatusBadge status={selectedCaseData.case?.status || 'unknown'} />
                                 </div>
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Progress:</span>
                                   <span className="font-medium">{selectedCaseData.case?.progress_percentage || 0}%</span>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Created:</span>
                                   <span>{selectedCaseData.case?.created_at ? new Date(selectedCaseData.case.created_at).toLocaleDateString() : 'Unknown'}</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Last Update:</span>
                                   <span>{selectedCaseData.case?.updated_at ? new Date(selectedCaseData.case.updated_at).toLocaleDateString() : 'Unknown'}</span>
                                 </div>
                              </div>
                            </div>
                          </div>

                          {/* Client Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Client Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                               <div className="space-y-2">
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Name:</span>
                                   <span className="font-medium">
                                     {selectedCaseData.case?.profiles?.display_name || 
                                      `${selectedCaseData.case?.profiles?.first_name || ''} ${selectedCaseData.case?.profiles?.last_name || ''}`.trim() || 
                                      'Not provided'}
                                   </span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Email:</span>
                                   <span className="font-medium">
                                     {selectedCaseData.case?.profiles?.email || 'Not provided'}
                                   </span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Phone:</span>
                                   <span className="font-medium">
                                     {selectedCaseData.case?.profiles?.phone_number || 'Not provided'}
                                   </span>
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 <div className="flex justify-between">
                                   <span className="text-muted-foreground">Client ID:</span>
                                   <span className="font-mono text-xs">{selectedCaseData.case?.user_id}</span>
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
                              <AttachmentViewer attachments={selectedCaseAttachments} />
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
                        steps={selectedCaseData?.progress || []} 
                        progressPercentage={selectedCaseData?.case?.progress_percentage || 0}
                        progressUpdates={selectedCaseData?.progressUpdates || []}
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

          {/* Invoice Management */}
          <TabsContent value="invoices" className="space-y-6">
            <AdminInvoiceManager />
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            {/* User Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search users by name or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users ({filteredUsers.length})
                </CardTitle>
                <CardDescription>
                  Manage user roles and permissions. At least one admin must remain in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-3 pr-4 font-medium">User</th>
                          <th className="py-3 pr-4 font-medium">Name</th>
                          <th className="py-3 pr-4 font-medium">Roles</th>
                          <th className="py-3 pr-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => {
                          const isAdmin = user.user_roles.some(r => r.role === 'admin');
                          const adminCount = users?.filter(u => 
                            u.user_roles.some(r => r.role === 'admin')
                          ).length || 0;
                          const isLastAdmin = isAdmin && adminCount <= 1;
                          
                          return (
                            <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <div className="font-mono text-xs text-muted-foreground">
                                      {user.id.slice(0, 8)}...
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                <div>
                                  <div className="font-medium">
                                    {user.profiles?.display_name || 
                                     `${user.profiles?.first_name || ''} ${user.profiles?.last_name || ''}`.trim() || 
                                     'No name set'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.profiles?.first_name && user.profiles?.last_name 
                                      ? `${user.profiles.first_name} ${user.profiles.last_name}`
                                      : 'Profile incomplete'}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                <div className="flex flex-wrap gap-1">
                                  {user.user_roles.length > 0 ? (
                                    user.user_roles.map((role, index) => (
                                      <Badge 
                                        key={index}
                                        variant={role.role === 'admin' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {role.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                        {role.role}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      user
                                    </Badge>
                                  )}
                                </div>
                              </td>
                               <td className="py-3 pr-4">
                                <div className="flex gap-2">
                                  {isAdmin ? (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          disabled={isLastAdmin}
                                          className="text-destructive hover:text-destructive"
                                        >
                                          <UserX className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Remove Admin Role</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to remove admin role from this user? 
                                            They will lose access to admin functions.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleRoleUpdate(user.id, 'remove')}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                                          >
                                            Remove Admin
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  ) : (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-primary hover:text-primary"
                                        >
                                          <UserCheck className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Promote to Admin</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to grant admin privileges to this user? 
                                            They will have access to all admin functions including user management.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleRoleUpdate(user.id, 'add')}
                                          >
                                            Grant Admin Access
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isLastAdmin}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to permanently delete this user? This action cannot be undone and will remove:
                                          <ul className="list-disc list-inside mt-2 space-y-1">
                                            <li>User profile and account data</li>
                                            <li>All associated cases and messages</li>
                                            <li>Payment history and invoices</li>
                                            <li>Uploaded attachments</li>
                                          </ul>
                                          {isLastAdmin && (
                                            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                              <strong>Cannot delete:</strong> This is the last admin user. At least one admin must remain in the system.
                                            </div>
                                          )}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleUserDelete(user.id)}
                                          disabled={isLastAdmin}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                                        >
                                          Delete User
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                                {isLastAdmin && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Last admin
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
