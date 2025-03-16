import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MobileNavProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg px-2 py-2">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative flex-1 min-w-[80px] px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  activeTab === tab
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }
              `}
            >
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-center whitespace-nowrap">{tab}</span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav; 