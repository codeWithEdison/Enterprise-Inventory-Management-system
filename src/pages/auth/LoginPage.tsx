import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import  useAuth  from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { LoginInput, ApiError } from '../../types/api/types';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof validationErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(formData);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      const apiError = error as ApiError;
      setApiError(apiError.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const clearValidationError = (field: keyof typeof validationErrors) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 py-4">
      <div className="text-start mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Sign in
        </h2>
      </div>

      {apiError && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          title="Email"
          type="email"
          value={formData.email}
          onChange={e => {
            setFormData(prev => ({ ...prev, email: e.target.value }));
            clearValidationError('email');
            setApiError('');
          }}
          error={validationErrors.email}
          onCloseError={() => clearValidationError('email')}
          className="bg-gray-50 focus:bg-white"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
        />

        <Input
          title="Password"
          type="password"
          value={formData.password}
          onChange={e => {
            setFormData(prev => ({ ...prev, password: e.target.value }));
            clearValidationError('password');
            setApiError('');
          }}
          error={validationErrors.password}
          onCloseError={() => clearValidationError('password')}
          className="bg-gray-50 focus:bg-white"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

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
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;