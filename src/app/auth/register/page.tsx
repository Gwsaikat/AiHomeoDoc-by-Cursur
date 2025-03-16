'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUserAlt, FaUserMd, FaHospital, FaArrowLeft, FaCheck } from 'react-icons/fa';

type UserRole = 'patient' | 'doctor' | 'clinic';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const RegisterPage = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    qualification: '',
    licenseNumber: '',
    clinicName: '',
    address: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep(2);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Role-specific validation
    if (selectedRole === 'doctor') {
      if (!formData.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    }
    
    if (selectedRole === 'clinic') {
      if (!formData.clinicName) newErrors.clinicName = 'Clinic name is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Redirect to success page
        router.push('/auth/register/success');
      }, 1500);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get role theme color
  const getRoleThemeColor = () => {
    switch (selectedRole) {
      case 'patient': return 'blue';
      case 'doctor': return 'green';
      case 'clinic': return 'purple';
      default: return 'blue';
    }
  };

  // Render role selection step
  const renderRoleSelection = () => (
    <motion.div
      className="w-full max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-3xl font-bold text-center mb-2 text-gray-800"
        variants={itemVariants}
      >
        Create Your Account
      </motion.h1>
      <motion.p 
        className="text-gray-600 text-center mb-8"
        variants={itemVariants}
      >
        Select your role to get started
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleSelect('patient')}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserAlt className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Patient</h2>
          <p className="text-gray-600 text-sm">
            Sign up as a patient to manage your health journey, book consultations, and access treatment plans
          </p>
        </motion.div>
        
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleSelect('doctor')}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Doctor</h2>
          <p className="text-gray-600 text-sm">
            Join as a homeopathy doctor to manage your patients, consultations, and access AI-assisted diagnosis
          </p>
        </motion.div>
        
        <motion.div
          className="bg-white p-8 rounded-xl shadow-lg text-center cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleRoleSelect('clinic')}
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHospital className="text-purple-600 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Clinic</h2>
          <p className="text-gray-600 text-sm">
            Register your homeopathy clinic to manage doctors, patients, appointments, and inventory
          </p>
        </motion.div>
      </div>
      
      <motion.div className="mt-8 text-center" variants={itemVariants}>
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/auth" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );

  // Render registration form
  const renderRegistrationForm = () => {
    const themeColor = getRoleThemeColor();
    
    return (
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-6">
          <button 
            onClick={goBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {selectedRole} Registration
            </h1>
            <p className="text-gray-600">Fill in your details to create your account</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Common fields for all roles */}
            <div className="space-y-4 mb-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password (min. 8 characters)"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </motion.div>
            </div>
            
            {/* Doctor-specific fields */}
            {selectedRole === 'doctor' && (
              <motion.div
                className="space-y-4 mb-6 border-t border-gray-200 pt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h3 
                  className="text-lg font-medium text-gray-800 mb-4"
                  variants={itemVariants}
                >
                  Professional Information
                </motion.h3>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                      errors.specialization ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Classical Homeopathy, Pediatric Homeopathy"
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                      errors.qualification ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., BHMS, MD (Homeopathy)"
                  />
                  {errors.qualification && (
                    <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                      errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your medical license number"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
                  )}
                </motion.div>
              </motion.div>
            )}
            
            {/* Clinic-specific fields */}
            {selectedRole === 'clinic' && (
              <motion.div
                className="space-y-4 mb-6 border-t border-gray-200 pt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h3 
                  className="text-lg font-medium text-gray-800 mb-4"
                  variants={itemVariants}
                >
                  Clinic Information
                </motion.h3>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    id="clinicName"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                      errors.clinicName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your clinic name"
                  />
                  {errors.clinicName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinicName}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your clinic address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-${themeColor}-500 focus:border-${themeColor}-500 transition-colors ${
                      errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter clinic contact number"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </motion.div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-${themeColor}-600 hover:bg-${themeColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${themeColor}-500 transition-colors`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {currentStep === 1 ? renderRoleSelection() : renderRegistrationForm()}
    </div>
  );
};

export default RegisterPage; 