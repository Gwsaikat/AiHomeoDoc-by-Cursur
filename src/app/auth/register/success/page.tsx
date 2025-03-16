'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Success confetti animation
const SuccessConfetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 10 + 5;
        const x = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 3 + 2;
        const color = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][
          Math.floor(Math.random() * 5)
        ];
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              top: -size,
              left: `${x}%`,
            }}
            initial={{ y: -100 }}
            animate={{ 
              y: `calc(100vh + ${size}px)`,
              rotate: Math.random() * 360
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

const SuccessPage = () => {
  const router = useRouter();
  
  // Redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative overflow-hidden">
      <SuccessConfetti />
      
      <motion.div
        className="w-full max-w-lg bg-white rounded-xl shadow-xl p-10 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6"
          variants={itemVariants}
        >
          <FaCheckCircle className="text-green-600 text-5xl" />
        </motion.div>
        
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-2"
          variants={itemVariants}
        >
          Registration Successful!
        </motion.h1>
        
        <motion.p
          className="text-gray-600 mb-8"
          variants={itemVariants}
        >
          Your account has been created successfully. A verification email has been sent to your email address.
        </motion.p>
        
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              Please check your inbox and verify your email address to activate your account. You'll be redirected to the login page in a few seconds.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
        >
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Continue to Login <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage; 