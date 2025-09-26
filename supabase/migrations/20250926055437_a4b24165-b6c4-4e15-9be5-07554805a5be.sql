-- Fix security issues by properly dropping and recreating functions with triggers

-- Drop the trigger first, then functions
DROP TRIGGER IF EXISTS trigger_set_complaint_number ON public.complaints;
DROP FUNCTION IF EXISTS public.set_complaint_number();
DROP FUNCTION IF EXISTS public.generate_complaint_number();

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    next_number INTEGER;
    complaint_number TEXT;
BEGIN
    -- Get the next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(complaint_number FROM 2) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.complaints
    WHERE complaint_number IS NOT NULL;
    
    -- Format as CXXX
    complaint_number := 'C' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN complaint_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_complaint_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.complaint_number IS NULL THEN
        NEW.complaint_number := public.generate_complaint_number();
    END IF;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_set_complaint_number
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.set_complaint_number();