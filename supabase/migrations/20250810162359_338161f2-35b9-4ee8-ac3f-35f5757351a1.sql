-- Drop the case_requirements table completely
DROP TABLE IF EXISTS public.case_requirements;

-- Add progress_percentage column to cases table
ALTER TABLE public.cases 
ADD COLUMN progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Create case_progress_updates table for admin-only progress updates
CREATE TABLE public.case_progress_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  update_message TEXT NOT NULL,
  progress_percentage INTEGER NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for case_progress_updates
ALTER TABLE public.case_progress_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for case_progress_updates
CREATE POLICY "Admins can manage all progress updates" 
ON public.case_progress_updates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view progress updates for their cases" 
ON public.case_progress_updates 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  EXISTS (
    SELECT 1 FROM cases c 
    WHERE c.id = case_progress_updates.case_id 
    AND c.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates on case_progress_updates
CREATE TRIGGER update_case_progress_updates_updated_at
BEFORE UPDATE ON public.case_progress_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();