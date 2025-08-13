-- Add preferred_currency column to cases table
ALTER TABLE public.cases 
ADD COLUMN preferred_currency text NOT NULL DEFAULT 'USD';

-- Add a comment for clarity
COMMENT ON COLUMN public.cases.preferred_currency IS 'The preferred currency for billing this case (USD, EUR, CAD, GBP, etc.)';