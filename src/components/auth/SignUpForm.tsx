'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaCheckCircle, FaGoogle, FaPhoneAlt, FaApple, FaMedkit, FaHospital, FaUserMd } from 'react-icons/fa';
import { supabase } from '@/utils/supabase';

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'clinic'>('patient');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Sign up with metadata included to avoid separate profile creation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
            subscription_plan: 'free',
          },
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Successfully created account, now wait for verification
      setIsSignupComplete(true);
      setEmail(email); // Save email for confirmation message
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || String(err));
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setSocialLoading('google');
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?signup=true&role=${selectedRole}`,
        },
      });
      
      if (error) throw error;
      // Redirect is handled by OAuth provider
    } catch (err: any) {
      console.error('Google sign up error:', err);
      setError(err.message || 'Error signing up with Google');
      setSocialLoading(null);
    }
  };

  const handleAppleSignUp = async () => {
    setSocialLoading('apple');
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?signup=true&role=${selectedRole}`,
        },
      });
      
      if (error) throw error;
      // Redirect is handled by OAuth provider
    } catch (err: any) {
      console.error('Apple sign up error:', err);
      setError(err.message || 'Error signing up with Apple');
      setSocialLoading(null);
    }
  };

  const handlePhoneSignUp = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setSocialLoading('phone');
    setError(null);
    
    try {
      // Format phone with country code if not already included
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true, // This is a sign-up attempt
        }
      });
      
      if (error) throw error;
      
      // Show OTP input field
      setShowOtpInput(true);
      setSocialLoading(null);
      setOtpMessage('Verification code sent to your phone. Please enter it below.');
    } catch (err: any) {
      console.error('Phone sign up error:', err);
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
    setError(null);
    
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
      
      // After successful verification, update user metadata with role
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: selectedRole,
          subscription_plan: 'free'
        }
      });
      
      if (updateError) {
        console.error('Error updating user role:', updateError);
        // Continue despite the error
      }
      
      // OTP verification successful, user will be redirected to dashboard
      setOtpMessage('Verification successful! Redirecting...');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid verification code');
      setSocialLoading(null);
    }
  };

  const handleResendOtp = async () => {
    setSocialLoading('phone');
    setError(null);
    
    try {
      // Format phone with country code if not already included
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
    >
      {!isSignupComplete ? (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg"
            >
              <p className="text-sm">{error}</p>
            </motion.div>
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
                  onClick={handlePhoneSignUp}
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

          {/* Regular Form */}
          {!showPhoneInput && !showOtpInput && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('patient')}
                    className={`py-4 border rounded-lg flex flex-col items-center justify-center ${
                      selectedRole === 'patient'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                      selectedRole === 'patient' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'
                    }`}>
                      <FaUser className="text-lg" />
                    </div>
                    <span className={selectedRole === 'patient' ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                      Patient
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('doctor')}
                    className={`py-4 border rounded-lg flex flex-col items-center justify-center ${
                      selectedRole === 'doctor'
                        ? 'bg-green-50 border-green-500 ring-2 ring-green-500 ring-opacity-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                      selectedRole === 'doctor' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-500'
                    }`}>
                      <FaUserMd className="text-lg" />
                    </div>
                    <span className={selectedRole === 'doctor' ? 'text-green-700 font-medium' : 'text-gray-700'}>
                      Doctor
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('clinic')}
                    className={`py-4 border rounded-lg flex flex-col items-center justify-center ${
                      selectedRole === 'clinic'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500 ring-opacity-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                      selectedRole === 'clinic' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-500'
                    }`}>
                      <FaHospital className="text-lg" />
                    </div>
                    <span className={selectedRole === 'clinic' ? 'text-purple-700 font-medium' : 'text-gray-700'}>
                      Clinic
                    </span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email */}
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
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
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Create a password (min. 6 characters)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Social login options */}
          {!showOtpInput && (
            <div className="mt-8">
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute w-full h-px bg-gray-300"></div>
                <span className="relative px-4 bg-white text-gray-500 text-sm">OR SIGN UP WITH</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
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
                  <span className="text-gray-800 font-medium">Sign up with Google</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => !showPhoneInput && setShowPhoneInput(true)}
                  className="w-full py-3 px-4 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 flex items-center justify-center gap-3 transition-colors"
                  disabled={!!socialLoading}
                >
                  {socialLoading === 'phone' ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <FaPhoneAlt className="text-green-600 text-xl" />
                  )}
                  <span className="text-gray-800 font-medium">Sign up with Phone</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleAppleSignUp}
                  disabled={!!socialLoading}
                  className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-3 transition-colors"
                >
                  {socialLoading === 'apple' ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <FaApple className="text-gray-800 text-xl" />
                  )}
                  <span className="text-gray-800 font-medium">Sign up with Apple</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a 
                onClick={() => {
                  setShowPhoneInput(false);
                  setShowOtpInput(false);
                  router.push('/auth?tab=login');
                }} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Sign In
              </a>
            </p>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verification Email Sent!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            If you don't see the email, please check your spam folder or click the button below to return to sign in.
          </p>
          <button
            onClick={() => router.push('/auth?tab=login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Sign In
          </button>
        </motion.div>
      )}
    </motion.div>
  );
} 