// app/packages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  GiCheckMark,
  GiPayMoney,
} from 'react-icons/gi';
import {
  MdDataUsage,
  MdLockClock,
  MdOutlineSupportAgent,
  MdOutlineRocketLaunch,
  MdOutlineCheckCircle,
  MdOutlineNetworkCell
} from 'react-icons/md';
import {
  FaTachometerAlt,
  FaBolt,
} from 'react-icons/fa';
import {
  FiWifi,
  FiServer,
  FiShield,
  FiMonitor,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsClock, BsHouseDoor } from 'react-icons/bs';
import { LuGamepad2, LuRouter, LuWifi } from 'react-icons/lu';

// Dynamic icon mapping - matches the static component's icon set
const iconMap: { [key: string]: React.ReactNode } = {
  FiWifi: <FiWifi className="h-7 w-7" />,
  LuGamepad2: <LuGamepad2 className="h-7 w-7" />,
  BsHouseDoor: <BsHouseDoor className="h-7 w-7" />,
  HiOutlineSparkles: <HiOutlineSparkles className="h-7 w-7" />,
  MdDataUsage: <MdDataUsage className="h-7 w-7" />,
  FaTachometerAlt: <FaTachometerAlt className="h-7 w-7" />,
};

interface PricingTier {
  _id: string;
  name: string;
  price: number;
  speed: string;
  speedMbps: number;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  icon: string;
  color: string;
  iconBg: string;
  displayOrder: number;
  isActive: boolean;
}

const PricingCard: React.FC<{ tier: PricingTier }> = ({ tier }) => {
  // Get the icon component from the map, fallback to FiWifi
  const iconComponent = iconMap[tier.icon] || <FiWifi className="h-7 w-7" />;

  return (
    <div className={`
      relative flex flex-col w-full max-w-sm mx-auto rounded-2xl shadow-xl overflow-hidden
      transition-all duration-300 hover:scale-105 hover:shadow-2xl
      ${tier.isPopular ? 'ring-2 ring-amber-500 md:scale-105' : 'ring-1 ring-gray-200 dark:ring-gray-700'}
    `}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-linear-to-br ${tier.color} opacity-5`} />

      {/* Popular badge */}
      {tier.isPopular && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-linear-to-r from-amber-500 to-amber-700 text-white px-4 py-1 rounded-bl-2xl text-sm font-semibold shadow-lg flex items-center gap-1">
            <HiOutlineSparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="relative bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${tier.iconBg} text-white shadow-lg`}>
            {iconComponent}
          </div>
          <div className="text-right">
            <p className="py-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {tier.speed}
            </p>
            <h3 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {tier.name}
            </h3>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-gray-900 dark:text-white">৳</span>
            <span className="text-5xl font-black text-gray-900 dark:text-white">{tier.price}</span>
            <span className="text-gray-600 dark:text-gray-300">/mo</span>
          </div>
        </div>

        {/* Speed Badge */}
        <div className="mb-4 flex justify-center">
          <div className={`px-4 py-1 rounded-full text-sm font-bold text-white bg-linear-to-r ${tier.color}`}>
            {tier.speed}
          </div>
        </div>

        {/* Features */}
        <div className="grow mb-8">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider flex items-center gap-2">
            <MdOutlineCheckCircle className="w-4 h-4 text-red-500" />
            What's Included:
          </p>
          <ul className="space-y-3">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className={`shrink-0 w-5 h-5 rounded-full bg-linear-to-r ${tier.color} flex items-center justify-center`}>
                  <GiCheckMark className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <button className={`
          w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-200
          bg-linear-to-r ${tier.color} hover:shadow-lg
          transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
          flex items-center justify-center gap-2
        `}>
          <MdOutlineRocketLaunch className="w-4 h-4" />
          {tier.buttonText}
        </button>

        {/* Fine print */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-1">
          <MdLockClock className="w-3 h-3" />
          No hidden fees • Cancel anytime
        </p>
      </div>
    </div>
  );
};

