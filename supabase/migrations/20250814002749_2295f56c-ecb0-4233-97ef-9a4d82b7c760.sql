-- Update default crypto currency to USDT in existing tables
UPDATE payment_configurations 
SET crypto_currency = 'USDT' 
WHERE payment_method = 'crypto' AND crypto_currency = 'ETH';

UPDATE client_invoices 
SET crypto_currency = 'USDT' 
WHERE crypto_currency = 'ETH';

UPDATE crypto_payments 
SET token_symbol = 'USDT' 
WHERE token_symbol = 'ETH';

-- Update default values for new records
ALTER TABLE payment_configurations 
ALTER COLUMN crypto_currency SET DEFAULT 'USDT';

ALTER TABLE client_invoices 
ALTER COLUMN crypto_currency SET DEFAULT 'USDT';

ALTER TABLE crypto_payments 
ALTER COLUMN token_symbol SET DEFAULT 'USDT';