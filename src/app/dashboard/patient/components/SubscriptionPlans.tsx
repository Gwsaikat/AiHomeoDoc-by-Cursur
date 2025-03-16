'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBookMedical, FaCheck, FaSeedling } from 'react-icons/fa';

// Define interfaces
interface SubscriptionProps {
  activeSubscription: string;
}

// Styles
const subscriptionCardStyle = "relative bg-white/95 rounded-xl p-6 border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden";
const card3DStyle = "bg-gradient-to-br from-white/95 to-white/90 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-filter backdrop-blur-xl rounded-2xl transition-all duration-300 transform perspective-1000";

const SubscriptionPlans: React.FC<SubscriptionProps> = ({ activeSubscription }) => {
  return (
    <motion.div
      className={`${card3DStyle} overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="px-6 py-5 border-b border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-blue-500">
        <h2 className="text-xl font-semibold text-white drop-shadow-sm">Your Subscription</h2>
        <FaBookMedical className="text-white text-xl" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan:</h3>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeSubscription === "premium" ? "bg-indigo-100 text-indigo-700" : 
              activeSubscription === "basic" ? "bg-blue-100 text-blue-700" : 
              "bg-gray-100 text-gray-700"
            }`}>
              {activeSubscription === "premium" ? "Premium" : 
               activeSubscription === "basic" ? "Basic" : "Free"}
            </span>
            {activeSubscription === "premium" && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2 text-yellow-500"
              >
                <FaSeedling />
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`${subscriptionCardStyle} ${activeSubscription === "free" ? "ring-2 ring-gray-400" : ""}`}>
            <div className="absolute top-0 right-0">
              {activeSubscription === "free" && (
                <div className="bg-gray-500 text-white text-xs py-1 px-3 rounded-bl-lg">Active</div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Free</h3>
            <p className="text-2xl font-bold text-gray-900 mb-4">$0<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-gray-500 mr-2" /> Basic Consultations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-gray-500 mr-2" /> Limited Health Tracking
              </li>
            </ul>
            <button className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors">
              Current Plan
            </button>
          </div>
          
          <div className={`${subscriptionCardStyle} ${activeSubscription === "basic" ? "ring-2 ring-blue-400" : ""}`}>
            <div className="absolute top-0 right-0">
              {activeSubscription === "basic" && (
                <div className="bg-blue-500 text-white text-xs py-1 px-3 rounded-bl-lg">Active</div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Basic</h3>
            <p className="text-2xl font-bold text-gray-900 mb-4">$9.99<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-blue-500 mr-2" /> Enhanced Consultations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-blue-500 mr-2" /> Full Health Tracking
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-blue-500 mr-2" /> Personalized Insights
              </li>
            </ul>
            <button className={`w-full py-2 ${activeSubscription === "basic" ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white hover:bg-blue-600"} rounded-lg font-medium text-sm transition-colors`}>
              {activeSubscription === "basic" ? "Current Plan" : "Upgrade"}
            </button>
          </div>
          
          <div className={`${subscriptionCardStyle} ${activeSubscription === "premium" ? "ring-2 ring-indigo-400" : ""} relative overflow-hidden`}>
            {activeSubscription !== "premium" && (
              <div className="absolute -right-10 top-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs py-1 px-10 transform rotate-45">
                Popular
              </div>
            )}
            <div className="absolute top-0 right-0">
              {activeSubscription === "premium" && (
                <div className="bg-indigo-500 text-white text-xs py-1 px-3 rounded-bl-lg">Active</div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium</h3>
            <p className="text-2xl font-bold text-gray-900 mb-4">$19.99<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-indigo-500 mr-2" /> Priority Consultations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-indigo-500 mr-2" /> Advanced Health Analytics
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-indigo-500 mr-2" /> Personalized Treatment Plans
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <FaCheck className="text-indigo-500 mr-2" /> 24/7 Support Access
              </li>
            </ul>
            <button className={`w-full py-2 ${activeSubscription === "premium" ? "bg-gray-100 text-gray-800" : "bg-indigo-500 text-white hover:bg-indigo-600"} rounded-lg font-medium text-sm transition-colors`}>
              {activeSubscription === "premium" ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>Need help choosing a plan? <span className="text-indigo-600 cursor-pointer hover:underline">Talk to our support team</span></p>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionPlans; 