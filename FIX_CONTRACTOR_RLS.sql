-- Fix contractor RLS so officers can add, update, and delete contractors in their city

DROP POLICY IF EXISTS "Public can view contractors" ON public.contractors;
DROP POLICY IF EXISTS "Officers can add contractors in their city" ON public.contractors;
DROP POLICY IF EXISTS "Officers can update contractors in their city" ON public.contractors;
DROP POLICY IF EXISTS "Officers can delete contractors in their city" ON public.contractors;

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view contractors"
ON public.contractors
FOR SELECT
USING (true);

CREATE POLICY "Officers can add contractors in their city"
ON public.contractors
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.officers o
    JOIN public.nagars n ON n.id = nagar_id
    WHERE o.user_id = auth.uid()
      AND n.city_id = o.city_id
  )
);

CREATE POLICY "Officers can update contractors in their city"
ON public.contractors
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.officers o
    JOIN public.nagars n ON n.id = nagar_id
    WHERE o.user_id = auth.uid()
      AND n.city_id = o.city_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.officers o
    JOIN public.nagars n ON n.id = nagar_id
    WHERE o.user_id = auth.uid()
      AND n.city_id = o.city_id
  )
);

CREATE POLICY "Officers can delete contractors in their city"
ON public.contractors
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.officers o
    JOIN public.nagars n ON n.id = nagar_id
    WHERE o.user_id = auth.uid()
      AND n.city_id = o.city_id
  )
);
