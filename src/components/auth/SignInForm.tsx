'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle, FaGoogle, FaPhoneAlt, FaApple } from 'react-icons/fa';
import { supabase } from '@/utils/supabase';

export default function SignInForm() {
  // Basic state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [success, setSuccess] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('[SignIn] Starting sign-in process...');
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[SignIn] Supabase sign-in error:', error.message);
        
        // Handle verification errors
        if (error.message.toLowerCase().includes('verification') || 
            error.message.toLowerCase().includes('confirmed')) {
          setShowResend(true);
          setError('Email not verified. Please check your inbox or resend verification.');
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }

      // Successful sign in
      if (data.user) {
        console.log('[SignIn] Sign-in successful, user:', data.user.id);
        setSuccess('Sign-in successful! Redirecting to dashboard...');
        
        // Get the role from user metadata and normalize it
        let role = (data.user.user_metadata?.role || 'patient').toLowerCase();
        console.log('[SignIn] User role:', role);
        
        // Ensure role is one of the valid options
        if (!['patient', 'doctor', 'clinic'].includes(role)) {
          console.log('[SignIn] Invalid role, defaulting to patient');
          role = 'patient';
        }

        // Store role in localStorage for other components
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', role);
          
          // Use the most direct and immediate approach to navigate
          console.log('[SignIn] Force navigating to dashboard...');
          document.location.href = `/dashboard/${role}`;
        }
      }
    } catch (err) {
      console.error('[SignIn] Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address to resend verification.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Verification email sent! Please check your inbox.');
        setShowResend(false);
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?signup=false`,
        },
      });
      
      if (error) throw error;
      // Redirect is handled by OAuth provider
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Error signing in with Google');
      setSocialLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading('apple');
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?signup=false`,
        },
      });
      
      if (error) throw error;
      // Redirect is handled by OAuth provider
    } catch (err: any) {
      console.error('Apple sign in error:', err);
      setError(err.message || 'Error signing in with Apple');
      setSocialLoading(null);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setSocialLoading('phone');
    setError('');
    
    try {
      // Format phone with country code if not already included
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: false, // This is a sign-in attempt, not sign-up
        }
      });
      
      if (error) throw error;
      
      // Show OTP input field
      setShowOtpInput(true);
      setSocialLoading(null);
      setOtpMessage('Verification code sent to your phone. Please enter it below.');
    } catch (err: any) {
      console.error('Phone sign in error:', err);
      setError(err.message || 'Error sending verification code');
      setSocialLoading(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    
    setSocialLoading('phone');
    setError('');
    
    try {
      // Format phone with country code if not already included
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      // OTP verification successful, user will be redirected automatically
      setOtpMessage('Verification successful! Redirecting...');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid verification code');
      setSocialLoading(null);
    }
  };

  const handleResendOtp = async () => {
    setSocialLoading('phone');
    setError('');
    
    try {
      // Format phone with country code if not already included
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: false,
        }
      });
      
      if (error) throw error;
      
      setOtpMessage('New verification code sent to your phone.');
      setSocialLoading(null);
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Error resending verification code');
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
          <FaExclamationCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
          <p className="text-sm">{success}</p>
          {isLoading && (
            <div className="mt-2 flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              <span className="text-sm">Preparing your dashboard...</span>
            </div>
          )}
        </div>
      )}

      {/* Phone Input */}
      {showPhoneInput && !showOtpInput && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your phone number
          </label>
          <div className="flex">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPhoneAlt className="text-gray-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handlePhoneSignIn}
              disabled={socialLoading === 'phone' || !phone}
              className="bg-blue-600 text-white py-3 px-4 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {socialLoading === 'phone' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                'Send Code'
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Include your country code (e.g., +1 for US)
          </p>
        </div>
      )}

      {/* OTP Input */}
      {showOtpInput && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter verification code
          </label>
          {otpMessage && (
            <p className="text-sm text-green-600 mb-2">{otpMessage}</p>
          )}
          <div className="flex">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={socialLoading === 'phone' || !otp}
              className="bg-blue-600 text-white py-3 px-4 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {socialLoading === 'phone' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={socialLoading === 'phone'}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Resend code
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Change phone
            </button>
          </div>
        </div>
      )}

      {/* Regular Email/Password Form */}
      {!showPhoneInput && !showOtpInput && (
        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your password"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                <span>Processing...</span>
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Resend verification option */}
          {showResend && (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isLoading}
              className="w-full mt-4 bg-white text-blue-600 border border-blue-600 py-3 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Processing...</span>
                </span>
              ) : (
                <span>Resend Verification Email</span>
              )}
            </button>
          )}
        </form>
      )}

      {/* Social login options */}
      {!showOtpInput && (
        <div className="mt-8">
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute w-full h-px bg-gray-300"></div>
            <span className="relative px-4 bg-white text-gray-500 text-sm">OR CONTINUE WITH</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!!socialLoading}
              className="w-full py-3 px-4 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-3 transition-colors"
            >
              {socialLoading === 'google' ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
              )}
              <span className="text-gray-800 font-medium">Continue with Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => !showPhoneInput && setShowPhoneInput(true)}
              className="w-full py-3 px-4 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 flex items-center justify-center gap-3 transition-colors"
              disabled={socialLoading !== null}
            >
              {socialLoading === 'phone' ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <FaPhoneAlt className="text-green-600 text-xl" />
              )}
              <span className="text-gray-800 font-medium">Sign in with Phone</span>
            </button>
            
            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={!!socialLoading}
              className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-3 transition-colors"
            >
              {socialLoading === 'apple' ? (
                <FaSpinner className="animate-spin text-xl" />
              ) : (
                <FaApple className="text-gray-800 text-xl" />
              )}
              <span className="text-gray-800 font-medium">Continue with Apple</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth?tab=register')}
            className="text-blue-600 hover:text-blue-800 bg-transparent border-none p-0 inline font-normal cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}