import React from "react";
import { LucideIcon } from "lucide-react";

interface TrustBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-center space-x-3 p-4 bg-card/50 border border-border/30 rounded-lg hover:bg-card/80 transition-colors duration-300">
      <div className="p-2 rounded-lg bg-success-green/10">
        <Icon className="h-5 w-5 text-success-green" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};