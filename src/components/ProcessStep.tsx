import React from "react";
import { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isLast?: boolean;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  step,
  title,
  description,
  icon: Icon,
  isLast = false,
}) => {
  return (
    <div className="relative flex items-start space-x-4 animate-slide-up" style={{ animationDelay: `${step * 200}ms` }}>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-white font-bold text-lg shadow-medium">
          {step}
        </div>
        {!isLast && (
          <div className="w-0.5 h-16 bg-gradient-to-b from-trust-blue to-trust-blue-light mt-4" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-5 w-5 text-trust-blue" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};