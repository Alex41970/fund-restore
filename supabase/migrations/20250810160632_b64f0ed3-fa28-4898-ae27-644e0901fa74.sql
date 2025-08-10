-- Update case_status enum to include missing values used by AdminDashboard
ALTER TYPE case_status ADD VALUE 'in_progress';
ALTER TYPE case_status ADD VALUE 'pending_client'; 
ALTER TYPE case_status ADD VALUE 'under_review';