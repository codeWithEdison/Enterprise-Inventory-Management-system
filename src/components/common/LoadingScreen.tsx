// src/components/common/LoadingScreen.tsx
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

// src/components/common/LoadingSpinner.tsx
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    </div>
  );
};

export { LoadingScreen, LoadingSpinner };