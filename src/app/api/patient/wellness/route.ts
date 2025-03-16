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
    
    // Fetch wellness metrics from the database
    const { data: metrics, error: metricsError } = await supabase
      .from('wellness_metrics')
      .select('*')
      .eq('patient_id', user.id)
      .order('recorded_date', { ascending: false })
      .limit(10);
    
    if (metricsError) {
      console.error('Error fetching wellness metrics:', metricsError);
      return NextResponse.json(
        { error: 'Failed to retrieve wellness metrics' },
        { status: 500 }
      );
    }
    
    // Fetch wellness goals from the database
    const { data: goals, error: goalsError } = await supabase
      .from('wellness_goals')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });
    
    if (goalsError) {
      console.error('Error fetching wellness goals:', goalsError);
      return NextResponse.json(
        { error: 'Failed to retrieve wellness goals' },
        { status: 500 }
      );
    }
    
    // Fetch wellness tasks from the database
    const { data: tasks, error: tasksError } = await supabase
      .from('wellness_tasks')
      .select('*')
      .eq('patient_id', user.id)
      .order('due_date', { ascending: true });
    
    if (tasksError) {
      console.error('Error fetching wellness tasks:', tasksError);
      return NextResponse.json(
        { error: 'Failed to retrieve wellness tasks' },
        { status: 500 }
      );
    }
    
    // Calculate trends for metrics
    const trends: Record<string, { trend: string; change: string; direction: string }> = {};
    
    // Group metrics by type to calculate trends
    const metricsByType: Record<string, any[]> = {};
    
    if (metrics) {
      metrics.forEach(metric => {
        const type = metric.metric_type;
        if (!metricsByType[type]) {
          metricsByType[type] = [];
        }
        metricsByType[type].push(metric);
      });
    
      // Calculate trends for each metric type
      Object.entries(metricsByType).forEach(([type, typeMetrics]) => {
        if (typeMetrics.length >= 2) {
          const sortedMetrics = [...typeMetrics].sort((a, b) => 
            new Date(b.recorded_date).getTime() - new Date(a.recorded_date).getTime()
          );
          
          const current = parseFloat(sortedMetrics[0].metric_value);
          const previous = parseFloat(sortedMetrics[1].metric_value);
          
          if (!isNaN(current) && !isNaN(previous) && previous !== 0) {
            const percentChange = ((current - previous) / Math.abs(previous)) * 100;
            const trend = current > previous ? 'up' : current < previous ? 'down' : 'stable';
            
            trends[type] = {
              trend,
              change: `${Math.abs(percentChange).toFixed(1)}%`,
              direction: percentChange >= 0 ? 'increase' : 'decrease'
            };
          }
        }
      });
    }
    
    return NextResponse.json({
      metrics: metrics || [],
      goals: goals || [],
      tasks: tasks || [],
      trends
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
    const { metric_type, metric_value, notes } = body;

    // Validate required fields
    if (!metric_type || metric_value === undefined) {
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
        { error: 'Access denied: Only patients can add wellness data' },
        { status: 403 }
      );
    }

    const patient_id = session.user.id;
    const recorded_date = new Date().toISOString();

    // Insert new wellness metric into database
    const { data: newMetric, error } = await supabase
      .from('wellness_metrics')
      .insert({
        patient_id,
        metric_type,
        metric_value,
        recorded_date,
        notes: notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording wellness metric:', error);
      return NextResponse.json(
        { error: 'Failed to record wellness metric' },
        { status: 500 }
      );
    }

    // Update wellness goals if they exist for this metric type
    await updateGoalsForMetric(supabase, patient_id, metric_type, metric_value);

    return NextResponse.json({ 
      metric: newMetric,
      message: 'Wellness metric recorded successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in wellness metric recording:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate trends from historical data
function calculateTrends(metrics: any[]) {
  const trends: Record<string, { trend: 'up' | 'down' | 'neutral', change: string }> = {};
  
  // Group metrics by type
  const metricsByType: Record<string, any[]> = {};
  metrics.forEach(metric => {
    if (!metricsByType[metric.metric_type]) {
      metricsByType[metric.metric_type] = [];
    }
    metricsByType[metric.metric_type].push(metric);
  });

  // For each metric type, sort by date and calculate trend
  for (const [type, values] of Object.entries(metricsByType)) {
    if (values.length < 2) {
      trends[type] = { trend: 'neutral', change: '0%' };
      continue;
    }

    // Sort by date (newest to oldest)
    values.sort((a, b) => new Date(b.recorded_date).getTime() - new Date(a.recorded_date).getTime());
    
    const current = parseFloat(values[0].metric_value);
    const previous = parseFloat(values[1].metric_value);
    
    if (isNaN(current) || isNaN(previous) || previous === 0) {
      trends[type] = { trend: 'neutral', change: '0%' };
      continue;
    }
    
    const percentChange = ((current - previous) / previous) * 100;
    const trend: 'up' | 'down' | 'neutral' = 
      percentChange > 0 ? 'up' : 
      percentChange < 0 ? 'down' : 'neutral';
    
    trends[type] = { 
      trend, 
      change: `${Math.abs(percentChange).toFixed(1)}%` 
    };
  }

  return trends;
}

// Helper function to update goals when new metrics are added
async function updateGoalsForMetric(supabase: any, patientId: string, metricType: string, value: number) {
  try {
    // Find goals for this metric type
    const { data: goals, error } = await supabase
      .from('wellness_goals')
      .select('*')
      .eq('patient_id', patientId)
      .eq('goal_type', metricType);
    
    if (error || !goals.length) {
      return;
    }
    
    // Update each goal's current value
    for (const goal of goals) {
      await supabase
        .from('wellness_goals')
        .update({ 
          current_value: value,
          status: value >= goal.target_value ? 'completed' : 'in_progress'
        })
        .eq('id', goal.id);
    }
  } catch (error) {
    console.error('Error updating goals:', error);
  }
} 