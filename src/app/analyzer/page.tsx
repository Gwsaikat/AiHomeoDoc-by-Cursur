'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaArrowLeft, FaSearch, FaCheck, FaExclamationTriangle, 
  FaHeartbeat, FaLungs, FaBrain, FaTablets, FaAllergies,
  FaBone, FaTemperatureHigh, FaWeight, FaBed, FaClock,
  FaCalendarAlt, FaPills, FaUtensils, FaArrowRight
} from 'react-icons/fa';

// Define types for our form data
type FormData = {
  primarySymptom: string;
  bodyArea: string;
  additionalSymptoms: string[];
  duration: string;
  severity: string;
  factors: string[];
};

// Define type for analysis result
type AnalysisResult = {
  potentialConditions: Array<{ condition: string; probability: number }>;
  recommendedRemedies: Array<{ name: string; description: string }>;
  lifestyleRecommendations: string[];
  dietarySuggestions: string[];
  followUpRecommendation: string;
};

const HealthAnalyzerPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    primarySymptom: '',
    bodyArea: '',
    additionalSymptoms: [],
    duration: '',
    severity: '5',
    factors: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Common symptoms list for checkboxes
  const commonSymptoms = [
    'Fatigue', 'Headache', 'Nausea', 'Dizziness', 'Fever',
    'Cough', 'Shortness of breath', 'Joint pain', 'Muscle aches',
    'Loss of appetite', 'Insomnia', 'Anxiety', 'Depression'
  ];

  // Body areas for selection
  const bodyAreas = [
    'Head', 'Chest', 'Abdomen', 'Back', 'Arms', 
    'Legs', 'Joints', 'Skin', 'General/Systemic'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (symptom: string) => {
    setFormData(prev => {
      const currentSymptoms = [...prev.additionalSymptoms];
      if (currentSymptoms.includes(symptom)) {
        return { ...prev, additionalSymptoms: currentSymptoms.filter(s => s !== symptom) };
      } else {
        return { ...prev, additionalSymptoms: [...currentSymptoms, symptom] };
      }
    });
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, severity: e.target.value }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const submitAnalysis = async () => {
    // Validation
    if (!formData.primarySymptom || !formData.bodyArea) {
      setValidationError('Please enter your primary symptom and affected body area');
      return;
    }
    
    setIsAnalyzing(true);
    setValidationError('');
    
    try {
      // Make API call to analyzer endpoint
      const response = await fetch('/api/analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const analysisData = await response.json();
      
      if (!analysisData) {
        throw new Error('No analysis data received');
      }
      
      // Update analysis result with API response
      setAnalysisResult(analysisData);
      setResultsVisible(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Unable to complete the health analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fallback function to generate analysis if API fails
  const generateFallbackAnalysis = (data: FormData): AnalysisResult => {
    // Create a basic fallback analysis
    const result: AnalysisResult = {
      potentialConditions: [],
      recommendedRemedies: [],
      lifestyleRecommendations: [
        'Practice deep breathing exercises for 10 minutes daily',
        'Ensure consistent sleep schedule (7-8 hours per night)',
        'Moderate physical activity for 30 minutes, 5 times per week',
        'Regular hydration with filtered water'
      ],
      dietarySuggestions: [
        'Increase intake of anti-inflammatory foods (berries, leafy greens)',
        'Reduce processed foods and refined sugars',
        'Consider adding turmeric and ginger to meals',
        'Stay well hydrated with 8-10 glasses of water daily'
      ],
      followUpRecommendation: 'Monitor symptoms for 7 days. If symptoms persist or worsen, consider scheduling a consultation with a homeopathic practitioner.'
    };

    // Add some basic condition and remedy analysis based on symptoms
    if (data.primarySymptom.toLowerCase().includes('headache')) {
      result.potentialConditions = [
        { condition: 'Tension Headache', probability: 75 },
        { condition: 'Migraine', probability: 45 }
      ];
      result.recommendedRemedies = [
        { name: 'Natrum Muriaticum 30C', description: 'For headaches associated with stress or emotional upset.' },
        { name: 'Bryonia 6C', description: 'For headaches that worsen with movement.' }
      ];
    } else if (data.primarySymptom.toLowerCase().includes('cough') || data.additionalSymptoms.includes('Cough')) {
      result.potentialConditions = [
        { condition: 'Common Cold', probability: 85 },
        { condition: 'Seasonal Allergies', probability: 50 }
      ];
      result.recommendedRemedies = [
        { name: 'Oscillococcinum', description: 'For early onset of cold symptoms.' },
        { name: 'Bryonia 30C', description: 'For dry, painful cough that worsens with movement.' }
      ];
    } else {
      result.potentialConditions = [
        { condition: 'Stress-Related Condition', probability: 65 },
        { condition: 'Vitamin Deficiency', probability: 40 }
      ];
      result.recommendedRemedies = [
        { name: 'Arsenicum Album 30C', description: 'For anxiety and restlessness with exhaustion.' },
        { name: 'Gelsemium 6C', description: 'For fatigue with muscle weakness.' }
      ];
    }
    
    return result;
  };

  // Render form steps
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Primary Symptoms</h2>
            
            {/* Add validation error message */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {validationError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">What is your main symptom or concern?</label>
                <input
                  type="text"
                  name="primarySymptom"
                  value={formData.primarySymptom}
                  onChange={handleInputChange}
                  placeholder="E.g., Headache, Cough, Fatigue..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Which area of your body is affected?</label>
                <select
                  name="bodyArea"
                  value={formData.bodyArea}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select body area</option>
                  {bodyAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  How severe is the symptom? (1-10)
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Mild</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.severity}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-sm text-gray-500">Severe</span>
                </div>
                <div className="text-center mt-1 font-medium">
                  {formData.severity}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">How long have you been experiencing this?</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="E.g., 2 days, 1 week, several months..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={() => {
                  if (formData.primarySymptom && formData.bodyArea) {
                    setValidationError('');
                    setStep(2);
                  } else {
                    setValidationError('Please enter your primary symptom and affected body area');
                  }
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center disabled:opacity-50 disabled:hover:bg-emerald-600"
              >
                Next <FaCheck className="ml-2" />
              </button>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Symptoms</h2>
            
            <div>
              <label className="block text-gray-700 mb-3">Do you have any of these additional symptoms? (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {commonSymptoms.map(symptom => (
                  <div key={symptom} className="flex items-center">
                    <input
                      type="checkbox"
                      id={symptom}
                      checked={formData.additionalSymptoms.includes(symptom)}
                      onChange={() => handleCheckboxChange(symptom)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor={symptom} className="ml-2 text-gray-700">{symptom}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Are there any specific triggers that worsen your symptoms?</label>
              <textarea
                name="factors"
                value={formData.factors.join(', ')}
                onChange={(e) => setFormData({...formData, factors: e.target.value.split(', ')})}
                placeholder="E.g., certain foods, stress, weather changes..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">What helps alleviate your symptoms?</label>
              <textarea
                name="factors"
                value={formData.factors.join(', ')}
                onChange={(e) => setFormData({...formData, factors: e.target.value.split(', ')})}
                placeholder="E.g., rest, cold compress, specific positions..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                Next <FaCheck className="ml-2" />
              </button>
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical History</h2>
            
            <div>
              <label className="block text-gray-700 mb-2">Do you have any relevant medical history or chronic conditions?</label>
              <textarea
                name="factors"
                value={formData.factors.join(', ')}
                onChange={(e) => setFormData({...formData, factors: e.target.value.split(', ')})}
                placeholder="E.g., asthma, high blood pressure, previous injuries..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Are you currently taking any medications or supplements?</label>
              <textarea
                name="factors"
                value={formData.factors.join(', ')}
                onChange={(e) => setFormData({...formData, factors: e.target.value.split(', ')})}
                placeholder="E.g., vitamins, prescription medications, herbal remedies..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
              />
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-blue-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> This assessment is not a replacement for professional medical advice. 
                    If you're experiencing severe or life-threatening symptoms, please seek immediate medical attention.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              <button
                type="button"
                onClick={submitAnalysis}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
              >
                {isAnalyzing ? (
                  <>Analyzing <span className="ml-2 animate-pulse">...</span></>
                ) : (
                  <>Analyze My Health <FaSearch className="ml-2" /></>
                )}
              </button>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-emerald-700 mb-2">Your Health Analysis</h2>
              <p className="text-gray-600">Based on your symptom assessment</p>
            </div>

            {resultsVisible && analysisResult && (
              <>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <FaHeartbeat className="mr-2" /> Potential Conditions
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {analysisResult.potentialConditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{condition.condition}</span>
                          <div className="flex items-center">
                            <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-emerald-600 h-2.5 rounded-full" 
                                style={{ width: `${condition.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{condition.probability}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Note: These are potential conditions based on your symptoms and are not definitive diagnoses.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <FaPills className="mr-2" /> Recommended Homeopathic Remedies
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {analysisResult.recommendedRemedies.map((remedy, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                          <h4 className="font-semibold text-indigo-700">{remedy.name}</h4>
                          <p className="text-gray-600 mt-1">{remedy.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <FaBed className="mr-2" /> Lifestyle Recommendations
                      </h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-2">
                        {analysisResult.lifestyleRecommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <FaCheck className="text-purple-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <FaUtensils className="mr-2" /> Dietary Suggestions
                      </h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-2">
                        {analysisResult.dietarySuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <FaCheck className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                    <FaCalendarAlt className="mr-2 text-blue-600" /> Follow-up Recommendation
                  </h3>
                  <p className="text-gray-700">{analysisResult.followUpRecommendation}</p>
                </div>

                <div className="flex justify-between mt-8">
                  <Link href="/" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to Home
                  </Link>
                  <Link 
                    href="/consultation" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Consult with AI Doctor <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/" className="mr-4 hover:opacity-80 transition-opacity">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-xl font-bold">Health Analyzer</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl mt-8 mb-16">
        {/* Progress Bar for steps 1-3 */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {['Symptoms', 'Additional Info', 'Medical History'].map((label, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center w-1/3 ${index + 1 < step ? 'text-emerald-600' : index + 1 === step ? 'text-emerald-800 font-medium' : 'text-gray-400'}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      index + 1 < step ? 'bg-emerald-500 text-white' : index + 1 === step ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1 < step ? <FaCheck /> : index + 1}
                  </div>
                  <span className="text-sm hidden sm:block">{label}</span>
                </div>
              ))}
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="absolute h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        {renderStep()}
      </div>
    </div>
  );
};

export default HealthAnalyzerPage; 