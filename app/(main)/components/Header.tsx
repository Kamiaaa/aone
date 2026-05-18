// components/Header.tsx (Button right-aligned and vertically centered)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPhone, FiMail, FiLogIn } from 'react-icons/fi';

interface HeaderProps {
  phoneNumber?: string;
  email?: string;
  loginText?: string;
  loginUrl?: string;
  hideOnScroll?: boolean;
  hideOnMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  phoneNumber = '09542366393',
  email = 'info@a1communications.com',
  loginText = 'Self Care',
  loginUrl = '/login',
  hideOnScroll = true,
  hideOnMobile = true
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!hideOnScroll || isMobile) return;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setIsHidden(!visible);
      setPrevScrollPos(currentScrollPos);
    };

    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null as any;
      }, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [prevScrollPos, hideOnScroll, isMobile]);

  // Don't render anything on mobile if hideOnMobile is true
  if (isMobile && hideOnMobile) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Contact Info - Left */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-red-500" />
                <a 
                  href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}
                  className="text-lg hover:text-gray-50 transition-colors"
                >
                  {phoneNumber}
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-red-500" />
                <a 
                  href={`mailto:${email}`}
                  className="text-lg hover:text-gray-50 transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Self Care Button - Right with vertical centering */}
            <Link
              href={loginUrl}
              className="relative overflow-hidden bg-red-600 text-white font-semibold py-2 px-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center gap-2"
            >
              <FiLogIn className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{loginText}</span>
              <span className="absolute inset-0 bg-red-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;