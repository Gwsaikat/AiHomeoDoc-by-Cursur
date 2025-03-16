'use client';


import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaLock, 
  FaCreditCard, 
  FaCheckCircle, 
  FaApple, 
  FaGooglePay,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaMoneyBillWave
} from 'react-icons/fa';

// Loading component for Suspense fallback
const PaymentPageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading payment details...</p>
      </div>
    </div>
  </div>
);

// Payment form component that uses useSearchParams
const PaymentForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams!.get('plan') || 'monthly';
  
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate plan price
  const planPrice = planType === 'yearly' ? 799 : 99;
  
  // Handle input change for card details
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Handle card number formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardDetails(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
    
    if (errors.cardNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!cardDetails.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!cardDetails.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      }
      
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!upiId.includes('@')) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    } else if (paymentMethod === 'netbanking') {
      if (!bank) {
        newErrors.bank = 'Please select a bank';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false);
        setPaymentSuccess(true);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }, 2000);
    }
  };
  
  // Format expiry date input (MM/YY)
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    setCardDetails(prev => ({
      ...prev,
      expiryDate: value
    }));
    
    if (errors.expiryDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.expiryDate;
        return newErrors;
      });
    }
  };
  
  // Restrict CVV to numbers only
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails(prev => ({
      ...prev,
      cvv: value
    }));
    
    if (errors.cvv) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cvv;
        return newErrors;
      });
    }
  };
  
  // Handle UPI ID change
  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
    
    if (errors.upiId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.upiId;
        return newErrors;
      });
    }
  };
  
  // Handle bank selection
  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBank(e.target.value);
    
    if (errors.bank) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.bank;
        return newErrors;
      });
    }
  };

  // Render payment success message
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaCheckCircle className="text-green-500 text-4xl" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Payment Successful!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6"
              >
                Thank you for upgrading to our {planType === 'yearly' ? 'Premium Yearly' : 'Premium Monthly'} plan!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mt-4 text-sm text-gray-500">
                  You'll be redirected to your dashboard automatically...
                </div>
                
                <Link
                  href="/dashboard"
                  className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/subscription/upgrade" className="text-gray-500 hover:text-gray-700">
              ← Back to Plans
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Secure Checkout</h1>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-6 bg-blue-500 text-white flex items-center space-x-2">
                  <FaLock />
                  <h2 className="text-lg font-medium">Secure Payment</h2>
                </div>
                
                <div className="p-6">
                  {/* Payment Method Selector */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h3>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 px-4 border rounded-md flex items-center justify-center space-x-2 ${
                          paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FaCreditCard className={paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-400'} />
                        <span className={paymentMethod === 'card' ? 'font-medium text-blue-700' : 'text-gray-700'}>Card</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 py-3 px-4 border rounded-md flex items-center justify-center space-x-2 ${
                          paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FaGooglePay className={paymentMethod === 'upi' ? 'text-blue-500' : 'text-gray-400'} />
                        <span className={paymentMethod === 'upi' ? 'font-medium text-blue-700' : 'text-gray-700'}>UPI</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`flex-1 py-3 px-4 border rounded-md flex items-center justify-center space-x-2 ${
                          paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FaMoneyBillWave className={paymentMethod === 'netbanking' ? 'text-blue-500' : 'text-gray-400'} />
                        <span className={paymentMethod === 'netbanking' ? 'font-medium text-blue-700' : 'text-gray-700'}>NetBanking</span>
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    {/* Credit Card Form */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <div>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={cardDetails.cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19} // 16 digits + 3 spaces
                              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                            )}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <FaCcVisa className="text-blue-800 text-2xl" />
                            <FaCcMastercard className="text-red-600 text-2xl" />
                            <FaCcAmex className="text-blue-500 text-2xl" />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={cardDetails.cardName}
                            onChange={handleCardInputChange}
                            placeholder="John Doe"
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.cardName ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.cardName && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date (MM/YY)
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={cardDetails.expiryDate}
                              onChange={handleExpiryDateChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCvvChange}
                              placeholder="123"
                              maxLength={4}
                              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.cvv ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* UPI Form */}
                    {paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            id="upiId"
                            value={upiId}
                            onChange={handleUpiChange}
                            placeholder="yourname@upi"
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.upiId ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          {errors.upiId && (
                            <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-4 mt-2">
                          <FaGooglePay className="text-blue-600 text-3xl" />
                          <FaApple className="text-gray-800 text-3xl" />
                        </div>
                      </div>
                    )}
                    
                    {/* NetBanking Form */}
                    {paymentMethod === 'netbanking' && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Bank
                          </label>
                          <select
                            id="bank"
                            value={bank}
                            onChange={handleBankChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.bank ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select your bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="pnb">Punjab National Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                          </select>
                          {errors.bank && (
                            <p className="mt-1 text-sm text-red-600">{errors.bank}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-5 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                          <>Pay ₹{planPrice}</>
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center">
                      <FaLock className="text-gray-400 text-sm mr-2" />
                      <p className="text-xs text-gray-500">Your payment is secured with SSL encryption</p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">
                      {planType === 'yearly' ? 'Premium Yearly Plan' : 'Premium Monthly Plan'}
                    </span>
                    <span className="font-medium">₹{planPrice}</span>
                  </div>
                  
                  {planType === 'yearly' && (
                    <div className="flex justify-between mb-4 text-green-600 text-sm">
                      <span>Yearly savings</span>
                      <span className="font-medium">₹{(99 * 12) - 799}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{planPrice}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {planType === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                    </p>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Subscription Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2 text-sm text-gray-600">Advanced AI health tracking</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2 text-sm text-gray-600">Personalized medicine suggestions</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2 text-sm text-gray-600">
                          {planType === 'yearly' ? '10' : '5'} video consultations
                        </span>
                      </li>
                      {planType === 'yearly' && (
                        <li className="flex items-start">
                          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="ml-2 text-sm text-gray-600">Exclusive seasonal health guides</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageLoading />}>
      <PaymentForm />
    </Suspense>
  );
} 