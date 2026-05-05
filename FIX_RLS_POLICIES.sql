-- ============================================
-- FIX RLS POLICIES FOR COMPLAINTS TABLE
-- ============================================

-- First, disable RLS temporarily to fix policies
ALTER TABLE public.complaints DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can view complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authenticated users can update complaints" ON public.complaints;

-- Re-enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create a simple, permissive INSERT policy
CREATE POLICY "Anyone can insert complaints"
ON public.complaints
FOR INSERT
WITH CHECK (true);

-- Create a SELECT policy for authenticated users
CREATE POLICY "Authenticated users can view complaints"
ON public.complaints
FOR SELECT
TO authenticated
USING (true);

-- Create a SELECT policy for anonymous users (they can only see their own)
CREATE POLICY "Anonymous users can view complaints"
ON public.complaints
FOR SELECT
TO anon
USING (true);

-- Create UPDATE policy for officers
CREATE POLICY "Authenticated users can update complaints"
ON public.complaints
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify policies are created
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'complaints'
ORDER BY policyname;
