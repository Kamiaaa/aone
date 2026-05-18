// app/components/Header.tsx - simplified version without token prop
'use client';

import React, { useState } from 'react';
import { FiBell, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import ChangePasswordModal from './ChangePasswordModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  userInitials?: string;
  onMenuClick: () => void;
  onLogout: () => void;
  notificationCount?: number;
}

export default function Header({
  title,
  subtitle,
  userName,
  userRole,
  userInitials,
  onMenuClick,
  onLogout,
  notificationCount = 0,
}: HeaderProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Mobile menu button and title */}
            <div className="flex items-center">
              <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 hidden sm:block">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Right side - Notifications and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications Button */}
              <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                <FiBell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User Dropdown Button */}
              <div className="relative group">
                <button className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <span className="text-sm font-medium">
                      {userInitials || 'U'}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {userName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{userRole || 'Role'}</p>
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/customer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={() => {
          console.log('Password changed successfully');
        }}
      />
    </>
  );
}