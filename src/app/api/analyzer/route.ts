import { NextResponse } from 'next/server';

// Type for form data
type SymptomFormData = {
  primarySymptom: string;
  bodyArea: string;
  additionalSymptoms?: string[];
  duration?: string;
  severity?: string;
  factors?: string[];
};

// Type for analysis results
type AnalysisResult = {
  potentialConditions: Array<{ condition: string; probability: number }>;
  recommendedRemedies: Array<{ name: string; description: string }>;
  lifestyleRecommendations: string[];
  dietarySuggestions: string[];
  followUpRecommendation: string;
};

// Mock database of condition patterns
const conditionPatterns = {
  headache: {
    conditions: [
      { name: 'Tension Headache', keywords: ['pressure', 'stress', 'neck', 'tight'] },
      { name: 'Migraine', keywords: ['light', 'sound', 'nausea', 'aura', 'throbbing'] },
      { name: 'Cluster Headache', keywords: ['eye', 'severe', 'one side', 'recurring'] },
      { name: 'Sinus Headache', keywords: ['face', 'pressure', 'congestion', 'nose'] }
    ],
    remedies: [
      { name: 'Natrum Muriaticum', description: 'For headaches aggravated by stress with sensitivity to light' },
      { name: 'Bryonia', description: 'For headaches worse from motion, better with pressure' },
      { name: 'Belladonna', description: 'For throbbing headaches with sudden onset' },
      { name: 'Kali Bichromicum', description: 'For sinus headaches with pressure at root of nose' },
      { name: 'Gelsemium', description: 'For headaches with fatigue and dizziness' }
    ]
  },
  respiratory: {
    conditions: [
      { name: 'Common Cold', keywords: ['sneezing', 'congestion', 'mild', 'runny nose'] },
      { name: 'Seasonal Allergies', keywords: ['itchy', 'eyes', 'seasonal', 'pollen'] },
      { name: 'Bronchitis', keywords: ['cough', 'phlegm', 'chest', 'wheeze'] },
      { name: 'Asthma', keywords: ['wheeze', 'shortness of breath', 'chest tightness'] }
    ],
    remedies: [
      { name: 'Allium Cepa', description: 'For colds with watery eyes and clear nasal discharge' },
      { name: 'Arsenicum Album', description: 'For respiratory complaints worse at night, with anxiety' },
      { name: 'Bryonia', description: 'For dry, painful cough worse with motion' },
      { name: 'Pulsatilla', description: 'For colds with yellow-green discharge, better in open air' },
      { name: 'Phosphorus', description: 'For respiratory issues with dry cough and hoarseness' }
    ]
  },
  digestive: {
    conditions: [
      { name: 'Acid Reflux', keywords: ['heartburn', 'burning', 'after eating', 'lying down'] },
      { name: 'Irritable Bowel Syndrome', keywords: ['cramping', 'alternating', 'diarrhea', 'constipation', 'stress'] },
      { name: 'Food Intolerance', keywords: ['bloating', 'after eating', 'gas', 'specific foods'] },
      { name: 'Gastritis', keywords: ['burning', 'stomach pain', 'nausea'] }
    ],
    remedies: [
      { name: 'Nux Vomica', description: 'For digestive upset from overindulgence or stress' },
      { name: 'Lycopodium', description: 'For bloating and gas, worse in afternoon/evening' },
      { name: 'Carbo Vegetabilis', description: 'For bloating with need to burp' },
      { name: 'Arsenicum Album', description: 'For burning pains and food poisoning with anxiety' },
      { name: 'Colocynthis', description: 'For abdominal cramps better from pressure' }
    ]
  },
  stress: {
    conditions: [
      { name: 'Acute Stress', keywords: ['temporary', 'event', 'overwhelming', 'recent'] },
      { name: 'Chronic Stress', keywords: ['long-term', 'ongoing', 'fatigue', 'sleep issues'] },
      { name: 'Anxiety', keywords: ['worry', 'nervous', 'overthinking', 'restless'] },
      { name: 'Burnout', keywords: ['exhaustion', 'work', 'motivation', 'tired'] }
    ],
    remedies: [
      { name: 'Aconite', description: 'For sudden, intense anxiety with fear' },
      { name: 'Argentum Nitricum', description: 'For anticipatory anxiety with racing thoughts' },
      { name: 'Ignatia', description: 'For emotional stress and mood swings' },
      { name: 'Phosphorus', description: 'For those easily startled and needing reassurance' },
      { name: 'Gelsemium', description: 'For performance anxiety with weakness and trembling' }
    ]
  }
};

// Common lifestyle recommendations
const lifestyleRecommendations = [
  'Maintain a regular sleep schedule of 7-9 hours per night',
  'Practice deep breathing or meditation for 10-15 minutes daily',
  'Engage in moderate exercise for at least 30 minutes, 5 days a week',
  'Take regular breaks when working for extended periods',
  'Limit screen time, especially before bedtime',
  'Spend time in nature regularly',
  'Keep a symptom journal to identify patterns and triggers',
  'Practice stress management techniques like yoga or tai chi',
  'Ensure proper ergonomics in your workspace',
  'Establish a relaxing bedtime routine'
];

