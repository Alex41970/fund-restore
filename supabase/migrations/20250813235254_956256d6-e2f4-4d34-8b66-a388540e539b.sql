-- Create payment_configurations table
CREATE TABLE public.payment_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('crypto', 'wire_transfer')),
  crypto_wallet_address TEXT,
  crypto_network TEXT DEFAULT 'ethereum',
  crypto_currency TEXT DEFAULT 'ETH',
  wire_bank_name TEXT,
  wire_account_number TEXT,
  wire_routing_number TEXT,
  wire_swift_code TEXT,
  wire_account_holder TEXT,
  wire_bank_address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.payment_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all payment configurations" 
ON public.payment_configurations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add payment_configuration_id to client_invoices table
ALTER TABLE public.client_invoices 
ADD COLUMN payment_configuration_id UUID,
ADD COLUMN payment_instructions TEXT;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_configurations_updated_at
BEFORE UPDATE ON public.payment_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();