import { NextResponse } from 'next/server';

// Mock database of homeopathic remedies
const homeopathicRemedies = {
  headache: [
    { name: 'Natrum Muriaticum 30C', description: 'For headaches associated with stress or emotional upset.' },
    { name: 'Bryonia 6C', description: 'For headaches that worsen with movement.' },
    { name: 'Belladonna 30C', description: 'For throbbing headaches with sudden onset.' },
    { name: 'Gelsemium 30C', description: 'For headaches with dull pain, especially at the back of the head.' }
  ],
  cough: [
    { name: 'Oscillococcinum', description: 'For early onset of cold symptoms.' },
    { name: 'Bryonia 30C', description: 'For dry, painful cough that worsens with movement.' },
    { name: 'Phosphorus 6C', description: 'For persistent cough with chest tightness.' },
    { name: 'Drosera 30C', description: 'For spasmodic coughing, especially at night.' }
  ],
  digestive: [
    { name: 'Nux Vomica 30C', description: 'For digestive issues related to overindulgence or stress.' },
    { name: 'Lycopodium 6C', description: 'For bloating and gas, especially in the afternoon.' },
    { name: 'Arsenicum Album 30C', description: 'For digestive upset with burning pain and anxiety.' }
  ],
  stress: [
    { name: 'Argentum Nitricum 30C', description: 'For anxiety with anticipation and nervousness.' },
    { name: 'Arsenicum Album 30C', description: 'For anxiety and restlessness with exhaustion.' },
    { name: 'Ignatia 30C', description: 'For emotional stress and mood swings.' }
  ],
  sleep: [
    { name: 'Coffea Cruda 30C', description: 'For insomnia due to an overactive mind.' },
    { name: 'Passiflora Incarnata 30C', description: 'For restless sleep and difficulty falling asleep.' },
    { name: 'Avena Sativa 30C', description: 'For insomnia due to nervous exhaustion.' }
  ],
  default: [
    { name: 'Arnica Montana 30C', description: 'For soreness, bruising, and physical trauma.' },
    { name: 'Rhus Toxicodendron 30C', description: 'For stiffness that improves with movement.' },
    { name: 'Pulsatilla 30C', description: 'For symptoms that vary and change rapidly.' }
  ]
};

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export async function POST(request: Request) {
  try {
    const { userMessage } = await request.json();
    
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: userMessage is required' },
        { status: 400 }
      );
    }

    // Process user message and generate AI response
    const aiResponse = generateAIResponse(userMessage);
    
    return NextResponse.json({ 
      message: aiResponse 
    });
  } catch (error) {
    console.error('Consultation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation request' },
      { status: 500 }
    );
  }
}

function generateAIResponse(userMessage: string): string {
  // Convert message to lowercase for easier matching
  const message = userMessage.toLowerCase();
  
  // Check for common homeopathic remedy scenarios
  if (message.includes('headache') || message.includes('head pain')) {
    return "Based on your symptoms, I recommend considering Belladonna for sudden, throbbing headaches, especially with heat and redness. Bryonia may help if your headache is worse with movement and better with pressure. For stress headaches, try Natrum Muriaticum. Take 30C potency, 3 pellets under the tongue, 3 times daily. Stay hydrated and rest in a dark, quiet room. If symptoms persist beyond 3 days, please consult a healthcare professional.";
  }
  
  if (message.includes('cough') || message.includes('cold') || message.includes('flu')) {
    return "For your respiratory symptoms, Oscillococcinum may help in the early stages of flu. For dry, spasmodic coughs, Bryonia 30C is often effective. For productive coughs with yellow mucus, consider Pulsatilla 30C. Take 3 pellets under the tongue every 4 hours. Rest, stay hydrated, and consider steam inhalation with eucalyptus. If you develop high fever or difficulty breathing, seek medical attention immediately.";
  }
  
  if (message.includes('insomnia') || message.includes('sleep') || message.includes('can\'t sleep')) {
    return "For difficulty sleeping, Coffea Cruda 30C may help if your mind is overactive. Passiflora Incarnata can promote restful sleep, especially with anxiety. Take 3 pellets 30 minutes before bedtime. Establish a calming bedtime routine, avoid screens 1 hour before sleep, and consider relaxation techniques like deep breathing. If insomnia persists beyond 2 weeks, please consult a healthcare professional.";
  }
  
  if (message.includes('anxiety') || message.includes('stress') || message.includes('nervous')) {
    return "For anxiety and stress symptoms, Argentum Nitricum 30C may help with anticipatory anxiety and nervousness. Aconite is helpful for panic attacks with fear. Take 3 pellets under the tongue as needed. Practice daily mindfulness meditation, deep breathing exercises, and consider reducing caffeine intake. Regular physical activity can also help reduce stress. If symptoms become severe or interfere with daily function, please seek professional mental health support.";
  }
  
  if (message.includes('stomach') || message.includes('nausea') || message.includes('digestive')) {
    return "For digestive discomfort, Nux Vomica 30C can help with indigestion, especially after overindulgence. For nausea with specific food aversions, try Colchicum 30C. Take 3 pellets every 4 hours until symptoms improve. Stay hydrated, eat smaller, more frequent meals, and consider ginger tea. If symptoms include severe pain, blood in stool, or persist beyond 3 days, please consult a healthcare professional promptly.";
  }
  
  // Default response for other queries
  return "Thank you for sharing your health concerns. Based on homeopathic principles, I'd need to understand your specific symptoms in more detail to provide the most accurate remedy recommendation. Please describe your symptoms including when they started, what makes them better or worse, any accompanying emotional changes, and your general energy level. This will help me suggest an appropriate homeopathic treatment plan tailored to your unique situation.";
} 