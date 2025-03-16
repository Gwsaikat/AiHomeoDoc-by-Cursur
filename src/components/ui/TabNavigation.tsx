'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  isReducedMotion?: boolean;
  stickyPosition?: 'top' | 'none';
  variant?: 'premium' | 'minimal';
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  isReducedMotion = false,
  stickyPosition = 'top',
  variant = 'premium'
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Check if touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Styles based on variant
  const navStyles = {
    premium: "bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border border-white/50 shadow-xl p-2 rounded-2xl transform perspective-1000 relative",
    minimal: "bg-white/90 backdrop-blur-md border border-gray-200 shadow-md p-1 rounded-xl"
  };

  const stickyClass = stickyPosition === 'top' ? 'sticky top-0' : '';
  
  // Calculate tab width class based on screen size
  const getTabWidthClass = () => {
    if (windowWidth < 400) return 'min-w-[75px]';
    if (windowWidth < 640) return 'min-w-[85px]';
    return 'min-w-0'; // Let it size naturally on larger screens
  };

  const tabWidthClass = getTabWidthClass();

  return (
    <motion.div 
      className={`flex justify-center mb-8 ${stickyClass} py-2 relative z-50`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className={`${navStyles[variant]} w-full max-w-[95vw] md:max-w-3xl overflow-x-auto hide-scrollbar shadow-xl`}>
        <div className="flex flex-nowrap justify-start md:justify-center">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative whitespace-nowrap flex-1 ${tabWidthClass} px-3 sm:px-5 py-3 m-0.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 overflow-hidden ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/20 transform -translate-y-[1px]'
                  : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-indigo-600'
              }`}
              whileHover={!isReducedMotion && !isTouchDevice ? { 
                y: activeTab === tab ? -1 : -1,
                transition: { duration: 0.2 }
              } : {}}
              whileTap={{ scale: 0.97 }}
            >
              {activeTab === tab && !isReducedMotion && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl"
                  layoutId="navHighlight"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 mx-auto">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TabNavigation; 