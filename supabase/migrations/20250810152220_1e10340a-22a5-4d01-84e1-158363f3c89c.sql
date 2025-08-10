-- Enhanced case status enum
DROP TYPE IF EXISTS case_status CASCADE;
CREATE TYPE case_status AS ENUM (
  'initial_review',
  'documents_needed', 
  'in_progress',
  'awaiting_client',
  'legal_review',
  'settlement_negotiation',
  'completed',
  'closed'
);

-- Update cases table with new status and one case per user constraint
ALTER TABLE cases 
  ALTER COLUMN status TYPE case_status USING status::text::case_status,
  ALTER COLUMN status SET DEFAULT 'initial_review';

-- Add unique constraint for one case per user
ALTER TABLE cases ADD CONSTRAINT one_case_per_user UNIQUE (user_id);

-- Create case_progress table for detailed progress tracking
CREATE TABLE case_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  step_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on case_progress
ALTER TABLE case_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_progress
CREATE POLICY "Users can view progress for their cases" ON case_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cases c 
      WHERE c.id = case_progress.case_id 
      AND (c.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins can manage all case progress" ON case_progress
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create case_messages table for communication
CREATE TABLE case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_from_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on case_messages
ALTER TABLE case_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_messages
CREATE POLICY "Users can view messages for their cases" ON case_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cases c 
      WHERE c.id = case_messages.case_id 
      AND (c.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can send messages for their cases" ON case_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases c 
      WHERE c.id = case_messages.case_id 
      AND c.user_id = auth.uid()
    ) AND sender_id = auth.uid()
  );

CREATE POLICY "Admins can manage all messages" ON case_messages
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create case_requirements table
CREATE TABLE case_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  is_required BOOLEAN DEFAULT TRUE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on case_requirements
ALTER TABLE case_requirements ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_requirements
CREATE POLICY "Users can view requirements for their cases" ON case_requirements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cases c 
      WHERE c.id = case_requirements.case_id 
      AND (c.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can update requirements for their cases" ON case_requirements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM cases c 
      WHERE c.id = case_requirements.case_id 
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all requirements" ON case_requirements
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at columns
CREATE TRIGGER update_case_progress_updated_at
  BEFORE UPDATE ON case_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_requirements_updated_at
  BEFORE UPDATE ON case_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate case progress percentage
CREATE OR REPLACE FUNCTION calculate_case_progress(case_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  total_steps INTEGER;
  completed_steps INTEGER;
  progress_percentage INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_steps 
  FROM case_progress 
  WHERE case_id = case_id_param;
  
  SELECT COUNT(*) INTO completed_steps 
  FROM case_progress 
  WHERE case_id = case_id_param AND is_completed = TRUE;
  
  IF total_steps = 0 THEN
    RETURN 0;
  END IF;
  
  progress_percentage := (completed_steps * 100) / total_steps;
  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;