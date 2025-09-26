-- Create a security definer function to assign contractors to complaints
CREATE OR REPLACE FUNCTION public.assign_contractor_to_complaint(
  p_complaint_id UUID,
  p_nagar_id UUID
)
RETURNS TABLE (
  contractor_id UUID,
  contractor_name TEXT,
  contractor_phone TEXT,
  contractor_email TEXT,
  success BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contractor_id UUID;
  v_contractor_name TEXT;
  v_contractor_phone TEXT;
  v_contractor_email TEXT;
BEGIN
  -- Find an available contractor for the nagar
  SELECT c.id, c.name, c.phone, c.email
  INTO v_contractor_id, v_contractor_name, v_contractor_phone, v_contractor_email
  FROM public.contractors c
  WHERE c.nagar_id = p_nagar_id
  LIMIT 1;
  
  -- If contractor found, assign to complaint
  IF v_contractor_id IS NOT NULL THEN
    UPDATE public.complaints
    SET 
      assigned_contractor_id = v_contractor_id,
      status = 'in_progress',
      assigned_at = now(),
      updated_at = now()
    WHERE id = p_complaint_id;
    
    -- Return contractor details
    RETURN QUERY SELECT 
      v_contractor_id,
      v_contractor_name,
      v_contractor_phone,
      v_contractor_email,
      true;
  ELSE
    -- No contractor found
    RETURN QUERY SELECT 
      NULL::UUID,
      NULL::TEXT,
      NULL::TEXT,
      NULL::TEXT,
      false;
  END IF;
END;
$$;