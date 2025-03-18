import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Homeopathic remedies database (expanded from existing one)
const homeopathicRemedies = {
  headache: [
    { remedy: 'Natrum Muriaticum 30C', dosage: '3 pellets, 3 times daily', duration: '7 days', description: 'For headaches associated with stress or emotional upset.' },
    { remedy: 'Bryonia 6C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For headaches that worsen with movement.' },
    { remedy: 'Belladonna 30C', dosage: '3 pellets, every 4 hours', duration: '3 days', description: 'For throbbing headaches with sudden onset.' },
    { remedy: 'Gelsemium 30C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For headaches with dull pain, especially at the back of the head.' }
  ],
  stress: [
    { remedy: 'Argentum Nitricum 30C', dosage: '3 pellets, twice daily', duration: '10 days', description: 'For anxiety with anticipation and nervousness.' },
    { remedy: 'Arsenicum Album 30C', dosage: '3 pellets, twice daily', duration: '7 days', description: 'For anxiety and restlessness with exhaustion.' },
    { remedy: 'Ignatia 30C', dosage: '3 pellets, twice daily', duration: '14 days', description: 'For emotional stress and mood swings.' },
    { remedy: 'Phosphorus 30C', dosage: '3 pellets, twice daily', duration: '7 days', description: 'For anxiety with oversensitivity to external stimuli.' }
  ],
  sleep: [
    { remedy: 'Coffea Cruda 30C', dosage: '3 pellets, 30 minutes before bedtime', duration: '10 days', description: 'For insomnia due to an overactive mind.' },
    { remedy: 'Passiflora Incarnata 30C', dosage: '3 pellets, 30 minutes before bedtime', duration: '14 days', description: 'For restless sleep and difficulty falling asleep.' },
    { remedy: 'Avena Sativa 30C', dosage: '3 pellets, before bedtime', duration: '14 days', description: 'For insomnia due to nervous exhaustion.' },
    { remedy: 'Nux Vomica 30C', dosage: '3 pellets, before bedtime', duration: '7 days', description: 'For insomnia after overindulgence or stimulants.' }
  ],
  digestive: [
    { remedy: 'Nux Vomica 30C', dosage: '3 pellets, after meals', duration: '5 days', description: 'For digestive issues related to overindulgence or stress.' },
    { remedy: 'Lycopodium 6C', dosage: '3 pellets, twice daily', duration: '7 days', description: 'For bloating and gas, especially in the afternoon.' },
    { remedy: 'Arsenicum Album 30C', dosage: '3 pellets, 3 times daily', duration: '3 days', description: 'For digestive upset with burning pain and anxiety.' },
    { remedy: 'Pulsatilla 30C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For digestive issues with changeable symptoms and emotional component.' }
  ],
  respiratory: [
    { remedy: 'Oscillococcinum', dosage: '1 dose, 3 times daily', duration: '2 days', description: 'For early onset of cold symptoms.' },
    { remedy: 'Bryonia 30C', dosage: '3 pellets, 4 times daily', duration: '5 days', description: 'For dry, painful cough that worsens with movement.' },
    { remedy: 'Phosphorus 6C', dosage: '3 pellets, 3 times daily', duration: '7 days', description: 'For persistent cough with chest tightness.' },
    { remedy: 'Drosera 30C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For spasmodic coughing, especially at night.' }
  ],
  musculoskeletal: [
    { remedy: 'Arnica Montana 30C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For soreness, bruising, and physical trauma.' },
    { remedy: 'Rhus Toxicodendron 30C', dosage: '3 pellets, 3 times daily', duration: '7 days', description: 'For stiffness that improves with movement.' },
    { remedy: 'Ruta Graveolens 30C', dosage: '3 pellets, 3 times daily', duration: '7 days', description: 'For injuries to tendons and ligaments.' },
    { remedy: 'Bryonia 30C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For joint pain that worsens with movement.' }
  ],
  skin: [
    { remedy: 'Apis Mellifica 30C', dosage: '3 pellets, 4 times daily', duration: '3 days', description: 'For swelling, redness, and stinging pain.' },
    { remedy: 'Graphites 30C', dosage: '3 pellets, twice daily', duration: '14 days', description: 'For cracked, dry skin with oozing honey-like discharge.' },
    { remedy: 'Sulphur 30C', dosage: '3 pellets, once daily', duration: '10 days', description: 'For itchy, burning skin conditions, worse with heat.' },
    { remedy: 'Urtica Urens 30C', dosage: '3 pellets, 3 times daily', duration: '5 days', description: 'For hives and burning skin conditions.' }
  ]
};

