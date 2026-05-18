'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiPackage, 
  FiUserPlus, 
  FiUsers,
  FiCopy,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { HiOutlineX } from 'react-icons/hi';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  package: string;
}

interface CreatedUser {
  userId: string;
  temporaryPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  package?: {
    _id: string;
    name: string;
    price: number;
    speed: string;
  } | null;
}

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

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    package: '',
  });
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
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

  const fetchPackages = async () => {
    try {
      const token = getToken();
      
      const response = await fetch('/api/packages?includeInactive=false', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const data = await response.json();

      if (data.success) {
        setPackages(data.data);
      } else {
        console.error('Failed to fetch packages:', data.error);
        if (data.error === 'Unauthorized') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCreatedUser(null);

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)');
      setLoading(false);
      return;
    }

    if (!formData.package) {
      setError('Please select a package');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.phone,
          address: formData.address,
          package: formData.package,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        setError('Session expired. Please login again.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setCreatedUser({
        userId: data.data.customerId || data.data.userId,
        temporaryPassword: data.data.temporaryPassword,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
        package: data.data.package,
      });
      setShowCredentials(true);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        package: '',
      });

      setTimeout(() => {
        setShowCredentials(false);
      }, 30000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      const tempAlert = document.createElement('div');
      tempAlert.textContent = `${label} copied!`;
      tempAlert.style.position = 'fixed';
      tempAlert.style.bottom = '20px';
      tempAlert.style.right = '20px';
      tempAlert.style.backgroundColor = '#10b981';
      tempAlert.style.color = 'white';
      tempAlert.style.padding = '10px 20px';
      tempAlert.style.borderRadius = '5px';
      tempAlert.style.zIndex = '1000';
      document.body.appendChild(tempAlert);
      setTimeout(() => tempAlert.remove(), 2000);
    } catch (err) {
      alert('Failed to copy. Please manually copy the text.');
    }
  };

  const getPackageDisplay = (pkg: Package) => {
    return `${pkg.name} - ${pkg.speed} @ BDT ${pkg.price}/month`;
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiUserPlus className="h-8 w-8" />
                <h1 className="text-2xl font-bold">Create New Customer</h1>
              </div>
              <p className="text-blue-100">Add a new customer to the Self Care Portal</p>
            </div>
            <button
              onClick={() => router.push('/admin/users')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Users
            </button>
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

        {/* Success Message with Credentials */}
        {showCredentials && createdUser && (
          <div className="rounded-lg bg-green-50 border-l-4 border-green-500 p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">
                  Customer Created Successfully!
                </h2>
              </div>
              <button
                onClick={() => setShowCredentials(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-mono font-semibold text-gray-900">{createdUser.userId}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(createdUser.userId, 'Customer ID')}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <FiCopy className="h-3 w-3" />
                  Copy
                </button>
              </div>
              
              {createdUser.package && (
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Assigned Package</p>
                  <p className="font-semibold text-gray-900">
                    {createdUser.package.name} - {createdUser.package.speed} @ BDT {createdUser.package.price}/month
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                <div>
                  <p className="text-sm text-gray-600">Temporary Password</p>
                  <p className="font-mono font-semibold text-gray-900">{createdUser.temporaryPassword}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(createdUser.temporaryPassword, 'Password')}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <FiCopy className="h-3 w-3" />
                  Copy
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  Please provide these credentials to the customer. They will need to change their password on first login.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create User Form */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Doe"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Customer ID will be generated automatically (e.g., A1C123456)
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="+880 1234567890"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., +880 for Bangladesh)
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-2">
                  Internet Package *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPackage className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    required
                    disabled={loadingPackages}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a package</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {getPackageDisplay(pkg)} {pkg.isPopular && '⭐ Popular'}
                      </option>
                    ))}
                  </select>
                </div>
                {loadingPackages && (
                  <p className="text-xs text-gray-500 mt-1">Loading packages...</p>
                )}
                {!loadingPackages && packages.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No packages found. Please create packages first.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="House #, Street #, City, Postal Code"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || loadingPackages || packages.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Customer...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="h-5 w-5" />
                    Create Customer
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <FiUsers className="h-5 w-5" />
                View All Users
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}