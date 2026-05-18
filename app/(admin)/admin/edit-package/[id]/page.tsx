// app/admin/edit-package/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  FiPackage, 
  FiDollarSign, 
  FiZap, 
  FiCheckCircle, 
  FiStar, 
  FiSave,
  FiArrowLeft,
  FiAlertCircle,
  FiList,
  FiHash,
  FiTrendingUp,
  FiEdit2,
  FiWifi,
  FiMonitor,
  FiServer,
  FiShield
} from 'react-icons/fi';
import { HiOutlineX, HiOutlineSparkles } from 'react-icons/hi';
import { 
  MdDataUsage, 
  MdOutlineRocketLaunch,
  MdOutlineCheckCircle,
  MdLockClock
} from 'react-icons/md';
import { FaTachometerAlt, FaBolt } from 'react-icons/fa';
import { BsHouseDoor, BsClock } from 'react-icons/bs';
import { LuGamepad2, LuRouter, LuWifi } from 'react-icons/lu';
import { GiCheckMark, GiPayMoney } from 'react-icons/gi';

interface PackageFormData {
  _id?: string;
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
}

interface Feature {
  id: number;
  text: string;
}

// Icon mapping that matches the Packages component
const availableIcons = [
  { name: 'FiWifi', component: FiWifi, label: 'WiFi' },
  { name: 'LuGamepad2', component: LuGamepad2, label: 'Gaming' },
  { name: 'BsHouseDoor', component: BsHouseDoor, label: 'Home' },
  { name: 'HiOutlineSparkles', component: HiOutlineSparkles, label: 'Premium' },
  { name: 'MdDataUsage', component: MdDataUsage, label: 'Data' },
  { name: 'FaTachometerAlt', component: FaTachometerAlt, label: 'Speed' },
  { name: 'FiTrendingUp', component: FiTrendingUp, label: 'Trending' },
  { name: 'FiPackage', component: FiPackage, label: 'Package' },
];

// Color options matching the Packages component linear styles
const colorOptions = [
  { value: 'from-blue-500 to-blue-700', label: 'Blue', bgClass: 'bg-linear-to-br from-blue-500 to-blue-700', swatchClass: 'bg-blue-500', linearClass: 'from-blue-500 to-blue-700' },
  { value: 'from-cyan-500 to-cyan-700', label: 'Cyan', bgClass: 'bg-linear-to-br from-cyan-500 to-cyan-700', swatchClass: 'bg-cyan-500', linearClass: 'from-cyan-500 to-cyan-700' },
  { value: 'from-emerald-500 to-emerald-700', label: 'Emerald', bgClass: 'bg-linear-to-br from-emerald-500 to-emerald-700', swatchClass: 'bg-emerald-500', linearClass: 'from-emerald-500 to-emerald-700' },
  { value: 'from-purple-500 to-purple-700', label: 'Purple', bgClass: 'bg-linear-to-br from-purple-500 to-purple-700', swatchClass: 'bg-purple-500', linearClass: 'from-purple-500 to-purple-700' },
  { value: 'from-rose-500 to-rose-700', label: 'Rose', bgClass: 'bg-linear-to-br from-rose-500 to-rose-700', swatchClass: 'bg-rose-500', linearClass: 'from-rose-500 to-rose-700' },
  { value: 'from-amber-500 to-amber-700', label: 'Amber', bgClass: 'bg-linear-to-br from-amber-500 to-amber-700', swatchClass: 'bg-amber-500', linearClass: 'from-amber-500 to-amber-700' },
  { value: 'from-green-500 to-green-700', label: 'Green', bgClass: 'bg-linear-to-br from-green-500 to-green-700', swatchClass: 'bg-green-500', linearClass: 'from-green-500 to-green-700' },
  { value: 'from-indigo-500 to-indigo-700', label: 'Indigo', bgClass: 'bg-linear-to-br from-indigo-500 to-indigo-700', swatchClass: 'bg-indigo-500', linearClass: 'from-indigo-500 to-indigo-700' },
];

const EditPackagePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    slug: '',
    price: 0,
    speed: '',
    speedMbps: 0,
    features: [],
    isPopular: false,
    buttonText: 'Choose Plan',
    icon: 'FiWifi',
    color: 'from-blue-500 to-blue-700',
    iconBg: 'bg-linear-to-br from-blue-500 to-blue-700',
    displayOrder: 0,
    isActive: true,
  });

  const [featuresList, setFeaturesList] = useState<Feature[]>([]);

  useEffect(() => {
    if (id) {
      fetchPackage();
    } else {
      setFetchError('No package ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      
      const token = getToken();
      const response = await fetch(`/api/packages/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        const packageData = result.data;
        
        // Map color value from stored linear to color option
        let colorValue = 'from-blue-500 to-blue-700';
        if (packageData.color) {
          const foundColor = colorOptions.find(c => packageData.color.includes(c.value.split(' ')[0].replace('from-', '')));
          if (foundColor) colorValue = foundColor.value;
        }
        
        setFormData({
          ...packageData,
          color: colorValue,
          iconBg: colorOptions.find(c => c.value === colorValue)?.bgClass || 'bg-linear-to-br from-blue-500 to-blue-700',
        });
        
        // Convert features array to features list with IDs
        if (packageData.features && packageData.features.length > 0) {
          setFeaturesList(packageData.features.map((text: string, index: number) => ({
            id: index + 1,
            text: text
          })));
        } else {
          setFeaturesList([{ id: 1, text: '' }]);
        }
      } else {
        setFetchError(result.error || 'Package not found');
        setError(result.error || 'Package not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setFetchError('Failed to fetch package data');
      setError('Failed to fetch package data');
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleFeatureChange = (id: number, text: string) => {
    setFeaturesList(prev => prev.map(feature => 
      feature.id === id ? { ...feature, text } : feature
    ));
  };

  const addFeature = () => {
    const newId = Math.max(...featuresList.map(f => f.id), 0) + 1;
    setFeaturesList(prev => [...prev, { id: newId, text: '' }]);
  };

  const removeFeature = (id: number) => {
    if (featuresList.length > 1) {
      setFeaturesList(prev => prev.filter(feature => feature.id !== id));
    }
  };

  const handleIconSelect = (iconName: string) => {
    setFormData(prev => ({
      ...prev,
      icon: iconName,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    // Validate form
    if (!formData.name) {
      setError('Please enter a package name');
      setSaving(false);
      return;
    }

    if (!formData.speed) {
      setError('Please enter the internet speed');
      setSaving(false);
      return;
    }

    if (formData.price <= 0) {
      setError('Please enter a valid price');
      setSaving(false);
      return;
    }

    // Collect features
    const features = featuresList
      .filter(f => f.text.trim())
      .map(f => f.text.trim());

    if (features.length === 0) {
      setError('Please add at least one feature');
      setSaving(false);
      return;
    }

    const packageData = {
      ...formData,
      features,
    };

    try {
      const token = getToken();

      if (!token) {
        setError('Authentication required. Please login again.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      const response = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
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
        throw new Error(data.error || 'Failed to update package');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/admin/packages');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update package');
    } finally {
      setSaving(false);
    }
  };

  const getSelectedIcon = () => {
    const icon = availableIcons.find(i => i.name === formData.icon);
    if (icon) {
      const IconComponent = icon.component;
      return <IconComponent className="h-7 w-7" />;
    }
    return <FiWifi className="h-7 w-7" />;
  };

  const getSelectedColorClass = () => {
    const color = colorOptions.find(opt => opt.value === formData.color);
    return color?.linearClass || 'from-blue-500 to-blue-700';
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading package data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (fetchError) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-700">{fetchError}</p>
                <button
                  onClick={fetchPackage}
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="space-y-6 p-6">
          {/* Page Header - Matching Packages component hero section style */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600" />
            </div>
            <div className="relative z-0 py-8 px-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <FiEdit2 className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Package</h1>
                  </div>
                  <p className="text-blue-100">Update package information and settings</p>
                </div>
                <button
                  onClick={() => router.push('/admin/packages')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm text-white"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back to Packages
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
                <FiCheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="text-lg font-semibold text-green-800">
                    Package Updated Successfully!
                  </h2>
                  <p className="text-sm text-green-700 mt-1">
                    Redirecting to packages list...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Package Form - Matching the card style from Packages component */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white">
                    <FiPackage className="h-4 w-4" />
                  </div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., Ultra Fast Fiber"
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="ultra-fast-fiber"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-generated from package name</p>
                  </div>

                  <div>
                    <label htmlFor="speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Speed Display *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiZap className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="speed"
                        name="speed"
                        value={formData.speed}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="e.g., 100 Mbps, 1 Gbps"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="speedMbps" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Speed (Mbps) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiHash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="speedMbps"
                        name="speedMbps"
                        value={formData.speedMbps}
                        onChange={handleNumberChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (BDT) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleNumberChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="999"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      id="displayOrder"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower numbers appear first</p>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white">
                    <FiList className="h-4 w-4" />
                  </div>
                  Package Features
                </h3>
                <div className="space-y-3">
                  {featuresList.map((feature) => (
                    <div key={feature.id} className="flex gap-2">
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) => handleFeatureChange(feature.id, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter a feature (e.g., 24/7 Support)"
                      />
                      {featuresList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(feature.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <HiOutlineX className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Package Icon</h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {availableIcons.map((icon) => {
                    const IconComponent = icon.component;
                    const isSelected = formData.icon === icon.name;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => handleIconSelect(icon.name)}
                        className={`p-3 rounded-xl transition-all ${
                          isSelected
                            ? `bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105`
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <IconComponent className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs">{icon.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Appearance Settings - Visual Color Picker */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Color</h3>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          color: color.value,
                          iconBg: color.bgClass,
                        }));
                      }}
                      className={`relative group focus:outline-none`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${color.swatchClass} transition-all duration-200 ${
                          formData.color === color.value
                            ? 'ring-2 ring-offset-2 ring-green-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                      />
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Popular Package</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active (Visible to customers)</span>
                  </label>
                </div>
              </div>

              {/* Preview Section - Matching exact card design from Packages component */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Preview</h3>
                <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="relative flex flex-col w-full max-w-sm mx-auto rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                    <div className={`absolute inset-0 bg-linear-to-br ${formData.color} opacity-5`} />
                    
                    {formData.isPopular && (
                      <div className="absolute top-0 right-0 z-10">
                        <div className="bg-linear-to-r from-amber-500 to-amber-700 text-white px-4 py-1 rounded-bl-2xl text-sm font-semibold shadow-lg flex items-center gap-1">
                          <HiOutlineSparkles className="w-4 h-4" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="relative bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${formData.iconBg} text-white shadow-lg`}>
                          {getSelectedIcon()}
                        </div>
                        <div className="text-right">
                          <p className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {formData.speed || 'Speed'}
                          </p>
                          <h3 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {formData.name || 'Package Name'}
                          </h3>
                        </div>
                      </div>

                      <div className="mb-6 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-gray-900 dark:text-white">৳</span>
                          <span className="text-5xl font-black text-gray-900 dark:text-white">{formData.price || '0'}</span>
                          <span className="text-gray-600 dark:text-gray-300">/mo</span>
                        </div>
                      </div>

                      <div className="mb-4 flex justify-center">
                        <div className={`px-4 py-1 rounded-full text-sm font-bold text-white bg-linear-to-r ${formData.color}`}>
                          {formData.speed || 'Speed'}
                        </div>
                      </div>

                      <div className="grow mb-8">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <MdOutlineCheckCircle className="w-4 h-4 text-green-500" />
                          What's Included:
                        </p>
                        <ul className="space-y-3">
                          {featuresList.filter(f => f.text.trim()).slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <div className={`shrink-0 w-5 h-5 rounded-full bg-linear-to-r ${formData.color} flex items-center justify-center`}>
                                <GiCheckMark className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature.text}</span>
                            </li>
                          ))}
                          {featuresList.filter(f => f.text.trim()).length === 0 && (
                            <li className="text-gray-400 text-sm">Add features to see preview</li>
                          )}
                        </ul>
                      </div>

                      <button className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-200 bg-linear-to-r ${formData.color} hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center gap-2`}>
                        <MdOutlineRocketLaunch className="w-4 h-4" />
                        {formData.buttonText || 'Choose Plan'}
                      </button>

                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-1">
                        <MdLockClock className="w-3 h-3" />
                        No hidden fees • Cancel anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Package...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-5 w-5" />
                      Update Package
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/packages')}
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

export default EditPackagePage;