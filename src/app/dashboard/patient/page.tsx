'use client';

import React, { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaBell, 
  FaChartLine, 
  FaPills, 
  FaClipboardList, 
  FaCheckCircle as FaCheckCircleIcon, 
  FaUserMd, 
  FaFire, 
  FaUtensils, 
  FaCapsules, 
  FaRunning, 
  FaHeartbeat, 
  FaUser, 
  FaTint, 
  FaSun, 
  FaWeight, 
  FaBed, 
  FaRobot, 
  FaStethoscope,
  FaFileAlt,
  FaKeyboard, 
  FaMicrophone, 
  FaImage, 
  FaCloudUploadAlt, 
  FaCheckCircle, 
  FaLeaf, 
  FaChartBar,
  FaLungs, 
  FaBrain, 
  FaAppleAlt,
  FaShieldAlt,
  FaMoon,
  FaCheck,
  FaSync,
  FaDownload,
  FaSearch,
  FaSeedling,
  FaArrowLeft,
  FaFish,
  FaExclamationTriangle,
  FaWater,
  FaCoffee,
  FaWalking,
  FaUsers,
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaStar,
  FaInfoCircle,
  FaClipboardCheck,
  FaNotesMedical,
  FaCommentMedical,
  FaThumbsUp,
  FaCalendarPlus,
  FaClock,
  FaClinicMedical,
  FaHistory,
  FaRedo,
  FaVideo,
  FaThermometerHalf,
  FaFlask,
  FaCalendarDay,
  FaCalendarMinus,
  FaListUl,
  FaPrescriptionBottleAlt,
  FaChevronRight,
  FaCalendarCheck, 
  FaTh
} from 'react-icons/fa';
import { FiCheckCircle, FiCircle, FiCheck, FiClipboard } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import TabNavigation from '@/components/ui/TabNavigation';
import axios from 'axios';
import Link from 'next/link';
import AppointmentSchedulingModal, { AppointmentFormData } from './components/AppointmentSchedulingModal';
import PrescriptionRequestModal, { PrescriptionFormData } from './components/PrescriptionRequestModal';

// Loading skeleton animation
const skeletonAnimation = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%]";

// Preloader component for content
const ContentPreloader = () => (
  <div className="space-y-4">
    <div className={`h-8 rounded-xl ${skeletonAnimation}`} />
    <div className={`h-24 rounded-xl ${skeletonAnimation}`} />
    <div className="grid grid-cols-2 gap-4">
      <div className={`h-16 rounded-xl ${skeletonAnimation}`} />
      <div className={`h-16 rounded-xl ${skeletonAnimation}`} />
    </div>
  </div>
);

// Define interfaces for the subscription components
interface SubscriptionProps {
  activeSubscription: string;
}

