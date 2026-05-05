-- ============================================
-- COMPLETE SUPABASE SCHEMA FOR CIVICCONNECT
-- ============================================

-- ⚙️ 1. UTILITY FUNCTION (required for triggers)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 👤 2. USER PROFILES TABLE (REQUIRED!)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for user_profiles timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, phone, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User')
  )
  ON CONFLICT (phone) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- ============================================
-- 🗺️ 4. LOCATION TABLES (with RLS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nagars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nagars ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read access
CREATE POLICY "Public can view states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Public can view cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public can view nagars" ON public.nagars FOR SELECT USING (true);

-- ============================================
-- 👤 5. OFFICERS TABLE (with RLS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id),
  role TEXT DEFAULT 'nodal_officer',
  department TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for officers
CREATE POLICY "Officers can view their own record" 
ON public.officers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Officers can update their own record" 
ON public.officers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for officers
DROP TRIGGER IF EXISTS update_officers_updated_at ON public.officers;
CREATE TRIGGER update_officers_updated_at
BEFORE UPDATE ON public.officers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 🧑‍🔧 6. CONTRACTORS TABLE (with RLS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nagar_id UUID REFERENCES public.nagars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Allow public read
CREATE POLICY "Public can view contractors" ON public.contractors FOR SELECT USING (true);

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

-- Trigger for contractors
DROP TRIGGER IF EXISTS update_contractors_updated_at ON public.contractors;
CREATE TRIGGER update_contractors_updated_at
BEFORE UPDATE ON public.contractors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5️⃣ 7. COMPLAINTS TABLE (MAIN - with RLS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  state_id UUID REFERENCES public.states(id),
  city_id UUID REFERENCES public.cities(id),
  nagar_id UUID REFERENCES public.nagars(id),

  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',

  citizen_name TEXT,
  citizen_phone TEXT,
  description TEXT,
  address TEXT,

  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),

  complaint_number TEXT UNIQUE,

  assigned_contractor_id UUID REFERENCES public.contractors(id),

  photo_url TEXT,

  assigned_at TIMESTAMP,
  resolved_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for complaints
CREATE POLICY "Anyone can create complaints" 
ON public.complaints 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can view complaints" 
ON public.complaints 
FOR SELECT 
TO authenticated
USING (true);

-- Trigger for complaints
DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;
CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 🎯 8. COMPLAINT NUMBER GENERATOR
-- ============================================
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
    -- Get the next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(complaint_number FROM 2) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.complaints
    WHERE complaint_number IS NOT NULL;
    
    -- Format as CXXX
    new_complaint_number := 'C' || LPAD(next_number::TEXT, 3, '0');
    
    RETURN new_complaint_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_complaint_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    IF NEW.complaint_number IS NULL THEN
        NEW.complaint_number := public.generate_complaint_number();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_complaint_number_trigger ON public.complaints;
CREATE TRIGGER set_complaint_number_trigger
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.set_complaint_number();

-- ============================================
-- 💾 9. STORAGE FOR COMPLAINT PHOTOS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-photos', 'complaint-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload complaint photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'complaint-photos');

CREATE POLICY "Complaint photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'complaint-photos');

-- ============================================
-- 🌍 10. SAMPLE DATA (Optional - for testing)
-- ============================================
-- Add sample states
INSERT INTO public.states (name) VALUES
  ('Chhattisgarh'),
  ('Maharashtra'),
  ('Madhya Pradesh')
ON CONFLICT (name) DO NOTHING;

-- Add sample cities
INSERT INTO public.cities (state_id, name) 
SELECT s.id, 'Durg' FROM public.states s WHERE s.name = 'Chhattisgarh'
ON CONFLICT DO NOTHING;

INSERT INTO public.cities (state_id, name) 
SELECT s.id, 'Bhilai' FROM public.states s WHERE s.name = 'Chhattisgarh'
ON CONFLICT DO NOTHING;

-- Add sample nagars
INSERT INTO public.nagars (city_id, name)
SELECT c.id, 'Subhas Nagar' FROM public.cities c WHERE c.name = 'Durg'
ON CONFLICT DO NOTHING;

INSERT INTO public.nagars (city_id, name)
SELECT c.id, 'Supela' FROM public.cities c WHERE c.name = 'Bhilai'
ON CONFLICT DO NOTHING;

-- Add sample contractors
INSERT INTO public.contractors (nagar_id, name, phone, email)
SELECT n.id, 'Contractor 1', '9876543210', 'contractor1@example.com' 
FROM public.nagars n WHERE n.name = 'Subhas Nagar'
ON CONFLICT DO NOTHING;

-- ============================================
-- ✅ DONE! 
-- ============================================
-- All tables created with RLS enabled
-- User profiles auto-created on signup
-- Complaint numbers auto-generated
-- Ready for production!
