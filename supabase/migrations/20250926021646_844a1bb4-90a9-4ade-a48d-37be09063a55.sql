-- Drop the existing INSERT policy for anonymous users only
DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;

-- Create a new INSERT policy that allows both anonymous and authenticated users to create complaints
CREATE POLICY "Anyone can create complaints" 
ON public.complaints 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Create a SELECT policy for authenticated users (general access)
CREATE POLICY "Authenticated users can view complaints" 
ON public.complaints 
FOR SELECT 
TO authenticated
USING (true);