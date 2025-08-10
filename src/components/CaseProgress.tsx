import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface ProgressStepProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  step_order: number;
}

interface CaseProgressProps {
  steps: ProgressStepProps[];
  progressPercentage: number;
}

export const CaseProgress: React.FC<CaseProgressProps> = ({ steps, progressPercentage }) => {
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
      
      <div className="space-y-4">
        {steps.map((step, index) => (
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
    </div>
  );
};