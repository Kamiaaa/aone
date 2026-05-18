// app/customer/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

// Helper function to format currency
const formatCurrency = (amount: number, currency = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface UserPackage {
  _id: string;
  name: string;
  price: number;
  speed: string;
  speedMbps: number;
  slug: string;
}

interface UserData {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  role: string;
  isActive: boolean;
  package: UserPackage | null;
}

export default function CustomerDashboardPage() {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    accountStatus: 'Active',
    dialBalance: 0.0,
    notifications: 0,
    currentPackage: { name: 'Loading...', price: 0, period: 'month' },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        setIsLoadingUser(true);
        const response = await fetch('/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const result = await response.json();
        
        if (result.success && result.data) {
          const userDataFromApi = result.data;
          setUserData(userDataFromApi);
          setDashboardData({
            accountStatus: userDataFromApi.isActive ? 'Active' : 'Inactive',
            dialBalance: 0.0,
            notifications: 0,
            currentPackage: userDataFromApi.package ? {
              name: userDataFromApi.package.name,
              price: userDataFromApi.package.price,
              period: 'month',
            } : { name: 'No Package Assigned', price: 0, period: 'month' },
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, [token]);

  const getFirstName = () => user?.firstName || userData?.firstName || 'Customer';

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="space-y-6">
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {getFirstName()}! 👋</h2>
          <p className="text-blue-100">Here's what's happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Account Status Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Account Status</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.accountStatus}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dial Balance Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Dial Balance</p>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(dashboardData.dialBalance)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Notifications</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.notifications}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Package Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Current Package</p>
                {isLoadingUser ? (
                  <p className="text-xl font-bold text-gray-800">Loading...</p>
                ) : (
                  <>
                    <p className="text-xl font-bold text-gray-800">{dashboardData.currentPackage.name}</p>
                    {dashboardData.currentPackage.price > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatCurrency(dashboardData.currentPackage.price)} / {dashboardData.currentPackage.period}
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}