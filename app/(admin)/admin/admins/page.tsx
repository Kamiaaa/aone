// app/admin/admins/page.tsx
'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import { 
  FiSearch, 
  FiRefreshCw, 
  FiUserPlus, 
  FiEye, 
  FiEdit2, 
  FiKey, 
  FiTrash2,
  FiX,
  FiAlertCircle,
  FiShield
} from 'react-icons/fi';

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: string;
}

export default function AdminsPage() {
  const { token, user } = useAuth(); // Get user from auth context
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resetModal, setResetModal] = useState({
    isOpen: false,
    adminName: '',
    temporaryPassword: '',
    adminEmail: '',
    adminId: '',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const adminsOnly = data.data.filter((user: Admin) => user.role === 'admin');
        setAdmins(adminsOnly);
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      showNotification('error', 'Failed to load administrators. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.mobileNumber?.includes(searchTerm)
  );

  const handleView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    router.push(`/admin/edit-admin/${admin._id}`);
  };

  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = async (admin: Admin) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId: admin._id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setResetModal({
          isOpen: true,
          adminName: `${admin.firstName} ${admin.lastName}`,
          temporaryPassword: data.temporaryPassword,
          adminEmail: admin.email,
          adminId: admin._id,
        });
      } else {
        showNotification('error', data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showNotification('error', 'Failed to reset password');
    }
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;

    // Prevent deleting the last admin
    if (admins.length === 1) {
      showNotification('error', 'Cannot delete the only administrator. Please create another admin first.');
      setIsDeleteModalOpen(false);
      return;
    }

    // Prevent admin from deleting themselves
    if (user?._id === selectedAdmin._id) {
      showNotification('error', 'You cannot delete your own admin account.');
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${selectedAdmin._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification('success', 'Administrator deleted successfully');
        fetchAdmins();
        setIsDeleteModalOpen(false);
      } else {
        showNotification('error', data.error || 'Failed to delete administrator');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('error', 'Failed to delete administrator');
    }
  };

  if (!token) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Management</h1>
              <p className="mt-2 text-indigo-100">Manage system administrators and their access privileges</p>
            </div>
            <Link
              href="/admin/create-admin"
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <FiUserPlus className="h-5 w-5" />
              Add New Admin
            </Link>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'error' && <FiAlertCircle className="h-5 w-5" />}
              {notification.message}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => fetchAdmins()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Loading administrators...</p>
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      {admins.length === 0 ? 'No administrators found' : 'No matching administrators found'}
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FiShield className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.firstName} {admin.lastName}
                              {user?._id === admin._id && (
                                <span className="ml-2 text-xs text-indigo-600 font-normal">(You)</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{admin.mobileNumber}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{admin.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <FiShield className="h-3 w-3 mr-1" />
                          Administrator
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleView(admin)}
                            className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(admin)}
                            className="p-1 text-green-600 hover:text-green-900 transition-colors"
                            title="Edit Admin"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(admin)}
                            className="p-1 text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Reset Password"
                          >
                            <FiKey className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin)}
                            className={`p-1 transition-colors ${
                              user?._id === admin._id 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-900'
                            }`}
                            title={user?._id === admin._id ? "Cannot delete your own account" : "Delete Admin"}
                            disabled={user?._id === admin._id}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          {!loading && admins.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredAdmins.length}</span> of{' '}
                  <span className="font-medium">{admins.length}</span> administrators
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Modal */}
        {isViewModalOpen && selectedAdmin && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Administrator Details</h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedAdmin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedAdmin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize flex items-center gap-1">
                      <FiShield className="h-4 w-4 text-purple-600" />
                      System Administrator
                      {user?._id === selectedAdmin._id && (
                        <span className="ml-2 text-xs text-indigo-600">(You)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.firstName} {selectedAdmin.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.mobileNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Joined Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedAdmin.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.address}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEdit(selectedAdmin);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit Admin
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && selectedAdmin && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-lg bg-white">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Delete Administrator</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete admin "{selectedAdmin.firstName} {selectedAdmin.lastName}"? This action cannot be undone.
                </p>
                {admins.length === 1 && (
                  <p className="mt-2 text-sm text-red-600">
                    Warning: This is the only administrator. Please create another admin before deleting this one.
                  </p>
                )}
                {user?._id === selectedAdmin._id && (
                  <p className="mt-2 text-sm text-red-600">
                    Warning: You cannot delete your own account.
                  </p>
                )}
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={admins.length === 1 || user?._id === selectedAdmin._id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {resetModal.isOpen && (
          <ResetPasswordModal
            isOpen={resetModal.isOpen}
            customerName={resetModal.adminName}
            temporaryPassword={resetModal.temporaryPassword}
            customerEmail={resetModal.adminEmail}
            onClose={() => setResetModal({ ...resetModal, isOpen: false })}
            onSendEmail={async (password) => {
              try {
                const response = await fetch('/api/auth/send-password-email', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    email: resetModal.adminEmail,
                    customerName: resetModal.adminName,
                    temporaryPassword: password,
                  }),
                });
                
                if (response.ok) {
                  showNotification('success', 'Password email sent successfully!');
                  setResetModal({ ...resetModal, isOpen: false });
                } else {
                  showNotification('error', 'Failed to send email');
                }
              } catch (error) {
                console.error('Send email error:', error);
                showNotification('error', 'Failed to send email');
              }
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}