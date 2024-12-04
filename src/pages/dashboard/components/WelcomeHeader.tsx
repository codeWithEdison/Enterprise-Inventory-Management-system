interface WelcomeHeaderProps {
    userName: string;
  }
  
  export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {userName}!
      </h1>
      <p className="mt-1 text-gray-500">
        Here's what's happening in your inventory system today.
      </p>
    </div>
  );
  