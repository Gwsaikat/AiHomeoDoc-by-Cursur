'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { FaHospital, FaUserMd, FaUserInjured, FaCalendarAlt, FaProcedures, FaMoneyBillWave } from 'react-icons/fa';

export default function ClinicDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // You can fetch additional profile data from your profiles table if needed
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Clinic Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline-block">
                Welcome, {user?.user_metadata?.full_name || 'Clinic Admin'}
              </span>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaHospital className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Patients', value: '1,248', icon: FaUserInjured, color: 'purple' },
            { label: 'Doctors', value: '12', icon: FaUserMd, color: 'blue' },
            { label: 'Today\'s Appointments', value: '34', icon: FaCalendarAlt, color: 'green' },
            { label: 'Monthly Revenue', value: '₹245,000', icon: FaMoneyBillWave, color: 'emerald' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`text-${stat.color}-600 text-xl`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Appointments and doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-8 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Today's Appointments</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Morning appointments */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Morning</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="text-sm font-semibold text-purple-600">9:00 AM</div>
                            <div className="text-xs text-gray-500">Dr. Chen</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Lisa Rodriguez</h4>
                            <p className="text-gray-600 text-xs">Follow-up Consultation</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">Checked In</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="text-sm font-semibold text-purple-600">10:15 AM</div>
                            <div className="text-xs text-gray-500">Dr. Singh</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Thomas Wang</h4>
                            <p className="text-gray-600 text-xs">Initial Consultation</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">Confirmed</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="text-sm font-semibold text-purple-600">11:30 AM</div>
                            <div className="text-xs text-gray-500">Dr. Patel</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Emma Johnson</h4>
                            <p className="text-gray-600 text-xs">Remedy Evaluation</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">Confirmed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Afternoon appointments */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Afternoon</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="text-sm font-semibold text-purple-600">1:00 PM</div>
                            <div className="text-xs text-gray-500">Dr. Chen</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">David Brown</h4>
                            <p className="text-gray-600 text-xs">Follow-up Consultation</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">Scheduled</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="text-sm font-semibold text-purple-600">2:30 PM</div>
                            <div className="text-xs text-gray-500">Dr. Patel</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Sophia Kim</h4>
                            <p className="text-gray-600 text-xs">Initial Consultation</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">Scheduled</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3">
                            <div className="text-sm font-semibold text-purple-600">4:15 PM</div>
                            <div className="text-xs text-gray-500">Dr. Singh</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Michael Lee</h4>
                            <p className="text-gray-600 text-xs">Treatment Review</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                View Full Schedule
              </button>
            </div>
          </motion.div>

          {/* Doctor status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-4 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Doctor Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUserMd className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">Dr. Michael Chen</h3>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        <span className="text-xs text-green-600">Available - Room 102</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUserMd className="text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">Dr. Priya Patel</h3>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        <span className="text-xs text-green-600">Available - Room 105</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FaUserMd className="text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">Dr. Raj Singh</h3>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                        <span className="text-xs text-yellow-600">With Patient - Room 103</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FaUserMd className="text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">Dr. Sarah Johnson</h3>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        <span className="text-xs text-red-600">On Leave</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                View All Doctors
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 