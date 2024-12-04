import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import Input from '../../components/common/Input';
import { cn } from '../../lib/utils';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }
    if (formData.password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);
    try {
      // Call your reset password API here with token and new password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      setErrors({ password: 'Failed to reset password' });
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof typeof errors];
      return newErrors;
    });
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid reset link</h2>
        <p className="text-gray-600 mb-6">
          This password reset link is invalid or has expired.
        </p>
        <button
          onClick={() => navigate('/auth/forgot-password')}
          className="text-primary-600 hover:text-primary-500 font-medium"
        >
          Request a new link
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Password reset successful</h2>
        <p className="text-gray-600">
          Your password has been reset successfully. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset password</h2>
      <p className="text-sm text-gray-600 mb-6">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          title="New Password"
          type="password"
          value={formData.password}
          onChange={e => {
            setFormData(prev => ({ ...prev, password: e.target.value }));
            clearError('password');
          }}
          error={errors.password}
          onCloseError={() => clearError('password')}
          className="bg-gray-50 focus:bg-white"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
        />

        <Input
          title="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          onChange={e => {
            setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
            clearError('confirmPassword');
          }}
          error={errors.confirmPassword}
          onCloseError={() => clearError('confirmPassword')}
          className="bg-gray-50 focus:bg-white"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex justify-center py-2 px-4",
            "border border-transparent rounded-md shadow-sm",
            "text-sm font-medium text-white",
            "bg-primary-600 hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Resetting password...
            </div>
          ) : (
            'Reset password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;