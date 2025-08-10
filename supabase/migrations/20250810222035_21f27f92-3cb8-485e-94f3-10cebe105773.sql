-- Enable required extensions for automated cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cleanup of attachments older than 48 hours
-- Runs every 4 hours at minute 0
SELECT cron.schedule(
  'cleanup-old-attachments',
  '0 */4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://fgnurcnjqjbqnbdtjirv.supabase.co/functions/v1/cleanup-old-attachments',
    headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbnVyY25qcWpicW5iZHRqaXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzYzNDQsImV4cCI6MjA3MDI1MjM0NH0.TmG5bqOujOpF-mjPFsUYXu16O9qXFk3aF0HxtRhDZHU"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);