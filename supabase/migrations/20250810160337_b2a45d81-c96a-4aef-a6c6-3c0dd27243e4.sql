-- Update case_messages table to match CaseMessages component expectations

-- Rename body column to content
ALTER TABLE case_messages RENAME COLUMN body TO content;

-- Add sender_type enum
CREATE TYPE public.sender_type AS ENUM ('client', 'admin');

-- Add sender_type column
ALTER TABLE case_messages ADD COLUMN sender_type sender_type NOT NULL DEFAULT 'client';

-- Add is_internal column for admin notes
ALTER TABLE case_messages ADD COLUMN is_internal boolean NOT NULL DEFAULT false;

-- Update existing messages to have proper sender_type based on user roles
UPDATE case_messages 
SET sender_type = CASE 
  WHEN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = case_messages.user_id 
    AND user_roles.role = 'admin'
  ) THEN 'admin'::sender_type
  ELSE 'client'::sender_type
END;