import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Archive,
  Pause
} from "lucide-react";

interface CaseStatusBadgeProps {
  status: string;
  className?: string;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return {
          icon: <Clock className="h-3 w-3" />,
          label: "Open",
          className: "bg-muted text-muted-foreground border-muted-foreground/20"
        };
      case "in_progress":
        return {
          icon: <Play className="h-3 w-3" />,
          label: "In Progress",
          className: "bg-trust-blue/10 text-trust-blue border-trust-blue/20"
        };
      case "pending_client":
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "Pending Client",
          className: "bg-warning-amber/10 text-warning-amber border-warning-amber/20"
        };
      case "under_review":
        return {
          icon: <Pause className="h-3 w-3" />,
          label: "Under Review",
          className: "bg-secondary text-secondary-foreground border-secondary-foreground/20"
        };
      case "resolved":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Resolved",
          className: "bg-success-green/10 text-success-green border-success-green/20"
        };
      case "closed":
        return {
          icon: <XCircle className="h-3 w-3" />,
          label: "Closed",
          className: "bg-destructive/10 text-destructive border-destructive/20"
        };
      case "archived":
        return {
          icon: <Archive className="h-3 w-3" />,
          label: "Archived",
          className: "bg-muted/50 text-muted-foreground border-muted-foreground/10"
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
          className: "bg-muted text-muted-foreground border-muted-foreground/20"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${config.className} ${className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};