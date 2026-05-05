-- Fix: Add missing photo_url column to complaints table
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Verify the table structure
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'complaints' ORDER BY ordinal_position;
