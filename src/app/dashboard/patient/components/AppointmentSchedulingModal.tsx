'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUserMd, FaMapMarkerAlt, FaVideo, FaClipboardList, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';

// Interface for the modal props
interface AppointmentSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: AppointmentFormData) => void;
}

// Interface for the form data
export interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  isVirtual: boolean;
}

// Interface for doctor data
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image?: string;
  availability?: { date: string; slots: string[] }[];
}

// Sample doctors data
const sampleDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'General Homeopathy',
    image: '/images/doctors/doctor1.jpg',
    availability: [
      { date: '2024-03-20', slots: ['09:00', '10:00', '14:00', '15:00'] },
      { date: '2024-03-21', slots: ['11:00', '13:00', '16:00'] },
      { date: '2024-03-22', slots: ['09:00', '10:00', '11:00', '14:00'] }
    ]
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Pediatric Homeopathy',
    image: '/images/doctors/doctor2.jpg',
    availability: [
      { date: '2024-03-20', slots: ['10:00', '11:00', '15:00'] },
      { date: '2024-03-21', slots: ['09:00', '13:00', '14:00', '16:30'] },
      { date: '2024-03-22', slots: ['10:30', '13:30', '16:00'] }
    ]
  },
  {
    id: '3',
    name: 'Dr. Aisha Patel',
    specialty: 'Constitutional Homeopathy',
    image: '/images/doctors/doctor3.jpg',
    availability: [
      { date: '2024-03-20', slots: ['11:30', '12:30', '16:30'] },
      { date: '2024-03-21', slots: ['10:00', '11:00', '15:00'] },
      { date: '2024-03-22', slots: ['09:30', '12:00', '14:30'] }
    ]
  }
];

// Available time slots for scheduling
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

const AppointmentSchedulingModal: React.FC<AppointmentSchedulingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isVirtual, setIsVirtual] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate available dates for the next 10 days
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }
    setAvailableDates(dates);
  }, []);

  // Reset available times when a doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setAvailableTimes(timeSlots);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDoctor, selectedDate]);

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Submit the appointment data
      onSubmit({
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason,
        isVirtual
      });
      
      // Reset form and close after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
        onClose();
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setIsVirtual(false);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get selected doctor details
  const getSelectedDoctorDetails = () => {
    return sampleDoctors.find(doctor => doctor.id === selectedDoctor);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800/30 backdrop-blur-sm transition-opacity">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div className="fixed inset-0" onClick={onClose}></div>
          
          <motion.div 
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full">
                    <FaCalendarAlt className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-white">
                    Schedule Appointment
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 flex items-center justify-between">
                {[1, 2, 3, 4].map(stepNumber => (
                  <div key={stepNumber} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stepNumber < step ? 'bg-green-500' : 
                        stepNumber === step ? 'bg-white' : 'bg-white/30'
                      } transition-colors`}
                    >
                      {stepNumber < step ? (
                        <FaCheck className="h-4 w-4 text-white" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          stepNumber === step ? 'text-indigo-600' : 'text-white/70'
                        }`}>{stepNumber}</span>
                      )}
                    </div>
                    <span className="text-xs mt-1 text-white/80">
                      {stepNumber === 1 ? 'Doctor' : 
                       stepNumber === 2 ? 'Date' : 
                       stepNumber === 3 ? 'Time' : 'Details'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-6">
              {/* Step 1: Select Doctor */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Select a Doctor</h4>
                  <div className="space-y-3 mb-6">
                    {sampleDoctors.map(doctor => (
                      <motion.div
                        key={doctor.id}
                        className={`p-3 border rounded-xl cursor-pointer transition-all ${
                          selectedDoctor === doctor.id 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                        }`}
                        onClick={() => handleDoctorSelect(doctor.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                            {doctor.image ? (
                              <div className="w-full h-full bg-gray-300 rounded-full"></div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                                <FaUserMd className="text-indigo-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <h5 className="text-base font-medium text-gray-900">{doctor.name}</h5>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Select Date */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <button onClick={handleBack} className="text-indigo-600 mr-3">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h4 className="text-lg font-medium text-gray-900">Select a Date</h4>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FaUserMd className="text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          {getSelectedDoctorDetails()?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {getSelectedDoctorDetails()?.specialty}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                    {availableDates.map((date, index) => (
                      <motion.button
                        key={date}
                        className={`py-3 px-4 rounded-lg text-center ${
                          selectedDate === date 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={() => handleDateSelect(date)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <p className="text-xs mb-1">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="font-medium">
                          {new Date(date).getDate()}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Select Time */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <button onClick={handleBack} className="text-indigo-600 mr-3">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h4 className="text-lg font-medium text-gray-900">Select a Time</h4>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <FaUserMd className="text-indigo-600 h-4 w-4" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {getSelectedDoctorDetails()?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <FaCalendarAlt className="text-indigo-600 h-4 w-4" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(selectedDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {availableTimes.map((time, index) => (
                      <motion.button
                        key={time}
                        className={`py-2 px-3 rounded-lg text-center ${
                          selectedTime === time 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={() => handleTimeSelect(time)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                      >
                        <p className="text-sm">{time}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step 4: Appointment Details */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    <button onClick={handleBack} className="text-indigo-600 mr-3">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h4 className="text-lg font-medium text-gray-900">Appointment Details</h4>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <FaUserMd className="text-indigo-600 h-4 w-4" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {getSelectedDoctorDetails()?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {getSelectedDoctorDetails()?.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <FaCalendarAlt className="text-indigo-600 h-4 w-4" />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(selectedDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {selectedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for visit
                      </label>
                      <textarea
                        id="reason"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Please describe your symptoms or reason for this appointment"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={isVirtual}
                          onChange={(e) => setIsVirtual(e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          This will be a virtual appointment
                        </span>
                      </label>
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
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Appointment Scheduled!</h4>
                  <p className="text-sm text-gray-600">
                    Your appointment has been successfully scheduled.
                  </p>
                </motion.div>
              )}
            </div>
            
            {/* Footer with action buttons */}
            {!isSuccess && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                {step > 1 ? (
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
                
                {step === 4 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !reason}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                      isSubmitting || !reason
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
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
                        Schedule Appointment
                        <FaArrowRight className="ml-2 h-3 w-3" />
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AppointmentSchedulingModal; 