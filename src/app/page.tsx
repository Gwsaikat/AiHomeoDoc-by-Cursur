'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, FaArrowRight, FaStethoscope, FaLaptopMedical, 
  FaFileMedical, FaVideo, FaChartLine, FaDiagnoses, FaPills, 
  FaStar, FaLeaf, FaHeart, FaBrain, FaShieldAlt, FaUsers, FaUserMd, FaCalendarCheck, FaHeartbeat, FaGlobe, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaChevronRight, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCookieBite, FaExclamationTriangle, FaFileContract, FaCreditCard, FaUndoAlt, FaHeadset, FaCheck, FaClock, FaAward, FaUserCheck, FaLock, FaCalendarAlt, FaGift, FaSearch
} from 'react-icons/fa';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Type definitions
type FloatingIconProps = {
  icon: React.ElementType;
  color: string;
  delay?: number;
  scale?: number;
};

// Enhanced floating animation variants - simplified for performance
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-3, 3, -3], // Reduced range for smoother animation
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "linear" // Changed to linear for better performance
    }
  }
};

// Enhanced particle animation - optimized for performance
const Particle = ({ delay = 0, size = 2, color = "blue" }) => {
  // Memoize size and color classes to prevent recomputation
  const sizeClass = useMemo(() => {
    return size <= 1 ? "w-1 h-1" : size <= 2 ? "w-2 h-2" : "w-3 h-3";
  }, [size]);
  
  const colorClass = useMemo(() => {
    return color === "blue" ? "bg-blue-400" : 
           color === "indigo" ? "bg-indigo-400" : "bg-purple-400";
  }, [color]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0],
        scale: [0, 1.2, 0],
        y: -40,
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "linear" // Linear easing is more performance-friendly
      }}
      className={`absolute ${sizeClass} rounded-full ${colorClass} blur-sm`}
      style={{ willChange: 'transform, opacity' }}
    />
  );
};

// Floating Icon component - optimized for performance
const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, color, delay = 0, scale = 1 }) => {
  return (
    <motion.div
      variants={floatingAnimation}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      className={`absolute ${color} text-2xl`}
      style={{ 
        transform: `scale(${scale})`,
        willChange: 'transform'
      }}
    >
      <Icon />
    </motion.div>
  );
};

