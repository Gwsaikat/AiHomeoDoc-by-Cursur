import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Fetch appointments from the database
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', user.id)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve appointments' },
        { status: 500 }
      );
    }
    
    // Format the appointments data for the frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      doctor: appointment.doctor_name,
      specialty: appointment.doctor_specialty,
      date: new Date(appointment.date).toLocaleDateString(),
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes,
      isVirtual: appointment.is_virtual,
      image: appointment.doctor_image || null
    }));
    
    return NextResponse.json({
      appointments: formattedAppointments
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctor_id, appointment_date, appointment_time, is_virtual, notes } = body;

    // Validate required fields
    if (!doctor_id || !appointment_date || !appointment_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verify the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's role from metadata
    const userRole = session.user.user_metadata?.role;
    
    if (userRole !== 'patient') {
      return NextResponse.json(
        { error: 'Access denied: Only patients can create appointments' },
        { status: 403 }
      );
    }

    const patient_id = session.user.id;

    // Insert new appointment into database
    const { data: newAppointment, error } = await supabase
      .from('appointments')
      .insert({
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: 'upcoming',
        is_virtual: is_virtual || false,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      appointment: newAppointment,
      message: 'Appointment created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in appointment creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 