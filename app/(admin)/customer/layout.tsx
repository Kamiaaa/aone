// app/customer/layout.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CustomerSidebar from '../components/CustomerSidebar';
import Header from '../components/Header';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getCustomerName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || 'Customer';
  };

  const getCustomerInitials = () => {
    const first = user?.firstName?.charAt(0) || '';
    const last = user?.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <CustomerSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onLogout={handleLogout}
          user={user}
        />

        <div className="flex-1">
          <Header
            title="Customer Dashboard"
            subtitle={`Welcome back, ${getCustomerName()}`}
            userName={getCustomerName()}
            userRole="Customer"
            userInitials={getCustomerInitials()}
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={handleLogout}
            notificationCount={0}
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