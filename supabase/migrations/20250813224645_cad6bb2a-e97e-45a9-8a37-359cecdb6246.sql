-- Add foreign key constraints to client_invoices table
ALTER TABLE public.client_invoices 
ADD CONSTRAINT fk_client_invoices_case_id 
FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE public.client_invoices 
ADD CONSTRAINT fk_client_invoices_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;