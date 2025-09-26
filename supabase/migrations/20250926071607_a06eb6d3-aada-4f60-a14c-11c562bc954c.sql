-- First, let's drop the existing trigger if it exists
DROP TRIGGER IF EXISTS set_complaint_number_trigger ON public.complaints;

-- Recreate the trigger with the correct setup
CREATE TRIGGER set_complaint_number_trigger
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.set_complaint_number();

-- Also fix the generate_complaint_number function to avoid ambiguous column references
CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    next_number INTEGER;
    new_complaint_number TEXT;
BEGIN
    -- Get the next sequence number with explicit table reference
    SELECT COALESCE(MAX(CAST(SUBSTRING(c.complaint_number FROM 2) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.complaints c
    WHERE c.complaint_number IS NOT NULL;
    
    -- Format as CXXX
    new_complaint_number := 'C' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN new_complaint_number;
END;
$function$