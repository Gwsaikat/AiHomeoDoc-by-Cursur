'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { supabase } from '@/utils/supabase';

// Loading component for Suspense fallback
const ConfirmPageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
    >
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaSpinner className="text-blue-600 text-4xl animate-spin" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
      <p className="text-gray-600">
        Please wait while we verify your email address...
      </p>
    </motion.div>
  </div>
);

// Main confirm form component that uses useSearchParams
const ConfirmForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const processConfirmation = async () => {
      try {
        // Check if there's an error parameter (from the callback route)
        const error = searchParams!.get('error') || null;
        
        if (error) {
          console.error('Error from callback:', error);
          setStatus('error');
          setMessage('Email verification failed.');
          setErrorDetails(error);
          return;
        }
        
        // For direct access to this page, check for code parameter
        const code = searchParams!.get('token') || searchParams!.get('code');
        
        if (code) {
          // User accessed this page directly with a verification code
          // We'll try to handle it here, though ideally users should use the callback route
          console.log('Direct access with code detected, attempting verification...');
          
          const { error } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'email',
          });
          
          if (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('Failed to verify your email.');
            setErrorDetails(error.message);
            return;
          }
          
          // Get user details after successful verification
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            setStatus('error');
            setMessage('Unable to retrieve user information after verification.');
            return;
          }
          
          // Extract role from user metadata
          const role = user.user_metadata?.role || 'patient';
          setUserRole(role);
          
          // Success!
          setStatus('success');
          setMessage('Email verified successfully!');
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            if (role === 'doctor') {
              router.push('/dashboard/doctor');
            } else if (role === 'clinic') {
              router.push('/dashboard/clinic');
            } else {
              // Default to patient dashboard
              router.push('/dashboard/patient');
            }
          }, 2000);
          
          return;
        }
        
        // If we reach here, no error or code parameters were found
        setStatus('error');
        setMessage('Invalid verification link. No verification code found.');
        
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred.');
        setErrorDetails(err.message || String(err));
      }
    };

    processConfirmation();
  }, [searchParams, router]);

  // Same return statement as before with the status === 'loading', 'success', and 'error' JSX
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSpinner className="text-blue-600 text-4xl animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You will be redirected to your dashboard shortly.
            </p>
            <div className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
              Redirecting to {userRole === 'doctor' ? 'Doctor' : userRole === 'clinic' ? 'Clinic' : 'Patient'} Dashboard...
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            {errorDetails && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-700">Error details: {errorDetails}</p>
                <p className="text-xs text-red-500 mt-2">
                  If the message says "Email link is invalid or has expired", the link was likely used already 
                  or has expired (typically after 24 hours). Please request a new verification email.
                </p>
              </div>
            )}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => router.push('/auth')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Sign In
              </button>
              <button
                onClick={async () => {
                  try {
                    setStatus('loading');
                    setMessage('Sending new verification email...');
                    // Redirect to sign-in page where they can request a new email
                    router.push('/auth?action=resend-verification');
                  } catch (err) {
                    console.error('Failed to resend verification:', err);
                    setStatus('error');
                    setMessage('Failed to send a new verification email. Please try signing in again.');
                  }
                }}
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Resend Verification Email
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Main page component with Suspense boundary
export default function ConfirmPage() {
  return (
    <Suspense fallback={<ConfirmPageLoading />}>
      <ConfirmForm />
    </Suspense>
  );
} 