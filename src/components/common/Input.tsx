// Input.tsx
import React, { ReactNode } from "react";
import Alert, {AlertType} from "./Alert";

interface InputProps {
  title?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value?: string | number;
  error?: string | null;
  onCloseError?: () => void;
  type: React.HTMLInputTypeAttribute;
  className?: string;
  icon?: ReactNode;
}

const Input: React.FC<InputProps> = ({
  title,
  min,
  max,
  onChange,
  disabled,
  value,
  error,
  onCloseError,
  type,
  className,
  icon,
}) => {
  return (
    <div className="w-full">
      {title && <div className="text-md">{title}</div>}
      <div className="relative">
        <input
          type={type}
          className={`px-3 py-2 text-sm w-full border ${
            error ? "border-red-600" : " outline-my-blue border-my-blue"
          } rounded-md ${
            className === undefined ? "bg-gray-100" : className
          }`}
          disabled={disabled}
          value={value}
          onChange={onChange}
          min={type === "date" ? min : undefined}
          max={type === "date" ? max : undefined}
        />
        {icon && (
          <div className="absolute top-2 right-2">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-600 mt-1">
          {onCloseError &&
           <Alert
           className="bg-danger" 
           alertType={AlertType.DANGER} title={error} close={onCloseError}/>} 
          {/* {error}
          {onCloseError && (
            <button className="ml-2 text-sm" onClick={onCloseError}>
              Close
            </button>
          )} */}  
        </div>
      )}
    </div>
  );
};

export default Input;
