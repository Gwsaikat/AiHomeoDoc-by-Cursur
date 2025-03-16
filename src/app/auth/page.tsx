'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaLeaf, FaHeart, FaBrain, FaShieldAlt } from 'react-icons/fa';

// Dynamically import the authentication components with SSR disabled
// This ensures they only render on the client, avoiding hydration issues
const SignInForm = dynamic(() => import('@/components/auth/SignInForm'), { 
  ssr: false,
  loading: () => <AuthFormSkeleton title="Sign In" />
});

const SignUpForm = dynamic(() => import('@/components/auth/SignUpForm'), {
  ssr: false,
  loading: () => <AuthFormSkeleton title="Create Account" />
});

// Static skeleton for auth forms during loading
function AuthFormSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="h-12 bg-blue-200 rounded mb-4"></div>
      </div>
    </div>
  );
}

// Define the FloatingIcon props type
interface FloatingIconProps {
  icon: React.ElementType;
  color: string;
  delay?: number;
  scale?: number;
}

// Floating Icon component
const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, color, delay = 0, scale = 1 }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        }
      }}
      className={`absolute ${color} text-2xl ${
        scale === 1.5 ? 'scale-150' : 
        scale === 1.4 ? 'scale-140' : 
        scale === 1.3 ? 'scale-130' : 
        scale === 1.2 ? 'scale-120' : 
        'scale-100'
      }`}
    >
      <Icon />
    </motion.div>
  );
};

// Loading component for Suspense fallback
const AuthPageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <AuthFormSkeleton title="Loading..." />
    </div>
  </div>
);

// Main component that uses useSearchParams
const AuthPageContent = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    // Check for tab parameter
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'register') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  // Render a minimal page until client-side code takes over
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthFormSkeleton title="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4">
          <FloatingIcon icon={FaLeaf} color="text-green-400" delay={0} scale={1.5} />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <FloatingIcon icon={FaHeart} color="text-red-400" delay={1} scale={1.2} />
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <FloatingIcon icon={FaBrain} color="text-purple-400" delay={2} scale={1.3} />
        </div>
        <div className="absolute bottom-1/4 right-1/3">
          <FloatingIcon icon={FaShieldAlt} color="text-blue-400" delay={3} scale={1.4} />
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      {/* Back to home link */}
      <div className="max-w-md mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <FaArrowLeft className="mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 6V12C4 15.31 7.58 20 12 22C16.42 20 20 15.31 20 12V6L12 2Z" fill="url(#paint0_linear)" />
              <path d="M11 14H13V16H11V14Z" fill="white" />
              <path d="M11 8H13V12H11V8Z" fill="white" />
              <defs>
                <linearGradient id="paint0_linear" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-900 mb-2"
        >
          AI Homeopathy
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-gray-600 mb-8"
        >
          Your journey to better health starts here
        </motion.p>
        
        {/* Toggle buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex rounded-xl bg-white p-1 mb-8 shadow-lg"
        >
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'signin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {activeTab === 'signin' ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div key={`signin-${isMounted ? 'mounted' : 'unmounted'}`}>
                <SignInForm />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div key={`signup-${isMounted ? 'mounted' : 'unmounted'}`}>
                <SignUpForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main auth page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <AuthPageContent />
    </Suspense>
  );
} 