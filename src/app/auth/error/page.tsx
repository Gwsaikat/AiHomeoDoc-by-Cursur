'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const errorMessages = {
  missing_code: 'Authentication code is missing. Please try signing in again.',
  exchange_error: 'Failed to process your authentication. Please try again.',
  callback_error: 'An unexpected error occurred during authentication.',
  default: 'An error occurred during authentication. Please try again.'
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Handle searchParams safely
    const errorCode = searchParams?.get('error') || 'default';
    setErrorMessage(errorMessages[errorCode as keyof typeof errorMessages] || errorMessages.default);

    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/auth');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{errorMessage}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 flex items-center justify-center transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Return to Sign In
          </Link>
          
          <p className="text-center text-sm text-gray-500">
            Redirecting to login in {countdown} seconds...
          </p>
        </div>
      </motion.div>
    </div>
  );
} 