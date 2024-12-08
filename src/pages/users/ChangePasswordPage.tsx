import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordRule {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    validator: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letter',
    validator: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'Contains number',
    validator: (password) => /\d/.test(password),
  },
];

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Partial<ChangePasswordForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [passedRules, setPassedRules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Update passed rules whenever new password changes
    const newPassedRules = passwordRules.reduce((acc, rule) => ({
      ...acc,
      [rule.id]: rule.validator(formData.newPassword)
    }), {});
    setPassedRules(newPassedRules);
  }, [formData.newPassword]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordForm> = {};
    let isValid = true;

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else {
      const allRulesPassed = Object.values(passedRules).every(passed => passed);
      if (!allRulesPassed) {
        newErrors.newPassword = 'Password must meet all requirements';
        isValid = false;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setApiError(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ChangePasswordForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setApiError('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Password"
        subtitle="Update your password to keep your account secure"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </PageHeader>

      <div className="max-w-xl mx-auto">
        <Card className="p-6">
          {apiError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>Password changed successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange('currentPassword')}
                className={cn(
                  "w-full rounded-md border px-4 py-2",
                  errors.currentPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                )}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                className={cn(
                  "w-full rounded-md border px-4 py-2",
                  errors.newPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                )}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={cn(
                  "w-full rounded-md border px-4 py-2",
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                )}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</h3>
              <ul className="space-y-2">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.id}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors",
                      passedRules[rule.id] ? "text-green-600" : "text-gray-600"
                    )}
                  >
                    {passedRules[rule.id] ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    )}
                    {rule.label}
                  </li>
                ))}
                <li
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    formData.confirmPassword && formData.confirmPassword === formData.newPassword
                      ? "text-green-600"
                      : "text-gray-600"
                  )}
                >
                  {formData.confirmPassword && formData.confirmPassword === formData.newPassword ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  )}
                  Passwords match
                </li>
              </ul>
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
                  Changing Password...
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;