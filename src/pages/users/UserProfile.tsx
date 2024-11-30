import useAuth from '@/hooks/useAuth';
import React from 'react';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-100 text-gray-800 rounded-lg shadow-md">
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-blue-100 rounded-full p-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
            {user.firstName[0]}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-700">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-md text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">
            Personal Details
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Phone:</strong> {user.phone || 'Not Provided'}
            </p>
            <p>
              <strong>NID:</strong> {user.nid || 'Not Provided'}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`font-bold ${
                  user.status === 'ACTIVE'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {user.status}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">
            Roles & Departments
          </h2>
          <div className="space-y-4">
            {user.userRoles.map((role, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-gray-50 border border-blue-100"
              >
                <p>
                  <strong>Role:</strong> {role.role.name}
                </p>
                <p>
                  <strong>Department:</strong>{' '}
                  {role.department.name || 'Not Assigned'}
                </p>
                <p>
                  <strong>Start Date:</strong>{' '}
                  {new Date(role.startDate).toLocaleDateString()}
                </p>
                {role.endDate && (
                  <p>
                    <strong>End Date:</strong>{' '}
                    {new Date(role.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
