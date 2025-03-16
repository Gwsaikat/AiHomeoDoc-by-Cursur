'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaSpinner, FaUserMd, FaHospital } from 'react-icons/fa';
import { supabase } from '@/utils/supabase';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'clinic'>('patient');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user is already authenticated
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          // Redirect to login if no session
          router.push('/auth');
          return;
        }
        
        // Check if user has already completed their profile
        const user = data.session.user;
        if (user.user_metadata?.role) {
          // User already has role, redirect to dashboard
          const role = user.user_metadata.role;
          router.push(`/dashboard/${role}`);
          return;
        }
        
        // Pre-fill name if available from OAuth providers
        if (user.user_metadata?.full_name) {
          setFullName(user.user_metadata.full_name);
        }
        else if (user.user_metadata?.name) {
          setFullName(user.user_metadata.name);
        }
        
        setUser(user);
        setLoading(false);
      } catch (err: any) {
        console.error('Error checking session:', err);
        setError(err.message || 'An error occurred while checking your session.');
        setLoading(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // Update user metadata with role and name
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          role: selectedRole,
          subscription_plan: 'free'
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to appropriate dashboard
      setRedirecting(true);
      router.push(`/dashboard/${selectedRole}`);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while updating your profile.');
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <FaSpinner className="text-indigo-600 text-4xl animate-spin mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={() => router.push('/auth')}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Just a few more details to personalize your experience</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your full name"
              />
            </div>
          </div>
          
          {/* Email (display only) */}
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
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You signed in using {user?.app_metadata?.provider || 'an external provider'}
            </p>
          </div>
          
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
          
          <button
            type="submit"
            disabled={isSaving || redirecting}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            {isSaving || redirecting ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                <span>{redirecting ? 'Redirecting...' : 'Saving...'}</span>
              </div>
            ) : (
              'Complete Profile'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
} 