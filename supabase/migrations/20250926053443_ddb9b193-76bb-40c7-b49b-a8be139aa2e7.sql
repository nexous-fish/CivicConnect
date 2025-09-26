-- Add complaint_number column to complaints table
ALTER TABLE public.complaints 
ADD COLUMN complaint_number TEXT UNIQUE;

-- Create a function to generate sequential complaint numbers
CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Create a trigger to automatically generate complaint numbers
CREATE OR REPLACE FUNCTION public.set_complaint_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.complaint_number IS NULL THEN
        NEW.complaint_number := public.generate_complaint_number();
    END IF;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trigger_set_complaint_number
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.set_complaint_number();