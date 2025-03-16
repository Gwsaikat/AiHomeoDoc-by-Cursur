'use client';

import React, { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaPills, 
  FaChartLine, 
  FaHeartbeat, 
  FaRunning, 
  FaNotesMedical, 
  FaBell, 
  FaArrowRight, 
  FaSun, 
  FaMoon, 
  FaWater,
  FaSeedling,
  FaAppleAlt,
  FaBrain,
  FaStopwatch,
  FaBookMedical,
  FaRobot,
  FaLungs,
  FaUserMd,
  FaSearch,
  FaCheck,
  FaSync,
  FaDownload,
  FaStethoscope,
  FaFileAlt,
} from 'react-icons/fa';
import { FiCheckCircle, FiCircle, FiCheck, FiClipboard } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import TabNavigation from '@/components/ui/TabNavigation';
import axios from 'axios';

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

  const handleSubmitStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep((prevStep: number) => prevStep + 1);
    } else {
      // Final step - analyze and generate recommendations
      setIsLoading(true);
      
      // Simulate API call to AI analysis
      setTimeout(() => {
        setResult({
          diagnosis: "Based on your symptoms, you may be experiencing seasonal allergies with anxiety component.",
          recommendations: [
            { remedy: "Natrum Muriaticum 30C", dosage: "3 pellets, 3 times daily", duration: "7 days" },
            { remedy: "Arsenicum Album 200C", dosage: "Single dose", duration: "Once weekly for 3 weeks" }
          ],
          lifestyle: [
            "Increase water intake to at least 2 liters daily",
            "Practice meditation for 15 minutes each morning",
            "Reduce dairy consumption temporarily"
          ],
          followUp: "2 weeks"
        });
        setIsLoading(false);
      }, 3000);
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
      <form onSubmit={handleSubmitStep} className="space-y-6">
        {currentQuestions.map((question: ConsultationQuestion) => (
          <div key={question.id} className="space-y-2">
            <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
              {question.label}
            </label>
            
            {question.type === 'textarea' && (
              <textarea
                id={question.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder={question.placeholder}
                value={responses[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                required
              />
            )}
            
            {question.type === 'select' && question.options && (
              <select
                id={question.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              <div>
                <input
                  id={question.id}
                  type="range"
                  min={question.min}
                  max={question.max}
                  className="w-full"
                  value={responses[question.id] || question.min}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className="text-center font-medium mt-1">
                  {responses[question.id] || question.min} / {question.max}
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={handlePrevStep}
          >
            {step > 1 ? 'Previous' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {step < 4 ? 'Next' : 'Submit for Analysis'}
          </button>
        </div>
      </form>
    );
  };

  const renderConsultationResult = () => {
    if (isLoading) {
      return (
        <div className="py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Analyzing your responses and generating personalized recommendations...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment as our AI processes your detailed health information.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-800 mb-2">AI Analysis</h3>
          <p className="text-gray-700">{result?.diagnosis}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Recommended Homeopathic Remedies</h3>
          <div className="space-y-3">
            {result?.recommendations.map((rec: any, index: number) => (
              <div key={index} className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex justify-between">
                  <strong className="text-green-800">{rec.remedy}</strong>
                  <span className="text-green-700">{rec.dosage}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Duration: {rec.duration}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Lifestyle Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1">
            {result?.lifestyle.map((item: string, index: number) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Follow-up Recommendation</h3>
          <p className="text-gray-700">Schedule a follow-up in {result?.followUp} to assess your progress.</p>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={handleRestartConsultation}
          >
            New Consultation
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            onClick={handleCloseConsultation}
          >
            Save & Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={handleCloseConsultation}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mb-5 border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mr-3">
                    <FaRobot className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI Doctor Consultation</h3>
                </div>
                <button onClick={handleCloseConsultation} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {!result && !isLoading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-600">Step {step} of 4</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map(stp => (
                        <div
                          key={stp}
                          className={`h-2 w-10 rounded-full ${
                            stp <= step ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3">
              {result || isLoading ? renderConsultationResult() : renderQuestions()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
  const [showAIConsultation, setShowAIConsultation] = useState(false);
  const [consultationStep, setConsultationStep] = useState(1);
  const [consultationResponses, setConsultationResponses] = useState<ConsultationResponsesType>({});
  const [consultationResult, setConsultationResult] = useState<any>(null);
  const [isConsultationLoading, setIsConsultationLoading] = useState(false);

  // Health insights data for the unique feature
  const healthInsights = [
    { label: "Sleep Quality", value: "Improved", icon: FaMoon, trend: "up" },
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
    metrics: WellnessMetric[];
    goals: WellnessGoal[];
    tasks: WellnessTask[];
    trends: Record<string, {trend: string; change: string; direction: string}>;
  }>({
    metrics: [],
    goals: [],
    tasks: [],
    trends: {}
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
    { label: 'Sleep Quality', value: '7.5hrs', change: '+0.5hrs', trend: 'up', icon: FaMoon, color: 'purple' },
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
      icon: FaWater,
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
    try {
      setIsLoadingFeatureData(true);
      const response = await axios.get('/api/patient/wellness');
      setWellnessData({
        metrics: response.data.metrics || [],
        goals: response.data.goals || [],
        tasks: response.data.tasks || [],
        trends: response.data.trends || {}
      });
    } catch (error: any) {
      console.error('Error fetching wellness data:', error);
      setFeatureDataError(error.response?.data?.error || 'Failed to load wellness data');
      // Use sample tasks as fallback for wellness tasks
      setWellnessData({
        metrics: [],
        goals: [],
        tasks: sampleTasks,
        trends: {}
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

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
        <h2 className="text-2xl font-bold mb-6 text-indigo-800">Your Appointments</h2>
        
        {featureDataError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{featureDataError}</p>
            <button 
              onClick={fetchAppointments}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}
        
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any appointments scheduled.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Schedule New Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      {appointment.image ? (
                        <img src={appointment.image} alt={appointment.doctor} className="h-10 w-10 rounded-full object-cover" />
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
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
                <div className="mt-3 flex justify-end space-x-3">
                  {appointment.isVirtual && appointment.status === 'upcoming' && (
                    <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Join Video Call
                    </button>
                  )}
                  {appointment.status === 'upcoming' && (
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Update renderPrescriptionsTab to use real data
  const renderPrescriptionsTab = () => {
    if (isLoadingFeatureData) {
      return <div className="p-8 bg-white rounded-2xl"><MemoizedContentPreloader /></div>;
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
        <h2 className="text-2xl font-bold mb-6 text-green-800">Your Prescriptions</h2>
        
        {featureDataError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            <p>{featureDataError}</p>
            <button 
              onClick={fetchPrescriptions}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        )}
        
        {prescriptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any active prescriptions.</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Request New Prescription
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((prescription, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{prescription.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    prescription.status === 'active' ? 'bg-green-100 text-green-800' : 
                    prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Dosage:</span>
                    <span className="ml-1 text-gray-900">{prescription.dosage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <span className="ml-1 text-gray-900">{prescription.frequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Start:</span>
                    <span className="ml-1 text-gray-900">{prescription.startDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">End:</span>
                    <span className="ml-1 text-gray-900">{prescription.endDate || 'Ongoing'}</span>
                  </div>
                </div>
                {prescription.notes && (
                  <p className="mt-2 text-gray-600 text-sm border-t border-gray-100 pt-2">{prescription.notes}</p>
                )}
                {prescription.isRefillNeeded && prescription.status === 'active' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button className="px-4 py-2 w-full text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                      <FaSync className="mr-2" /> Request Refill
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
    if (isLoadingFeatureData) {
      return <div className="p-8 bg-white rounded-2xl"><MemoizedContentPreloader /></div>;
    }

    const { metrics, goals, tasks, trends } = wellnessData;

    return (
      <ClientOnlyAnimations>
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Your Wellness Journey</h2>
          
          {featureDataError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              <p>{featureDataError}</p>
              <button 
                onClick={fetchWellnessData}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wellness Metrics Section */}
            <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Health Metrics</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  Record New +
                </button>
              </div>
              
              {metrics.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No health metrics recorded yet</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Record First Metric
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.slice(0, 5).map((metric, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{metric.metric_type}</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{metric.metric_value}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{new Date(metric.recorded_date).toLocaleDateString()}</p>
                          {trends[metric.metric_type] && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              trends[metric.metric_type].trend === 'up' ? 'bg-green-100 text-green-800' : 
                              trends[metric.metric_type].trend === 'down' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {trends[metric.metric_type].change}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Wellness Goals Section */}
            <div className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Wellness Goals</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  Set New Goal +
                </button>
              </div>
              
              {goals.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">You haven't set any wellness goals yet</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Set Your First Goal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${goal.completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                          {goal.completed ? (
                            <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <FiClipboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{goal.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                        </div>
                      </div>
                      <div>
                        <button 
                          className={`rounded-full p-2 transition-colors ${
                            goal.completed 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => toggleTaskCompletion(goal.id)}
                        >
                          {goal.completed ? (
                            <FiCheck className="h-5 w-5" />
                          ) : (
                            <FiCircle className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Wellness Tasks Section */}
          <div className="mt-6 bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Wellness Tasks</h3>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                Add New Task +
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">You don't have any wellness tasks yet</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start p-3 rounded-lg ${
                      task.is_completed ? 'bg-gray-100 border border-gray-200' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.is_completed}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                      readOnly
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h4 className={`font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.task_name}
                        </h4>
                        <div>
                          {task.due_date && (
                            <span className="text-xs text-gray-500 mr-2">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        {task.frequency ? ` • ${task.frequency}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ClientOnlyAnimations>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <FaRobot className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Doctor Consultation</h3>
                </div>
                <p className="mb-4 text-white/80">Get instant AI-powered health analysis and homeopathic treatment recommendations</p>
                <button className="w-full py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center justify-center">
                  <FaStethoscope className="mr-2" /> Start Consultation
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <FaHeartbeat className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Health Analyzer</h3>
                </div>
                <p className="mb-4 text-white/80">Advanced symptom analysis and personalized wellness plan generation</p>
                <button className="w-full py-3 bg-white text-emerald-700 rounded-lg font-medium hover:bg-white/90 transition-all flex items-center justify-center">
                  <FaSearch className="mr-2" /> Analyze My Health
                </button>
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
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all flex items-center">
                  <FaSearch className="mr-2 h-3 w-3" /> Detailed Analysis
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all flex items-center">
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
    </div>
  );
} 