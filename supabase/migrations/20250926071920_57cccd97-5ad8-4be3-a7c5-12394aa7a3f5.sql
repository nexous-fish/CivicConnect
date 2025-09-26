-- Let's first check the current RLS policies and recreate them properly
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create complaints" ON public.complaints;
DROP POLICY IF EXISTS "Authenticated users can view complaints" ON public.complaints;
DROP POLICY IF EXISTS "Officers can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Officers can view all complaints" ON public.complaints;

-- Create a more permissive policy for complaint creation that allows anyone to create complaints
CREATE POLICY "Public can create complaints" 
ON public.complaints 
FOR INSERT 
WITH CHECK (true);

-- Allow public to view complaints (since this is a civic system)
CREATE POLICY "Public can view complaints" 
ON public.complaints 
FOR SELECT 
USING (true);

-- Officers can update complaints
CREATE POLICY "Officers can update complaints" 
ON public.complaints 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.officers 
    WHERE officers.user_id = auth.uid()
  )
);

-- Officers can delete complaints if needed
CREATE POLICY "Officers can delete complaints" 
ON public.complaints 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.officers 
    WHERE officers.user_id = auth.uid()
  )
);