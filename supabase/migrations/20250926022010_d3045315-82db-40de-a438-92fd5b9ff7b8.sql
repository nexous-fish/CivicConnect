-- Fix RLS policy to use specific roles instead of public
DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;

-- Create INSERT policy for specific roles only (no public role)
CREATE POLICY "Anyone can create complaints" 
ON public.complaints 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);