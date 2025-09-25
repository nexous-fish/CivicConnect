-- Create enum types
CREATE TYPE public.complaint_category AS ENUM ('roads', 'sewage', 'sanitation');
CREATE TYPE public.complaint_status AS ENUM ('pending', 'assigned', 'in_progress', 'resolved', 'delayed');

-- Create states table
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cities table
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nagars/wards table
CREATE TABLE public.nagars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contractors table
CREATE TABLE public.contractors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  nagar_id UUID NOT NULL REFERENCES public.nagars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create officers table
CREATE TABLE public.officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT NOT NULL,
  state_id UUID NOT NULL REFERENCES public.states(id),
  city_id UUID NOT NULL REFERENCES public.cities(id),
  nagar_id UUID NOT NULL REFERENCES public.nagars(id),
  category public.complaint_category NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address TEXT,
  status public.complaint_status NOT NULL DEFAULT 'pending',
  assigned_contractor_id UUID REFERENCES public.contractors(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nagars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to location data
CREATE POLICY "Public can view states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Public can view cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public can view nagars" ON public.nagars FOR SELECT USING (true);

-- Create policies for complaints (citizens can create, officers can view/update)
CREATE POLICY "Anyone can create complaints" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Officers can view all complaints" ON public.complaints FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.officers WHERE officers.user_id = auth.uid())
);
CREATE POLICY "Officers can update complaints" ON public.complaints FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.officers WHERE officers.user_id = auth.uid())
);

-- Create policies for officers (officers can view their own data)
CREATE POLICY "Officers can view their own data" ON public.officers FOR SELECT USING (user_id = auth.uid());

-- Create policies for contractors (officers can view/manage)
CREATE POLICY "Officers can view contractors" ON public.contractors FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.officers WHERE officers.user_id = auth.uid())
);

-- Insert sample data
INSERT INTO public.states (name) VALUES 
  ('Chhattisgarh'),
  ('Maharashtra'),
  ('Delhi'),
  ('Karnataka'),
  ('Gujarat');

INSERT INTO public.cities (state_id, name) 
SELECT s.id, c.name FROM public.states s, (VALUES 
  ('Chhattisgarh', 'Durg'),
  ('Chhattisgarh', 'Bhilai'),
  ('Chhattisgarh', 'Raipur'),
  ('Maharashtra', 'Mumbai'),
  ('Maharashtra', 'Pune'),
  ('Delhi', 'New Delhi'),
  ('Karnataka', 'Bangalore'),
  ('Gujarat', 'Ahmedabad')
) AS c(state_name, name) WHERE s.name = c.state_name;

INSERT INTO public.nagars (city_id, name)
SELECT c.id, n.name FROM public.cities c, (VALUES
  ('Durg', 'Subhas Nagar'),
  ('Durg', 'Padamanpur'),
  ('Durg', 'Kolihapuri'),
  ('Bhilai', 'Sector 1'),
  ('Bhilai', 'Sector 2'),
  ('Bhilai', 'Sector 3'),
  ('Bhilai', 'Sector 4'),
  ('Bhilai', 'Sector 5'),
  ('Raipur', 'Civil Lines'),
  ('Raipur', 'Shankar Nagar'),
  ('Mumbai', 'Bandra'),
  ('Mumbai', 'Andheri'),
  ('Pune', 'Koregaon Park'),
  ('New Delhi', 'Connaught Place'),
  ('Bangalore', 'Koramangala'),
  ('Ahmedabad', 'Satellite')
) AS n(city_name, name) WHERE c.name = n.city_name;

-- Insert sample contractors
INSERT INTO public.contractors (name, phone, email, nagar_id)
SELECT 'Contractor ' || n.name, '+91' || (9000000000 + ROW_NUMBER() OVER ())::TEXT, 
       'contractor' || ROW_NUMBER() OVER () || '@example.com', n.id
FROM public.nagars n LIMIT 10;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();