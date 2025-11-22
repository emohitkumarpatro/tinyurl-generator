-- TinyLink Database Schema
-- Create table for storing shortened URLs

CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_code ON links(code);

-- Sample query to verify setup
-- SELECT * FROM links;
