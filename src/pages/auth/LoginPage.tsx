/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/auth/LoginPage.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Input from '../../components/common/Input';
// import Alert, { AlertType } from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: 'admin@test.com',
    password: 'password123' 
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(formData);
      if (success) {
        navigate('/');
      } else {
        setErrors({ 
          email: 'Invalid credentials',
          password: 'Invalid credentials' 
        });
      }
    } catch (error) {
      setErrors({ 
        email: 'Login failed',
        password: 'Login failed'
      });
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

  return (
    <div className="min-h-screen bg-gray-100"> 
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="UR Logo" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  UR HG STOCK
                </h1>
                <p className="text-sm text-gray-500">
                  Nyarugenge  Campus
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="max-w-md  mx-auto px-4 py-16 ">
        <div className="bg-white shadow-xl rounded-lg p-8 py-4 ">
          <div className="text-start  mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Sign in 
            </h2>
            {/* <p className="mt-2 text-sm text-gray-600">
              Please enter your credentials
            </p> */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4"> 
            <Input
              title="Email"
              type="email"
              value={formData.email}
              onChange={e => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                clearError('email');
              }}
              error={errors.email}
              onCloseError={() => clearError('email')}
              className="bg-gray-50 focus:bg-white"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              // placeholder="Enter your email"
            />

            <Input
              title="Password"
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
              // placeholder="Enter your password"
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
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
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
            </div>

            {/* Test credentials */}
            {/* <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                Test credentials:
                <br />
                Email: admin@test.com
                <br />
                Password: password123
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;