import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  gradient?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  gradient = "gradient-primary",
  delay = 0,
}) => {
  return (
    <div 
      className="bg-card rounded-xl p-6 shadow-medium hover:shadow-large transition-all duration-500 animate-scale-in border border-border/50"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex p-3 rounded-lg ${gradient} mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold font-playfair text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};