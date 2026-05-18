// app/admin/edit-admin/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSave,
  FiArrowLeft,
  FiAlertCircle,
  FiUserCheck,
  FiShield,
  FiEdit2
} from 'react-icons/fi';

interface AdminFormData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  isActive: boolean;
  role: string;
}

const EditAdminPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    address: '',
    isActive: true,
    role: 'admin',
  });

  useEffect(() => {
    if (id) {
      fetchAdmin();
    } else {
      setFetchError('No admin ID provided');
      setLoading(false);
    }
  }, [id, token]);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      const response = await fetch(`/api/users?id=${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const userData = result.data[0];
        
        // Ensure we're editing an admin
        if (userData.role !== 'admin') {
          setFetchError('This user is not an administrator. Redirecting...');
          setTimeout(() => router.push('/admin/admins'), 2000);
          return;
        }
        
        setFormData({
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
          address: userData.address,
          isActive: userData.isActive,
          role: userData.role,
        });
      } else {
        setFetchError(result.error || 'Admin not found');
        setError(result.error || 'Admin not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setFetchError('Failed to fetch admin data');
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    // Validate form
    if (!formData.firstName) {
      setError('Please enter first name');
      setSaving(false);
      return;
    }

    if (!formData.lastName) {
      setError('Please enter last name');
      setSaving(false);
      return;
    }

    if (!formData.email) {
      setError('Please enter email address');
      setSaving(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setSaving(false);
      return;
    }

    if (!formData.mobileNumber) {
      setError('Please enter mobile number');
      setSaving(false);
      return;
    }

    if (!formData.address) {
      setError('Please enter address');
      setSaving(false);
      return;
    }

    const adminData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      isActive: formData.isActive,
      role: 'admin',
    };

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        setError('Session expired. Please login again.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update administrator');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/admin/admins');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update administrator');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading administrator data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (fetchError) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-700">{fetchError}</p>
                <button
                  onClick={fetchAdmin}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="space-y-6 p-6">
          {/* Page Header */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
            </div>
            <div className="relative z-0 py-8 px-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <FiEdit2 className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Administrator</h1>
                  </div>
                  <p className="text-indigo-100">Update administrator information and access settings</p>
                </div>
                <button
                  onClick={() => router.push('/admin/admins')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm text-white"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back to Administrators
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-green-50 border-l-4 border-green-500 p-6 shadow-md">
              <div className="flex items-center gap-3">
                <FiSave className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="text-lg font-semibold text-green-800">
                    Administrator Updated Successfully!
                  </h2>
                  <p className="text-sm text-green-700 mt-1">
                    Redirecting to administrators list...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Admin Form */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Admin Info Display */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <FiShield className="h-4 w-4" />
                  </div>
                  Administrator Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Admin ID</span>
                      <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                        {formData._id?.slice(-8) || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        formData.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
                        <FiShield className="h-3 w-3" />
                        Administrator
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <FiUser className="h-4 w-4" />
                  </div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="+8801XXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <FiUserCheck className="h-4 w-4" />
                  </div>
                  Account Status
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active Account</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Inactive administrators will not be able to access the admin panel
                  </p>
                </div>
              </div>

              {/* Preview Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Administrator Preview</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {formData.firstName} {formData.lastName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          <FiShield className="h-3 w-3" />
                          Admin
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiMail className="h-4 w-4" />
                          <span>{formData.email || 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiPhone className="h-4 w-4" />
                          <span>{formData.mobileNumber || 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiMapPin className="h-4 w-4" />
                          <span>{formData.address || 'Not set'}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          formData.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Note */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex gap-3">
                  <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Administrator Privileges</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Administrators have full access to manage customers, packages, and system settings. 
                      Changes to administrator accounts will take effect immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Administrator...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-5 w-5" />
                      Update Administrator
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/admins')}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditAdminPage;