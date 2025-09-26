-- Add INSERT policy for contractors table to allow officers to add contractors for their city
CREATE POLICY "Officers can insert contractors for their city nagars"
ON public.contractors
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.officers o
    JOIN public.nagars n ON n.city_id = o.city_id
    WHERE o.user_id = auth.uid() 
    AND n.id = nagar_id
  )
);

-- Add UPDATE policy for contractors table to allow officers to update contractors for their city
CREATE POLICY "Officers can update contractors for their city nagars"
ON public.contractors
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM public.officers o
    JOIN public.nagars n ON n.city_id = o.city_id
    WHERE o.user_id = auth.uid() 
    AND n.id = nagar_id
  )
);

-- Add DELETE policy for contractors table to allow officers to delete contractors for their city
CREATE POLICY "Officers can delete contractors for their city nagars"
ON public.contractors
FOR DELETE
USING (
  EXISTS (
    SELECT 1 
    FROM public.officers o
    JOIN public.nagars n ON n.city_id = o.city_id
    WHERE o.user_id = auth.uid() 
    AND n.id = nagar_id
  )
);