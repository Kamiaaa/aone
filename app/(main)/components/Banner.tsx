'use client'
import React from 'react';
import { FiWifi, FiZap, FiGlobe } from 'react-icons/fi';

const Banner: React.FC = () => {
  const handleGetConnectedClick = () => {
    // Add your packages page URL or signup integration here
    window.location.href = '/packages';
    // Or if using Next.js router:
    // router.push('/packages');
  };

  return (
    <div className="w-full mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-dvw lg:px-8 py-10">
      <div className="relative rounded-2xl px-6 py-10 bg-red-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
        <div aria-hidden="true" className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1463 360"
          >
            <path
              className="text-red-400 text-opacity-40"
              fill="currentColor"
              d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
            />
            <path
              className="text-red-700 text-opacity-40"
              fill="currentColor"
              d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
            />
          </svg>
        </div>
        <div className="relative flex flex-col">
          <div className="sm:text-center">
            <h2 className="text-2xl tracking-tight font-source text-white dark:text-gray-white sm:text-3xl md:text-6xl">
              Get Connected with A1 Communication Today!
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-100">
              Experience lightning-fast fiber optic internet with 99.9% uptime. 
              Choose from our flexible packages designed for home, business, and enterprise needs.
            </p>
          </div>
          
          {/* Button with new design */}
          <button
            onClick={handleGetConnectedClick}
            className="relative overflow-hidden bg-gray-600 text-white font-semibold py-3 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center justify-center gap-2 w-auto mt-5 mx-auto text-base"
            aria-label="View Packages"
          >
            <FiWifi className="text-xl relative z-10" />
            <span className="relative z-10">View Packages</span>
            <span className="absolute inset-0 bg-gray-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;