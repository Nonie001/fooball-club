-- Migration: Add match_order field to existing matches table
-- Run this in Supabase SQL Editor

-- Add match_order column
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_order INTEGER DEFAULT 0;

-- Update existing records to have proper match_order based on created_at
UPDATE matches 
SET match_order = row_number() OVER (ORDER BY round ASC, created_at ASC) - 1;

-- Verify the update
SELECT round, match_order, home_team_name, away_team_name, venue, created_at 
FROM matches 
ORDER BY round ASC, match_order ASC 
LIMIT 20;