// Enhanced Hero section with mobile optimization
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  const headlines = [
    'AI-Powered Homeopathic Care',
    'Future of Natural Healing',
    'Personalized Health Solutions'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden bg-black" style={{ contain: 'paint layout size' }}>
      {/* Optimized 3D background with fewer animations */}
      <div className="absolute inset-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        {/* Simplified gradient mesh with fewer animations */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 20%, rgba(139, 92, 246, 0.1) 40%, rgba(0, 0, 0, 0) 60%)',
            opacity: 0.8,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.3) 0%, rgba(217, 70, 239, 0.2) 20%, rgba(139, 92, 246, 0.1) 40%, rgba(0, 0, 0, 0) 60%)',
            opacity: 0.8,
          }}
        />

        {/* Static neural network background */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#neuralPatternGradient)" />
          </svg>
        </div>

        {/* Simplified glowing orb */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            opacity: 0.6,
          }}
        />
      </div>

      {/* Reduced static particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.2,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Simplified 3D grid - static */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none hidden sm:block">
        <div className="h-full w-full" 
             style={{
               backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               backgroundPosition: 'center',
               perspective: '1000px',
               transform: 'rotateX(60deg)',
               transformOrigin: 'bottom',
             }}>
        </div>
      </div>

      {/* Main content with mobile optimization */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="relative">
          {/* Title card with mobile optimization */}
          <div
            className="relative backdrop-blur-xl bg-white/10 p-4 sm:p-8 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px 5px rgba(99, 102, 241, 0.2)',
              transform: 'translateZ(0)',
            }}
          >
            {/* Static glow accent */}
            <div
              className="absolute -inset-2 opacity-30"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.7) 0%, transparent 70%)',
              }}
            />

            {/* Fixed height headlines container with mobile optimization */}
            <div className="h-[80px] sm:h-[110px] flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-center relative"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-300 to-purple-200">
                    {headlines[currentText]}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Subtitle with mobile optimization */}
            <p className="text-base sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-indigo-200 max-w-3xl mx-auto text-center leading-relaxed font-medium px-2 sm:px-4">
              Experience the perfect harmony of ancient wisdom and modern technology
              for personalized, holistic healthcare solutions.
            </p>
          </div>

          {/* CTA buttons with mobile optimization */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
              <Link
                href="/auth"
                className="relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 transform transition-all duration-200 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <span className="ml-2 sm:ml-3">
                    <FaArrowRight />
                  </span>
                </span>
              </Link>
            </div>

            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
              <Link
                href="/auth"
                className="relative w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full text-white border border-indigo-500/50 bg-black/50 backdrop-blur-md hover:bg-black/70 transform transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats cards with mobile optimization */}
          <div className="mt-12 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Active Users', value: '10,000+', icon: FaUsers },
              { label: 'Success Rate', value: '95%', icon: FaChartLine },
              { label: 'Expert Doctors', value: '100+', icon: FaUserMd },
              { label: 'Daily Consultations', value: '500+', icon: FaCalendarCheck }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="relative group h-[120px] sm:h-[140px]"
                style={{ transform: 'translateZ(0)' }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 h-full overflow-hidden">                  
                  <div className="flex flex-col items-center justify-center h-full relative z-10">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                      <stat.icon className="text-white text-base sm:text-xl" />
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-indigo-200 mt-0.5 sm:mt-1 font-medium text-center">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static wave background */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,128L48,154.7C96,181,192,235,288,224C384,213,480,139,576,128C672,117,768,171,864,197.3C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

// Enhanced feature card animation variants
const featureCardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
    scale: 0.9
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

// Enhanced feature hover animation
const featureHoverVariants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: {
    scale: 1.05,
    y: -5,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98
  }
};

// Enhanced Features section component
const FeaturesSection = () => {
  const features = [
    {
      icon: FaStethoscope,
      title: "AI Symptom Analysis",
      description: "Our advanced AI analyzes your symptoms to provide accurate homeopathic remedy suggestions.",
      color: "blue",
      gradient: "from-blue-500 to-indigo-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-100", 
      delay: 0
    },
    {
      icon: FaLaptopMedical,
      title: "Smart Image Analysis",
      description: "Upload images of your tongue, nails, and eyes for detailed health insights.",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-100", 
      delay: 0.1
    },
    {
      icon: FaFileMedical,
      title: "Personalized Health Reports",
      description: "Get detailed health reports with personalized homeopathic recommendations.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-100", 
      delay: 0.2
    },
    {
      icon: FaVideo,
      title: "Expert Consultations",
      description: "Connect with qualified homeopathic practitioners through video consultations.",
      color: "rose",
      gradient: "from-rose-500 to-red-500",
      textColor: "text-rose-600",
      bgColor: "bg-rose-100", 
      delay: 0.3
    },
    {
      icon: FaChartLine,
      title: "Health Tracking",
      description: "Monitor your health progress and treatment effectiveness over time.",
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-100", 
      delay: 0.4
    },
    {
      icon: FaDiagnoses,
      title: "Lifestyle Recommendations",
      description: "Get AI-powered dietary and lifestyle suggestions to complement your treatment.",
      color: "indigo",
      gradient: "from-indigo-500 to-violet-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-100", 
      delay: 0.5
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Enhanced background decoration - reduced for performance */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium px-4 py-1 rounded-full mb-4 inline-block">
              Revolutionary Features
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
            Experience the Future of Healthcare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform combines ancient homeopathic wisdom with cutting-edge technology
            to provide you with personalized care and treatment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureCardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              <motion.div
                variants={featureHoverVariants}
                initial="initial"
              whileHover="hover"
              whileTap="tap"
                className="h-full"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transform-gpu transition-all duration-200">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/90 rounded-2xl backdrop-blur-sm opacity-80"></div>
                  
                  {/* Background decoration - simplified for performance */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full opacity-10 blur-2xl`}></div>
                  
                  {/* Content */}
                  <div className="relative">
              <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    >
                      <feature.icon className="text-white text-2xl" />
                    </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                    <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                    {/* Fixed Learn More button with explicit color classes */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6"
                    >
                      <motion.button
                        whileHover={{ x: 5 }}
                        className={`flex items-center ${feature.textColor} font-medium`}
                      >
                        Learn more
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="ml-2"
                        >
                          <FaArrowRight className={feature.textColor} />
                        </motion.span>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <Link
            href="/auth"
              className="relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200"
          >
            Start Your Healing Journey
            <FaArrowRight className="ml-3" />
          </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced testimonials section component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      image: "/testimonials/sarah.jpg",
      quote: "The AI-powered diagnosis was incredibly accurate. It helped me find the right homeopathic treatment faster than ever before.",
      rating: 5,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "Dr. Michael Chen",
      role: "Homeopathic Doctor",
      image: "/testimonials/michael.jpg",
      quote: "This platform has revolutionized how I practice. The AI assistance helps me make more informed decisions for my patients.",
      rating: 5,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Priya Patel",
      role: "Regular User",
      image: "/testimonials/priya.jpg",
      quote: "I love how the app tracks my progress and suggests personalized remedies. It's like having a homeopath in my pocket!",
      rating: 5,
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-20, -40],
              x: Math.random() * 20 - 10,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium px-4 py-1 rounded-full mb-4 inline-block">
              Success Stories
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community about how AI-powered homeopathy has transformed their healthcare journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/50 h-full"
              >
                {/* Decorative elements */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${testimonial.gradient} rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${testimonial.gradient} rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}></div>

                <div className="relative">
                  {/* Quote icon with animation */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -top-4 -left-4"
                  >
                    <svg
                      className="h-8 w-8 text-blue-400 transform -rotate-12"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  </motion.div>

                  {/* Enhanced rating stars with animation */}
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                      >
                        <FaStar className="text-yellow-400 text-xl mx-0.5 drop-shadow" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote with gradient background */}
                  <div className="relative">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 text-lg mb-6 italic relative z-10"
                    >
                    "{testimonial.quote}"
                    </motion.p>
                  </div>

                  {/* Author with enhanced styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center mt-8"
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-1">{testimonial.name}</h4>
                      <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{testimonial.role}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <Link
            href="/testimonials"
              className="relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-blue-600 bg-white border-2 border-blue-500/50 hover:bg-blue-50 transform transition-all duration-200"
          >
            Read More Success Stories
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="ml-3" />
              </motion.span>
          </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

// Counter animation component
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2 }) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  
  React.useEffect(() => {
    const node = nodeRef.current;
    const targetValue = parseInt(value.replace(/,/g, ''));
    let startTime: number | null = null;
    
    const updateCounter = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      if (node) {
        node.textContent = Math.floor(targetValue * progress).toLocaleString();
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, [value, duration]);
  
  return <span ref={nodeRef}>0</span>;
};

// Statistics section component
const StatisticsSection = () => {
  const stats = [
    {
      value: "50,000",
      label: "Active Users",
      icon: FaUsers,
      color: "blue"
    },
    {
      value: "95",
      label: "Success Rate",
      suffix: "%",
      icon: FaChartLine,
      color: "green"
    },
    {
      value: "150",
      label: "Expert Doctors",
      suffix: "+",
      icon: FaUserMd,
      color: "purple"
    },
    {
      value: "25,000",
      label: "Consultations",
      suffix: "+",
      icon: FaCalendarCheck,
      color: "indigo"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming healthcare through the power of AI and homeopathy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden group"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-${stat.color}-100 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`text-${stat.color}-500 text-3xl`} />
                  </div>

                  {/* Counter */}
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      <AnimatedCounter value={stat.value} />
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>

                {/* Decorative elements */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-50 rounded-full -mr-16 -mt-16 opacity-50`}></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-${stat.color}-50 rounded-full -ml-12 -mb-12 opacity-50`}></div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional stats in a row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaHeartbeat className="text-3xl" />
              <span className="text-3xl font-bold">98%</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Patient Satisfaction</h3>
            <p className="text-blue-100">Based on user feedback and reviews</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaChartLine className="text-3xl" />
              <span className="text-3xl font-bold">85%</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Recovery Rate</h3>
            <p className="text-purple-100">Improved symptoms within 3 months</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaGlobe className="text-3xl" />
              <span className="text-3xl font-bold">20+</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Countries Served</h3>
            <p className="text-green-100">Global reach and impact</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section component with premium design
const SubscriptionSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'monthly' | 'yearly'>('monthly');
  const [showModal, setShowModal] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Calculate yearly savings
  const monthlyPrice = 99;
  const yearlyPrice = 799;
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;
  const savingsPercentage = 33;

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Reduced number of particles for better performance
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      key: i,
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 opacity-40"></div>
          <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-overlay filter blur-3xl"
        />
              </div>

      {/* Reduced floating particles for better performance */}
      {particles.map((particle) => (
        <motion.div
          key={particle.key}
          className="absolute rounded-full bg-white"
          style={{
            width: particle.width,
            height: particle.height,
            left: particle.left,
            top: particle.top,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Simplified glowing orbs */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(159,122,234,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(159,122,234,0) 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
            Limited Time Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Health Journey Today
            </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Join thousands who have already discovered the power of AI-driven homeopathic care.
            <span className="block mt-2 font-medium">The sooner you start, the sooner you'll feel better.</span>
            </p>
          </motion.div>

          {/* Plan selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl inline-flex shadow-xl">
              <button 
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                selectedPlan === 'trial' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setSelectedPlan('trial')}
            >
              24-Hour Trial
              </button>
              <button 
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                selectedPlan === 'monthly' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
                onClick={() => setSelectedPlan('monthly')}
              >
              Monthly
              </button>
              <button 
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                selectedPlan === 'yearly' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
                onClick={() => setSelectedPlan('yearly')}
              >
              Yearly
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Save 33%
              </span>
              </button>
            </div>
          </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Trial Card - Fixed shape issues */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 h-full ${
              selectedPlan === 'trial' ? 'ring-4 ring-yellow-400 shadow-xl scale-105' : 'opacity-85 shadow-lg'
            }`}
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    24-Hour Trial
                </h3>
                  <p className="mt-2 text-gray-300">
                    Experience the full power of AI homeopathy
                  </p>
                  </div>
                <div className="bg-yellow-400/30 p-3 rounded-full">
                  <FaClock className="text-yellow-300 text-xl" />
              </div>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">
                    Free
                </span>
              </div>
                <p className="mt-1 text-gray-300 text-sm">
                  Full access for 24 hours
                </p>
              </div>
            </div>

            <div className="p-8 bg-white h-full flex flex-col">
              <ul className="space-y-4 flex-grow">
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Complete platform access</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">1 detailed health report</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Symptom analysis</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Basic recommendations</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg"
                  onClick={() => setShowModal(true)}
                >
                  Start Free Trial
                </motion.button>
                <p className="mt-3 text-xs text-center text-gray-500">
                  No credit card required
                </p>
                      </div>
                      </div>
          </motion.div>

          {/* Monthly Plan Card - Fixed white background issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 h-full ${
              selectedPlan === 'monthly' ? 'ring-4 ring-indigo-400 shadow-xl scale-105' : 'opacity-85 shadow-lg'
            }`}
          >
            <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Premium Monthly
                  </h3>
                  <p className="mt-2 text-blue-100">
                    Flexible monthly access
                  </p>
                      </div>
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-full shadow-lg">
                  <FaCalendarAlt className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">
                    ₹99
                  </span>
                  <span className="ml-1 text-xl font-medium text-indigo-100">
                    /mo
                  </span>
                </div>
                <p className="mt-1 text-indigo-100 text-sm">
                  Billed monthly
                </p>
              </div>
            </div>
            
            <div className="p-8 bg-white h-full flex flex-col">
              <ul className="space-y-4 flex-grow">
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Unlimited AI symptom analysis</span>
                    </li>
                    <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">3 detailed reports/month</span>
                    </li>
                    <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">1 expert consultation/month</span>
                    </li>
                    <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Personalized remedy suggestions</span>
                    </li>
                    <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Progress tracking</span>
                    </li>
                    <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Email support</span>
                    </li>
              </ul>

              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg"
                >
                  Get Started Now
                </motion.button>
                <p className="mt-3 text-xs text-center text-gray-500">
                  Cancel anytime, no long-term commitment
                </p>
              </div>
            </div>
          </motion.div>

          {/* Yearly Plan Card - Best Value */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`rounded-2xl overflow-hidden transition-all duration-300 relative h-full ${
              selectedPlan === 'yearly' ? 'ring-4 ring-yellow-400 shadow-xl scale-105' : 'opacity-85 shadow-lg'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Enhanced best value badge */}
            <div className="absolute top-0 right-0 z-10">
              <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black font-bold px-4 py-1 transform rotate-45 translate-x-[30%] translate-y-[50%] shadow-lg">
                BEST VALUE
                  </div>
                </div>

            <div className="bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-900 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Premium Yearly
                  </h3>
                  <p className="mt-2 text-purple-100">
                    Maximum savings & benefits
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform">
                  <FaAward className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-white to-yellow-500">
                    ₹799
                  </span>
                  <span className="ml-1 text-xl font-medium text-purple-100">
                    /yr
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-xs font-bold text-black shadow-md">
                    Save 33%
                  </span>
                  <span className="text-yellow-300 text-sm">₹{yearlySavings} savings</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-white h-full flex flex-col">
              <ul className="space-y-4 flex-grow">
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Everything in monthly plan</span>
                    </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">
                    <span className="font-semibold text-indigo-700">UNLIMITED</span> detailed health reports
                  </span>
                    </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">
                    <span className="font-semibold text-indigo-700">6</span> expert consultations/year
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Priority 24/7 support</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">Family account (up to 4 members)</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-yellow-600 font-medium">Exclusive seasonal health guides</span>
                    </li>
                  </ul>
              
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 shadow-lg relative overflow-hidden mb-6"
                >
                  {isHovering && (
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">Get Maximum Savings</span>
                </motion.button>
                <p className="mt-3 text-xs text-center text-gray-500 mb-6">
                  30-day money-back guarantee
                </p>

                {/* Added green tag at bottom */}
                <div className="mt-auto">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-5 py-2 rounded-md shadow-lg flex items-center border border-green-400/30">
                    <FaCheckCircle className="mr-2 text-green-200" />
                    First month free with yearly plan
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
        </div>

        {/* Enhanced Pay as you go options with more colors and attractive UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {/* Health Reports Box - Enhanced with more vibrant gradient */}
          <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-700 rounded-2xl p-0.5 shadow-xl overflow-hidden">
            <div className="backdrop-blur-md rounded-2xl p-8 h-full flex flex-col bg-white/5 relative overflow-hidden">
              {/* Enhanced background effects */}
              <div className="absolute top-0 right-0 rounded-full w-40 h-40 bg-pink-500 filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 rounded-full w-40 h-40 bg-purple-500 filter blur-3xl opacity-20 animate-pulse"></div>
              
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
                  <FaFileMedical className="text-white text-2xl" />
                  </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Detailed AI Health Reports</h3>
                  <p className="text-pink-100 text-sm">Pay per report, no subscription required</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-6 relative z-10">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold text-white">₹19</div>
                  <span className="text-lg font-normal text-pink-200 ml-1">/report</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 text-xs font-semibold text-black shadow-md">Save 70% with yearly plan</div>
              </div>
              <p className="text-white mb-8 relative z-10 flex-grow">Comprehensive health analysis with personalized remedy recommendations based on your symptoms and health data.</p>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-medium text-base relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-80 hover:opacity-90 transition-opacity"></span>
                <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-white/20 to-transparent blur top-1/2 left-0 right-0 h-[1px]"></span>
                <span className="relative z-10 text-white flex items-center justify-center">
                  Purchase Report
                  <FaArrowRight className="ml-2" />
                </span>
              </motion.button>
            </div>
          </div>

          {/* Expert Consultations Box - Enhanced with more vibrant gradient */}
          <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-2xl p-0.5 shadow-xl overflow-hidden">
            <div className="backdrop-blur-md rounded-2xl p-8 h-full flex flex-col bg-white/5 relative overflow-hidden">
              {/* Enhanced background effects */}
              <div className="absolute top-0 right-0 rounded-full w-40 h-40 bg-teal-500 filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 rounded-full w-40 h-40 bg-emerald-500 filter blur-3xl opacity-20 animate-pulse"></div>
              
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-teal-400 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform">
                  <FaVideo className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Expert Video Consultations</h3>
                  <p className="text-teal-100 text-sm">Pay per session, speak with real experts</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold text-white">₹29</div>
                  <span className="text-lg font-normal text-teal-200 ml-1">/session</span>
                </div>
                <div className="ml-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-xs font-semibold text-black shadow-md whitespace-nowrap">
                  Free sessions with yearly plan
                </div>
              </div>
              <p className="text-white mb-8 relative z-10 flex-grow">Connect with qualified homeopathic practitioners through secure video consultations for personalized advice and treatment plans.</p>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-medium text-base relative overflow-hidden mb-6"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80 hover:opacity-90 transition-opacity"></span>
                <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-white/20 to-transparent blur top-1/2 left-0 right-0 h-[1px]"></span>
                <span className="relative z-10 text-white flex items-center justify-center">
                  Book Consultation
                  <FaArrowRight className="ml-2" />
                </span>
              </motion.button>
              
              {/* Green tag at bottom of white area */}
              <div className="mt-auto">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-md shadow-md flex items-center">
                  <FaCheckCircle className="mr-2 text-green-200" />
                  First session free with new sign up
                </div>
              </div>
                </div>
              </div>
            </motion.div>

        {/* Social proof and guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mx-auto max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaShieldAlt className="text-white text-xl" />
        </div>
              <div>
                <h4 className="text-white font-medium">30-Day Guarantee</h4>
                <p className="text-indigo-100 text-sm">Full refund if not satisfied</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaUserCheck className="text-white text-xl" />
              </div>
              <div>
                <h4 className="text-white font-medium">10,000+ Users</h4>
                <p className="text-indigo-100 text-sm">Join our growing community</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaLock className="text-white text-xl" />
              </div>
              <div>
                <h4 className="text-white font-medium">Secure & Private</h4>
                <p className="text-indigo-100 text-sm">Your data stays protected</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Start Your Transformation Today
          </h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Don't wait for your health to deteriorate. Take control now with AI-powered homeopathic care.
            <span className="block mt-2">
              <span className="font-semibold text-yellow-300">95%</span> of our users report significant improvements within <span className="font-semibold text-yellow-300">30 days</span>.
            </span>
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
              <Link 
                href="/auth" 
              className="relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-indigo-700 bg-white hover:bg-gray-50 shadow-2xl transform transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                Get Started Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ rotate: isHovering ? [0, 5, -5, 0] : 0 }}
                transition={{ duration: 0.5 }}
              />
              </Link>
          </motion.div>
          <p className="mt-4 text-indigo-200 text-sm">
            Your journey to better health is just one click away
          </p>
          </motion.div>
        </div>
      </section>
  );
};

// New Health Services component with symmetrically designed cards
const HealthServicesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background effects remain the same */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
        />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 40%)' 
        }} />
            </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Path to Wellness
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our AI-powered solutions provide personalized healthcare experiences tailored to your specific needs
          </p>
        </motion.div>

        {/* Main cards container with fixed heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Cards with identical structure and fixed heights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-700 h-[350px]"
          >
            <div className="flex flex-col h-full">
              <div className="p-8 pb-4">
              <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaUserMd className="text-white text-3xl" />
                    </motion.div>
                </div>
                  <h3 className="ml-4 text-2xl font-bold text-white">AI Doctor Consultation</h3>
              </div>
              
                <p className="text-lg text-blue-100">
                  Get instant AI-powered health analysis and homeopathic treatment recommendations
                </p>
              </div>
              
              {/* Fixed button container */}
              <div className="mt-auto p-8 pt-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <a 
                    href="/consultation"
                    className="block w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/consultation';
                    }}
                  >
                    <button 
                      className="w-full h-[56px] bg-white hover:bg-blue-50 text-blue-600 font-medium rounded-xl flex items-center justify-center transition-all duration-300 group shadow-xl"
                    >
                      <motion.span
                        className="flex items-center"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <FaStethoscope className="mr-2" />
                        Start Consultation
                        <motion.div
                          className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                          transition={{ duration: 0.2 }}
                        >
                          <FaArrowRight />
                        </motion.div>
                      </motion.span>
                    </button>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Health Analyzer Card - identical structure */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-500 to-teal-700 h-[350px]"
          >
            <div className="flex flex-col h-full">
              <div className="p-8 pb-4">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FaHeartbeat className="text-white text-3xl" />
                    </motion.div>
            </div>
                  <h3 className="ml-4 text-2xl font-bold text-white">Health Analyzer</h3>
            </div>
            
                <p className="text-lg text-emerald-100">
                  Advanced symptom analysis and personalized wellness plan generation
                </p>
                  </div>
              
              {/* Fixed button container - identical to above */}
              <div className="mt-auto p-8 pt-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <a 
                    href="/analyzer"
                    className="block w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/analyzer';
                    }}
                  >
                    <button 
                      className="w-full h-[56px] bg-white hover:bg-green-50 text-emerald-600 font-medium rounded-xl flex items-center justify-center transition-all duration-300 group shadow-xl"
                    >
                      <motion.span
                        className="flex items-center"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <FaSearch className="mr-2" />
                        Analyze My Health
                        <motion.div
                          className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                          transition={{ duration: 0.2 }}
                        >
                          <FaArrowRight />
                        </motion.div>
                      </motion.span>
                    </button>
                  </a>
                </motion.div>
                  </div>
                  </div>
          </motion.div>
                  </div>
                  </div>
    </section>
  );
};

// Client-side only wrapper component to prevent hydration issues
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <>{children}</>;
};

export default function HomePage() {
  return (
    <ClientOnly>
      <div className="bg-white">
        <HeroSection />
        <HealthServicesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <StatisticsSection />
        <SubscriptionSection />
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
          {/* Footer content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <p className="text-center text-gray-400">© {new Date().getFullYear()} AI Homeopathy. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </ClientOnly>
  );
}
