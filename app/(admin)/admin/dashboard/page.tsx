// app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { FiUsers, FiUserCheck, FiCalendar, FiUserPlus } from 'react-icons/fi';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: FiUserCheck,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'New This Month',
      value: stats?.newUsersThisMonth || 0,
      icon: FiCalendar,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Welcome to Admin Panel</h2>
          <p className="mt-2 text-blue-100">
            Manage users, view analytics, and control your application settings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users/create"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-blue-50 hover:border-blue-200 group"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">
                  Create New User
                </p>
                <p className="text-sm text-gray-500">Add a new user to the system</p>
              </div>
              <div className="rounded-full bg-blue-100 p-2 group-hover:bg-blue-200">
                <FiUserPlus className="h-5 w-5 text-blue-600" />
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-blue-50 hover:border-blue-200 group"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">
                  Manage Users
                </p>
                <p className="text-sm text-gray-500">View and edit existing users</p>
              </div>
              <div className="rounded-full bg-blue-100 p-2 group-hover:bg-blue-200">
                <FiUsers className="h-5 w-5 text-blue-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}