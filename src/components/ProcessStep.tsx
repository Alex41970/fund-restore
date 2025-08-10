import React from "react";
import { LucideIcon } from "lucide-react";

interface ProcessStepProps {
  stepNumber: number;
  title: string;
  description: string;
  details: string[];
  icon: LucideIcon;
  isEven?: boolean;
  delay?: number;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  stepNumber,
  title,
  description,
  details,
  icon: Icon,
  isEven = false,
  delay = 0,
}) => {
  return (
    <div 
      className={`flex items-center gap-8 animate-fade-in ${isEven ? 'flex-row-reverse' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg gradient-primary">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold font-playfair text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-elegant">
          {stepNumber}
        </div>
      </div>
    </div>
  );
};