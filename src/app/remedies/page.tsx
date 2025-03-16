'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FaSearch, FaFilter } from 'react-icons/fa';

// Mock remedies data
const mockRemedies = [
  {
    id: '1',
    name: 'Arnica Montana',
    description: 'For trauma, injuries, and soreness. Helps with bruising and shock.',
    potencies: ['6C', '30C', '200C', '1M'],
    mainIndications: ['Physical trauma', 'Bruising', 'Muscle soreness', 'Post-surgery recovery'],
    origin: 'Mountain daisy plant native to Europe'
  },
  {
    id: '2',
    name: 'Bryonia Alba',
    description: 'For dry, painful coughs and irritations that worsen with movement.',
    potencies: ['6C', '30C', '200C'],
    mainIndications: ['Dry cough', 'Respiratory issues', 'Joint pain', 'Headaches'],
    origin: 'White Bryony plant from Eurasia'
  },
  {
    id: '3',
    name: 'Nux Vomica',
    description: 'For digestive issues, especially those caused by overindulgence or stress.',
    potencies: ['6C', '30C', '200C', '1M'],
    mainIndications: ['Indigestion', 'Constipation', 'Hangover', 'Irritability'],
    origin: 'Seeds of the Strychnos nux-vomica tree'
  },
  {
    id: '4',
    name: 'Belladonna',
    description: 'For sudden, intense symptoms with heat, redness, and throbbing pain.',
    potencies: ['6C', '30C', '200C'],
    mainIndications: ['High fever', 'Throbbing headaches', 'Sore throat', 'Earache'],
    origin: 'Deadly Nightshade plant'
  },
  {
    id: '5',
    name: 'Rhus Toxicodendron',
    description: 'For joint and muscle stiffness that improves with motion.',
    potencies: ['6C', '30C', '200C'],
    mainIndications: ['Joint stiffness', 'Arthritis', 'Sprains', 'Skin eruptions'],
    origin: 'Poison ivy plant'
  },
  {
    id: '6',
    name: 'Pulsatilla',
    description: 'For emotional sensitivity and changeable symptoms.',
    potencies: ['6C', '30C', '200C'],
    mainIndications: ['Changeable symptoms', 'Tearfulness', 'Sinus issues', 'Menstrual problems'],
    origin: 'Windflower or Pasque flower'
  },
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Remedies' },
  { id: 'trauma', name: 'Trauma & Injury' },
  { id: 'respiratory', name: 'Respiratory' },
  { id: 'digestive', name: 'Digestive' },
  { id: 'emotional', name: 'Emotional & Mental' },
  { id: 'pain', name: 'Pain & Inflammation' },
];

export default function RemediesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter remedies based on search query
  const filteredRemedies = mockRemedies.filter(remedy => 
    remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    remedy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    remedy.mainIndications.some(indication => 
      indication.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Homeopathic Remedies</h1>
        <p className="text-gray-600">
          Explore our comprehensive database of homeopathic remedies, their uses, and effectiveness.
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search remedies by name, indication, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Remedies grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRemedies.map((remedy) => (
          <Link 
            key={remedy.id} 
            href={`/remedies/${remedy.id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{remedy.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{remedy.description}</p>
              
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Main Indications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {remedy.mainIndications.slice(0, 3).map((indication, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {indication}
                    </span>
                  ))}
                  {remedy.mainIndications.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                      +{remedy.mainIndications.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Available Potencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {remedy.potencies.map((potency, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {potency}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRemedies.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No remedies found</h3>
          <p className="text-gray-500">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
} 