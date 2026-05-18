// app/components/PricingCards.tsx
import React from 'react';
import { 
  GiCheckMark
  
} from 'react-icons/gi';
import { 
  MdDataUsage,  
  MdLockClock,
  MdOutlineSupportAgent,
  MdOutlineRocketLaunch,
  MdOutlineCheckCircle
  
} from 'react-icons/md';
import { 
  FaTachometerAlt 
  
} from 'react-icons/fa';
import { 
  FiWifi, 
  FiServer, 
  FiShield
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsClock, BsHouseDoor } from 'react-icons/bs';
import { LuGamepad2, LuRouter } from 'react-icons/lu';

interface PricingTier {
  name: string;
  price: string;
  speed: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Bijoy",
    price: "600",
    speed: "15 MBPS",
    features: [
      "15 Mbps Symmetrical Speed",
      "Unlimited Data",
      "24/7 Basic Support",
      "Standard Router Included",
      "1 Month Contract"
    ],
    buttonText: "Get Started",
    icon: <FiWifi className="h-7 w-7" />,
    color: "from-blue-500 to-blue-700",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700"
  },
  {
    name: "Duronto",
    price: "800",
    speed: "30 MBPS",
    features: [
      "30 Mbps Symmetrical Speed",
      "Unlimited Premium Data",
      "Priority 24/7 Support",
      "Gaming Router Included",
      "Free Installation",
      "No Contract"
    ],
    buttonText: "Choose Plan",
    icon: <LuGamepad2 className="h-7 w-7" />,
    color: "from-cyan-500 to-cyan-700",
    iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-700"
  },
  {
    name: "Shadhin",
    price: "1000",
    speed: "40 MBPS",
    features: [
      "40 Mbps Symmetrical Speed",
      "Unlimited Premium Data",
      "Priority 24/7 Support",
      "Gaming Router Included",
      "Free Installation",
      "No Contract"
    ],
    buttonText: "Choose Plan",
    icon: <BsHouseDoor className="h-7 w-7" />,
    color: "from-emerald-500 to-emerald-700",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-700"
  },
  {
    name: "Shagotom",
    price: "1500",
    speed: "50 MBPS",
    features: [
      "50 Mbps Symmetrical Speed",
      "Unlimited Premium+ Data",
      "VIP 24/7 Priority Support",
      "Mesh WiFi System Included",
      "Free Professional Setup",
      "2 Years Price Lock",
      "Static IP Address"
    ],
    buttonText: "Go Premium",
    icon: <HiOutlineSparkles className="h-7 w-7" />,
    color: "from-purple-500 to-purple-700",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700"
  },
  {
    name: "Chaitali",
    price: "2000",
    speed: "80 MBPS",
    features: [
      "80 Mbps Symmetrical Speed",
      "Unlimited Premium+ Data",
      "VIP 24/7 Priority Support",
      "Mesh WiFi System Included",
      "Free Professional Setup",
      "Static IP Address"
    ],
    buttonText: "Go Premium",
    icon: <MdDataUsage className="h-7 w-7" />,
    color: "from-rose-500 to-rose-700",
    iconBg: "bg-gradient-to-br from-rose-500 to-rose-700"
  },
  {
    name: "Boishakhi",
    price: "3000",
    speed: "100 MBPS",
    features: [
      "100 Mbps Symmetrical Speed",
      "Unlimited Premium+ Data",
      "VIP 24/7 Priority Support",
      "Mesh WiFi System Included",
      "Free Professional Setup",
      "Static IP Address",
      "Dedicated Account Manager"
    ],
    isPopular: true,
    buttonText: "Go Ultra",
    icon: <FaTachometerAlt className="h-7 w-7" />,
    color: "from-amber-500 to-amber-700",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700"
  }
];

const PricingCard: React.FC<{ tier: PricingTier }> = ({ tier }) => {
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
            {tier.icon}
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
            <MdOutlineCheckCircle className="w-4 h-4 text-green-500" />
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

const PricingCards: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl tracking-tight font-source text-gray-900 dark:text-white sm:text-3xl md:text-5xl mb-4">
            Discover Our Best Packages
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pick the plan that fits your lifestyle. All plans include unlimited data and 24/7 support.
          </p>
          
          {/* Speed indicators */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FaTachometerAlt className="w-4 h-4 text-gray-500" />
              <span>Fiber Optic</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MdDataUsage className="w-4 h-4 text-green-500" />
              <span>Unlimited Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiShield className="w-4 h-4 text-purple-500" />
              <span>Secure Connection</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid - responsive for 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} tier={tier} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3">
                <MdOutlineSupportAgent className="w-8 h-8 text-purple-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">24/7 Support</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <LuRouter className="w-8 h-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Free Router</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">With annual payment</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <BsClock className="w-8 h-8 text-green-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">30-Day Guarantee</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Money back guarantee</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <FiServer className="w-4 h-4" />
              99.9% Uptime Guarantee • No Contracts • Free Installation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;