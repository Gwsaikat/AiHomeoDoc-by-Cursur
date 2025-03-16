-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  doctor_specialty TEXT,
  doctor_image TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  notes TEXT,
  is_virtual BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  refill_needed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create medical reports table
CREATE TABLE IF NOT EXISTS medical_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  doctor_name TEXT,
  report_title TEXT NOT NULL,
  report_type TEXT NOT NULL,
  report_date DATE NOT NULL,
  report_description TEXT,
  lab_name TEXT,
  is_critical BOOLEAN DEFAULT false,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wellness metrics table
CREATE TABLE IF NOT EXISTS wellness_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  recorded_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wellness goals table
CREATE TABLE IF NOT EXISTS wellness_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wellness tasks table
CREATE TABLE IF NOT EXISTS wellness_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  frequency TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies for appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view appointments for their patients"
  ON appointments FOR SELECT
  USING (auth.uid() = doctor_id);

-- Create RLS policies for prescriptions
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own prescriptions"
  ON prescriptions FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view prescriptions they created"
  ON prescriptions FOR SELECT
  USING (auth.uid() = doctor_id);

-- Create RLS policies for medical reports
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own medical reports"
  ON medical_reports FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view medical reports they created"
  ON medical_reports FOR SELECT
  USING (auth.uid() = doctor_id);

-- Create RLS policies for wellness metrics
ALTER TABLE wellness_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own wellness metrics"
  ON wellness_metrics FOR SELECT
  USING (auth.uid() = patient_id);

-- Create RLS policies for wellness goals
ALTER TABLE wellness_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own wellness goals"
  ON wellness_goals FOR SELECT
  USING (auth.uid() = patient_id);

-- Create RLS policies for wellness tasks
ALTER TABLE wellness_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own wellness tasks"
  ON wellness_tasks FOR SELECT
  USING (auth.uid() = patient_id); 