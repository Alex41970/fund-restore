-- Add missing updated_at column to client_invoices table
ALTER TABLE public.client_invoices 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Create trigger for automatic timestamp updates (if not exists)
CREATE TRIGGER update_client_invoices_updated_at
BEFORE UPDATE ON public.client_invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();