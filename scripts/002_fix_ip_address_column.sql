-- Fix the ip_address column to accept text values including "unknown"
ALTER TABLE contact_submissions 
ALTER COLUMN ip_address TYPE TEXT;

-- Update any existing NULL values to "unknown"
UPDATE contact_submissions 
SET ip_address = 'unknown' 
WHERE ip_address IS NULL;
