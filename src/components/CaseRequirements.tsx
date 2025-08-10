import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Plus, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";

interface RequirementProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "submitted" | "approved";
  required_by?: string;
  created_at: string;
}

interface CaseRequirementsProps {
  caseId: string;
  requirements: RequirementProps[];
  isAdmin?: boolean;
}

export const CaseRequirements: React.FC<CaseRequirementsProps> = ({ 
  caseId, 
  requirements, 
  isAdmin = false 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddingRequirement, setIsAddingRequirement] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    title: "",
    description: "",
    required_by: "",
  });

  const handleAddRequirement = async () => {
    if (!newRequirement.title.trim() || !user) return;

    try {
      const { error } = await supabase
        .from("case_requirements")
        .insert({
          case_id: caseId,
          title: newRequirement.title.trim(),
          description: newRequirement.description.trim(),
          required_by: newRequirement.required_by || null,
          user_id: user.id,
        });

      if (error) throw error;

      setNewRequirement({ title: "", description: "", required_by: "" });
      setIsAddingRequirement(false);
      toast.success("Requirement added");
      queryClient.invalidateQueries({ queryKey: ["case-requirements", caseId] });
    } catch (error) {
      toast.error("Failed to add requirement");
      console.error("Error adding requirement:", error);
    }
  };

  const handleStatusUpdate = async (requirementId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("case_requirements")
        .update({ status: newStatus })
        .eq("id", requirementId);

      if (error) throw error;

      toast.success("Requirement updated");
      queryClient.invalidateQueries({ queryKey: ["case-requirements", caseId] });
    } catch (error) {
      toast.error("Failed to update requirement");
      console.error("Error updating requirement:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success-green" />;
      case "submitted":
        return <Clock className="h-5 w-5 text-warning-amber" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success-green/10 text-success-green border-success-green/20">Approved</Badge>;
      case "submitted":
        return <Badge className="bg-warning-amber/10 text-warning-amber border-warning-amber/20">Submitted</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Requirements
          </CardTitle>
          {isAdmin && (
            <Dialog open={isAddingRequirement} onOpenChange={setIsAddingRequirement}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Requirement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Requirement title"
                    value={newRequirement.title}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newRequirement.description}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Input
                    type="date"
                    placeholder="Required by (optional)"
                    value={newRequirement.required_by}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, required_by: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddRequirement} disabled={!newRequirement.title.trim()}>
                      Add Requirement
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingRequirement(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No requirements yet</p>
        ) : (
          requirements.map((requirement) => (
            <div key={requirement.id} className="flex gap-3 p-4 rounded-lg border bg-card">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(requirement.status)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{requirement.title}</h4>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(requirement.status)}
                    {isAdmin && requirement.status === "submitted" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(requirement.id, "approved")}
                        className="text-success-green border-success-green/20 hover:bg-success-green/10"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{requirement.description}</p>
                {requirement.required_by && (
                  <p className="text-xs text-warning-amber">
                    Required by: {new Date(requirement.required_by).toLocaleDateString()}
                  </p>
                )}
                {!isAdmin && requirement.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(requirement.id, "submitted")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Mark as Submitted
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};