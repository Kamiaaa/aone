// app/profile/page.tsx (or wherever your Profile component is)
'use client';
import ProtectedRoute from '../../components/ProtectedRoute';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ChangePasswordModal from '../../components/ChangePasswordModal';

// User data interface
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

interface ProfileProps {
  token?: string | null;
  onPasswordChange?: () => void;
}

export default function Profile({ token, onPasswordChange }: ProfileProps) {
  const { user } = useAuth(); // Remove changePassword from here as modal will handle it
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for user data with package
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch user data with package information
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      try {
        setIsLoadingUser(true);
        setFetchError(null);
        
        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched user data:', result); // Debug log

        if (result.success && result.data) {
          setUserData(result.data);
        } else {
          throw new Error(result.message || 'Invalid response from server');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to load user data');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Handle successful password change
  const handlePasswordChangeSuccess = () => {
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setTimeout(() => setMessage(null), 3000);
    onPasswordChange?.();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const first = user?.firstName?.charAt(0) || userData?.firstName?.charAt(0) || '';
    const last = user?.lastName?.charAt(0) || userData?.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    const first = user?.firstName || userData?.firstName || '';
    const last = user?.lastName || userData?.lastName || '';
    const fullName = `${first} ${last}`.trim();
    return fullName || 'Not provided';
  };

  const getEmail = () => {
    return user?.email || userData?.email || 'Not provided';
  };

  const getMobileNumber = () => {
    return user?.mobileNumber || userData?.mobileNumber || 'Not provided';
  };

  const getAddress = () => {
    // Check both userData and user objects for address
    const address = userData?.address || user?.address;
    
    // Check if address exists and is not empty
    if (address && address.trim() !== '') {
      return address;
    }
    
    return 'No address provided';
  };

  const getCustomerId = () => {
    return userData?.customerId || user?.customerId || 'N/A';
  };

  // Loading state
  if (isLoadingUser) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
              {getUserInitials()}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              <p className="text-blue-100 mt-1">Manage your personal details</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {user?.isFirstLogin && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-yellow-700 font-medium">This is your first login. Please change your password.</p>
              </div>
            </div>
          )}

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
              } border flex items-center`}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={message.type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
              </svg>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Customer ID</label>
              <p className="text-lg font-semibold text-gray-900">{getCustomerId()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <p className="text-lg font-semibold text-gray-900">{getFullName()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-900">{getEmail()}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-gray-900">{getMobileNumber()}</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Address</label>
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-900 whitespace-pre-wrap">{getAddress()}</p>
              </div>
            </div>
          </div>

          {userData?.package && (
            <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Current Package</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-blue-900">{userData.package.name}</p>
                  <p className="text-sm text-blue-700">Speed: {userData.package.speed}</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">৳{userData.package.price}/mo</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowChangePassword(true)} // Open modal instead of showing form
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </button>

            {/* Footer info */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">{getFullName()}</p>
              <p className="text-xs text-gray-400">{getCustomerId()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </ProtectedRoute>
  );
}