// components/ScrollToTopWithProgress.jsx
'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', calculateScrollProgress);
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full relative overflow-hidden bg-red-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#6A957A] group flex items-center justify-center"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
          }}
          aria-label="Scroll to top"
        >
          {/* Animated background overlay */}
          <span className="absolute inset-0 bg-red-700 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
          
          {/* Progress circle */}
          <svg className="w-full h-full absolute top-0 left-0 transform -rotate-90 z-10">
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeDasharray={163}
              strokeDashoffset={163 - (scrollProgress * 163) / 100}
              className="transition-all duration-100"
            />
          </svg>
          
          <FaArrowUp className="w-5 h-5 relative z-20 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;