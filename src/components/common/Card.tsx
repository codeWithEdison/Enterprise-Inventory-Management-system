import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
      <div className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200",
        className
      )}>
        {children}
      </div>
    );
  };