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
    
    // Fetch reports from the database
    const { data: reports, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('patient_id', user.id)
      .order('report_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve medical reports' },
        { status: 500 }
      );
    }
    
    // Format the reports data for the frontend
    const formattedReports = reports.map(report => ({
      id: report.id,
      report_title: report.report_title,
      report_type: report.report_type,
      report_date: new Date(report.report_date).toLocaleDateString(),
      report_description: report.report_description,
      lab_name: report.lab_name,
      doctor_name: report.doctor_name,
      is_critical: report.is_critical,
      file_url: report.file_url
    }));
    
    return NextResponse.json({
      reports: formattedReports
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
    const { 
      report_type, 
      report_title,
      report_description,
      lab_name,
      doctor_name,
      report_date,
      file_url
    } = body;

    // Validate required fields
    if (!report_type || !report_title || !report_date) {
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
        { error: 'Access denied: Only patients can upload reports' },
        { status: 403 }
      );
    }

    const patient_id = session.user.id;

    // Insert new report into database
    const { data: newReport, error } = await supabase
      .from('medical_reports')
      .insert({
        patient_id,
        report_type,
        report_title,
        report_description: report_description || null,
        lab_name: lab_name || null,
        doctor_name: doctor_name || null,
        report_date,
        file_url: file_url || null,
        is_critical: false // Default to not critical
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating medical report:', error);
      return NextResponse.json(
        { error: 'Failed to create medical report' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      report: newReport,
      message: 'Medical report added successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in medical report creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 