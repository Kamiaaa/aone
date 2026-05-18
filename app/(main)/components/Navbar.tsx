'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  HiMenu, 
  HiX
} from 'react-icons/hi';
import { FiLogIn } from 'react-icons/fi';
import Image from 'next/image';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 'lg' breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll effect - Only apply header hiding logic on desktop
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only apply header hiding on desktop (not mobile)
      if (!isMobile) {
        // Detect if header is hidden (scrolling down)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHeaderHidden(true);
        } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
          // Show when scrolling up or at top
          setIsHeaderHidden(false);
        }
      }
      
      // Original scroll effect for styling (apply to both mobile and desktop)
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [lastScrollY, isMobile]);

  // Navigation Data
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/'
    },
    {
      id: 'about',
      label: 'About Us',
      href: '/about'
    },
    {
      id: 'packages',
      label: 'Packages',
      href: '/packages'
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '/contact'
    }
  ];

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideNavbar = navbarRef.current && !navbarRef.current.contains(target);
      
      if (isOutsideNavbar) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
  };

  // Calculate navbar position - Always top on mobile
  const getNavbarTop = () => {
    // On mobile, always stay at top
    if (isMobile) {
      return 'top-0';
    }
    
    // On desktop, adjust based on header visibility
    if (isHeaderHidden) {
      return 'top-0'; // Stick to top when header is hidden
    }
    return 'top-14'; // Below header when header is visible
  };

  // Get mobile menu position - Always full screen from top on mobile
  const getMobileMenuStyle = () => {
    if (isMobile) {
      return { top: '0' };
    }
    return { 
      top: isHeaderHidden ? '0' : '64px'
    };
  };

  // Get overlay position - Always full screen from top on mobile
  const getOverlayStyle = () => {
    if (isMobile) {
      return { top: '0' };
    }
    return { 
      top: isHeaderHidden ? '0' : '64px'
    };
  };

  return (
    <>
      {/* Main Navbar - Always at top on mobile */}
      <nav 
        ref={navbarRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          getNavbarTop()
        } ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 py-0' 
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-2'
        }`}
        style={{
          transition: 'top 0.3s ease-in-out, transform 0.3s ease-in-out'
        }}
      >
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18.5">
            {/* Logo - Left aligned */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-2 group"
                onClick={closeAllMenus}
              >
                <div className="relative w-37.5 h-18.5">
                <Image
                  src="/img/logo.png"
                  alt="logo"
                  fill
                  loading="eager"
                  className="object-contain"
                />
              </div>
                
              </Link>
            </div>

            {/* Right side: Navigation menu for desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Navigation Menu */}
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                    onClick={closeAllMenus}
                  >
                    <span>{item.label}</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile menu button - Only visible on mobile, no Self Care button outside */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu - Always full screen from top on mobile */}
      <div 
        ref={navbarRef}
        className={`lg:hidden fixed inset-0 bg-white dark:bg-gray-900 z-40 transition-all duration-500 ease-in-out transform ${
          isMobileMenuOpen 
            ? 'translate-x-0 opacity-100 pointer-events-auto' 
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        style={getMobileMenuStyle()}
      >
        <div className="h-full overflow-y-auto px-4 py-4 space-y-0 pt-28">
          {/* Self Care button inside hamburger menu only */}
          <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <Link
              href="/login"
              className="relative overflow-hidden bg-red-600 text-white font-semibold py-3 px-5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg group flex items-center justify-center gap-2 w-full"
              onClick={closeAllMenus}
            >
              <FiLogIn className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-medium">Self Care</span>
              <span className="absolute inset-0 bg-red-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
            </Link>
          </div>
          
          {navItems.map((item) => (
            <div 
              key={item.id} 
              className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-300"
            >
              <Link
                href={item.href}
                className="flex items-center px-3 py-4 text-base font-medium text-gray-900 dark:text-white hover:text-pink-700 dark:hover:text-pink-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                onClick={closeAllMenus}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for mobile menu - Always full screen from top on mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-500"
          onClick={closeAllMenus}
          style={getOverlayStyle()}
        />
      )}
    </>
  );
};

export default Navbar;