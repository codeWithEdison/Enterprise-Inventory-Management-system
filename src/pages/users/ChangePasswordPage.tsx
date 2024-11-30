import React, { useState } from 'react';
import Input from '@/components/common/Input';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    setCurrentPasswordError(null);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setNewPasswordError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(null);
  };

  const handleSubmit = () => {
    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      hasError = true;
    }

    if (!newPassword) {
      setNewPasswordError('New password is required');
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError('New password must be at least 8 characters long');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Confirm password must match the new password');
      hasError = true;
    }

    if (!hasError) {
      // Handle successful password change
      console.log('Passwords changed successfully');
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>

        <Input
          title="Current Password"
          type="password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          error={currentPasswordError}
          onCloseError={() => setCurrentPasswordError(null)}
        />

        <Input
          title="New Password"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={newPasswordError}
          onCloseError={() => setNewPasswordError(null)}
        />

        <Input
          title="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          onCloseError={() => setConfirmPasswordError(null)}
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full mt-4"
          onClick={handleSubmit}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;