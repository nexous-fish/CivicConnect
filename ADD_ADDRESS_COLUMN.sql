-- Add address column to complaints table if it doesn't exist
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS address TEXT;
