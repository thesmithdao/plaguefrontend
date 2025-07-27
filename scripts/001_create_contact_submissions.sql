-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rate_limit_attempts table for tracking rate limiting
CREATE TABLE IF NOT EXISTS rate_limit_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL DEFAULT '/api/contact',
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_endpoint ON rate_limit_attempts(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_attempts(window_start);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_submissions
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON contact_submissions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policies for rate_limit_attempts
CREATE POLICY "Allow anonymous rate limit checks" ON rate_limit_attempts
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access on rate limits" ON rate_limit_attempts
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
