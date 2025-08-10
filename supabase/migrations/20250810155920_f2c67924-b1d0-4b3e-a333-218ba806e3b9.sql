-- Add foreign key constraint to establish relationship between cases and profiles
ALTER TABLE cases 
ADD CONSTRAINT fk_cases_user_id 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;