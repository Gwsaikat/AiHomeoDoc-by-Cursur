-- Create a function that will be triggered when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_patient_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user is a patient
  IF NEW.raw_user_meta_data->>'role' = 'patient' THEN
    -- Create sample appointments
    INSERT INTO public.appointments (patient_id, doctor_name, doctor_specialty, date, time, status, notes, is_virtual)
    VALUES
      (NEW.id, 'Dr. Sarah Johnson', 'Homeopathy', CURRENT_DATE + INTERVAL '2 days', '10:00 AM', 'upcoming', 'Initial consultation', true),
      (NEW.id, 'Dr. Michael Chen', 'Naturopathy', CURRENT_DATE + INTERVAL '7 days', '2:30 PM', 'upcoming', 'Follow-up appointment', false);
    
    -- Create sample prescriptions
    INSERT INTO public.prescriptions (patient_id, doctor_name, medication_name, dosage, frequency, start_date, end_date, status, notes)
    VALUES
      (NEW.id, 'Dr. Sarah Johnson', 'Arnica Montana', '30C, 3 pellets', 'Three times daily', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'active', 'Take before meals');
    
    -- Create sample wellness tasks
    INSERT INTO public.wellness_tasks (patient_id, task_name, category, priority, due_date, frequency, is_completed)
    VALUES
      (NEW.id, 'Take morning medication', 'medication', 'high', CURRENT_DATE, 'Daily', false),
      (NEW.id, 'Drink 8 glasses of water', 'hydration', 'medium', CURRENT_DATE, 'Daily', false);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger on auth.users to call the function when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_patient_user(); 