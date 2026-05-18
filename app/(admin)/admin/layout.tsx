// app/admin/layout.tsx - simplified without token prop
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth(); // Remove token if not needed
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getAdminName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || 'Admin';
  };

  const getAdminInitials = () => {
    const first = user?.firstName?.charAt(0) || '';
    const last = user?.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onLogout={handleLogout}
          user={user}
        />

        <div className="flex-1">
          <Header
            title="Admin Dashboard"
            subtitle={`Welcome back, ${getAdminName()}`}
            userName={getAdminName()}
            userRole="Administrator"
            userInitials={getAdminInitials()}
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={handleLogout}
            notificationCount={0}
            // token prop removed - modal will use useAuth directly
          />
          
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}