-- Add separate amount fields for crypto and wire payments
ALTER TABLE client_invoices 
ADD COLUMN crypto_amount_usdt numeric,
ADD COLUMN wire_amount numeric,
ADD COLUMN wire_currency text DEFAULT 'USD';

-- Migrate existing data - copy amount_due to both new fields initially
UPDATE client_invoices 
SET crypto_amount_usdt = amount_due,
    wire_amount = amount_due,
    wire_currency = currency;