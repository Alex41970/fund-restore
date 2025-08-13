-- Add missing updated_at column to client_invoices table
ALTER TABLE public.client_invoices 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();