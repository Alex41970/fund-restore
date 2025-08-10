-- Create case_progress table
CREATE TABLE public.case_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  step_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_messages table  
CREATE TABLE public.case_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  user_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_requirements table
CREATE TABLE public.case_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  required_by DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add one case per user constraint
ALTER TABLE public.cases 
ADD CONSTRAINT one_case_per_user UNIQUE (user_id);

-- Enable RLS on new tables
ALTER TABLE public.case_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_requirements ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_progress
CREATE POLICY "Users can view progress for their cases" 
ON public.case_progress 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR (EXISTS ( 
  SELECT 1 FROM cases c WHERE c.id = case_progress.case_id AND c.user_id = auth.uid()
)));

CREATE POLICY "Admins can manage all progress" 
ON public.case_progress 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for case_messages
CREATE POLICY "Users can view messages for their cases" 
ON public.case_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR (EXISTS ( 
  SELECT 1 FROM cases c WHERE c.id = case_messages.case_id AND c.user_id = auth.uid()
)));

CREATE POLICY "Users can add messages to their cases" 
ON public.case_messages 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR (EXISTS ( 
  SELECT 1 FROM cases c WHERE c.id = case_messages.case_id AND c.user_id = auth.uid()
)));

CREATE POLICY "Admins can manage all messages" 
ON public.case_messages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for case_requirements
CREATE POLICY "Users can view requirements for their cases" 
ON public.case_requirements 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR (EXISTS ( 
  SELECT 1 FROM cases c WHERE c.id = case_requirements.case_id AND c.user_id = auth.uid()
)));

CREATE POLICY "Admins can manage all requirements" 
ON public.case_requirements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_case_progress_updated_at
BEFORE UPDATE ON public.case_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_requirements_updated_at
BEFORE UPDATE ON public.case_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();