import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const user = session.user;
    
    // Fetch prescriptions from the database
    const { data: prescriptions, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching prescriptions:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve prescriptions' },
        { status: 500 }
      );
    }
    
    // Format the prescriptions data for the frontend
    const formattedPrescriptions = prescriptions.map(prescription => ({
      id: prescription.id,
      name: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      startDate: new Date(prescription.start_date).toLocaleDateString(),
      endDate: prescription.end_date ? new Date(prescription.end_date).toLocaleDateString() : null,
      notes: prescription.notes,
      status: prescription.status,
      isRefillNeeded: prescription.refill_needed,
      doctorName: prescription.doctor_name,
      createdAt: prescription.created_at
    }));
    
    return NextResponse.json({
      prescriptions: formattedPrescriptions
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 