const Packages = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [packages, setPackages] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages');
      const result = await response.json();
      
      if (result.success) {
        // Sort packages by displayOrder
        const sortedPackages = result.data.sort((a: PricingTier, b: PricingTier) => a.displayOrder - b.displayOrder);
        setPackages(sortedPackages);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const valueAdds = [
    { title: '24/7 Local Support', description: 'Real humans, not robots. Our support team is always awake.', icon: MdOutlineSupportAgent },
    { title: '99.9% Uptime Guarantee', description: 'We take reliability seriously. SLA-backed commitment.', icon: BsClock },
    { title: 'No Hidden Fees', description: 'What you see is what you pay. Transparent billing.', icon: GiPayMoney },
    { title: 'Free Router', description: 'With annual payment. Cutting-edge wireless tech.', icon: LuRouter }
  ];

  const addOns = [
    { name: 'Static IP', price: '৳৫০০/mo', icon: MdOutlineNetworkCell, color: 'from-blue-500 to-blue-600' },
    { name: 'Mesh WiFi Extender', price: '৳৮০০/mo', icon: LuWifi, color: 'from-cyan-500 to-cyan-600' },
    { name: 'Premium TV Bundle', price: '৳১৫০০/mo', icon: FiMonitor, color: 'from-purple-500 to-purple-600' },
    { name: 'Cloud Backup', price: '৳৩০০/mo', icon: FiServer, color: 'from-emerald-500 to-emerald-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={fetchPackages}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2070&q=80"
            alt="Fiber optic network background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 mix-blend-multiply" />
        </div>

        <div className="relative z-10 py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <FaBolt className="w-4 h-4" />
                High-Speed Fiber Network
              </div>
              <h1 className="text-4xl font-source font-bold text-white sm:text-5xl lg:text-6xl mb-6">
                Discover Our <span className="text-red-200">Best Packages</span>
              </h1>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <FaTachometerAlt className="w-4 h-4" />
                  <span>Fiber Optic</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <MdDataUsage className="w-4 h-4 text-red-300" />
                  <span>Unlimited Data</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <FiShield className="w-4 h-4 text-purple-300" />
                  <span>Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section - Using dynamic data with same design as static */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-4">
              Discover Our Best Packages
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pick the plan that fits your lifestyle. All plans include unlimited data and 24/7 support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((tier, index) => (
              <div 
                key={tier._id}
                className={`transform transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <PricingCard tier={tier} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-4">
              Compare Plans Side by Side
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Still not sure? Here's a detailed breakdown of what each plan offers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-red-600 to-red-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Feature</th>
                  {packages.map((tier) => (
                    <th key={tier._id} className="px-6 py-4 text-left text-sm font-semibold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">Download/Upload Speed</td>
                  {packages.map((tier) => (
                    <td key={tier._id} className="px-6 py-4 text-sm text-gray-900 dark:text-white">{tier.speed}</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">Data Cap</td>
                  {packages.map((tier) => (
                    <td key={tier._id} className="px-6 py-4 text-sm text-gray-900 dark:text-white">Unlimited</td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">Monthly Price</td>
                  {packages.map((tier) => (
                    <td key={tier._id} className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">৳{tier.price}/mo</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Value Adds Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-4">
              Every Plan Includes
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              No matter which package you choose, you'll always get these benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueAdds.map((add, index) => (
              <div
                key={add.title}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white mb-4 shadow-md">
                  <add.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {add.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {add.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-source font-semibold text-gray-900 dark:text-white mb-4">
              Boost Your Experience
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6" />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Add these premium features to any package for an enhanced experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={addon.name}
                className={`bg-gradient-to-br ${addon.color} rounded-2xl p-6 text-white shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <addon.icon className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">{addon.name}</h3>
                <p className="text-white/90 text-sm mb-4">Perfect for power users</p>
                <p className="text-2xl font-bold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative w-full overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=884&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-0" />
        </div>

        <div className="relative z-10 py-20 px-4 sm:py-24 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-source font-bold text-white max-w-4xl mx-auto mb-8">
              Ready to Experience the A1 Difference?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their internet needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="relative overflow-hidden bg-red-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center justify-center gap-2">
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative z-10">Check Availability</span>
                <span className="absolute inset-0 bg-red-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
              </button>

              <button className="relative overflow-hidden bg-transparent border-2 border-red-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center justify-center gap-2">
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="relative z-10">Talk to an Expert</span>
                <span className="absolute inset-0 bg-red-600 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
              </button>
            </div>
            <p className="text-sm text-white/80 mt-8">
              No contracts. 30-day money-back guarantee. Free cancellation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;