// Lifestyle recommendations based on condition categories
const lifestyleRecommendations = {
  headache: [
    'Stay well hydrated, aiming for at least 2 liters of water daily',
    'Practice stress reduction techniques like deep breathing or meditation for 15 minutes daily',
    'Maintain regular sleep patterns with 7-8 hours of sleep per night',
    'Reduce screen time and take frequent breaks from digital devices',
    'Consider maintaining a headache diary to identify personal triggers'
  ],
  stress: [
    'Practice daily meditation or mindfulness for 10-20 minutes',
    'Engage in regular physical activity like walking or yoga',
    'Establish a consistent sleep routine',
    'Limit caffeine and alcohol consumption',
    'Spend time in nature regularly'
  ],
  sleep: [
    'Establish a regular sleep schedule, even on weekends',
    'Create a calming bedtime routine without screens 1 hour before sleep',
    'Keep your bedroom cool, dark, and quiet',
    'Avoid caffeine after noon and limit alcohol consumption',
    'Consider herbal teas like chamomile or valerian before bedtime'
  ],
  digestive: [
    'Eat smaller, more frequent meals throughout the day',
    'Chew food thoroughly and eat slowly',
    'Stay well hydrated between meals rather than during meals',
    'Incorporate probiotics from fermented foods or supplements',
    'Identify and avoid personal food triggers'
  ],
  respiratory: [
    'Use a humidifier to maintain proper humidity levels',
    'Stay well hydrated to thin mucus secretions',
    'Practice steam inhalation with a few drops of eucalyptus oil',
    'Elevate your head while sleeping to improve breathing',
    'Avoid known allergens and irritants'
  ],
  musculoskeletal: [
    'Apply alternating hot and cold compresses to affected areas',
    'Practice gentle stretching exercises daily',
    'Maintain proper posture during daily activities',
    'Consider ergonomic adjustments to your work environment',
    'Incorporate anti-inflammatory foods like turmeric and omega-3 fatty acids'
  ],
  skin: [
    'Use gentle, fragrance-free cleansers',
    'Keep skin well moisturized, especially after bathing',
    'Avoid hot water and opt for lukewarm showers',
    'Wear breathable, natural fabrics like cotton',
    'Stay well hydrated and consider adding omega-3 fatty acids to your diet'
  ]
};

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' },
        { status: 401 }
      );
    }
    
    // Get request data
    const requestData = await request.json();
    const { responses } = requestData;
    
    if (!responses) {
      return NextResponse.json({ 
        error: 'Invalid request: responses object is required'
      }, { status: 400 });
    }

    // Check if responses has any meaningful content
    const hasContent = Object.values(responses).some(
      value => typeof value === 'string' && value.trim().length > 0
    );
    
    // If there's no real content, provide a default response
    if (!hasContent) {
      const defaultResult = {
        diagnosis: "Based on the limited information provided, I cannot provide a detailed analysis. For a more accurate assessment, please provide more details about your symptoms and health concerns.",
        recommendations: [
          { 
            remedy: "Consultation", 
            dosage: "N/A", 
            duration: "N/A", 
            description: "Please complete the consultation with more detailed information about your symptoms."
          }
        ],
        lifestyle: [
          "Maintain a balanced diet rich in fruits and vegetables",
          "Stay hydrated by drinking 8-10 glasses of water daily",
          "Ensure you get 7-8 hours of quality sleep each night"
        ],
        followUp: "as soon as possible",
        categories: ["general"]
      };
      
      try {
        // Still save the empty consultation to keep track of user activity
        await supabase
          .from('ai_consultations')
          .insert({
            user_id: session.user.id,
            consultation_data: responses,
            analysis_result: defaultResult,
            created_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error saving empty consultation:', error);
      }
      
      return NextResponse.json(defaultResult);
    }
    
    // Process consultation data to determine health issues
    const analysisResult = analyzeConsultationResponses(responses);
    
    // Save consultation record to database
    const { data: consultation, error: savingError } = await supabase
      .from('ai_consultations')
      .insert({
        user_id: session.user.id,
        consultation_data: responses,
        analysis_result: analysisResult,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (savingError) {
      console.error('Error saving consultation to database:', savingError);
      // Continue with returning the result even if saving fails
    }
    
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('AI Doctor consultation error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI consultation' },
      { status: 500 }
    );
  }
}

function analyzeConsultationResponses(responses: any) {
  // Determine primary health categories from symptoms
  const categories = determineHealthCategories(responses);
  
  // Select appropriate remedies from the top categories
  const recommendations = selectRemedies(categories);
  
  // Select lifestyle recommendations
  const lifestyle = selectLifestyleRecommendations(categories);
  
  // Create diagnosis text
  const diagnosis = generateDiagnosis(responses, categories);
  
  // Determine appropriate follow-up time
  const followUpTime = determineFollowUpTime(categories);
  
  const result = {
    diagnosis,
    recommendations,
    lifestyle,
    followUp: followUpTime,
    categories
  };
  
  console.log("AI Doctor API Response:", result);
  
  return result;
}

function determineHealthCategories(responses: any) {
  const categories: Record<string, number> = {
    headache: 0,
    stress: 0,
    sleep: 0,
    digestive: 0,
    respiratory: 0,
    musculoskeletal: 0,
    skin: 0
  };
  
  // Analyze main symptoms
  if (responses.mainSymptoms) {
    const symptoms = responses.mainSymptoms.toLowerCase();
    
    if (symptoms.includes('headache') || symptoms.includes('migraine') || symptoms.includes('head pain')) {
      categories.headache += 3;
    }
    
    if (symptoms.includes('stress') || symptoms.includes('anxiety') || symptoms.includes('worry') || 
        symptoms.includes('tension') || symptoms.includes('nervous')) {
      categories.stress += 3;
    }
    
    if (symptoms.includes('sleep') || symptoms.includes('insomnia') || symptoms.includes('tired') || 
        symptoms.includes('fatigue') || symptoms.includes('exhaustion')) {
      categories.sleep += 3;
    }
    
    if (symptoms.includes('stomach') || symptoms.includes('digest') || symptoms.includes('nausea') || 
        symptoms.includes('bloat') || symptoms.includes('bowel') || symptoms.includes('constipation') || 
        symptoms.includes('diarrhea')) {
      categories.digestive += 3;
    }
    
    if (symptoms.includes('cough') || symptoms.includes('breathe') || symptoms.includes('cold') || 
        symptoms.includes('congestion') || symptoms.includes('sinus') || symptoms.includes('throat') ||
        symptoms.includes('flu')) {
      categories.respiratory += 3;
    }
    
    if (symptoms.includes('pain') || symptoms.includes('ache') || symptoms.includes('joint') || 
        symptoms.includes('muscle') || symptoms.includes('sprain') || symptoms.includes('strain') ||
        symptoms.includes('back')) {
      categories.musculoskeletal += 3;
    }
    
    if (symptoms.includes('skin') || symptoms.includes('rash') || symptoms.includes('itch') || 
        symptoms.includes('eczema') || symptoms.includes('hives') || symptoms.includes('dry') ||
        symptoms.includes('acne')) {
      categories.skin += 3;
    }
  }
  
  // Analyze symptom intensity
  if (responses.symptomIntensity) {
    const intensity = parseInt(responses.symptomIntensity);
    // Increase scores for high intensity symptoms
    Object.keys(categories).forEach(category => {
      if (categories[category] > 0 && intensity > 7) {
        categories[category] += 2;
      }
    });
  }
  
  // Analyze stress level
  if (responses.stressLevel) {
    const stressLevel = parseInt(responses.stressLevel);
    if (stressLevel > 6) {
      categories.stress += 3;
      // Stress often affects sleep and can trigger headaches
      categories.sleep += 1;
      categories.headache += 1;
    }
  }
  
  // Analyze sleep patterns
  if (responses.sleepPattern) {
    const sleepPattern = responses.sleepPattern.toLowerCase();
    if (sleepPattern.includes('trouble') || sleepPattern.includes('difficult') || 
        sleepPattern.includes('poor') || sleepPattern.includes('insomnia') ||
        sleepPattern.includes('wake up') || sleepPattern.includes('can\'t sleep')) {
      categories.sleep += 3;
      // Poor sleep often affects stress levels
      categories.stress += 1;
    }
  }
  
  // Sort categories by score and get top 3
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .filter(category => category[1] > 0)
    .slice(0, 3)
    .map(category => category[0]);
  
  return sortedCategories;
}

function selectRemedies(categories: string[]) {
  const recommendations: any[] = [];
  
  // Get 1-2 remedies from each of the top categories
  categories.forEach(category => {
    const categoryRemedies = homeopathicRemedies[category as keyof typeof homeopathicRemedies] || [];
    
    // Take up to 2 remedies from this category
    const selectedRemedies = categoryRemedies.slice(0, 2);
    recommendations.push(...selectedRemedies);
  });
  
  // Limit to max 4 remedies total to avoid overwhelming the patient
  return recommendations.slice(0, 4);
}

function selectLifestyleRecommendations(categories: string[]) {
  const recommendations: string[] = [];
  
  // Get 2 lifestyle recommendations from each of the top categories
  categories.forEach(category => {
    const categoryRecommendations = lifestyleRecommendations[category as keyof typeof lifestyleRecommendations] || [];
    
    // Take 2 random recommendations from this category
    if (categoryRecommendations.length > 0) {
      const shuffled = [...categoryRecommendations].sort(() => 0.5 - Math.random());
      recommendations.push(...shuffled.slice(0, 2));
    }
  });
  
  // Limit to max 6 lifestyle recommendations
  return recommendations.slice(0, 6);
}

function generateDiagnosis(responses: any, categories: string[]) {
  let diagnosis = "Based on your consultation responses, ";
  
  if (categories.length === 0) {
    return diagnosis + "I don't have enough information to provide a clear analysis. Please provide more details about your symptoms or consult with a healthcare professional for a more accurate assessment.";
  }
  
  diagnosis += "you appear to be experiencing ";
  
  // Add symptom intensity if available
  if (responses.symptomIntensity) {
    const intensity = parseInt(responses.symptomIntensity);
    if (intensity >= 8) {
      diagnosis += "severe ";
    } else if (intensity >= 5) {
      diagnosis += "moderate ";
    } else {
      diagnosis += "mild ";
    }
  }
  
  // Add category descriptions
  if (categories.length === 1) {
    diagnosis += `symptoms related to ${formatCategoryName(categories[0])}.`;
  } else if (categories.length === 2) {
    diagnosis += `symptoms related to ${formatCategoryName(categories[0])} and ${formatCategoryName(categories[1])}.`;
  } else {
    diagnosis += `symptoms primarily related to ${formatCategoryName(categories[0])}, with additional concerns related to ${formatCategoryName(categories[1])} and ${formatCategoryName(categories[2])}.`;
  }
  
  // Add duration if available
  if (responses.symptomDuration) {
    diagnosis += ` These symptoms have been present for ${responses.symptomDuration.toLowerCase()}.`;
  }
  
  // Add stress component if applicable
  if (responses.stressLevel && parseInt(responses.stressLevel) > 6) {
    diagnosis += " Your current stress levels appear to be elevated, which may be exacerbating your symptoms.";
  }
  
  // Add sleep component if applicable
  if (responses.sleepPattern && responses.sleepPattern.toLowerCase().includes('poor')) {
    diagnosis += " Your sleep patterns may also be contributing to your current health state.";
  }
  
  diagnosis += " The recommended homeopathic remedies and lifestyle adjustments are tailored to address these specific concerns.";
  
  return diagnosis;
}

function formatCategoryName(category: string) {
  const categoryMappings: Record<string, string> = {
    headache: "headache or head pain",
    stress: "stress and anxiety",
    sleep: "sleep disturbances",
    digestive: "digestive issues",
    respiratory: "respiratory symptoms",
    musculoskeletal: "musculoskeletal pain or discomfort",
    skin: "skin conditions"
  };
  
  return categoryMappings[category] || category;
}

function determineFollowUpTime(categories: string[]) {
  // Base follow-up time is 2 weeks
  let followUpTime = "2 weeks";
  
  // Adjust based on categories
  if (categories.includes("respiratory") || categories.includes("digestive")) {
    // These typically need quicker follow-up
    followUpTime = "1 week";
  } else if (categories.includes("skin") || categories.includes("musculoskeletal")) {
    // These might need longer time to see improvement
    followUpTime = "3 weeks";
  }
  
  return followUpTime;
} 