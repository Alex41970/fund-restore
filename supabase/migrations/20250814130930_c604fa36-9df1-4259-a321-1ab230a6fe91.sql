-- Remove payment_configuration_id column from client_invoices table
ALTER TABLE client_invoices DROP COLUMN IF EXISTS payment_configuration_id;

-- Drop payment_configurations table completely
DROP TABLE IF EXISTS payment_configurations;