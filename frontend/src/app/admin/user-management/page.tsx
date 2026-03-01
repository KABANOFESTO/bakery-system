'use client';

import React, { FormEvent, useMemo, useState } from 'react';
import { Loader2, Mail, Shield, UserPlus, Users } from 'lucide-react';
import { useAdminCreateUserMutation, useGetAllUsersQuery } from '@/lib/redux/slices/AuthSlice';

type UserRole = 'admin' | 'user';

interface UserRecord {
  id: string;
  email: string;
  role: string;
  username?: string | null;
  createdAt: string;
}

const UserManagementPage = () => {
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    role: 'user' as UserRole,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({});
  const [adminCreateUser, { isLoading: isCreating }] = useAdminCreateUserMutation();

  const users = useMemo(() => {
    if (!Array.isArray(usersData)) return [];
    return usersData as UserRecord[];
  }, [usersData]);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formState.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    try {
      await adminCreateUser({
        email: formState.email.trim(),
        username: formState.username.trim() || undefined,
        role: formState.role,
      }).unwrap();

      setSuccessMessage('User created. A temporary password has been sent by email.');
      setFormState({ email: '', username: '', role: 'user' });
      refetch();
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as { data?: { message?: string } }).data?.message === 'string'
      ) {
        setErrorMessage((error as { data: { message: string } }).data.message);
        return;
      }
      setErrorMessage('Failed to create user.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-orange-600" />
            Create User
          </h2>
          <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username (Optional)</label>
              <input
                type="text"
                value={formState.username}
                onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="username"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formState.role}
                onChange={(e) => setFormState((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-70"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isCreating ? 'Creating...' : 'Create User & Send Password'}
              </button>
            </div>
          </form>

          {errorMessage && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}
          {successMessage && <p className="mt-3 text-sm text-green-700">{successMessage}</p>}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Existing Users
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Username</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-gray-800">{user.email}</td>
                      <td className="py-2 pr-4 text-gray-700">{user.username || '-'}</td>
                      <td className="py-2 pr-4">
                        <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 capitalize">{user.role}</span>
                      </td>
                      <td className="py-2 pr-4 text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
