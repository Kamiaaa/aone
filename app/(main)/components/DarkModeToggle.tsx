// components/StickyDarkModeToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 120,
        damping: 15
      }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50"
    >
      <div className="relative group">
        {/* Glow effect */}
        <motion.div
          animate={{
            boxShadow: isDark
              ? '0 0 20px rgba(106, 149, 122, 0.4)'
              : '0 0 20px rgba(49, 85, 67, 0.4)',
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Rotating gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, currentColor, transparent)',
            opacity: 0.15,
          }}
        />

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            rotate: isDark ? 360 : 0,
          }}
          transition={{
            rotate: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
            scale: { type: 'spring', stiffness: 400, damping: 12 }
          }}
          // Update the button className to include text colors:
          className={`
  relative p-4 rounded-full shadow-2xl
  backdrop-blur-sm
  bg-white dark:bg-gray-900
  text-gray-800 dark:text-gray-200  // ← Add this line
  border-2 border-gray-200 dark:border-gray-700
  hover:border-red-500 dark:hover:border-red-700
  transition-all duration-300 ease-out
  focus:outline-none focus:ring-4 focus:ring-red-500 dark:focus:ring-[red-700]/30
  cursor-pointer overflow-hidden
`}
          aria-label="Toggle dark mode"
        >
          {/* Background particle effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-linear-to-br from-red-500/20 to-[red-700]/20 rounded-full"
          />

          {/* Sun icon */}
          <motion.div
            initial={false}
            animate={{
              scale: isDark ? 0 : 1,
              rotate: isDark ? 180 : 0,
              y: isDark ? 20 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.4
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className={`w-7 h-7 transition-all duration-300 ${isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </motion.div>

          {/* Moon icon */}
          <motion.div
            initial={false}
            animate={{
              scale: isDark ? 1 : 0,
              rotate: isDark ? 0 : -180,
              y: isDark ? 0 : -20,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.4
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className={`w-7 h-7 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </motion.div>

          {/* Ripple effect on click */}
          <AnimatePresence>
            <motion.div
              key={Date.now()}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-linear-to-r from-red-500 to-[red-700]"
            />
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: -15 }}
          transition={{ duration: 0.2 }}
          className="absolute right-full top-1/2 -translate-y-1/2 mr-3 pointer-events-none"
        >
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {isDark ? 'Light mode' : 'Dark mode'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DarkModeToggle;