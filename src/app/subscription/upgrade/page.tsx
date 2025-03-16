'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaArrowRight, 
  FaStethoscope, 
  FaChartLine, 
  FaUserMd, 
  FaHeartbeat, 
  FaLaptopMedical,
  FaCreditCard,
  FaCalendarAlt
} from 'react-icons/fa';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Plan benefit type
type PlanBenefit = {
  id: number;
  title: string;
  included: boolean;
  highlightedForPlan?: 'monthly' | 'yearly';
  footnote?: string;
};

const SubscriptionUpgradePage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  
  // Monthly savings calculation
  const monthlyCost = 99;
  const yearlyCost = 799;
  const yearlySavings = (monthlyCost * 12) - yearlyCost;
  const savingsPercentage = Math.round((yearlySavings / (monthlyCost * 12)) * 100);
  
  // Plan benefits data
  const freePlanBenefits: PlanBenefit[] = [
    { id: 1, title: 'Basic symptom checking', included: true },
    { id: 2, title: 'General health advice', included: true },
    { id: 3, title: 'Basic health reports', included: true },
    { id: 4, title: '3 video consultations', included: true, footnote: '₹29 per additional session' },
    { id: 5, title: 'Advanced AI health tracking', included: false },
    { id: 6, title: 'Deep diagnostic insights', included: false },
    { id: 7, title: 'Personalized medicine suggestions', included: false },
    { id: 8, title: 'Unlimited AI health assistant usage', included: false },
    { id: 9, title: 'Detailed health reports', included: false, footnote: '₹19 per report' },
    { id: 10, title: 'Priority support', included: false },
  ];

  const monthlyPlanBenefits: PlanBenefit[] = [
    { id: 1, title: 'Basic symptom checking', included: true },
    { id: 2, title: 'General health advice', included: true },
    { id: 3, title: 'Basic health reports', included: true },
    { id: 4, title: '5 video consultations', included: true, footnote: '₹29 per additional session' },
    { id: 5, title: 'Advanced AI health tracking', included: true, highlightedForPlan: 'monthly' },
    { id: 6, title: 'Deep diagnostic insights', included: true, highlightedForPlan: 'monthly' },
    { id: 7, title: 'Personalized medicine suggestions', included: true, highlightedForPlan: 'monthly' },
    { id: 8, title: 'Unlimited AI health assistant usage', included: true, highlightedForPlan: 'monthly' },
    { id: 9, title: '5 detailed health reports per month', included: true, highlightedForPlan: 'monthly', footnote: '₹19 per additional report' },
    { id: 10, title: 'Priority support', included: true },
  ];

  const yearlyPlanBenefits: PlanBenefit[] = [
    { id: 1, title: 'Basic symptom checking', included: true },
    { id: 2, title: 'General health advice', included: true },
    { id: 3, title: 'Basic health reports', included: true },
    { id: 4, title: '10 video consultations', included: true, highlightedForPlan: 'yearly', footnote: '₹29 per additional session' },
    { id: 5, title: 'Advanced AI health tracking', included: true },
    { id: 6, title: 'Deep diagnostic insights', included: true },
    { id: 7, title: 'Personalized medicine suggestions', included: true },
    { id: 8, title: 'Unlimited AI health assistant usage', included: true },
    { id: 9, title: '5 detailed health reports per month', included: true, footnote: '₹19 per additional report' },
    { id: 10, title: 'Priority support', included: true },
    { id: 11, title: 'Exclusive seasonal health guides', included: true, highlightedForPlan: 'yearly' },
    { id: 12, title: '33% savings compared to monthly plan', included: true, highlightedForPlan: 'yearly' },
  ];
  
  // Handle subscription
  const handleSubscribe = () => {
    setLoading(true);
    
    // Simulate API call to handle subscription
    setTimeout(() => {
      setLoading(false);
      
      // Redirect to payment page
      router.push(`/subscription/payment?plan=${selectedPlan}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Back to Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Subscription Plans</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Upgrade to unlock premium features and take your homeopathic healthcare to the next level
          </p>
        </motion.div>

        {/* Plan Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-lg shadow-sm inline-flex">
            <button 
              className={`px-6 py-2 text-sm font-medium rounded-md ${selectedPlan === 'monthly' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 text-sm font-medium rounded-md ${selectedPlan === 'yearly' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              Yearly (Save {savingsPercentage}%)
            </button>
          </div>
        </div>
        
        {/* Plans Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-200"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="px-6 py-8 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Basic Plan</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-gray-900">Free</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Perfect for occasional users</p>
            </div>

            <div className="px-6 py-8">
              <ul className="space-y-4">
                {freePlanBenefits.map(benefit => (
                  <li key={benefit.id} className="flex items-start">
                    {benefit.included ? (
                      <FaCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <span className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                    )}
                    <div className="ml-3">
                      <p className={`text-sm ${benefit.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {benefit.title}
                      </p>
                      {benefit.footnote && benefit.included && (
                        <p className="text-xs text-gray-500 mt-1">{benefit.footnote}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <div className="rounded-md shadow">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200"
                  >
                    Current Plan
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Monthly Plan */}
          <motion.div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${selectedPlan === 'monthly' ? 'border-blue-500' : 'border-gray-200'}`}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <div className={`px-6 py-8 ${selectedPlan === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-800'}`}>
              <h3 className="text-xl font-semibold">Premium Monthly</h3>
              <div className="mt-4 flex items-baseline">
                <span className={`text-3xl font-extrabold ${selectedPlan === 'monthly' ? 'text-white' : 'text-gray-900'}`}>₹99</span>
                <span className={`ml-1 text-xl ${selectedPlan === 'monthly' ? 'text-blue-100' : 'text-gray-500'}`}>/month</span>
              </div>
              <p className={`mt-2 text-sm ${selectedPlan === 'monthly' ? 'text-blue-100' : 'text-gray-600'}`}>Full access with monthly flexibility</p>
            </div>

            <div className="px-6 py-8">
              <ul className="space-y-4">
                {monthlyPlanBenefits.map(benefit => (
                  <li key={benefit.id} className="flex items-start">
                    <FaCheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${benefit.highlightedForPlan === 'monthly' ? 'text-blue-500' : 'text-green-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm ${benefit.highlightedForPlan === 'monthly' ? 'font-medium text-blue-800' : 'text-gray-700'}`}>
                        {benefit.title}
                      </p>
                      {benefit.footnote && (
                        <p className="text-xs text-gray-500 mt-1">{benefit.footnote}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${selectedPlan === 'monthly' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>{selectedPlan === 'monthly' ? 'Select Monthly Plan' : 'Switch to Monthly'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yearly Plan */}
          <motion.div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${selectedPlan === 'yearly' ? 'border-blue-500' : 'border-gray-200'} relative`}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                BEST VALUE
              </div>
            </div>

            <div className={`px-6 py-8 ${selectedPlan === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-800'}`}>
              <h3 className="text-xl font-semibold">Premium Yearly</h3>
              <div className="mt-4 flex items-baseline">
                <span className={`text-3xl font-extrabold ${selectedPlan === 'yearly' ? 'text-white' : 'text-gray-900'}`}>₹799</span>
                <span className={`ml-1 text-xl ${selectedPlan === 'yearly' ? 'text-blue-100' : 'text-gray-500'}`}>/year</span>
              </div>
              <p className={`mt-2 text-sm ${selectedPlan === 'yearly' ? 'text-blue-100' : 'text-gray-600'}`}>Best value for committed users</p>
            </div>

            <div className="px-6 py-8">
              <ul className="space-y-4">
                {yearlyPlanBenefits.map(benefit => (
                  <li key={benefit.id} className="flex items-start">
                    <FaCheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${benefit.highlightedForPlan === 'yearly' ? 'text-blue-500' : 'text-green-500'}`} />
                    <div className="ml-3">
                      <p className={`text-sm ${benefit.highlightedForPlan === 'yearly' ? 'font-medium text-blue-800' : 'text-gray-700'}`}>
                        {benefit.title}
                      </p>
                      {benefit.footnote && (
                        <p className="text-xs text-gray-500 mt-1">{benefit.footnote}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <div className="rounded-md shadow">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${selectedPlan === 'yearly' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>{selectedPlan === 'yearly' ? 'Select Yearly Plan' : 'Switch to Yearly'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Features */}
        <motion.div
          className="mt-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Premium Features Included
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="bg-white p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaStethoscope className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced AI Diagnosis</h3>
              <p className="text-gray-600">Our sophisticated AI system provides deeper analysis of your symptoms with higher accuracy and personalized remedy matching.</p>
            </motion.div>
            
            <motion.div className="bg-white p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaHeartbeat className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Continuous Health Tracking</h3>
              <p className="text-gray-600">Monitor your symptoms and treatment progress over time with detailed analytics and improvement metrics.</p>
            </motion.div>
            
            <motion.div className="bg-white p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaUserMd className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Consultations</h3>
              <p className="text-gray-600">Connect with qualified homeopathic practitioners through video calls for personalized advice and treatment plans.</p>
            </motion.div>
            
            <motion.div className="bg-white p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <FaLaptopMedical className="text-yellow-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Image Analysis</h3>
              <p className="text-gray-600">Upload images of your tongue, eyes, and skin for advanced diagnostic insights using our AI-powered image recognition.</p>
            </motion.div>
            
            <motion.div className="bg-white p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaChartLine className="text-red-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Health Reports</h3>
              <p className="text-gray-600">Receive comprehensive health assessments with actionable insights and personalized homeopathic recommendations.</p>
            </motion.div>
            
            <motion.div className="bg-white p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Priority Access</h3>
              <p className="text-gray-600">Get priority booking for consultations, faster response times, and dedicated support for all your healthcare needs.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does billing work?</h3>
              <p className="text-gray-600">You'll be charged immediately upon subscribing, and then on a recurring basis (monthly or yearly depending on your plan). You can cancel anytime from your account settings.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I switch between plans?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. When upgrading, we'll prorate any remaining time on your current plan. When downgrading to a lower tier, the changes will take effect at the end of your current billing period.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a refund policy?</h3>
              <p className="text-gray-600">We offer a 7-day money-back guarantee for new subscriptions. If you're not satisfied with our premium services, contact our support team within 7 days of your purchase for a full refund.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, debit cards, UPI, and net banking through our secure payment gateway.</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your health journey?</h2>
            <p className="mb-8 max-w-xl mx-auto">Join thousands of users who have improved their well-being with our premium AI-powered homeopathic care.</p>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Get {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Premium <FaArrowRight className="ml-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradePage; 