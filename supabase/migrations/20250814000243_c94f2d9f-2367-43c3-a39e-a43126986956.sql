-- Add direct crypto and wire transfer fields to client_invoices table
ALTER TABLE public.client_invoices 
ADD COLUMN crypto_wallet_address TEXT,
ADD COLUMN crypto_currency TEXT DEFAULT 'ETH',
ADD COLUMN crypto_network TEXT DEFAULT 'ethereum',
ADD COLUMN wire_bank_name TEXT,
ADD COLUMN wire_account_holder TEXT,
ADD COLUMN wire_account_number TEXT,
ADD COLUMN wire_routing_number TEXT,
ADD COLUMN wire_swift_code TEXT,
ADD COLUMN wire_bank_address TEXT;

-- Remove dependency on payment_configuration_id (make it optional)
ALTER TABLE public.client_invoices 
ALTER COLUMN payment_configuration_id DROP NOT NULL;