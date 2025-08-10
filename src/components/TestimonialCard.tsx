import React from "react";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  title?: string;
  recoveredAmount?: string;
  rating: number;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  title,
  recoveredAmount,
  rating,
  delay = 0,
}) => {
  return (
    <div 
      className="bg-card border border-border/50 rounded-xl p-6 shadow-medium hover:shadow-large transition-all duration-500 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-premium-gold fill-premium-gold" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
      <blockquote className="text-foreground italic mb-4 leading-relaxed">
        "{quote}"
      </blockquote>
      <div className="border-t border-border/50 pt-4">
        <div className="flex justify-between items-end">
          <div>
            <cite className="text-sm font-semibold text-foreground not-italic">— {author}</cite>
            {title && <p className="text-xs text-muted-foreground">{title}</p>}
          </div>
          {recoveredAmount && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Recovered</p>
              <p className="text-sm font-bold text-success-green">{recoveredAmount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};