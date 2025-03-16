'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaRobot, FaUser, FaPaperPlane, FaSpinner } from 'react-icons/fa';

// Define the Message type to match the API
type Message = {
  role: 'user' | 'ai';
  content: string;
};

const ConsultationPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Welcome to AI Doctor Consultation. How can I help you today? Please describe your symptoms or health concerns.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Make API call to get AI response
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: userMessage.content }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = { role: 'ai', content: data.message };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        { 
          role: 'ai', 
          content: 'I apologize, but I encountered an error processing your request. Please try again or check your connection.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/" className="mr-4 hover:opacity-80 transition-opacity">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-xl font-bold">AI Doctor Consultation</h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-xl mt-8 mb-24 min-h-[70vh] flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                <div className="flex items-center mb-2">
                  {message.role === 'ai' ? (
                    <div className="bg-blue-100 p-2 rounded-full mr-2">
                      <FaRobot className="text-blue-600" />
                    </div>
                  ) : (
                    <div className="bg-white p-2 rounded-full ml-2 order-2">
                      <FaUser className="text-blue-600" />
                    </div>
                  )}
                  <span className={`font-medium ${message.role === 'user' ? 'order-1 mr-2' : ''}`}>
                    {message.role === 'ai' ? 'AI Doctor' : 'You'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-2">
                    <FaRobot className="text-blue-600" />
                  </div>
                  <span className="font-medium">AI Doctor</span>
                </div>
                <div className="mt-2 flex items-center">
                  <FaSpinner className="animate-spin text-blue-600 mr-2" />
                  <span>Analyzing your symptoms...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your symptoms..."
              className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
              disabled={isLoading || !inputValue.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationPage; 