// Common dietary suggestions
const dietarySuggestions = [
  'Stay well-hydrated with at least 8 glasses of water daily',
  'Incorporate anti-inflammatory foods like turmeric and ginger',
  'Reduce processed foods and added sugars',
  'Eat smaller, more frequent meals if digestive issues are present',
  'Include probiotics like yogurt or kefir for gut health',
  'Consider food sensitivities that may trigger symptoms',
  'Increase intake of fresh fruits and vegetables',
  'Choose whole grains over refined carbohydrates',
  'Limit caffeine and alcohol consumption',
  'Include sources of omega-3 fatty acids like flaxseed or fatty fish'
];

export async function POST(request: Request) {
  try {
    // Parse the form data from the request
    const formData: SymptomFormData = await request.json();
    
    // Validate required fields
    if (!formData.primarySymptom || !formData.bodyArea) {
      return NextResponse.json({ 
        error: 'Primary symptom and body area are required' 
      }, { status: 400 });
    }
    
    // Generate analysis result
    const analysisResult = analyzeSymptoms(formData);
    
    // Return the analysis
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error processing symptom analysis:', error);
    return NextResponse.json({ 
      error: 'Failed to process symptom analysis' 
    }, { status: 500 });
  }
}

function analyzeSymptoms(formData: SymptomFormData): AnalysisResult {
  // Initialize analysis result
  const result: AnalysisResult = {
    potentialConditions: [],
    recommendedRemedies: [],
    lifestyleRecommendations: [],
    dietarySuggestions: [],
    followUpRecommendation: ''
  };
  
  // Combine symptoms for analysis
  const allSymptoms = [
    formData.primarySymptom.toLowerCase(),
    ...(formData.additionalSymptoms || []).map(s => s.toLowerCase())
  ];
  
  // Determine condition category based on symptoms and body area
  let category: keyof typeof conditionPatterns = 'headache';
  
  if (
    formData.bodyArea.toLowerCase().includes('head') || 
    allSymptoms.some(s => s.includes('headache') || s.includes('migraine'))
  ) {
    category = 'headache';
  } else if (
    formData.bodyArea.toLowerCase().includes('chest') || 
    formData.bodyArea.toLowerCase().includes('throat') || 
    allSymptoms.some(s => 
      s.includes('cough') || s.includes('breath') || 
      s.includes('cold') || s.includes('sneez')
    )
  ) {
    category = 'respiratory';
  } else if (
    formData.bodyArea.toLowerCase().includes('stomach') || 
    formData.bodyArea.toLowerCase().includes('abdomen') || 
    allSymptoms.some(s => 
      s.includes('nausea') || s.includes('digest') || 
      s.includes('diarrhea') || s.includes('constipation')
    )
  ) {
    category = 'digestive';
  } else if (
    allSymptoms.some(s => 
      s.includes('stress') || s.includes('anxi') || 
      s.includes('worry') || s.includes('nervous')
    )
  ) {
    category = 'stress';
  }
  
  // Select potential conditions based on keywords
  const possibleConditions = conditionPatterns[category].conditions
    .filter(condition => 
      condition.keywords.some(keyword => 
        allSymptoms.some(symptom => symptom.includes(keyword))
      )
    );
  
  // If no specific matches, include all conditions from the category with lower probabilities
  if (possibleConditions.length === 0) {
    result.potentialConditions = conditionPatterns[category].conditions
      .map(condition => ({
        condition: condition.name,
        probability: Math.floor(Math.random() * 30) + 20 // 20-50% probability
      }));
  } else {
    result.potentialConditions = possibleConditions.map(condition => ({
      condition: condition.name,
      probability: Math.floor(Math.random() * 30) + 60 // 60-90% probability
    }));
  }
  
  // Sort conditions by probability (highest first)
  result.potentialConditions.sort((a, b) => b.probability - a.probability);
  
  // Select remedies from the category
  const remedies = conditionPatterns[category].remedies;
  // Get 2-3 random remedies
  const numRemedies = Math.floor(Math.random() * 2) + 2; // 2-3 remedies
  
  for (let i = 0; i < numRemedies; i++) {
    const randomIndex = Math.floor(Math.random() * remedies.length);
    const remedy = remedies[randomIndex];
    
    // Avoid duplicates
    if (!result.recommendedRemedies.some(r => r.name === remedy.name)) {
      result.recommendedRemedies.push(remedy);
    }
  }
  
  // Select 3-5 random lifestyle recommendations
  const shuffledLifestyle = [...lifestyleRecommendations].sort(() => Math.random() - 0.5);
  result.lifestyleRecommendations = shuffledLifestyle.slice(0, Math.floor(Math.random() * 3) + 3);
  
  // Select 3-4 random dietary suggestions
  const shuffledDiet = [...dietarySuggestions].sort(() => Math.random() - 0.5);
  result.dietarySuggestions = shuffledDiet.slice(0, Math.floor(Math.random() * 2) + 3);
  
  // Generate follow-up recommendation based on severity and duration
  const severity = formData.severity || 'moderate';
  const duration = formData.duration || 'recent';
  
  if (severity === 'severe' || duration === 'chronic' || duration === 'months') {
    result.followUpRecommendation = 'Given the severity and/or duration of your symptoms, it is recommended to consult with a healthcare professional within the next 1-2 days for a comprehensive evaluation.';
  } else if (severity === 'moderate' || duration === 'weeks') {
    result.followUpRecommendation = 'Consider scheduling an appointment with a healthcare provider within the next week if symptoms persist or worsen despite following the recommended remedies.';
  } else {
    result.followUpRecommendation = 'Monitor your symptoms for the next 5-7 days while trying the suggested remedies. If no improvement is noticed or if symptoms worsen, please consult with a healthcare professional.';
  }
  
  return result;
} 