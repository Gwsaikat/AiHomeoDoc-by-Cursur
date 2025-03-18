'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPills, FaClipboardList, FaFileMedical, FaLungs, FaHeartbeat, FaBrain, FaLeaf, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';

// Interface for the modal props
interface PrescriptionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prescriptionData: PrescriptionFormData) => void;
}

// Interface for the form data
export interface PrescriptionFormData {
  medicationName: string;
  isRefill: boolean;
  refillMedication?: string;
  dosage: string;
  frequency: string;
  additionalInformation: string;
  urgency: 'normal' | 'urgent';
}

// Interface for medication options
interface Medication {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
}

// Sample homeopathic medications
const sampleMedications: Medication[] = [
  { id: '1', name: 'Arnica Montana', category: 'Trauma/Injury', icon: <FaHeartbeat className="text-red-500" /> },
  { id: '2', name: 'Bryonia Alba', category: 'Respiratory', icon: <FaLungs className="text-blue-500" /> },
  { id: '3', name: 'Rhus Toxicodendron', category: 'Musculoskeletal', icon: <FaLeaf className="text-green-500" /> },
  { id: '4', name: 'Nux Vomica', category: 'Digestive', icon: <FaFileMedical className="text-yellow-500" /> },
  { id: '5', name: 'Belladonna', category: 'Fever/Inflammation', icon: <FaHeartbeat className="text-orange-500" /> },
  { id: '6', name: 'Gelsemium', category: 'Nervous System', icon: <FaBrain className="text-purple-500" /> },
  { id: '7', name: 'Pulsatilla', category: 'Emotional/Women\'s Health', icon: <FaLeaf className="text-pink-500" /> },
  { id: '8', name: 'Arsenicum Album', category: 'Digestive/Anxiety', icon: <FaFileMedical className="text-teal-500" /> }
];

// Common dosage options
const dosageOptions = [
  '6C', '12C', '30C', '200C', '1M', 'Q1', 'Q3', 'Q6'
];

// Common frequency options
const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'As needed',
  'Before meals',
  'After meals',
  'Before bedtime'
];

const PrescriptionRequestModal: React.FC<PrescriptionRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isRefill, setIsRefill] = useState(false);
  const [refillMedication, setRefillMedication] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [customMedication, setCustomMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [customDosage, setCustomDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [customFrequency, setCustomFrequency] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRefillChange = (value: boolean) => {
    setIsRefill(value);
    // Reset medication selection if changing between refill and new prescription
    setMedicationName('');
    setRefillMedication('');
  };

  const handleMedicationSelect = (id: string) => {
    setMedicationName(id);
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const validateForm = () => {
    if (isRefill) {
      return refillMedication.trim() !== '';
    } else {
      return (medicationName !== '' || customMedication.trim() !== '');
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Prepare the form data
    const formData: PrescriptionFormData = {
      medicationName: isRefill 
        ? refillMedication 
        : (medicationName ? sampleMedications.find(m => m.id === medicationName)?.name || '' : customMedication),
      isRefill,
      refillMedication: isRefill ? refillMedication : undefined,
      dosage: dosage ? (dosage === 'custom' ? customDosage : dosage) : '',
      frequency: frequency ? (frequency === 'custom' ? customFrequency : frequency) : '',
      additionalInformation,
      urgency
    };
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form and close after showing success message
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setIsRefill(false);
    setRefillMedication('');
    setMedicationName('');
    setCustomMedication('');
    setDosage('');
    setCustomDosage('');
    setFrequency('');
    setCustomFrequency('');
    setAdditionalInformation('');
    setUrgency('normal');
    setStep(1);
    setIsSuccess(false);
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800/30 backdrop-blur-sm transition-opacity">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div className="fixed inset-0" onClick={handleClose}></div>
          
          <motion.div 
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full">
                    <FaPills className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-white">
                    Request Prescription
                  </h3>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      step === 1 ? 'bg-white' : 'bg-white/30'
                    } transition-colors`}
                  ></div>
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      step === 2 ? 'bg-white' : 'bg-white/30'
                    } transition-colors`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-6">
              {/* Step 1: Medication Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Prescription Type</h4>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <motion.div
                        className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                          !isRefill ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'
                        }`}
                        onClick={() => handleRefillChange(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                            <FaFileMedical className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">New Prescription</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                          isRefill ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'
                        }`}
                        onClick={() => handleRefillChange(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                            <FaClipboardList className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">Medication Refill</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {isRefill ? (
                    <div className="space-y-3">
                      <h4 className="text-base font-medium text-gray-900">
                        Enter medication to refill
                      </h4>
                      <div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter medication name"
                          value={refillMedication}
                          onChange={(e) => setRefillMedication(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900">
                        Select a medication
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                        {sampleMedications.map((medication, index) => (
                          <motion.div
                            key={medication.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              medicationName === medication.id 
                                ? 'border-emerald-500 bg-emerald-50' 
                                : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                            }`}
                            onClick={() => handleMedicationSelect(medication.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15, delay: index * 0.05 }}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                                {medication.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{medication.name}</p>
                                <p className="text-xs text-gray-500">{medication.category}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Or enter a custom medication
                        </h4>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter medication name"
                          value={customMedication}
                          onChange={(e) => setCustomMedication(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Step 2: Prescription Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-center mb-4">
                    <button onClick={handleBack} className="text-emerald-600 mr-3">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h4 className="text-lg font-medium text-gray-900">Prescription Details</h4>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <FaPills className="text-emerald-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          {isRefill ? 'Refill Request' : 'New Prescription Request'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {isRefill ? refillMedication : (medicationName ? sampleMedications.find(m => m.id === medicationName)?.name : customMedication)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Dosage Selection */}
                    <div>
                      <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage
                      </label>
                      <select
                        id="dosage"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                      >
                        <option value="">Select dosage</option>
                        {dosageOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                        <option value="custom">Custom</option>
                      </select>
                      
                      {dosage === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="mt-2"
                        >
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter custom dosage"
                            value={customDosage}
                            onChange={(e) => setCustomDosage(e.target.value)}
                          />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Frequency Selection */}
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <select
                        id="frequency"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                      >
                        <option value="">Select frequency</option>
                        {frequencyOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                        <option value="custom">Custom</option>
                      </select>
                      
                      {frequency === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="mt-2"
                        >
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter custom frequency"
                            value={customFrequency}
                            onChange={(e) => setCustomFrequency(e.target.value)}
                          />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Additional Information */}
                    <div>
                      <label htmlFor="additional-info" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="additional-info"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Any special instructions or additional details"
                        value={additionalInformation}
                        onChange={(e) => setAdditionalInformation(e.target.value)}
                      />
                    </div>
                    
                    {/* Urgency Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                            checked={urgency === 'normal'}
                            onChange={() => setUrgency('normal')}
                          />
                          <span className="ml-2 text-sm text-gray-700">Normal</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                            checked={urgency === 'urgent'}
                            onChange={() => setUrgency('urgent')}
                          />
                          <span className="ml-2 text-sm text-gray-700">Urgent</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Request Submitted!</h4>
                  <p className="text-sm text-gray-600">
                    Your prescription request has been successfully submitted.
                  </p>
                </motion.div>
              )}
            </div>
            
            {/* Footer with action buttons */}
            {!isSuccess && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain layout
                )}
                
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!validateForm()}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                      !validateForm()
                        ? 'bg-emerald-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    } flex items-center`}
                  >
                    Continue
                    <FaArrowRight className="ml-2 h-3 w-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                      isSubmitting
                        ? 'bg-emerald-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    } flex items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <FaArrowRight className="ml-2 h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default PrescriptionRequestModal; 