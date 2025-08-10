import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProgressStepProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  step_order: number;
}

interface ProgressUpdateProps {
  id: string;
  update_message: string;
  progress_percentage: number;
  created_at: string;
  created_by: string;
}

interface CaseProgressProps {
  caseId: string;
  steps: ProgressStepProps[];
  progressPercentage: number;
  progressUpdates: ProgressUpdateProps[];
  isAdmin?: boolean;
}

export const CaseProgress: React.FC<CaseProgressProps> = ({ 
  caseId, 
  steps, 
  progressPercentage, 
  progressUpdates, 
  isAdmin = false 
}) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [newProgressPercentage, setNewProgressPercentage] = useState(progressPercentage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleProgressUpdate = async () => {
    if (!updateMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter an update message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert progress update
      const { error: updateError } = await supabase
        .from("case_progress_updates")
        .insert({
          case_id: caseId,
          update_message: updateMessage,
          progress_percentage: newProgressPercentage,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (updateError) throw updateError;

      // Update case progress percentage
      const { error: caseError } = await supabase
        .from("cases")
        .update({ progress_percentage: newProgressPercentage })
        .eq("id", caseId);

      if (caseError) throw caseError;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["case-details", caseId] });
      queryClient.invalidateQueries({ queryKey: ["progress-updates", caseId] });
      queryClient.invalidateQueries({ queryKey: ["admin-cases"] });

      toast({
        title: "Success",
        description: "Progress update added successfully",
      });

      setUpdateMessage("");
      setShowUpdateForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add progress update",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success-green" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-warning-amber" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-success-green/10 text-success-green border-success-green/20">Completed</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="bg-warning-amber/10 text-warning-amber border-warning-amber/20">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Case Progress</h3>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {isAdmin && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Admin Controls</CardTitle>
              {!showUpdateForm && (
                <Button 
                  onClick={() => setShowUpdateForm(true)}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Progress Update
                </Button>
              )}
            </div>
          </CardHeader>
          {showUpdateForm && (
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Progress Percentage</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgressPercentage}
                  onChange={(e) => setNewProgressPercentage(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Update Message</label>
                <Textarea
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Enter progress update message..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleProgressUpdate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Update"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowUpdateForm(false);
                    setUpdateMessage("");
                    setNewProgressPercentage(progressPercentage);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {progressUpdates.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Progress Updates</h4>
          {progressUpdates.map((update) => (
            <div key={update.id} className="flex gap-3 p-4 rounded-lg border bg-card">
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle className="h-5 w-5 text-success-green" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(update.created_at).toLocaleDateString()}
                  </span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {update.progress_percentage}% Complete
                  </Badge>
                </div>
                <p className="text-sm">{update.update_message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {steps.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Case Steps</h4>
          {steps.map((step) => (
            <div key={step.id} className="flex gap-3 p-4 rounded-lg border bg-card">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{step.title}</h4>
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};