// src/components/common/Alert.tsx
import { useEffect } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils"; 

export enum AlertType {
  SUCCESS = "SUCCESS",
  DEFAULT = "DEFAULT",
  DANGER = "DANGER",
  INFO = "INFO",
  WARNING = "WARNING",
}

export interface AlertProps {
  alertType: AlertType;
  title: string;
  description?: string;
  close: () => void;
  className?: string;
  timeOut?: number;
}

const getAlertStyles = (type: AlertType) => {
  switch (type) {
    case AlertType.SUCCESS:
      return {
        wrapper: "bg-green-50 border-green-200",
        icon: "text-green-500",
        title: "text-green-800",
        description: "text-green-700",
        closeHover: "hover:bg-green-100"
      };
    case AlertType.DANGER:
      return {
        wrapper: "bg-red-50 border-red-200",
        icon: "text-red-500",
        title: "text-red-800",
        description: "text-red-700",
        closeHover: "hover:bg-red-100"
      };
    case AlertType.WARNING:
      return {
        wrapper: "bg-yellow-50 border-yellow-200",
        icon: "text-yellow-500",
        title: "text-yellow-800",
        description: "text-yellow-700",
        closeHover: "hover:bg-yellow-100"
      };
    case AlertType.INFO:
      return {
        wrapper: "bg-blue-50 border-blue-200",
        icon: "text-blue-500",
        title: "text-blue-800",
        description: "text-blue-700",
        closeHover: "hover:bg-blue-100"
      };
    default:
      return {
        wrapper: "bg-gray-50 border-gray-200",
        icon: "text-gray-500",
        title: "text-gray-800",
        description: "text-gray-700",
        closeHover: "hover:bg-gray-100"
      };
  }
};

const Alert = ({ alertType, title, description, close, className, timeOut }: AlertProps) => {
  useEffect(() => {
    if (timeOut) {
      const timer = setTimeout(close, timeOut);
      return () => clearTimeout(timer);
    }
  }, [close, timeOut]);

  const styles = getAlertStyles(alertType);

  const Icon = () => {
    switch (alertType) {
      case AlertType.SUCCESS:
        return <CheckCircle className={cn("h-5 w-5", styles.icon)} />;
      case AlertType.DANGER:
        return <AlertCircle className={cn("h-5 w-5", styles.icon)} />;
      case AlertType.WARNING:
        return <AlertTriangle className={cn("h-5 w-5", styles.icon)} />;
      case AlertType.INFO:
        return <Info className={cn("h-5 w-5", styles.icon)} />;
      default:
        return <Info className={cn("h-5 w-5", styles.icon)} />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border p-4 shadow-sm animate-in fade-in",
        styles.wrapper,
        alertType === AlertType.DANGER && "shake-animation",
        className
      )}
      role="alert"
    >
      <div className="flex gap-3 items-start">
        <Icon />
        <div>
          <h3 className={cn("font-medium leading-tight", styles.title)}>
            {title}
          </h3>
          {description && (
            <p className={cn("text-sm mt-0.5", styles.description)}>
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={close}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          styles.closeHover
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close alert</span>
      </button>
    </div>
  );
};

export default Alert;