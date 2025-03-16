'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarAlt, FaUserInjured, FaClipboardList, FaChartLine } from 'react-icons/fa';

export default function DoctorDashboard() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline-block">
                Welcome, Dr. {user?.user_metadata?.full_name || 'Practitioner'}
              </span>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaUserMd className="text-white" />
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
            { label: 'Today\'s Appointments', value: '8', icon: FaCalendarAlt, color: 'green' },
            { label: 'Total Patients', value: '154', icon: FaUserInjured, color: 'blue' },
            { label: 'Pending Reports', value: '12', icon: FaClipboardList, color: 'amber' },
            { label: 'Success Rate', value: '92%', icon: FaChartLine, color: 'emerald' }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="col-span-2 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Sample appointments */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">SJ</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">Sarah Johnson</h3>
                        <p className="text-gray-600 text-sm">First Consultation</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          <span className="text-xs text-green-600">Confirmed</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium">10:30 AM</p>
                      <p className="text-gray-500 text-sm">45 min</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      Patient File
                    </button>
                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                      Start Session
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-medium">RK</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">Robert Kim</h3>
                        <p className="text-gray-600 text-sm">Follow-up</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          <span className="text-xs text-green-600">Confirmed</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium">11:30 AM</p>
                      <p className="text-gray-500 text-sm">30 min</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      Patient File
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded cursor-not-allowed">
                      Start Session
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-medium">MP</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900">Maria Patel</h3>
                        <p className="text-gray-600 text-sm">Remedy Check</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                          <span className="text-xs text-yellow-600">Pending</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium">2:00 PM</p>
                      <p className="text-gray-500 text-sm">30 min</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      Patient File
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded cursor-not-allowed">
                      Start Session
                    </button>
                  </div>
                </div>

                <button className="mt-2 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  View Full Schedule
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pending reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Pending Reports</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Sample reports */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">James Wilson</h3>
                      <p className="text-gray-600 text-sm mt-1">Initial Assessment</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">Urgent</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">Due: Today</div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Emma Thompson</h3>
                      <p className="text-gray-600 text-sm mt-1">Follow-up Report</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-600">Medium</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">Due: Tomorrow</div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Olivia Chen</h3>
                      <p className="text-gray-600 text-sm mt-1">Monthly Progress</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">Standard</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">Due: Jun 15, 2023</div>
                </div>

                <button className="mt-2 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  View All Reports
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 