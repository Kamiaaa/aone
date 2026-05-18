// app/admin/packages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiEye,
  FiChevronUp,
  FiChevronDown,
  FiSearch,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';
import { MdOutlineRocketLaunch, MdDataUsage } from 'react-icons/md';
import { FaTachometerAlt } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsHouseDoor } from 'react-icons/bs';
import { LuGamepad2, LuWifi } from 'react-icons/lu';

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

const PackagesManagement = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Package>('displayOrder');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [tempOrder, setTempOrder] = useState<number>(0);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch('/api/packages?includeInactive=true', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const result = await response.json();
      
      if (result.success) {
        setPackages(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const getToken = (): string | null => {
    const localStorageToken = localStorage.getItem('auth_token');
    if (localStorageToken) return localStorageToken;
    
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'token' || name === 'auth_token') {
        return value;
      }
    }
    
    const sessionToken = sessionStorage.getItem('auth_token');
    if (sessionToken) return sessionToken;
    
    return null;
  };

  const handleSort = (field: keyof Package) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedPackages = () => {
    let filtered = packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.speed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.price.toString().includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'price' || sortField === 'speedMbps' || sortField === 'displayOrder') {
        aValue = aValue as number;
        bValue = bValue as number;
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };

  const handleSelectAll = () => {
    if (selectedPackages.length === packages.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(packages.map(p => p._id));
    }
  };

  const handleSelectPackage = (id: string) => {
    if (selectedPackages.includes(id)) {
      setSelectedPackages(selectedPackages.filter(p => p !== id));
    } else {
      setSelectedPackages([...selectedPackages, id]);
    }
  };

  const handleDeleteClick = (pkg: Package) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;
    
    try {
      const token = getToken();
      const response = await fetch(`/api/packages/${packageToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPackages();
        setShowDeleteModal(false);
        setPackageToDelete(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete package');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const token = getToken();
      const deletePromises = selectedPackages.map(id =>
        fetch(`/api/packages/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        })
      );
      
      await Promise.all(deletePromises);
      await fetchPackages();
      setSelectedPackages([]);
      setShowBulkDeleteModal(false);
    } catch (err) {
      setError('Failed to delete selected packages');
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    try {
      const token = getToken();
      const response = await fetch(`/api/packages/${pkg._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ ...pkg, isActive: !pkg.isActive }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPackages();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update package status');
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const token = getToken();
      const pkg = packages.find(p => p._id === id);
      if (!pkg) return;
      
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ ...pkg, displayOrder: newOrder }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPackages();
        setEditingOrder(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update display order');
    }
  };

  const movePackage = async (index: number, direction: 'up' | 'down') => {
    const sorted = getSortedPackages();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= sorted.length) return;
    
    const currentOrder = sorted[index].displayOrder;
    const targetOrder = sorted[newIndex].displayOrder;
    
    await handleUpdateOrder(sorted[index]._id, targetOrder);
    await handleUpdateOrder(sorted[newIndex]._id, currentOrder);
  };

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'FiWifi': return LuWifi;
      case 'LuGamepad2': return LuGamepad2;
      case 'BsHouseDoor': return BsHouseDoor;
      case 'HiOutlineSparkles': return HiOutlineSparkles;
      case 'MdDataUsage': return MdDataUsage;
      case 'FaTachometerAlt': return FaTachometerAlt;
      default: return FiPackage;
    }
  };

  const SortIcon = ({ field }: { field: keyof Package }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <FiChevronUp className="w-4 h-4" /> : 
      <FiChevronDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const sortedPackages = getSortedPackages();

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiPackage className="h-8 w-8" />
                <h1 className="text-2xl font-bold">Packages Management</h1>
              </div>
              <p className="text-blue-100">Manage your internet packages, prices, and features</p>
            </div>
            <Link href="/admin/create-package">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm">
                <FiPlus className="h-4 w-4" />
                Create New Package
              </button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Packages</p>
            <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Active Packages</p>
            <p className="text-2xl font-bold text-green-600">{packages.filter(p => p.isActive).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Popular Packages</p>
            <p className="text-2xl font-bold text-amber-600">{packages.filter(p => p.isPopular).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Avg. Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ৳{Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length || 0)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search packages by name, speed, or price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {selectedPackages.length > 0 && (
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete Selected ({selectedPackages.length})
              </button>
            )}
          </div>
        </div>

        {/* Packages Table */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPackages.length === packages.length && packages.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('displayOrder')}
                  >
                    <div className="flex items-center gap-1">
                      Order <SortIcon field="displayOrder" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Package Name <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Price <SortIcon field="price" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('speed')}
                  >
                    <div className="flex items-center gap-1">
                      Speed <SortIcon field="speed" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popular
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPackages.map((pkg, index) => {
                  const IconComponent = getIconComponent(pkg.icon);
                  return (
                    <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPackages.includes(pkg._id)}
                          onChange={() => handleSelectPackage(pkg._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingOrder === pkg._id ? (
                          <input
                            type="number"
                            value={tempOrder}
                            onChange={(e) => setTempOrder(parseInt(e.target.value))}
                            onBlur={() => handleUpdateOrder(pkg._id, tempOrder)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleUpdateOrder(pkg._id, tempOrder);
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">
                              {pkg.displayOrder}
                            </span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => movePackage(index, 'up')}
                                disabled={index === 0}
                                className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                              >
                                <FiChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => movePackage(index, 'down')}
                                disabled={index === sortedPackages.length - 1}
                                className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                              >
                                <FiChevronDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${pkg.iconBg} text-white`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {pkg.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pkg.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ৳{pkg.price}/mo
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${pkg.color} text-white`}>
                          {pkg.speed}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {pkg.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="text-xs text-gray-600">
                              {feature}{idx < Math.min(pkg.features.length, 2) - 1 ? ',' : ''}
                            </span>
                          ))}
                          {pkg.features.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{pkg.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pkg.isPopular ? (
                          <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                            ★ Popular
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(pkg)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            pkg.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link href={`/packages/${pkg.slug}`}>
                            <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="View">
                              <FiEye className="w-4 h-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/edit-package/${pkg._id}`}>
                            <button className="p-1 text-green-600 hover:text-green-800 transition-colors" title="Edit">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(pkg)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {sortedPackages.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No packages found</p>
              <Link href="/admin/create-package">
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create your first package
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && packageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Package
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{packageToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Selected Packages
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedPackages.length} package(s)? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default PackagesManagement;