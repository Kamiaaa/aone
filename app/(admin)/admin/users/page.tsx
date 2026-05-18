// app/admin/users/page.tsx
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
  FiAlertCircle
} from 'react-icons/fi';

interface Package {
  _id: string;
  name: string;
  slug: string;
  price: number;
  speed: string;
  speedMbps: number;
  features: string[];
  isPopular: boolean;
  buttonText: string;
  icon: string;
  color: string;
  iconBg: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  package: string | Package | null;
  packageDetails?: Package;
  createdAt: string;
}

export default function UsersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resetModal, setResetModal] = useState({
    isOpen: false,
    customerName: '',
    temporaryPassword: '',
    customerEmail: '',
    customerId: '',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchPackages();
  }, [token]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        const customersOnly = data.data.filter((user: Customer) => user.role === 'customer');
        setCustomers(customersOnly);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      showNotification('error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPackages(data.data.filter((pkg: Package) => pkg.isActive !== false));
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobileNumber.includes(searchTerm)
  );

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    // Navigate to dedicated edit page
    router.push(`/admin/edit-users/${customer._id}`);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = async (customer: Customer) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId: customer._id }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetModal({
          isOpen: true,
          customerName: `${customer.firstName} ${customer.lastName}`,
          temporaryPassword: data.temporaryPassword,
          customerEmail: customer.email,
          customerId: customer._id,
        });
      } else {
        showNotification('error', data.error || 'Failed to reset password');
      }
    } catch (error) {
      showNotification('error', 'Failed to reset password');
    }
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(`/api/users?id=${selectedCustomer._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Customer deleted successfully');
        fetchCustomers();
        setIsDeleteModalOpen(false);
      } else {
        showNotification('error', data.error || 'Failed to delete customer');
      }
    } catch (error) {
      showNotification('error', 'Failed to delete customer');
    }
  };

  const getPackageName = (customer: Customer) => {
    if (customer.packageDetails) {
      return customer.packageDetails.name;
    }
    if (typeof customer.package === 'object' && customer.package) {
      return customer.package.name;
    }
    if (customer.package && packages.length > 0) {
      const foundPackage = packages.find(p => p._id === customer.package);
      return foundPackage ? foundPackage.name : 'No Package';
    }
    return 'No Package';
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Customer Management</h1>
              <p className="mt-2 text-blue-100">Manage your customers, view details, and control access</p>
            </div>
            <Link
              href="/admin/create-user"
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <FiUserPlus className="h-5 w-5" />
              Add New Customer
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
                  placeholder="Search by name, email, customer ID, or phone..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => fetchCustomers()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
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
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">{customer.customerId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.mobileNumber}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{customer.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getPackageName(customer)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleView(customer)}
                            className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(customer)}
                            className="p-1 text-green-600 hover:text-green-900 transition-colors"
                            title="Edit Customer"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(customer)}
                            className="p-1 text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Reset Password"
                          >
                            <FiKey className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            className="p-1 text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Customer"
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
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                <span className="font-medium">{customers.length}</span> customers
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {isViewModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
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
                    <label className="block text-sm font-medium text-gray-500">Customer ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedCustomer.customerId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedCustomer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.mobileNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Package</label>
                    <p className="mt-1 text-sm text-gray-900">{getPackageName(selectedCustomer)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedCustomer.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Joined Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedCustomer.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.address}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEdit(selectedCustomer);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiEdit2 className="h-4 w-4" />
                  Edit Customer
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
        {isDeleteModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-lg bg-white">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Delete Customer</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete customer "{selectedCustomer.firstName} {selectedCustomer.lastName}"? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
            customerName={resetModal.customerName}
            temporaryPassword={resetModal.temporaryPassword}
            customerEmail={resetModal.customerEmail}
            onClose={() => setResetModal({ ...resetModal, isOpen: false })}
            onSendEmail={async (password) => {
              try {
                const response = await fetch('/api/auth/send-password-email', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    email: resetModal.customerEmail,
                    customerName: resetModal.customerName,
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
                showNotification('error', 'Failed to send email');
              }
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}