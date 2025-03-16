'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaPhoneAlt, FaApple, FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (signUpError) throw signUpError;
        if (data) {
          setIsSignUp(false);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (data.user) {
          router.push('/dashboard/patient');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading('google');
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // The user will be redirected to Google's OAuth page
      // No need to handle success case here as the redirect happens automatically
    } catch (err: any) {
      setError(`Google login failed: ${err.message}`);
      setSocialLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setSocialLoading('apple');
      setError('');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // User will be redirected to Apple's sign in page
    } catch (err: any) {
      setError(`Apple login failed: ${err.message}`);
      setSocialLoading(null);
    }
  };

  const handlePhoneSignIn = async () => {
    if (showPhoneInput && phoneNumber) {
      // Step 2: Send OTP if phone number is provided
      try {
        setSocialLoading('phone');
        setError('');
        
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
        });
        
        if (error) throw error;
        
        setShowOtpInput(true);
        setShowPhoneInput(false);
        setSocialLoading(null);
      } catch (err: any) {
        setError(`Phone verification failed: ${err.message}`);
        setSocialLoading(null);
      }
    } else if (showOtpInput && otp) {
      // Step 3: Verify OTP
      try {
        setSocialLoading('phone');
        setError('');
        
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otp,
          type: 'sms',
        });
        
        if (error) throw error;
        
        if (data.user) {
          router.push('/dashboard/patient');
        }
      } catch (err: any) {
        setError(`OTP verification failed: ${err.message}`);
        setSocialLoading(null);
      }
    } else {
      // Step 1: Show phone input field
      setShowPhoneInput(true);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Start your wellness journey' : 'Continue your wellness journey'}
            </p>
          </div>

          {/* Phone Number Input (Conditional) */}
          {showPhoneInput && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter your phone number</label>
              <div className="flex">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button 
                  onClick={handlePhoneSignIn}
                  disabled={socialLoading === 'phone'}
                  className="bg-indigo-600 text-white py-3 px-4 rounded-r-lg hover:bg-indigo-700 transition-colors"
                >
                  {socialLoading === 'phone' ? <FaSpinner className="animate-spin" /> : 'Send Code'}
                </button>
              </div>
              <button 
                onClick={() => setShowPhoneInput(false)}
                className="text-sm text-gray-600 mt-2 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}

          {/* OTP Input (Conditional) */}
          {showOtpInput && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter the verification code</label>
              <div className="flex">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={6}
                />
                <button 
                  onClick={handlePhoneSignIn}
                  disabled={socialLoading === 'phone'}
                  className="bg-indigo-600 text-white py-3 px-4 rounded-r-lg hover:bg-indigo-700 transition-colors"
                >
                  {socialLoading === 'phone' ? <FaSpinner className="animate-spin" /> : 'Verify'}
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <button 
                  onClick={() => {
                    setShowOtpInput(false);
                    setShowPhoneInput(true);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Change Phone
                </button>
                <button 
                  onClick={handlePhoneSignIn}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* Regular Email/Password Form */}
          {!showPhoneInput && !showOtpInput && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full Name"
                    className="w-full pl-10 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email Address"
                  className="w-full pl-10 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full pl-10 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Social login options */}
          {!showOtpInput && (
            <div className="mt-6">
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute w-full h-px bg-gray-300"></div>
                <span className="relative px-4 bg-white text-gray-500 text-sm">OR CONTINUE WITH</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={!!socialLoading}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors relative"
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
                  onClick={handlePhoneSignIn}
                  disabled={!!socialLoading}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
                >
                  {socialLoading === 'phone' ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <FaPhoneAlt className="text-green-600 text-xl" />
                  )}
                  <span className="text-gray-800 font-medium">Continue with Phone Number</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={!!socialLoading}
                  className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
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

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setShowPhoneInput(false);
                setShowOtpInput(false);
                setError('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 