// Create a local subscription plans component for use until we can split the code
const LocalSubscriptionPlans: React.FC<SubscriptionProps> = ({ activeSubscription }) => {
  return (
    <motion.div
      className={`${card3DStyle} overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="px-6 py-5 border-b border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-blue-500">
        <h2 className="text-xl font-semibold text-white drop-shadow-sm">Your Subscription</h2>
        <FaFileAlt className="text-white text-xl" />
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
                <FaCheckCircle />
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

// Dynamically import heavy components
const SubscriptionPlansComponent = dynamic(() => import('./components/SubscriptionPlans'), { 
  ssr: false,
  loading: () => <div className="p-8 bg-white/80 rounded-2xl"><ContentPreloader /></div>
});

// Memoize static components to prevent re-renders
const MemoizedContentPreloader = React.memo(ContentPreloader);

// Enhanced card with advanced animation and style variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.01,
    boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Premium glass morphism effect with improved visibility and 3D effect
const glassCardStyle = "backdrop-filter backdrop-blur-lg bg-white/95 border border-white/30 shadow-lg";

// 3D Card effect with premium styling
const card3DStyle = "bg-gradient-to-br from-white/98 to-white/95 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-filter backdrop-blur-xl rounded-3xl transition-all duration-300 transform perspective-1000";

// Flat button style instead of 3D
const flatButtonStyle = "relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center justify-center";

// Subscription plan styles
const subscriptionCardStyle = "relative bg-white/95 rounded-xl p-6 border border-indigo-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden";

// Enhanced profile menu style with better positioning and transparency
const profileMenuStyle = "fixed right-4 top-24 md:top-28 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden z-[99999] transform origin-top-right transition-all duration-300";

// Premium metrics card style with improved mobile responsiveness
const metricsCardStyle = "relative bg-gradient-to-br from-indigo-500/90 to-blue-500/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/30 shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)] transform hover:translate-y-[-3px] transition-all duration-300 overflow-hidden";

// Input field styling with improved visibility and focus states
const inputStyle = "w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-800 placeholder-gray-500 shadow-inner transition-all duration-200";

// Button styling with improved visibility and interaction feedback
const primaryButtonStyle = "w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-600/20 transform hover:translate-y-[-2px] transition-all duration-200 font-medium text-lg tracking-wide";

// Breathe animation for health insights
const breatheVariants = {
  inhale: {
    scale: 1.2,
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

interface HealthMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: IconType;
  color: string;
}

interface Appointment {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'missed';
  notes?: string;
  image?: string;
  isVirtual: boolean;
}

interface Prescription {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
  isRefillNeeded?: boolean;
}

interface Task {
  id: string;
  task_name: string;
  category: string;
  priority: string;
  due_date?: string;
  frequency?: string;
  is_completed: boolean;
}

interface HealthTip {
  title: string;
  description: string;
  icon: IconType;
  color: string;
}

// Update your type definitions for metrics, goals and tasks
interface WellnessMetric {
  id: string;
  metric_type: string;
  metric_value: string;
  recorded_date: string;
  notes?: string;
}

interface WellnessGoal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  status: string;
  name?: string;
  description?: string;
  completed?: boolean;
}

interface WellnessTask {
  id: string;
  task_name: string;
  category: string;
  priority: string;
  due_date?: string;
  frequency?: string;
  is_completed: boolean;
}

// Add this client-only wrapper component near the top of the file
const ClientOnlyAnimations = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  return <>{children}</>;
};

// Move this outside the PatientDashboard component
type ConsultationResponsesType = Record<string, any>;

// Add back the missing interface
interface ConsultationQuestion {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

// Move this outside the PatientDashboard component to avoid nested components with hooks
const AIDoctorConsultationModal: React.FC<{
  onClose: () => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  responses: ConsultationResponsesType;
  setResponses: React.Dispatch<React.SetStateAction<ConsultationResponsesType>>;
  result: any;
  setResult: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ 
  onClose, 
  step, 
  setStep, 
  responses, 
  setResponses, 
  result, 
  setResult, 
  isLoading, 
  setIsLoading 
}) => {
  const questionSets: Record<number, ConsultationQuestion[]> = {
    1: [
      { id: 'mainSymptoms', label: 'What are your main symptoms?', type: 'textarea', placeholder: 'Describe your symptoms in detail...' },
      { id: 'symptomDuration', label: 'How long have you been experiencing these symptoms?', type: 'select', 
        options: ['Less than a day', '1-3 days', '4-7 days', '1-2 weeks', '2-4 weeks', 'More than a month'] },
      { id: 'symptomIntensity', label: 'How would you rate the intensity of your symptoms?', type: 'range', min: 1, max: 10 }
    ],
    2: [
      { id: 'medicalHistory', label: 'Do you have any pre-existing medical conditions?', type: 'textarea', placeholder: 'List any chronic conditions...' },
      { id: 'currentMedications', label: 'Are you currently taking any medications?', type: 'textarea', placeholder: 'List all medications and supplements...' },
      { id: 'allergies', label: 'Do you have any known allergies?', type: 'textarea', placeholder: 'List any allergies to medications, foods, etc...' }
    ],
    3: [
      { id: 'dietaryHabits', label: 'Describe your typical daily diet:', type: 'textarea', placeholder: 'Include meals, snacks, beverages...' },
      { id: 'sleepPattern', label: 'Describe your sleep pattern:', type: 'textarea', placeholder: 'Hours of sleep, quality, any issues...' },
      { id: 'exerciseRoutine', label: 'What is your exercise routine?', type: 'textarea', placeholder: 'Type, frequency, duration...' }
    ],
    4: [
      { id: 'stressLevel', label: 'How would you rate your current stress level?', type: 'range', min: 1, max: 10 },
      { id: 'mentalState', label: 'Describe your current mental and emotional state:', type: 'textarea', placeholder: 'Mood, anxiety, emotional reactions...' },
      { id: 'lifestyleFactors', label: 'Any notable lifestyle factors?', type: 'textarea', placeholder: 'Work environment, home situation, recent changes...' }
    ]
  };

  // Update handleSubmitStep to add debugging for the API response
  const handleSubmitStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep((prevStep: number) => prevStep + 1);
    } else {
      // Final step - analyze and generate recommendations
      setIsLoading(true);
      
      // Log the current responses before sending
      console.log("Sending consultation responses:", responses);
      
      // Call the AI Doctor API endpoint
      axios.post('/api/consultation/aiDoctor', {
        responses
      })
      .then(response => {
        // Log the received data
        console.log("Received AI consultation result:", response.data);
        setResult(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error during AI consultation:', error);
        setIsLoading(false);
        // Set a fallback result in case of error
        setResult({
          diagnosis: "Sorry, there was an error processing your consultation. Please try again later.",
          recommendations: [],
          lifestyle: ["Rest and stay hydrated", "Consider consulting with a healthcare professional"],
          followUp: "as soon as possible"
        });
      });
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setResponses((prev: ConsultationResponsesType) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleRestartConsultation = () => {
    setStep(1);
    setResponses({});
    setResult(null);
  };

  const handleCloseConsultation = () => {
    onClose();
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prevStep: number) => prevStep - 1);
    } else {
      handleCloseConsultation();
    }
  };

  const currentQuestions = questionSets[step] || [];
  
  const renderQuestions = () => {
    return (
      <motion.form 
        onSubmit={handleSubmitStep} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentQuestions.map((question: ConsultationQuestion) => (
          <motion.div 
            key={question.id} 
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label htmlFor={question.id} className="block text-md font-medium text-gray-800">
              {question.label}
            </label>
            
            {question.type === 'textarea' && (
              <textarea
                id={question.id}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-base bg-white text-gray-800"
                rows={4}
                placeholder={question.placeholder}
                value={responses[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                required
              />
            )}
            
            {question.type === 'select' && question.options && (
              <select
                id={question.id}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800"
                value={responses[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                required
              >
                <option value="">Select an option</option>
                {question.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            
            {question.type === 'range' && question.min !== undefined && question.max !== undefined && (
              <div className="pt-2">
                <input
                  id={question.id}
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={responses[question.id] || question.min}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  required
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
                  <span>{question.min}</span>
                  {question.id === 'symptomIntensity' && (
                    <>
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </>
                  )}
                  {question.id === 'stressLevel' && (
                    <>
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </>
                  )}
                  <span>{question.max}</span>
                </div>
                <div className="mt-2 text-center font-medium text-indigo-700">
                  {question.id === 'symptomIntensity' && `Intensity: ${responses[question.id] || question.min}/10`}
                  {question.id === 'stressLevel' && `Stress Level: ${responses[question.id] || question.min}/10`}
                </div>
              </div>
            )}
          </motion.div>
        ))}
        
        <div className="flex justify-between pt-6">
          <motion.button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
            onClick={handlePrevStep}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {step > 1 ? 'Previous' : 'Cancel'}
          </motion.button>
          <motion.button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {step < 4 ? 'Next' : 'Submit for Analysis'}
          </motion.button>
        </div>
      </motion.form>
    );
  };

  // Define a type for the recommendation
  interface RemedyRecommendation {
    remedy: string;
    dosage: string;
    duration: string;
    description?: string;
  }

  const renderConsultationResult = () => {
    if (isLoading) {
      return (
        <div className="py-10 text-center">
          <div className="mb-8 relative w-20 h-20 mx-auto">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
            
            {/* Inner pulsing brain */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <FaBrain className="h-10 w-10 text-indigo-500" />
            </motion.div>
            
            {/* Orbiting particles */}
            <motion.div 
              className="absolute w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute w-full h-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>
          
          <h3 className="text-lg font-medium text-indigo-800 mb-2">AI Doctor is analyzing your health data</h3>
          <p className="text-gray-600">Processing your symptoms and preparing personalized recommendations...</p>
          
          <div className="mt-6 max-w-md mx-auto">
            <motion.div 
              className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            ></motion.div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Analyzing symptoms</span>
              <span>Generating recommendations</span>
            </div>
          </div>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="py-10 text-center">
          <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">No Results Available</h3>
            <p className="text-gray-700">There was an issue processing your consultation. Please try again.</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-xl font-medium text-indigo-800 mb-3">AI Analysis</h3>
          {result?.diagnosis ? (
            <p className="text-gray-700 leading-relaxed">{result.diagnosis}</p>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              Based on your consultation responses, I've prepared personalized homeopathic remedy recommendations 
              and lifestyle suggestions to help address your health concerns. Please review the information below 
              and consider scheduling a follow-up to assess your progress.
            </p>
          )}
        </motion.div>
        
        {result?.recommendations && result.recommendations.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="text-lg font-medium text-gray-800 mb-3">Recommended Homeopathic Remedies</h3>
            <div className="space-y-3">
              {result.recommendations.map((rec: RemedyRecommendation, index: number) => (
                <motion.div 
                  key={index} 
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg shadow-sm hover:shadow-md transition-all"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between">
                    <strong className="text-green-800 text-lg">{rec.remedy}</strong>
                    <span className="text-emerald-700 font-medium">{rec.dosage}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Duration: {rec.duration}</p>
                  {rec.description && (
                    <p className="text-sm text-gray-600 mt-1 italic">{rec.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="p-4 bg-gray-50 border border-gray-100 rounded-lg shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-gray-700">No specific remedies recommended at this time.</p>
          </motion.div>
        )}
        
        {result?.lifestyle && result.lifestyle.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3 className="text-lg font-medium text-gray-800 mb-3">Lifestyle Recommendations</h3>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100 shadow-sm">
              <ul className="space-y-2">
                {result.lifestyle.map((item: string, index: number) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center text-gray-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                  >
                    <span className="text-purple-600 mr-2">•</span> {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="p-4 bg-gray-50 border border-gray-100 rounded-lg shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-gray-700">No specific lifestyle recommendations at this time.</p>
          </motion.div>
        )}
        
        <motion.div 
          className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h3 className="text-lg font-medium text-blue-800 mb-2">Follow-up Recommendation</h3>
          <p className="text-gray-700">Schedule a follow-up in {result?.followUp || '2 weeks'} to assess your progress.</p>
        </motion.div>
        
        <motion.div 
          className="flex justify-between pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
            onClick={handleRestartConsultation}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            New Consultation
          </motion.button>
          <motion.button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all"
            onClick={handleCloseConsultation}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Save & Close
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800/30 backdrop-blur-sm transition-opacity" onClick={handleCloseConsultation}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Remove the extra backdrop div that was causing the issue */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <motion.div 
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full relative"
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-5 pt-5 pb-5 sm:p-6">
            <div className="mb-6 border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full text-white mr-4">
                    <FaRobot className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl leading-6 font-bold text-gray-900">AI Doctor Consultation</h3>
                </div>
                <motion.button 
                  onClick={handleCloseConsultation} 
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {!result && !isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-medium">Step {step} of 4</p>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4].map(stp => (
                        <motion.div
                          key={stp}
                          className={`h-2.5 w-16 rounded-full ${
                            stp < step ? 'bg-indigo-600' : stp === step ? 'bg-indigo-500' : 'bg-gray-200'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: '4rem' }}
                          transition={{ 
                            duration: 0.4,
                            delay: stp * 0.1
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
              {result || isLoading ? renderConsultationResult() : renderQuestions()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Health Analyzer Modal Component
const HealthAnalyzerModal: React.FC<{
  onClose: () => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  analysisMethod: 'text' | 'voice' | 'image' | null;
  setAnalysisMethod: React.Dispatch<React.SetStateAction<'text' | 'voice' | 'image' | null>>;
  healthScore: number | null;
  setHealthScore: React.Dispatch<React.SetStateAction<number | null>>;
  healthRisks: any;
  setHealthRisks: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  result: any;
  setResult: React.Dispatch<React.SetStateAction<any>>;
}> = ({
  onClose,
  step,
  setStep,
  analysisMethod,
  setAnalysisMethod,
  healthScore,
  setHealthScore,
  healthRisks,
  setHealthRisks,
  isLoading,
  setIsLoading,
  result,
  setResult
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  
  const handleCloseModal = () => {
    onClose();
  };
  
  const handleMethodSelection = (method: 'text' | 'voice' | 'image') => {
    setAnalysisMethod(method);
    setStep(2);
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
      if (step === 2) {
        setAnalysisMethod(null);
      }
    } else {
      handleCloseModal();
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    }
  };
  
  const simulateVoiceRecording = () => {
    setIsRecording(true);
    // In a real app, you would use the Web Speech API here
    setTimeout(() => {
      setIsRecording(false);
      setAudioTranscript("I've been experiencing headaches, fatigue, and occasional dizziness for the past week.");
    }, 2000);
  };
  
  const handleSubmitAnalysis = () => {
    setIsLoading(true);
    
    // In a real implementation, you would call your API here
    setTimeout(() => {
      // Simulated API response
      const analysisResult = {
        score: 74,
        risks: {
          heart: { level: 'Low', score: 85 },
          respiratory: { level: 'Good', score: 78 },
          mental: { level: 'Needs Attention', score: 65 },
          digestive: { level: 'Moderate', score: 70 },
          immune: { level: 'Good', score: 80 }
        },
        recommendations: [
          "Consider increasing hydration to address headaches",
          "Check your iron levels as fatigue may indicate mild anemia",
          "Practice stress-reduction techniques for mental wellbeing",
          "Ensure adequate sleep, aim for 7-8 hours per night",
          "Add more magnesium-rich foods to your diet"
        ],
        preventiveTips: [
          "Daily 10-minute meditation practice",
          "Increase vitamin B intake through leafy greens",
          "Homeopathic remedy: Natrum Muriaticum 30C for headaches"
        ]
      };
      
      setHealthScore(analysisResult.score);
      setHealthRisks(analysisResult.risks);
      setResult(analysisResult);
      setIsLoading(false);
      setStep(3);
    }, 3000);
  };
  
  // Render the initial screen for selecting analysis method
  const renderMethodSelection = () => (
    <div className="py-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">How would you like to describe your symptoms?</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-indigo-100 rounded-xl p-5 text-center cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleMethodSelection('text')}
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaKeyboard className="h-8 w-8 text-indigo-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Text Description</h4>
          <p className="text-sm text-gray-600">Type your symptoms and health concerns</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-purple-100 rounded-xl p-5 text-center cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleMethodSelection('voice')}
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMicrophone className="h-8 w-8 text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Voice Description</h4>
          <p className="text-sm text-gray-600">Describe your symptoms by speaking</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white border border-blue-100 rounded-xl p-5 text-center cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleMethodSelection('image')}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaImage className="h-8 w-8 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Image Upload</h4>
          <p className="text-sm text-gray-600">Upload a photo of visible symptoms</p>
        </motion.div>
      </div>
    </div>
  );
  
  // Render the input form based on selected method
  const renderInputForm = () => {
    switch (analysisMethod) {
      case 'text':
        return (
          <div className="py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Describe your symptoms in detail</h3>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800 min-h-[150px]"
              placeholder="Example: I've been experiencing headaches, fatigue, and occasional dizziness for the past week..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-2">How long have you been experiencing these symptoms?</h4>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800"
                  defaultValue=""
                >
                  <option value="" disabled>Select duration</option>
                  <option value="today">Today only</option>
                  <option value="days">A few days</option>
                  <option value="week">About a week</option>
                  <option value="weeks">Several weeks</option>
                  <option value="month">A month or more</option>
                </select>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-2">Rate the severity (1-10)</h4>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                  defaultValue="5"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'voice':
        return (
          <div className="py-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Describe your symptoms by voice</h3>
            
            <div className="mt-4 mb-8">
              {isRecording ? (
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-50"></div>
                    <div className="relative w-full h-full bg-red-50 rounded-full flex items-center justify-center">
                      <FaMicrophone className="h-8 w-8 text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">Listening... Please describe your symptoms</p>
                </div>
              ) : (
                <div className="mb-6">
                  <button
                    onClick={simulateVoiceRecording}
                    className="w-20 h-20 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center mx-auto transition-all"
                  >
                    <FaMicrophone className="h-8 w-8 text-purple-600" />
                  </button>
                  <p className="text-gray-700 mt-4">Click the microphone to start recording</p>
                </div>
              )}
              
              {audioTranscript && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Transcript:</h4>
                  <p className="text-gray-700">{audioTranscript}</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload an image of your symptoms</h3>
            <p className="text-gray-600 mb-6">This works best for skin conditions, tongue coating, nail discoloration, eye redness, etc.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedImageUrl ? (
                <div>
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded symptom" 
                    className="max-h-[200px] mx-auto rounded-lg mb-4" 
                  />
                  <button 
                    onClick={() => {setUploadedImage(null); setUploadedImageUrl(null);}}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div>
                  <FaCloudUploadAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Drag and drop your image here or click to browse</p>
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-all"
                  >
                    Browse Images
                  </label>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-800 mb-2">Additional notes (optional)</h4>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-800"
                placeholder="Add any additional context about your symptoms..."
                rows={3}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render loading screen
  const renderLoadingScreen = () => (
    <div className="py-10 text-center">
      <div className="mb-8 relative w-24 h-24 mx-auto">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-violet-600 animate-spin"></div>
        
        {/* Inner pulsing brain */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0.6, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <FaChartLine className="h-12 w-12 text-violet-500" />
        </motion.div>
        
        {/* Orbiting particles */}
        <motion.div 
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-2.5 h-2.5 bg-violet-400 rounded-full"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute w-full h-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          </div>
        </motion.div>
      </div>
      
      <h3 className="text-lg font-medium text-violet-800 mb-2">Analyzing your health data</h3>
      <p className="text-gray-600">Processing your symptoms and calculating health recommendations...</p>
      
      <div className="mt-6 max-w-md mx-auto">
        <motion.div 
          className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        ></motion.div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Analyzing symptoms</span>
          <span>Generating recommendations</span>
        </div>
      </div>
    </div>
  );
  
  // Render the analysis result
  const renderAnalysisResult = () => (
    <div className="py-6 overflow-y-auto max-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="inline-block rounded-full p-1 bg-gradient-to-r from-violet-500 to-indigo-500 mb-4">
          <div className="bg-white rounded-full p-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{healthScore}</span>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Your Health Score</h3>
        <p className="text-gray-600 mt-1">Based on your symptom analysis</p>
      </motion.div>
      
      <motion.div 
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Health Risk Assessment</h3>
        
        <div className="space-y-4">
          {healthRisks && Object.entries(healthRisks).map(([system, data]: [string, any], index) => (
            <div key={system} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {system === 'heart' && <FaHeartbeat className="text-red-500 mr-2" />}
                  {system === 'respiratory' && <FaLungs className="text-blue-500 mr-2" />}
                  {system === 'mental' && <FaBrain className="text-purple-500 mr-2" />}
                  {system === 'digestive' && <FaAppleAlt className="text-green-500 mr-2" />}
                  {system === 'immune' && <FaShieldAlt className="text-yellow-500 mr-2" />}
                  <span className="text-gray-800 capitalize">{system}</span>
                </div>
                <span className={`text-sm font-medium ${
                  data.level === 'Low' || data.level === 'Good' ? 'text-green-600' : 
                  data.level === 'Moderate' ? 'text-yellow-600' : 'text-orange-600'
                }`}>
                  {data.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full ${
                    data.level === 'Low' || data.level === 'Good' ? 'bg-green-500' : 
                    data.level === 'Moderate' ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${data.score}%` }}
                  transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {result && (
        <motion.div 
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <ul className="space-y-2 mb-4">
            {result.recommendations.map((recommendation: string, index: number) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
              >
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </motion.li>
            ))}
          </ul>
          
          <h4 className="text-base font-medium text-gray-800 mb-2">Preventive Tips</h4>
          <ul className="space-y-2">
            {result.preventiveTips.map((tip: string, index: number) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
              >
                <FaLeaf className="text-emerald-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Close
        </button>
        
        <Link href="/dashboard/patient?tab=detailed-analysis">
          <button
            className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-600 hover:to-indigo-700"
            onClick={handleCloseModal}
          >
            View Detailed Analysis
          </button>
        </Link>
      </div>
    </div>
  );
  
  // Render content based on current step
  const renderContent = () => {
    if (isLoading) {
      return renderLoadingScreen();
    }
    
    switch (step) {
      case 1:
        return renderMethodSelection();
      case 2:
        return renderInputForm();
      case 3:
        return renderAnalysisResult();
      default:
        return null;
    }
  };
  
  const getModalTitle = () => {
    if (isLoading) return "Processing";
    
    switch (step) {
      case 1:
        return "Health Analyzer";
      case 2:
        return analysisMethod === 'text' 
          ? "Describe Your Symptoms" 
          : analysisMethod === 'voice' 
          ? "Voice Description" 
          : "Upload Symptom Image";
      case 3:
        return "Health Analysis Results";
      default:
        return "Health Analyzer";
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800/30 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <motion.div 
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full relative"
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-5 pt-5 pb-5 sm:p-6">
            <div className="mb-6 border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full text-white mr-4">
                    <FaChartBar className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl leading-6 font-bold text-gray-900">{getModalTitle()}</h3>
                </div>
                <motion.button 
                  onClick={handleCloseModal} 
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {!isLoading && step < 3 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-medium">Step {step} of 3</p>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3].map((stp) => (
                        <motion.div
                          key={stp}
                          className={`h-2.5 w-16 rounded-full ${
                            stp < step ? 'bg-violet-600' : stp === step ? 'bg-violet-500' : 'bg-gray-200'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: '4rem' }}
                          transition={{ 
                            duration: 0.4,
                            delay: stp * 0.1
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
              {renderContent()}
            </div>
            
            {step === 2 && !isLoading && (
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitAnalysis}
                  className={`px-4 py-2.5 rounded-lg text-white font-medium ${
                    (analysisMethod === 'text' && symptoms.trim().length > 5) || 
                    (analysisMethod === 'voice' && audioTranscript.trim().length > 5) || 
                    (analysisMethod === 'image' && uploadedImage)
                      ? 'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={
                    !(analysisMethod === 'text' && symptoms.trim().length > 5) && 
                    !(analysisMethod === 'voice' && audioTranscript.trim().length > 5) && 
                    !(analysisMethod === 'image' && uploadedImage)
                  }
                >
                  Analyze My Health
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showAIConsultation, setShowAIConsultation] = useState(false);
  const [showHealthAnalyzerModal, setShowHealthAnalyzerModal] = useState(false);
  const [showDetailedAnalysisModal, setShowDetailedAnalysisModal] = useState(false);
  const [showAIRecommendationModal, setShowAIRecommendationModal] = useState(false);
  const [selectedRecommendationType, setSelectedRecommendationType] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState("premium"); // Could be "free", "basic", "premium"
  const profileRef = React.useRef<HTMLDivElement>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [healthInsightsVisible, setHealthInsightsVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  // Add client-side rendering state at component level
  const [isClient, setIsClient] = useState(false);
  
  // Add state for AI Doctor consultation modal
  const [consultationStep, setConsultationStep] = useState(1);
  const [consultationResponses, setConsultationResponses] = useState<ConsultationResponsesType>({});
  const [consultationResult, setConsultationResult] = useState<any>(null);
  const [isConsultationLoading, setIsConsultationLoading] = useState(false);
  
  // Health Analyzer states
  const [healthAnalysisStep, setHealthAnalysisStep] = useState(1);
  const [healthAnalysisMethod, setHealthAnalysisMethod] = useState<'text' | 'voice' | 'image' | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthRisks, setHealthRisks] = useState<any>(null);
  const [isHealthAnalysisLoading, setIsHealthAnalysisLoading] = useState(false);
  const [healthAnalysisResult, setHealthAnalysisResult] = useState<any>(null);
  
  // Detailed Analysis states
  const [bodyPart, setBodyPart] = useState<string | null>(null);
  const [detailedAnalysisQuestions, setDetailedAnalysisQuestions] = useState<any[]>([]);
  const [detailedAnalysisResponses, setDetailedAnalysisResponses] = useState<Record<string, any>>({});
  const [detailedAnalysisResult, setDetailedAnalysisResult] = useState<any>(null);
  const [isDetailedAnalysisLoading, setIsDetailedAnalysisLoading] = useState(false);
  const [detailedAnalysisStep, setDetailedAnalysisStep] = useState<'body-map' | 'questions' | 'results'>('body-map');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Add the custom scrollbar styles
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c7d2fe;
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a5b4fc;
      }
    `;
    // Append to document head
    document.head.appendChild(styleEl);
    
    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Health insights data for the unique feature
  const healthInsights = [
    { label: "Sleep Quality", value: "Improved", icon: FaSun, trend: "up" },
    { label: "Stress Level", value: "Reduced", icon: FaBrain, trend: "down" },
    { label: "Activity", value: "Increased", icon: FaRunning, trend: "up" }
  ];

  // Add state for API data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingFeatureData, setIsLoadingFeatureData] = useState<boolean>(false);
  const [featureDataError, setFeatureDataError] = useState<string | null>(null);

  // Move wellnessData initialization here
  const [wellnessData, setWellnessData] = useState<{
    goals: WellnessGoal[];
    metrics: WellnessMetric[];
    recommendations?: {
      title: string;
      summary: string;
      items: Array<{ title: string; description: string; icon: string }>;
      dailyPlan?: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snacks: string;
      };
      dailyTasks?: Array<{ title: string; description: string; completed: boolean }>;
    };
  }>({
    goals: [],
    metrics: []
  });

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  // Handle scrolling - close menu on mobile when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isMobile && currentScrollY > lastScrollY + 10 && showProfileMenu) {
        setShowProfileMenu(false);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showProfileMenu, isMobile]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768 && !isMobile) {
        window.dispatchEvent(new Event('scroll')); // Trigger scroll event to potentially close menu
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Sample health metrics
  const healthMetrics: HealthMetric[] = [
    { label: 'Appointments', value: 2, icon: FaCalendarAlt, color: 'blue' },
    { label: 'Prescriptions', value: 3, icon: FaPills, color: 'emerald' },
    { label: 'Health Score', value: '85%', change: '+5%', trend: 'up', icon: FaChartLine, color: 'indigo' },
    { label: 'Sleep Quality', value: '7.5hrs', change: '+0.5hrs', trend: 'up', icon: FaSun, color: 'purple' },
  ];

  // Sample appointments
  const sampleAppointments: Appointment[] = [
    {
      doctor: 'Dr. Michael Chen',
      specialty: 'Homeopathic Consultation',
      date: 'Tomorrow',
      time: '10:30 AM',
      status: 'upcoming',
      isVirtual: true,
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Follow-up Consultation',
      date: 'June 18, 2023',
      time: '2:00 PM',
      status: 'upcoming',
      isVirtual: false,
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ];

  // Sample prescriptions
  const samplePrescriptions: Prescription[] = [
    {
      name: 'Arnica Montana 30C',
      dosage: '3 pills',
      frequency: '3 times daily',
      startDate: 'June 5, 2023',
      status: 'active'
    },
    {
      name: 'Bryonia Alba 6C',
      dosage: '5 drops in water',
      frequency: 'twice daily',
      startDate: 'June 2, 2023',
      status: 'active'
    },
    {
      name: 'Rhus Toxicodendron 200C',
      dosage: '1 dose',
      frequency: 'every other day',
      startDate: 'May 29, 2023',
      status: 'active',
      isRefillNeeded: true
    }
  ];

  // Sample tasks
  const sampleTasks: Task[] = [
    {
      id: '1',
      task_name: 'Take morning medication',
      category: 'medication',
      priority: 'high',
      due_date: new Date().toISOString(),
      frequency: 'Daily',
      is_completed: false
    },
    {
      id: '2',
      task_name: 'Drink 8 glasses of water',
      category: 'hydration',
      priority: 'medium',
      due_date: new Date().toISOString(),
      frequency: 'Daily',
      is_completed: false
    },
    {
      id: '3',
      task_name: '30 minutes of walking',
      category: 'exercise',
      priority: 'medium',
      due_date: new Date().toISOString(),
      frequency: 'Daily',
      is_completed: true
    },
    {
      id: '4',
      task_name: 'Meditation session',
      category: 'mental health',
      priority: 'low',
      due_date: new Date().toISOString(),
      frequency: 'Daily',
      is_completed: false
    }
  ];

  // Health tips
  const healthTips: HealthTip[] = [
    {
      title: 'Hydration Balance',
      description: 'Drink warm water throughout the day to support your homeopathic treatment.',
      icon: FaTint,
      color: 'blue'
    },
    {
      title: 'Mindful Breathing',
      description: 'Practice deep breathing for 5 minutes each morning to reduce stress.',
      icon: FaLungs,
      color: 'emerald'
    },
    {
      title: 'Dietary Harmony',
      description: 'Avoid coffee, mint, and camphor as they may interfere with your homeopathic remedies.',
      icon: FaAppleAlt,
      color: 'amber'
    }
  ];

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

    // Determine time of day for personalized greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    getUserProfile();
  }, []);

  const getGreeting = () => {
    const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Friend';
    switch(timeOfDay) {
      case 'morning': return `Good morning, ${name}`;
      case 'afternoon': return `Good afternoon, ${name}`;
      case 'evening': return `Good evening, ${name}`;
    }
  };

  const getTimeIcon = () => {
    switch(timeOfDay) {
      case 'morning': return <FaSun className="text-yellow-500" />;
      case 'afternoon': return <FaSun className="text-orange-500" />;
      case 'evening': return <FaMoon className="text-indigo-400" />;
    }
  };

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Memoize health metrics to prevent re-renders
  const memoizedHealthMetrics = useMemo(() => healthMetrics, []);
  
  // Memoize health insights to prevent re-renders
  const memoizedHealthInsights = useMemo(() => healthInsights, []);

  // Memoize prescriptions to prevent re-renders
  const memoizedPrescriptions = useMemo(() => samplePrescriptions, []);

  // Memoize tasks to prevent re-renders
  const memoizedTasks = useMemo(() => sampleTasks, []);

  // Optimize loading performance with shorter timeouts
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoading(false);
    }, 800);

    const showInsights = setTimeout(() => {
      setHealthInsightsVisible(true);
    }, 400);

    return () => {
      clearTimeout(timer);
      clearTimeout(showInsights);
    };
  }, []);

  // Use callbacks for event handlers to prevent re-renders
  const handleProfileClick = useCallback(() => {
    setShowProfileMenu(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Memoized Health Insights component for better performance
  const HealthInsights = React.memo(() => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: healthInsightsVisible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white/10 backdrop-blur-lg rounded-xl border border-white/30 overflow-hidden"
    >
      <div className="md:flex items-center space-y-3 md:space-y-0 md:space-x-6 p-3">
        {memoizedHealthInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.2 }}
            className="flex items-center md:flex-col md:items-center px-3 py-1"
          >
            <div className="p-2 rounded-full bg-white/20 flex items-center justify-center mb-0 md:mb-2 mr-3 md:mr-0">
              <insight.icon className="text-white text-sm" />
            </div>
            <div className="flex flex-col md:items-center">
              <span className="text-xs font-medium text-white">{insight.label}</span>
              <div className="flex items-center mt-1">
                <span className={`text-xs ${insight.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                  {insight.value}
                </span>
                {!isReducedMotion && (
                  <motion.div 
                    animate={{ 
                      y: insight.trend === 'up' ? [0, -2, 0] : [0, 2, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="ml-1"
                  >
                    {insight.trend === 'up' ? '↑' : '↓'}
                  </motion.div>
                )}
                {isReducedMotion && (
                  <span className="ml-1">
                    {insight.trend === 'up' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  ));

  // Enhanced profile dropdown with better styling, animations and positioning
  const ProfileDropdown = () => (
    <AnimatePresence>
      {showProfileMenu && (
        <motion.div 
          className={profileMenuStyle}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ position: 'fixed', zIndex: 99999 }}
        >
          <div className="p-6 border-b border-indigo-100/30 bg-gradient-to-r from-indigo-500/10 to-blue-500/10">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center p-1 shadow-lg">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="h-full w-full rounded-full object-cover ring-2 ring-white/50"
                  />
                ) : (
                  <FaUser className="text-white text-2xl" />
                )}
              </div>
              <div className="ml-4">
                <p className="font-semibold text-lg text-gray-900">{user?.user_metadata?.full_name || "User"}</p>
                <p className="text-sm text-gray-600 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-indigo-50 rounded-xl p-3 border border-indigo-100/50">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <FaSeedling className="text-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-700">Current Plan:</p>
                  <p className="text-sm font-semibold text-indigo-700">{activeSubscription.charAt(0).toUpperCase() + activeSubscription.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            {[
              { icon: FaUser, label: 'My Profile', color: 'indigo', action: () => console.log('Profile clicked') },
              { icon: FaClipboardList, label: 'My Treatments', color: 'blue', action: () => console.log('Treatments clicked') },
              { icon: FaCalendarAlt, label: 'My Appointments', color: 'violet', action: () => console.log('Appointments clicked') }
            ].map((item, index) => (
              <motion.button
                key={index}
                onClick={item.action}
                whileHover={{ x: 4, backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 rounded-xl transition-all duration-200 flex items-center group"
              >
                <div className={`mr-3 text-${item.color}-500 transition-transform duration-200 group-hover:scale-110 p-2 rounded-lg bg-${item.color}-50 group-hover:bg-${item.color}-100`}>
                  <item.icon />
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="p-3 border-t border-indigo-100/30 bg-gradient-to-r from-white to-indigo-50/30">
            <motion.button 
              onClick={async () => {
                try {
                  // Close menu first
                  setShowProfileMenu(false);
                  // Then perform sign out
                  await supabase.auth.signOut();
                  // Navigate to signin page
                  router.push('/signin');
                } catch (error) {
                  console.error('Error signing out:', error);
                }
              }}
              whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 rounded-xl transition-all duration-200 flex items-center group"
            >
              <div className="mr-3 p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-all duration-200">
                <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use the dynamically imported component
  const SubscriptionPlans = SubscriptionPlansComponent;

  // Add effect to fetch feature data when tab changes
  useEffect(() => {
    if (!user || contentLoading) return;
    
    // Reset error state when changing tabs
    setFeatureDataError(null);
    
    // Fetch data based on active tab
    if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'prescriptions') {
      fetchPrescriptions();
    } else if (activeTab === 'reports') {
      fetchReports();
    } else if (activeTab === 'wellness') {
      fetchWellnessData();
    }
  }, [activeTab, user, contentLoading]);
  
  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      setIsLoadingFeatureData(true);
      const response = await axios.get('/api/patient/appointments');
      setAppointments(response.data.appointments || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      setFeatureDataError(error.response?.data?.error || 'Failed to load appointments');
      // Use sample data as fallback
      setAppointments(sampleAppointments);
    } finally {
      setIsLoadingFeatureData(false);
    }
  };
  
  // Function to fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      setIsLoadingFeatureData(true);
      const response = await axios.get('/api/patient/prescriptions');
      setPrescriptions(response.data.prescriptions || []);
    } catch (error: any) {
      console.error('Error fetching prescriptions:', error);
      setFeatureDataError(error.response?.data?.error || 'Failed to load prescriptions');
      // Use sample data as fallback
      setPrescriptions(samplePrescriptions);
    } finally {
      setIsLoadingFeatureData(false);
    }
  };
  
  // Function to fetch reports
  const fetchReports = async () => {
    try {
      setIsLoadingFeatureData(true);
      const response = await axios.get('/api/patient/reports');
      setReports(response.data.reports || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      setFeatureDataError(error.response?.data?.error || 'Failed to load reports');
      // Use empty array as fallback
      setReports([]);
    } finally {
      setIsLoadingFeatureData(false);
    }
  };
  
  // Function to fetch wellness data
  const fetchWellnessData = async () => {
    setIsLoadingFeatureData(true);
    setFeatureDataError(null);
    
    try {
      // Use mock data directly since API might not be ready
      // In a production environment, you would fetch from an actual API
      
      // Mock data for development
      const mockData = {
        metrics: [
          {
            id: '1',
            metric_type: 'Heart Health',
            metric_value: '90/100',
            recorded_date: new Date().toISOString()
          },
          {
            id: '2',
            metric_type: 'Respiratory System',
            metric_value: '85/100',
            recorded_date: new Date().toISOString()
          },
          {
            id: '3',
            metric_type: 'Mental Health',
            metric_value: '78/100',
            recorded_date: new Date().toISOString()
          }
        ],
        goals: [
          {
            id: '1',
            goal_type: 'Hydration',
            target_value: 8,
            current_value: 6,
            status: 'in-progress',
            name: 'Drink water',
            description: 'Drink 8 glasses of water daily',
            completed: false
          },
          {
            id: '2',
            goal_type: 'Exercise',
            target_value: 30,
            current_value: 30,
            status: 'completed',
            name: 'Daily walk',
            description: 'Walk for 30 minutes daily',
            completed: true
          }
        ]
      };
      
      setWellnessData({
        metrics: mockData.metrics || [],
        goals: mockData.goals || []
      });
    } catch (error: any) {
      console.error('Error fetching wellness data:', error);
      setFeatureDataError('Failed to load wellness data. Please try again.');
      
      // Load empty data on error
      setWellnessData({
        metrics: [],
        goals: []
      });
    } finally {
      setIsLoadingFeatureData(false);
    }
  };

  // Add useEffect for client detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fix renderTabContent to remove hooks
  const renderTabContent = () => {
    // If not client-side yet, show loading state
    if (!isClient) {
      return <div className="p-8 bg-white/80 rounded-2xl"><MemoizedContentPreloader /></div>;
    }

    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'appointments':
        return renderAppointmentsTab();
      case 'prescriptions':
        return renderPrescriptionsTab();
      case 'reports':
        return renderReportsTab();
      case 'wellness':
        return renderWellnessTab();
      case 'subscription':
        return (
          <Suspense fallback={<div className="p-8 bg-white/80 rounded-2xl"><MemoizedContentPreloader /></div>}>
            <SubscriptionPlans activeSubscription={activeSubscription} />
          </Suspense>
        );
      default:
        return renderOverviewTab();
    }
  };

  // Update renderAppointmentsTab to use real data
  const renderAppointmentsTab = () => {
    if (isLoadingFeatureData) {
      return <div className="p-8 bg-white rounded-2xl"><MemoizedContentPreloader /></div>;
    }

    // Sample available doctors - we'll add this for the UI enhancement
    const availableDoctors = [
      {
        id: '1',
        name: 'Dr. Emily Rodriguez',
        specialty: 'General Homeopathy',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        rating: 4.9,
        availableIn: '5 min',
        isOnline: true
      },
      {
        id: '2',
        name: 'Dr. James Wilson',
        specialty: 'Constitutional Homeopathy',
        image: 'https://randomuser.me/api/portraits/men/42.jpg',
        rating: 4.7,
        availableIn: '15 min',
        isOnline: true
      },
      {
        id: '3',
        name: 'Dr. Aisha Patel',
        specialty: 'Pediatric Homeopathy',
        image: 'https://randomuser.me/api/portraits/women/63.jpg',
        rating: 4.8,
        availableIn: 'Now',
        isOnline: true
      }
    ];

    // Separate appointments by type
    const upcomingAppointments = appointments.filter(app => app.status === 'upcoming');
    const pastAppointments = appointments.filter(app => app.status !== 'upcoming');

    // Add AI consultation appointments (sample data)
    const aiConsultations = [
      {
        doctor: 'AI Homeopathy Assistant',
        specialty: 'Symptom Analysis',
        date: 'June 10, 2023',
        time: '11:45 AM',
        status: 'completed' as const,
        isVirtual: true,
        isAI: true,
        notes: 'Initial assessment of recurring headaches and sleep issues'
      },
      {
        doctor: 'AI Homeopathy Assistant',
        specialty: 'Follow-up Consultation',
        date: 'May 25, 2023',
        time: '3:30 PM',
        status: 'completed' as const,
        isVirtual: true,
        isAI: true
      }
    ];

    return (
      <div className="space-y-6">
        {/* Main appointments content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Appointments</h2>
            <motion.button 
              onClick={handleScheduleAppointment}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaCalendarPlus className="mr-2" />
              <span>Schedule New Appointment</span>
            </motion.button>
          </div>
          
          {featureDataError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              <p>{featureDataError}</p>
              <button 
                onClick={fetchAppointments}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Available Online Doctors Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Available Online Doctors</h3>
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDoctors.map(doctor => (
                <motion.div
                  key={doctor.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="relative">
                        <div className="h-14 w-14 rounded-full overflow-hidden bg-indigo-100 mr-3">
                          <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
                        </div>
                        {doctor.isOnline && (
                          <div className="absolute bottom-0 right-2 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                            <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                          </div>
                          <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-lg">
                            <FaStar className="text-yellow-500 text-xs mr-1" />
                            <span className="text-xs font-medium text-indigo-700">{doctor.rating}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Available {doctor.availableIn === 'Now' ? 'Now' : `in ${doctor.availableIn}`}
                          </span>
                          <motion.button 
                            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Consult Now
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Upcoming Appointments Section */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
            
            {upcomingAppointments.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <FaCalendarAlt className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">You don't have any upcoming appointments.</p>
                <button 
                  onClick={handleScheduleAppointment}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Schedule New Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mr-4 overflow-hidden">
                          {appointment.image ? (
                            <img src={appointment.image} alt={appointment.doctor} className="h-full w-full object-cover" />
                          ) : (
                            <FaUserMd className="text-indigo-600 text-xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{appointment.doctor}</h3>
                          <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1 justify-end">
                          <FaClock className="text-indigo-500 text-xs" />
                          <span className="text-sm text-gray-700 font-medium">{appointment.time}</span>
                        </div>
                        <span className="text-sm text-gray-600">{appointment.date}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        {appointment.isVirtual ? (
                          <span className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            <FaVideo className="mr-1" /> Virtual
                          </span>
                        ) : (
                          <span className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            <FaClinicMedical className="mr-1" /> In-person
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {appointment.isVirtual && (
                          <motion.button 
                            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaVideo className="mr-1 text-xs" /> Join Call
                          </motion.button>
                        )}
                        <motion.button 
                          className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Reschedule
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
          
          {/* Appointment History Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment History</h3>
            
            {pastAppointments.length === 0 && aiConsultations.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <FaHistory className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No appointment history available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* AI Consultations */}
                {aiConsultations.map((consultation, index) => (
                  <motion.div
                    key={`ai-${index}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mr-4">
                          <FaRobot className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{consultation.doctor}</h3>
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">AI</span>
                          </div>
                          <p className="text-gray-600 text-sm">{consultation.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                        <p className="text-gray-500 mt-1">
                          {consultation.date} at {consultation.time}
                        </p>
                      </div>
                    </div>
                    {consultation.notes && (
                      <p className="mt-3 text-gray-600 border-t border-gray-100 pt-2 text-sm">{consultation.notes}</p>
                    )}
                    <div className="mt-3 flex justify-end space-x-2">
                      <motion.button 
                        className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaFileAlt className="mr-1 text-xs" /> View Report
                      </motion.button>
                      <motion.button 
                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaRedo className="mr-1 text-xs" /> New Consultation
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
                
                {/* Human Doctor Past Appointments */}
                {pastAppointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (aiConsultations.length + index) * 0.1 }}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mr-4 overflow-hidden">
                          {appointment.image ? (
                            <img src={appointment.image} alt={appointment.doctor} className="h-full w-full object-cover" />
                          ) : (
                            <FaUserMd className="text-indigo-600 text-xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{appointment.doctor}</h3>
                          <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <p className="text-gray-500 mt-1">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="mt-3 text-gray-600 border-t border-gray-100 pt-2 text-sm">{appointment.notes}</p>
                    )}
                    <div className="mt-3 flex justify-end space-x-2">
                      <motion.button 
                        className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaFileAlt className="mr-1 text-xs" /> View Report
                      </motion.button>
                      <motion.button 
                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaCalendarPlus className="mr-1 text-xs" /> Schedule Follow-up
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  // Update renderPrescriptionsTab to use real data
  const renderPrescriptionsTab = () => {
    if (isLoadingFeatureData) {
      return <div className="p-8 bg-white rounded-2xl"><MemoizedContentPreloader /></div>;
    }

    // Sample medication categories for grouping
    const medicationCategories = [
      { id: 'constitutional', name: 'Constitutional Remedies', icon: <FaLeaf className="text-green-500" />, color: 'bg-green-50' },
      { id: 'acute', name: 'Acute Remedies', icon: <FaThermometerHalf className="text-red-500" />, color: 'bg-red-50' },
      { id: 'chronic', name: 'Chronic Remedies', icon: <FaClock className="text-purple-500" />, color: 'bg-purple-50' },
      { id: 'tissue-salt', name: 'Tissue Salts', icon: <FaFlask className="text-blue-500" />, color: 'bg-blue-50' },
    ];

    // Sample medication library for recommendations
    const medicationLibrary = [
      { 
        id: '1', 
        name: 'Arnica Montana', 
        potency: '30C', 
        category: 'acute',
        uses: 'Trauma, bruising, muscle soreness',
        description: 'Excellent for injuries, especially where there is bruising and soreness.',
        image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
      },
      { 
        id: '2', 
        name: 'Bryonia Alba', 
        potency: '6C',
        category: 'acute', 
        uses: 'Joint pain, respiratory issues',
        description: 'Useful for conditions that worsen with movement and improve with rest.',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
      },
      { 
        id: '3', 
        name: 'Natrum Muriaticum', 
        potency: '200C',
        category: 'constitutional', 
        uses: 'Emotional issues, migraines, allergies',
        description: 'Constitutional remedy for those who internalize grief and emotions.',
        image: 'https://images.unsplash.com/photo-1550170593-4c0b6c5e917a?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
      },
      { 
        id: '4', 
        name: 'Calcarea Phosphorica', 
        potency: '6X',
        category: 'tissue-salt', 
        uses: 'Nutritional support, bone health',
        description: 'Tissue salt that supports bone development and nutritional absorption.',
        image: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
      },
    ];

    // Helper to get relevant info by prescription name
    const getRelevantMedicationInfo = (prescriptionName: string) => {
      const name = prescriptionName.split(' ')[0] + ' ' + (prescriptionName.split(' ')[1] || '');
      return medicationLibrary.find(med => prescriptionName.includes(med.name)) || {
        name: prescriptionName,
        category: 'constitutional',
        uses: 'Various homeopathic uses',
        description: 'Homeopathic remedy prescribed by your practitioner.'
      };
    };

    // Separate active and completed/paused prescriptions
    const activePrescriptions = prescriptions.filter(p => p.status === 'active');
    const historicalPrescriptions = prescriptions.filter(p => p.status !== 'active');

    // Today's date for the medication schedule
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];

    // Create medication schedule data (representing when to take medications today)
    const medicationSchedule = activePrescriptions.map(prescription => {
      let times = [];
      if (prescription.frequency.includes('times daily')) {
        const count = parseInt(prescription.frequency.split(' ')[0]);
        if (count === 3) times = ['8:00 AM', '2:00 PM', '8:00 PM'];
        else if (count === 2) times = ['9:00 AM', '9:00 PM'];
        else times = ['9:00 AM'];
      } else if (prescription.frequency.includes('twice')) {
        times = ['9:00 AM', '9:00 PM'];
      } else {
        times = ['9:00 AM'];
      }
      
      return {
        ...prescription,
        times,
        taken: Array(times.length).fill(false)
      };
    });

    // Group medications by time for today's schedule display
    const timeSlots = ['Morning', 'Afternoon', 'Evening'];
    const scheduleByTime = timeSlots.map((slot, index) => {
      const medications = medicationSchedule
        .filter(med => med.times.length > index)
        .map(med => ({
          name: med.name,
          dosage: med.dosage,
          time: med.times[index],
          taken: med.taken[index]
        }));
      
      return {
        slot,
        time: index === 0 ? '6:00 AM - 12:00 PM' : index === 1 ? '12:00 PM - 6:00 PM' : '6:00 PM - 12:00 AM',
        medications
      };
    });

    return (
      <div className="space-y-6">
        {/* Main prescription content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Prescriptions</h2>
            <motion.button 
              onClick={handleRequestPrescription}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaPrescriptionBottleAlt className="mr-2" />
              <span>Request New Prescription</span>
            </motion.button>
          </div>
          
          {featureDataError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              <p>{featureDataError}</p>
              <button 
                onClick={fetchPrescriptions}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Today's Medication Schedule Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
                <span className="text-sm text-gray-500">({today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</span>
              </div>
              <motion.button 
                className="text-green-600 text-sm font-medium hover:text-green-800 transition-colors inline-flex items-center"
                whileHover={{ x: 3 }}
              >
                View Full Calendar <FaChevronRight className="ml-1 h-3 w-3" />
              </motion.button>
            </div>
            
            {medicationSchedule.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <FaCalendarCheck className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No medications scheduled for today.</p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl overflow-hidden border border-green-100">
                <div className="p-4 bg-gradient-to-r from-green-100 to-teal-100 border-b border-green-200">
                  <div className="flex items-center">
                    <FaCalendarDay className="h-5 w-5 text-green-700 mr-2" />
                    <h4 className="text-base font-semibold text-green-800">{todayName}'s Medication Reminder</h4>
                  </div>
                </div>
                
                <div className="p-4">
                  {scheduleByTime.map((timeSlot, idx) => (
                    timeSlot.medications.length > 0 && (
                      <div key={idx} className="mb-4 last:mb-0">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                            <FaClock className="h-3 w-3 text-green-600 mr-1" />
                            <span className="text-sm font-medium text-gray-700">{timeSlot.slot}</span>
                          </div>
                          <div className="ml-2 text-xs text-gray-500">{timeSlot.time}</div>
                        </div>
                        
                        <div className="space-y-2">
                          {timeSlot.medications.map((med, midx) => (
                            <motion.div 
                              key={midx}
                              className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
                              whileHover={{ x: 2 }}
                            >
                              <div className="flex items-center">
                                <div className="mr-3">
                                  <motion.div 
                                    className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${med.taken ? 'bg-green-100' : 'bg-gray-100'}`}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {med.taken ? (
                                      <FaCheck className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <FaPills className="h-4 w-4 text-gray-400" />
                                    )}
                                  </motion.div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">{med.name}</h5>
                                  <p className="text-xs text-gray-500">{med.dosage} • {med.time}</p>
                                </div>
                              </div>
                              <button className="text-xs text-green-600 hover:text-green-800 font-medium">
                                {med.taken ? 'Taken' : 'Mark as Taken'}
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </section>
          
          {/* Active Medications Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Current Medications</h3>
              <div className="flex items-center space-x-3">
                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                  <FaListUl className="mr-1" /> List View
                </button>
                <button className="text-sm text-green-600 font-medium hover:text-green-800 flex items-center">
                  <FaTh className="mr-1" /> Grid View
                </button>
              </div>
            </div>
            
            {activePrescriptions.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <FaPills className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">You don't have any active prescriptions.</p>
                <button 
                  onClick={handleRequestPrescription}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Request New Prescription
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePrescriptions.map((prescription, index) => {
                  const medInfo = getRelevantMedicationInfo(prescription.name);
                  const category = medicationCategories.find(c => c.id === medInfo.category);
                  
                  return (
                    <motion.div
                      key={index}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <div className={`px-4 py-3 flex items-center justify-between ${category?.color || 'bg-green-50'}`}>
                        <div className="flex items-center">
                          {category?.icon || <FaLeaf className="text-green-500" />}
                          <span className="ml-2 text-sm font-medium text-gray-800">{medInfo.category.charAt(0).toUpperCase() + medInfo.category.slice(1)} Remedy</span>
                        </div>
                        <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-green-700">
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900">{prescription.name}</h3>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                          <div>
                            <span className="text-gray-500 inline-flex items-center">
                              <FaPills className="mr-1 h-3 w-3" /> Dosage:
                            </span>
                            <span className="ml-1 text-gray-900">{prescription.dosage}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 inline-flex items-center">
                              <FaClock className="mr-1 h-3 w-3" /> Frequency:
                            </span>
                            <span className="ml-1 text-gray-900">{prescription.frequency}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 inline-flex items-center">
                              <FaCalendarPlus className="mr-1 h-3 w-3" /> Start:
                            </span>
                            <span className="ml-1 text-gray-900">{prescription.startDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 inline-flex items-center">
                              <FaCalendarMinus className="mr-1 h-3 w-3" /> End:
                            </span>
                            <span className="ml-1 text-gray-900">{prescription.endDate || 'Ongoing'}</span>
                          </div>
                        </div>
                        
                        {prescription.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-gray-600 text-sm flex items-start">
                              <FaInfoCircle className="text-gray-400 mr-2 mt-0.5 h-3 w-3 flex-shrink-0" />
                              <span>{prescription.notes}</span>
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <div className="flex-1">
                            <motion.button 
                              className="w-full px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaInfoCircle className="mr-1.5 h-3 w-3" /> Details
                            </motion.button>
                          </div>
                          
                          <div className="flex-1">
                            {prescription.isRefillNeeded && (
                              <motion.button 
                                className="w-full px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <FaSync className="mr-1.5 h-3 w-3" /> Request Refill
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
          
          {/* Medication Library Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Homeopathic Remedy Library</h3>
              <motion.button 
                className="text-green-600 text-sm font-medium hover:text-green-800 transition-colors inline-flex items-center"
                whileHover={{ x: 3 }}
              >
                Browse All Remedies <FaChevronRight className="ml-1 h-3 w-3" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {medicationLibrary.map((medication, index) => (
                <motion.div
                  key={medication.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="h-24 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={medication.image} 
                      alt={medication.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <span className="text-white text-xs font-medium">
                        {medication.name} {medication.potency}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2" title={medication.uses}>
                      {medication.uses}
                    </p>
                    <div className="flex justify-end">
                      <button className="text-xs text-green-600 font-medium hover:text-green-800">
                        Learn More
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Prescription History Section */}
          {historicalPrescriptions.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Prescription History</h3>
                <motion.button 
                  className="text-green-600 text-sm font-medium hover:text-green-800 transition-colors inline-flex items-center"
                  whileHover={{ x: 3 }}
                >
                  View Full History <FaChevronRight className="ml-1 h-3 w-3" />
                </motion.button>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remedy
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dosage
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Dates
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historicalPrescriptions.map((prescription, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{prescription.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{prescription.dosage} • {prescription.frequency}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">
                            {prescription.startDate} - {prescription.endDate || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <FaFileAlt className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FaRedo className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  // Update renderReportsTab to use real data
  const renderReportsTab = () => {
    if (isLoadingFeatureData) {
      return <div className="p-8 bg-white rounded-2xl"><MemoizedContentPreloader /></div>;
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
        {/* AI Report Generator - at the top of reports section */}
        <div className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg mr-4">
                  <FaRobot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">AI Health Report</h3>
                  <p className="text-white/80 mt-1">Generate a comprehensive AI-analyzed health report based on your profile data</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">New Feature</span>
            </div>
            
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center">
                  <div className="p-2 rounded-full bg-white/20 mr-2">
                    <FaHeartbeat className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">Physical Health</p>
                    <p className="text-sm font-semibold text-white">Analyzed</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center">
                  <div className="p-2 rounded-full bg-white/20 mr-2">
                    <FaBrain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">Mental Health</p>
                    <p className="text-sm font-semibold text-white">Data Included</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center">
                  <div className="p-2 rounded-full bg-white/20 mr-2">
                    <FaPills className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">Homeopathic Treatment</p>
                    <p className="text-sm font-semibold text-white">Suggestions Ready</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center justify-center mt-2">
                <FaFileAlt className="mr-2" /> Generate AI Health Report
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-purple-800">Your Medical Reports</h2>
        
        {featureDataError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{featureDataError}</p>
            <button 
              onClick={fetchReports}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        )}
        
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any medical reports uploaded.</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Upload New Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                    <FaClipboardList className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{report.report_title}</h3>
                        <p className="text-gray-600 text-sm">{report.report_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">{report.report_date}</p>
                        {report.is_critical && (
                          <span className="ml-2 px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                            Critical
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      {report.lab_name && (
                        <span className="text-gray-600 mr-4">Lab: {report.lab_name}</span>
                      )}
                      {report.doctor_name && (
                        <span className="text-gray-600">Doctor: {report.doctor_name}</span>
                      )}
                    </div>
                    {report.report_description && (
                      <p className="mt-2 text-gray-600 text-sm">{report.report_description}</p>
                    )}
                    {report.file_url && (
                      <div className="mt-3 flex justify-end gap-2">
                        <a 
                          href={report.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center"
                        >
                          <FaDownload className="mr-2" /> Download Report
                        </a>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center">
                          <FaRobot className="mr-2" /> AI Analysis
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Upload New Report
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Update renderWellnessTab to use real data
  const renderWellnessTab = () => {
    const wellnessGoals = wellnessData?.goals || [];
    const wellnessMetrics = wellnessData?.metrics || [];
    const recommendations = wellnessData?.recommendations;
    
    return (
      <div className="space-y-6">
        {/* Recommendations Section */}
        {recommendations && (
          <div className="mb-8 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{recommendations.title}</h3>
            
            <div className={`bg-gradient-to-br ${recommendations.title.includes('Diet') ? 'from-amber-50 to-orange-50 border-amber-100' : 'from-emerald-50 to-teal-50 border-emerald-100'} rounded-xl p-5 border`}>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                <p className="text-gray-700">{recommendations.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {recommendations.items.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-3 ${recommendations.title.includes('Diet') ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.icon === 'FaFish' && <FaFish className="h-4 w-4" />}
                        {item.icon === 'FaExclamationTriangle' && <FaExclamationTriangle className="h-4 w-4" />}
                        {item.icon === 'FaWater' && <FaWater className="h-4 w-4" />}
                        {item.icon === 'FaAppleAlt' && <FaAppleAlt className="h-4 w-4" />}
                        {item.icon === 'FaBrain' && <FaBrain className="h-4 w-4" />}
                        {item.icon === 'FaBed' && <FaBed className="h-4 w-4" />}
                        {item.icon === 'FaWalking' && <FaWalking className="h-4 w-4" />}
                        {item.icon === 'FaUsers' && <FaUsers className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {recommendations.dailyPlan && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">Daily Meal Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FaCoffee className="text-amber-600 mr-2" />
                        <span className="text-sm font-medium text-gray-800">Breakfast</span>
                      </div>
                      <p className="text-sm text-gray-600">{recommendations.dailyPlan.breakfast}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FaUtensils className="text-amber-600 mr-2" />
                        <span className="text-sm font-medium text-gray-800">Lunch</span>
                      </div>
                      <p className="text-sm text-gray-600">{recommendations.dailyPlan.lunch}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FaUtensils className="text-amber-600 mr-2" />
                        <span className="text-sm font-medium text-gray-800">Dinner</span>
                      </div>
                      <p className="text-sm text-gray-600">{recommendations.dailyPlan.dinner}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FaAppleAlt className="text-amber-600 mr-2" />
                        <span className="text-sm font-medium text-gray-800">Snacks</span>
                      </div>
                      <p className="text-sm text-gray-600">{recommendations.dailyPlan.snacks}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {recommendations.dailyTasks && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-3">Daily Mandatory Tasks</h4>
                  <div className="space-y-3">
                    {Array.isArray(recommendations.dailyTasks) && recommendations.dailyTasks.map((task, idx) => (
                      <motion.div 
                        key={idx}
                        className="flex items-center p-3 bg-emerald-50 rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className="mr-3">
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" 
                            checked={task.completed}
                            onChange={() => {
                              if (recommendations.dailyTasks) {
                                const updatedTasks = [...recommendations.dailyTasks];
                                updatedTasks[idx].completed = !updatedTasks[idx].completed;
                                setWellnessData(prev => ({
                                  ...prev,
                                  recommendations: {
                                    ...prev.recommendations!,
                                    dailyTasks: updatedTasks
                                  }
                                }));
                              }
                            }}
                          />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-800">{task.title}</h5>
                          <p className="text-xs text-gray-600">{task.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Wellness Goals */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Health Goals</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            
            {wellnessGoals.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">You haven't set any wellness goals yet</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Set Your First Goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wellnessGoals.map((goal, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${goal.completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                        {goal.completed ? (
                          <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <FaChartBar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">{goal.name}</h4>
                          <span className="text-sm font-medium text-gray-600">{goal.current_value}/{goal.target_value}</span>
                        </div>
                        <div className="mt-1 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${goal.completed ? 'bg-green-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Health Metrics */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Health Metrics</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View History</button>
            </div>
            
            {wellnessMetrics.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No health metrics recorded yet</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Record New Metric
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wellnessMetrics.slice(0, 5).map((metric, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{metric.metric_type}</h4>
                        <span className="text-lg font-semibold text-gray-900">{metric.metric_value}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{new Date(metric.recorded_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add the renderOverviewTab function if it's missing
  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        {/* Overview content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Health Insights</h2>
          
          {/* Profile Completion Banner - Always at top */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-indigo-100 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-start md:items-center mb-4 md:mb-0">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <FaUser className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">Complete Your Health Profile</h3>
                  <p className="text-gray-600 text-sm">We need more information for accurate AI analysis</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-indigo-700">65% Complete</span>
                  </div>
                  <div className="w-32 md:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
                  Complete Now
                </button>
              </div>
            </div>
          </div>
          
          {/* AI Doctor Features - Moved to top of dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Health Analyzer - Fixed implementation with no image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="p-6">
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Health Analyzer</h3>
                  <p className="text-gray-600 mb-4">
                    Get a complete health assessment based on your symptoms and medical history.
                  </p>
                  <button
                    onClick={handleStartHealthAnalysis}
                    className="inline-flex items-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-sm hover:shadow-lg hover:from-violet-600 hover:to-purple-700 transition-all"
                  >
                    <FaHeartbeat className="mr-2" />
                    <span>Analyze My Health</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Doctor Consultation */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Doctor Consultation</h3>
                    <p className="text-gray-600 mb-4">
                      Discuss your symptoms with our AI doctor for personalized homeopathic advice.
                    </p>
                    <button
                      onClick={handleStartAIConsultation}
                      className="inline-flex items-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-sm hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                    >
                      <FaRobot className="mr-2" />
                      <span>Start Consultation</span>
                    </button>
                  </div>
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <FaRobot className="h-10 w-10 text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI-Powered Health Insights */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <FaBrain className="text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-800">Your Health Profile</h4>
                    <p className="text-sm text-gray-500">AI-analyzed patterns and recommendations</p>
                  </div>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">65% Complete</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <FaHeartbeat className="text-red-500 mr-2" />
                    <span className="text-sm font-medium text-gray-800">Heart Health</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Excellent</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <FaLungs className="text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-800">Respiratory</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Good</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <FaBrain className="text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-gray-800">Mental Health</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Needs Attention</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={handleDetailedAnalysis} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all flex items-center"
                >
                  <FaSearch className="mr-2 h-3 w-3" /> Detailed Analysis
                </button>
                <button 
                  onClick={handleOpenAIRecommendation}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all flex items-center"
                >
                  <FaRobot className="mr-2 h-3 w-3" /> AI Recommendations
                </button>
              </div>
            </div>
          </div>
          
          {/* Personalized Wellness Plan */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">Your AI-Generated Wellness Plan</h3>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 mr-2">
                      <FaSeedling className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Your Holistic Plan</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Updated Today</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm text-gray-700 flex-1">Personalized Diet Plan</span>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View</button>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-700 flex-1">Exercise Recommendations</span>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View</button>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm text-gray-700 flex-1">Homeopathic Remedies</span>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">View</button>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm">
                  Update Wellness Plan
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Dashboard Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-indigo-800 mb-3">Upcoming Appointments</h3>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice(0, 2).map((appointment, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No upcoming appointments</p>
              )}
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Recent Prescriptions</h3>
              {prescriptions.length > 0 ? (
                <div className="space-y-3">
                  {prescriptions.slice(0, 2).map((prescription, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-medium">{prescription.name}</p>
                      <p className="text-sm text-gray-600">{prescription.dosage}, {prescription.frequency}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No active prescriptions</p>
              )}
            </div>
          </div>

          {/* Health Tips Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-3">Health Tips & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthTips.map((tip, index) => (
                <div key={index} className="bg-orange-50 rounded-xl p-5 border border-orange-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className={`p-2 bg-orange-100 rounded-lg text-orange-600 mr-3`}>
                      <tip.icon />
                    </div>
                    <h4 className="font-medium text-orange-800">{tip.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Tasks Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-purple-800">Today's Tasks</h3>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-800">View All</button>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              {memoizedTasks.length > 0 ? (
                <div className="space-y-2">
                  {memoizedTasks.slice(0, 3).map((task, index) => (
                    <div key={index} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={task.is_completed}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        readOnly
                      />
                      <div className="ml-3 flex-1">
                        <p className={`font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {task.task_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          {task.frequency ? ` • ${task.frequency}` : ''}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No tasks scheduled for today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add the toggleTaskCompletion function
  const toggleTaskCompletion = (goalId: string) => {
    setWellnessData(prev => {
      const updatedGoals = prev.goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            completed: !goal.completed,
          };
        }
        return goal;
      });
      return { ...prev, goals: updatedGoals };
    });
  };

  // Add click handlers for the AI Doctor buttons
  const handleStartAIConsultation = () => {
    setShowAIConsultation(true);
  };

  const handleCloseAIConsultation = () => {
    setShowAIConsultation(false);
  };

  // Add the handleStartHealthAnalysis function near the other handler functions
  const handleStartHealthAnalysis = () => {
    setShowHealthAnalyzerModal(true);
  };

  const handleCloseHealthAnalyzerModal = () => {
    setShowHealthAnalyzerModal(false);
  };

  // Add the handleDetailedAnalysis function near other handler functions
  const handleDetailedAnalysis = () => {
    setShowDetailedAnalysisModal(true);
  };

  const handleCloseDetailedAnalysisModal = () => {
    setShowDetailedAnalysisModal(false);
  };

  // Add handlers for AI recommendation modal
  const handleOpenAIRecommendation = () => {
    setShowAIRecommendationModal(true);
  };

  const handleCloseAIRecommendation = () => {
    setShowAIRecommendationModal(false);
    setSelectedRecommendationType(null);
  };

  const handleRecommendationTypeSelect = (type: string) => {
    setSelectedRecommendationType(type);
  };

  const handleGenerateRecommendation = async () => {
    // Simulate loading while AI analyzes data
    setLoading(true);
    
    // In a real implementation, you would fetch user profile data and send to an AI service
    // For now, we'll simulate a delay and then generate mock recommendations
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate recommendations based on selected type
    let recommendations;
    if (selectedRecommendationType === 'diet') {
      recommendations = {
        title: 'Personalized Diet Plan',
        summary: 'Based on your health profile data and reported symptoms, here\'s a customized diet plan to support your overall wellness.',
        items: [
          { title: 'Increase Omega-3 Intake', description: 'Add fatty fish like salmon, flaxseeds, and walnuts to your diet 2-3 times per week.', icon: 'FaFish' },
          { title: 'Reduce Inflammatory Foods', description: 'Minimize processed foods, refined sugars, and excessive dairy which may worsen your reported joint pain.', icon: 'FaExclamationTriangle' },
          { title: 'Hydration Focus', description: 'Aim for 2.5-3 liters of water daily to support your digestive issues and overall health.', icon: 'FaWater' },
          { title: 'Anti-oxidant Rich Foods', description: 'Include berries, dark leafy greens, and colorful vegetables to support immune function.', icon: 'FaAppleAlt' }
        ],
        dailyPlan: {
          breakfast: 'Vegetable omelet with sprouted grain toast',
          lunch: 'Quinoa bowl with mixed vegetables and lean protein',
          dinner: 'Baked fish with steamed vegetables and brown rice',
          snacks: 'Handful of nuts, fresh fruit, or vegetable sticks with hummus'
        }
      };
    } else {
      recommendations = {
        title: 'Lifestyle & Wellness Plan',
        summary: 'This personalized plan addresses your specific health needs based on your profile data and reported symptoms.',
        items: [
          { title: 'Stress Management', description: 'Practice 10-15 minutes of mindfulness meditation daily to reduce reported anxiety levels.', icon: 'FaBrain' },
          { title: 'Sleep Optimization', description: 'Maintain a consistent sleep schedule aiming for 7-8 hours, with a technology-free wind-down period.', icon: 'FaBed' },
          { title: 'Joint-Friendly Exercise', description: 'Incorporate low-impact activities like swimming or yoga 3-4 times weekly to address joint discomfort.', icon: 'FaWalking' },
          { title: 'Social Connection', description: 'Schedule regular social activities to support mental wellbeing and reduce isolation.', icon: 'FaUsers' }
        ],
        dailyTasks: [
          { title: 'Morning Stretching', description: '5-10 minutes of gentle stretching to reduce stiffness', completed: false },
          { title: 'Midday Walk', description: '15-minute walk to improve circulation and mood', completed: false },
          { title: 'Evening Relaxation', description: 'Progressive muscle relaxation before bed', completed: false },
          { title: 'Hydration Tracking', description: 'Monitor water intake throughout the day', completed: false }
        ]
      };
    }
    
    // Update wellness data with the new recommendations
    setWellnessData(prev => ({
      ...prev,
      recommendations
    }));
    
    // Add notification about the new recommendations
    // This is a placeholder - you'll need to implement notification system
    console.log(`New ${selectedRecommendationType === 'diet' ? 'Diet Plan' : 'Wellness Plan'} Generated`);
    
    setLoading(false);
    
    // Auto-switch to wellness tab to show the recommendations
    setActiveTab('wellness');
    handleCloseAIRecommendation();
  };

  // Update the renderDetailedAnalysisModal function to remove skin and joints sections
  const renderDetailedAnalysisModal = () => {
    if (!showDetailedAnalysisModal) return null;
    
    const handleBodyPartClick = (part: string) => {
      setBodyPart(part);
      // Set up questions based on selected body part
      const questions = [
        { id: `${part}_symptom`, label: `What symptoms are you experiencing in your ${part}?`, type: 'select', 
          options: ['Pain', 'Discomfort', 'Stiffness', 'Weakness', 'Other'] },
        { id: `${part}_duration`, label: 'How long have you been experiencing these symptoms?', type: 'select',
          options: ['Today only', 'A few days', 'About a week', 'Several weeks', 'A month or more'] },
        { id: `${part}_severity`, label: 'How would you rate the severity?', type: 'select',
          options: ['Mild', 'Moderate', 'Severe', 'Very severe'] }
      ];
      setDetailedAnalysisQuestions(questions);
      setDetailedAnalysisStep('questions');
    };
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800/30 backdrop-blur-sm transition-opacity" onClick={handleCloseDetailedAnalysisModal}>
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <motion.div 
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full relative"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white px-6 py-6 sm:p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-violet-600 rounded-full text-white mr-4">
                    <FaSearch className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Body Map Analysis</h3>
                </div>
                <motion.button 
                  onClick={handleCloseDetailedAnalysisModal} 
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {detailedAnalysisStep === 'body-map' && (
                <div className="py-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Select the area where you experience symptoms</h3>
                  
                  <div className="relative w-full mx-auto h-[500px] bg-blue-50 rounded-xl mb-6 overflow-hidden">
                    {/* Body map container with only Mental, Brain, Heart, Respiratory and Digestive systems */}
                    <div className="absolute inset-0 p-4">
                      {/* Central figure layout */}
                      <div className="relative w-full h-full mx-auto">
                        {/* Mental Health - Top center */}
                        <div className="absolute left-[50%] transform -translate-x-1/2 top-[10%] flex flex-col items-center">
                          <div onClick={() => handleBodyPartClick('mental')} className="relative">
                            <motion.div 
                              className="w-16 h-16 rounded-full bg-violet-100 cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div 
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                              >
                                <FaBrain className="h-8 w-8 text-violet-600" />
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Mental Health Text */}
                        <div className="absolute left-[18%] top-[10%] text-violet-700 font-medium">
                          Mental<br />Health
                        </div>
                        
                        {/* Brain & Nervous System Text */}
                        <div className="absolute right-[18%] top-[10%] text-right text-indigo-700 font-medium">
                          Brain &<br />Nervous<br />System
                        </div>
                        
                        {/* Person Icon (Heart) - Middle center */}
                        <div className="absolute left-[50%] transform -translate-x-1/2 top-[35%]" onClick={() => handleBodyPartClick('heart')}>
                          <motion.div 
                            className="w-20 h-20 rounded-full bg-red-100 cursor-pointer flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            >
                              <FaUser className="h-10 w-10 text-red-600" />
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Heart & Circulation Text */}
                        <div className="absolute right-[18%] top-[35%] text-right text-red-600 font-medium">
                          Heart &<br />Circulation
                        </div>
                        
                        {/* Respiratory System Box - Below heart */}
                        <div className="absolute left-[50%] transform -translate-x-1/2 top-[55%]" onClick={() => handleBodyPartClick('lungs')}>
                          <motion.div 
                            className="w-20 h-20 rounded-md bg-blue-100 cursor-pointer flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center"
                              animate={{ opacity: [0.8, 1, 0.8] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <FaLungs className="h-10 w-10 text-blue-600" />
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Respiratory System Text */}
                        <div className="absolute left-[18%] top-[55%] text-blue-600 font-medium">
                          Respiratory<br />System
                        </div>
                        
                        {/* Digestive System Box - Bottom center */}
                        <div className="absolute left-[50%] transform -translate-x-1/2 top-[75%]" onClick={() => handleBodyPartClick('digestive')}>
                          <motion.div 
                            className="w-20 h-20 rounded-md bg-green-100 cursor-pointer flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center"
                              animate={{ rotate: [0, 5, 0, -5, 0] }}
                              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <FaAppleAlt className="h-10 w-10 text-green-600" />
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Digestive System Text */}
                        <div className="absolute right-[18%] top-[75%] text-right text-green-600 font-medium">
                          Digestive<br />System
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-600">
                    <p>Click on the body part where you experience symptoms or discomfort</p>
                    <p className="text-sm mt-2">Our AI will ask targeted questions to provide a detailed analysis</p>
                  </div>
                </div>
              )}
              
              {detailedAnalysisStep === 'questions' && bodyPart && (
                <div className="py-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-2 rounded-full bg-indigo-100 mr-3">
                      {bodyPart === 'mental' && <FaBrain className="h-6 w-6 text-violet-600" />}
                      {bodyPart === 'heart' && <FaHeartbeat className="h-6 w-6 text-red-600" />}
                      {bodyPart === 'lungs' && <FaLungs className="h-6 w-6 text-blue-600" />}
                      {bodyPart === 'digestive' && <FaAppleAlt className="h-6 w-6 text-green-600" />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {bodyPart === 'mental' ? 'Mental Health' : 
                       bodyPart === 'heart' ? 'Heart & Circulation' :
                       bodyPart === 'lungs' ? 'Respiratory System' :
                       'Digestive System'} Assessment
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    {detailedAnalysisQuestions.map((question, index) => (
                      <motion.div 
                        key={question.id} 
                        className="bg-gray-50 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">{question.label}</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          value={detailedAnalysisResponses[question.id] || ''}
                          onChange={(e) => setDetailedAnalysisResponses(prev => ({
                            ...prev,
                            [question.id]: e.target.value
                          }))}
                        >
                          <option value="">Select an option</option>
                          {question.options?.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setDetailedAnalysisStep('body-map')}
                      className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setIsDetailedAnalysisLoading(true);
                        // Simulate analysis and update profile health metrics
                        setTimeout(() => {
                          const newResult = {
                            riskLevel: 'Moderate',
                            healthScore: 78,
                            findings: [
                              `Your ${bodyPart} symptoms suggest a mild imbalance that homeopathy may address.`,
                              "Environmental factors might be contributing to your condition.",
                              "Your symptoms appear to be connected to your overall stress levels."
                            ],
                            recommendations: [
                              { 
                                title: "Homeopathic Remedies", 
                                items: [
                                  bodyPart === 'mental' ? "Natrum Muriaticum 30C - Take 3 pellets twice daily for tension headaches" :
                                  bodyPart === 'heart' ? "Aconite 30C - Take 3 pellets twice daily for anxiety-related chest symptoms" :
                                  bodyPart === 'lungs' ? "Bryonia 30C - Take 3 pellets twice daily for dry cough and respiratory issues" :
                                  "Nux Vomica 30C - Take 3 pellets twice daily for digestive discomfort"
                                ]
                              },
                              {
                                title: "Lifestyle Adjustments",
                                items: [
                                  "Focus on regular hydration throughout the day",
                                  "Incorporate gentle movement like walking or stretching",
                                  "Establish a consistent sleep routine for better rest",
                                  "Consider incorporating stress-reduction techniques like meditation"
                                ]
                              }
                            ]
                          };
                          
                          // Update the health metrics in the profile tab based on the body part
                          const updatedHealthMetrics = [...healthMetrics];
                          
                          if (bodyPart === 'mental') {
                            const mentalHealthIndex = updatedHealthMetrics.findIndex(metric => 
                              metric.label === 'Mental Wellness' || metric.label.includes('Mental'));
                            if (mentalHealthIndex !== -1) {
                              updatedHealthMetrics[mentalHealthIndex] = {
                                ...updatedHealthMetrics[mentalHealthIndex],
                                value: '78%',
                                change: '+5%',
                                trend: 'up'
                              };
                            }
                          } else if (bodyPart === 'heart') {
                            const heartIndex = updatedHealthMetrics.findIndex(metric => 
                              metric.label === 'Heart Health' || metric.label.includes('Heart'));
                            if (heartIndex !== -1) {
                              updatedHealthMetrics[heartIndex] = {
                                ...updatedHealthMetrics[heartIndex],
                                value: '82%',
                                change: '+3%',
                                trend: 'up'
                              };
                            }
                          } else if (bodyPart === 'lungs') {
                            const respiratoryIndex = updatedHealthMetrics.findIndex(metric => 
                              metric.label === 'Respiratory Health' || metric.label.includes('Respiratory'));
                            if (respiratoryIndex !== -1) {
                              updatedHealthMetrics[respiratoryIndex] = {
                                ...updatedHealthMetrics[respiratoryIndex],
                                value: '85%',
                                change: '+4%',
                                trend: 'up'
                              };
                            }
                          } else if (bodyPart === 'digestive') {
                            const digestiveIndex = updatedHealthMetrics.findIndex(metric => 
                              metric.label === 'Digestive Health' || metric.label.includes('Digestive'));
                            if (digestiveIndex !== -1) {
                              updatedHealthMetrics[digestiveIndex] = {
                                ...updatedHealthMetrics[digestiveIndex],
                                value: '79%',
                                change: '+6%',
                                trend: 'up'
                              };
                            }
                          }
                          
                          // Comment out setHealthMetrics since it's not defined
                          // setHealthMetrics(updatedHealthMetrics);
                          setDetailedAnalysisResult(newResult);
                          setIsDetailedAnalysisLoading(false);
                          setDetailedAnalysisStep('results');
                          
                          // Comment out notification code since setNotification is not defined
                          /*
                          // Set a notification that health profile has been updated
                          setNotification({
                            message: `Your health profile has been updated with new ${bodyPart === 'mental' ? 'Mental Health' : 
                                      bodyPart === 'heart' ? 'Heart & Circulation' :
                                      bodyPart === 'lungs' ? 'Respiratory System' :
                                      'Digestive System'} data`,
                            type: 'success',
                            show: true
                          });
                          
                          // Hide notification after 5 seconds
                          setTimeout(() => {
                            setNotification(prev => ({...prev, show: false}));
                          }, 5000);
                          */
                        }, 2000);
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 shadow-sm"
                      disabled={Object.keys(detailedAnalysisResponses).length < detailedAnalysisQuestions.length}
                    >
                      Generate Analysis
                    </button>
                  </div>
                </div>
              )}
              
              {isDetailedAnalysisLoading && (
                <div className="py-10 text-center">
                  <div className="mb-8 relative w-24 h-24 mx-auto">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                    
                    {/* Inner pulsing icon */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0.6, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <FaSearch className="h-12 w-12 text-indigo-500" />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Analyzing your responses</h3>
                  <p className="text-gray-600">Our AI is generating a detailed health analysis based on your answers...</p>
                  
                  <div className="mt-6 max-w-md mx-auto">
                    <motion.div 
                      className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    ></motion.div>
                  </div>
                </div>
              )}
              
              {detailedAnalysisStep === 'results' && detailedAnalysisResult && (
                <div className="py-4 overflow-y-auto max-h-[70vh]">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center">
                      <div className="p-3 rounded-full bg-amber-100">
                        <span className="text-xl font-bold text-amber-600">
                          {detailedAnalysisResult.healthScore}
                        </span>
                      </div>
                      <div className="ml-3 text-left">
                        <h3 className="font-semibold text-gray-900">Health Score</h3>
                        <p className="text-sm text-amber-600">
                          {detailedAnalysisResult.riskLevel} Risk Level
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="bg-indigo-50 p-5 rounded-xl mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-medium text-indigo-800 mb-3">Key Findings</h3>
                    <ul className="space-y-2">
                      {detailedAnalysisResult.findings.map((finding: string, index: number) => (
                        <motion.li 
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <FaCheckCircle className="text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{finding}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  {detailedAnalysisResult.recommendations.map((section: any, sectionIndex: number) => (
                    <motion.div 
                      key={sectionIndex}
                      className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (sectionIndex * 0.1) }}
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-xs font-medium text-indigo-700">{itemIndex + 1}</span>
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                  
                  <div className="mt-6 text-center">
                    <button 
                      onClick={handleCloseDetailedAnalysisModal}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 shadow-sm"
                    >
                      Close Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // AI Recommendation Modal Component
  const renderAIRecommendationModal = () => {
    if (!showAIRecommendationModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800/30 backdrop-blur-sm transition-opacity" onClick={handleCloseAIRecommendation}>
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <motion.div 
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white px-6 py-6 sm:p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-600 rounded-full text-white mr-4">
                    <FaRobot className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
                </div>
                <motion.button 
                  onClick={handleCloseAIRecommendation} 
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {!selectedRecommendationType ? (
                <div className="py-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                    Select a recommendation type
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <motion.div 
                      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 cursor-pointer hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRecommendationTypeSelect('diet')}
                    >
                      <div className="flex items-start">
                        <div className="p-3 bg-amber-100 rounded-lg text-amber-600 mr-4">
                          <FaUtensils className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Diet Setup</h4>
                          <p className="text-sm text-gray-600">
                            Get a personalized diet plan based on your health profile, nutritional needs, and health goals
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 cursor-pointer hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRecommendationTypeSelect('wellness')}
                    >
                      <div className="flex items-start">
                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 mr-4">
                          <FaSeedling className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Lifestyle & Wellness Plan</h4>
                          <p className="text-sm text-gray-600">
                            Receive daily tasks and wellness recommendations tailored to your specific health needs
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <button 
                      onClick={() => setSelectedRecommendationType(null)}
                      className="mr-3 text-purple-600 hover:text-purple-800 p-1"
                    >
                      <FaArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedRecommendationType === 'diet' ? 'Diet Setup' : 'Lifestyle & Wellness Plan'}
                    </h3>
                  </div>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="relative w-20 h-20 mb-4">
                        <motion.div
                          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-purple-200 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                          className="absolute top-0 left-0 right-0 bottom-0 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <h4 className="text-base font-medium text-gray-800 mb-1">Analyzing your health data</h4>
                      <p className="text-sm text-gray-600 text-center max-w-xs">
                        Our AI is analyzing your health profile and creating personalized recommendations just for you
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-purple-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                          Based on your health profile, our AI will analyze your data and generate personalized 
                          {selectedRecommendationType === 'diet' ? ' diet recommendations' : ' lifestyle and wellness tasks'}.
                          This helps you make informed decisions about your health journey.
                        </p>
                      </div>
                      
                      <button
                        onClick={handleGenerateRecommendation}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center justify-center"
                      >
                        <FaRobot className="mr-2 h-4 w-4" /> 
                        Generate {selectedRecommendationType === 'diet' ? 'Diet Plan' : 'Wellness Plan'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Add these new handler functions near the other handler functions
  
  // Handler for scheduling a new appointment
  const handleScheduleAppointment = () => {
    setShowAppointmentModal(true);
  };
  
  // Handler for requesting a new prescription
  const handleRequestPrescription = () => {
    setShowPrescriptionModal(true);
  };
  
  // Function to handle appointment form submission
  const handleAppointmentSubmit = (appointmentData: AppointmentFormData) => {
    console.log('Appointment scheduled:', appointmentData);
    // Here you would typically send this data to your backend API
  };
  
  // Function to handle prescription form submission
  const handlePrescriptionSubmit = (prescriptionData: PrescriptionFormData) => {
    console.log('Prescription requested:', prescriptionData);
    // Here you would typically send this data to your backend API
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-indigo-900">
            <span className="inline-block">Loading Dashboard</span>
          </h2>
          <p className="text-indigo-600 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50">
      {/* Premium Header with optimized animations */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-500/95 via-blue-600/95 to-violet-500/95 text-white rounded-b-[40px] shadow-[0_15px_30px_-15px_rgba(70,50,200,0.25)]"
        style={{ zIndex: 10 }}
      >
        {/* Particles moved to client-only component */}
        <ClientOnlyAnimations>
        {!isReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => {
                // Use fixed pixel values instead of calculations
                const sizes = [10, 18, 26, 34, 42];
                const width = sizes[i % 5];
                const height = width;
                const topPositions = ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%"];
                const leftPositions = ["5%", "15%", "25%", "35%", "45%", "55%", "65%", "75%", "85%", "95%"];
                const top = topPositions[i % 9];
                const left = leftPositions[i % 10];
                const opacities = [0.1, 0.12, 0.14, 0.16, 0.18];
                const opacity = opacities[i % 5];
                const blurs = [0, 0.5, 1];
                const blur = blurs[i % 3];
                const delays = [0, 1, 2, 3, 4];
                const delay = delays[i % 5];
                
                return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      top,
                      left,
                      opacity,
                      filter: `blur(${blur}px)`
                }}
                animate={{
                  y: [0, -50],
                      opacity: [opacity, opacity * 2, 0],
                  scale: [1, 1.1, 0.9]
                }}
                transition={{
                      duration: 15,
                  repeat: Infinity,
                      delay
                }}
              />
                );
              })}
          </div>
        )}
        </ClientOnlyAnimations>

        {/* Header content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {getTimeIcon()}
              </div>
              <div className="ml-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {getGreeting()}
                </h1>
                <p className="text-white/80 mt-2 text-lg">Your wellness journey continues</p>
              </div>
            </div>
            <motion.div 
              className="flex items-center space-x-4 md:space-x-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {/* Mobile-optimized Health Insights */}
              <div className="hidden md:block w-auto">
                <HealthInsights />
              </div>
              
              {/* Enhanced Profile Button with optimized animations */}
              <div ref={profileRef} className="relative" style={{ zIndex: 99999 }}>
                <motion.div 
                  className="h-12 md:h-16 w-12 md:w-16 rounded-full border-2 border-white/50 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center p-1 shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer overflow-hidden group"
                  whileHover={!isReducedMotion ? { scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.2)" } : {}}
                  whileTap={!isReducedMotion ? { scale: 0.97 } : {}}
                  onClick={handleProfileClick}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="h-full w-full rounded-full object-cover ring-2 ring-white/50 transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <FaUser className="text-white text-xl md:text-2xl transition-transform duration-300 group-hover:scale-110" />
                  )}
                  {showProfileMenu && (
                    <motion.div
                      className="absolute inset-0 border-2 border-indigo-300 rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                <ProfileDropdown />
              </div>
            </motion.div>
          </div>

          {/* Show Health Insights on mobile */}
          <div className="mt-6 md:hidden">
            <HealthInsights />
          </div>

          {/* Enhanced metrics with optimized layout and individual card styling */}
          <motion.div 
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {contentLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl min-h-[100px] p-3">
                  <MemoizedContentPreloader />
                </div>
              ))
            ) : (
              <ClientOnlyAnimations>
                {memoizedHealthMetrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  className={`${metricsCardStyle} group`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                    whileHover={!isReducedMotion ? { y: -5, scale: 1.03, transition: { duration: 0.2 } } : {}}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="flex items-center">
                      <div className="p-3 sm:p-4 rounded-xl bg-white/25 backdrop-blur-md flex items-center justify-center shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] border border-white/40 group-hover:border-white/60 transition-all duration-300 mr-4">
                        <metric.icon className="text-white text-xl sm:text-2xl drop-shadow-md" />
                    </div>
                    <div className="z-10 min-w-0 flex-1">
                        <p className="text-white text-sm sm:text-base font-medium tracking-wide mb-1">{metric.label}</p>
                      <div className="flex items-center">
                          <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{metric.value}</span>
                        {metric.change && (
                            <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full shadow-sm whitespace-nowrap ${
                            metric.trend === 'up' ? 'bg-green-500/40 text-white border border-green-400/30' : 
                            metric.trend === 'down' ? 'bg-red-500/40 text-white border border-red-400/30' : 
                            'bg-gray-500/40 text-white border border-gray-400/30'
                          }`}>
                            {metric.change}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </ClientOnlyAnimations>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main dashboard content with optimized layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative">
        {contentLoading ? (
          <div className="space-y-6">
            <MemoizedContentPreloader />
            <MemoizedContentPreloader />
          </div>
        ) : (
          <>
            {/* Use the TabNavigation component */}
            <TabNavigation 
              tabs={['overview', 'appointments', 'prescriptions', 'reports', 'wellness', 'subscription']}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isReducedMotion={isReducedMotion}
            />

            {/* Render the active tab content */}
            {renderTabContent()}
          </>
        )}
      </main>

      {/* Add AI Doctor Consultation Modal */}
      {showAIConsultation && (
        <AIDoctorConsultationModal 
          onClose={handleCloseAIConsultation}
          step={consultationStep}
          setStep={setConsultationStep}
          responses={consultationResponses}
          setResponses={setConsultationResponses}
          result={consultationResult}
          setResult={setConsultationResult}
          isLoading={isConsultationLoading}
          setIsLoading={setIsConsultationLoading}
        />
      )}
      
      {/* Add Health Analyzer Modal */}
      {showHealthAnalyzerModal && (
        <HealthAnalyzerModal
          onClose={handleCloseHealthAnalyzerModal}
          step={healthAnalysisStep}
          setStep={setHealthAnalysisStep}
          analysisMethod={healthAnalysisMethod}
          setAnalysisMethod={setHealthAnalysisMethod}
          healthScore={healthScore}
          setHealthScore={setHealthScore}
          healthRisks={healthRisks}
          setHealthRisks={setHealthRisks}
          isLoading={isHealthAnalysisLoading}
          setIsLoading={setIsHealthAnalysisLoading}
          result={healthAnalysisResult}
          setResult={setHealthAnalysisResult}
        />
      )}
      
      {/* Render Detailed Analysis Modal */}
      {renderDetailedAnalysisModal()}
      {renderAIRecommendationModal()}
      
      {/* Modals */}
      <AppointmentSchedulingModal 
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={handleAppointmentSubmit}
      />
      
      <PrescriptionRequestModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onSubmit={handlePrescriptionSubmit}
      />
    </div>
  );
} 