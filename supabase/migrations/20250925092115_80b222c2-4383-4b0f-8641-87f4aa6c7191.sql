-- Create storage bucket for complaint photos
INSERT INTO storage.buckets (id, name, public) VALUES ('complaint-photos', 'complaint-photos', true);

-- Create policy for complaint photos
CREATE POLICY "Anyone can upload complaint photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'complaint-photos');

CREATE POLICY "Complaint photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'complaint-photos');