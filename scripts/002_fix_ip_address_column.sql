-- This script fixes the ip_address column type if it was created as INET
-- Run this if you're getting the "invalid input syntax for type inet" error

-- Check if the column exists and is of type inet
DO $$
BEGIN
  -- Change ip_address column from inet to text if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'contact_submissions' 
    AND column_name = 'ip_address' 
    AND data_type = 'inet'
  ) THEN
    ALTER TABLE contact_submissions ALTER COLUMN ip_address TYPE TEXT;
    UPDATE contact_submissions SET ip_address = 'unknown' WHERE ip_address IS NULL;
  END IF;
END $$;
