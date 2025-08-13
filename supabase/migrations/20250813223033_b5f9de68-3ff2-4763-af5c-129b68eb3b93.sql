-- Create wallet connections table
CREATE TABLE public.wallet_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  wallet_type TEXT NOT NULL, -- metamask, coinbase, walletconnect
  verification_status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, rejected
  preferred_payment_wallet BOOLEAN NOT NULL DEFAULT false,
  blockchain_network TEXT NOT NULL DEFAULT 'ethereum',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Create client invoices table
CREATE TABLE public.client_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount_due DECIMAL(18,8) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  invoice_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, overdue, cancelled
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  payment_method TEXT DEFAULT 'crypto', -- crypto, traditional
  blockchain_network TEXT DEFAULT 'ethereum',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create crypto payments table
CREATE TABLE public.crypto_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  amount_paid DECIMAL(18,8) NOT NULL,
  token_address TEXT, -- null for native tokens like ETH
  token_symbol TEXT NOT NULL DEFAULT 'ETH',
  blockchain_network TEXT NOT NULL DEFAULT 'ethereum',
  confirmation_status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, failed
  gas_fees DECIMAL(18,8),
  exchange_rate_usd DECIMAL(18,8),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;

-- Wallet connections policies
CREATE POLICY "Users can view their own wallet connections"
ON public.wallet_connections
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet connections"
ON public.wallet_connections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet connections"
ON public.wallet_connections
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all wallet connections"
ON public.wallet_connections
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Client invoices policies
CREATE POLICY "Users can view invoices for their cases"
ON public.client_invoices
FOR SELECT
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM cases c 
    WHERE c.id = client_invoices.case_id AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all invoices"
ON public.client_invoices
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Crypto payments policies
CREATE POLICY "Users can view payments for their invoices"
ON public.crypto_payments
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM client_invoices ci 
    WHERE ci.id = crypto_payments.invoice_id AND ci.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert payments for their invoices"
ON public.crypto_payments
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM client_invoices ci 
    WHERE ci.id = crypto_payments.invoice_id AND ci.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payments"
ON public.crypto_payments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX idx_wallet_connections_user_id ON public.wallet_connections(user_id);
CREATE INDEX idx_wallet_connections_address ON public.wallet_connections(wallet_address);
CREATE INDEX idx_client_invoices_case_id ON public.client_invoices(case_id);
CREATE INDEX idx_client_invoices_user_id ON public.client_invoices(user_id);
CREATE INDEX idx_client_invoices_status ON public.client_invoices(invoice_status);
CREATE INDEX idx_crypto_payments_invoice_id ON public.crypto_payments(invoice_id);
CREATE INDEX idx_crypto_payments_transaction_hash ON public.crypto_payments(transaction_hash);

-- Create updated_at triggers
CREATE TRIGGER update_wallet_connections_updated_at
  BEFORE UPDATE ON public.wallet_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_invoices_updated_at
  BEFORE UPDATE ON public.client_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();