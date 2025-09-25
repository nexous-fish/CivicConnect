-- Insert sample states
INSERT INTO states (name) VALUES 
('Maharashtra'),
('Delhi'),
('Karnataka'),
('Tamil Nadu'),
('Gujarat')
ON CONFLICT DO NOTHING;

-- Insert sample cities
INSERT INTO cities (state_id, name) 
SELECT s.id, city_name 
FROM states s, 
(VALUES 
  ('Maharashtra', 'Mumbai'),
  ('Maharashtra', 'Pune'),
  ('Delhi', 'New Delhi'),
  ('Karnataka', 'Bangalore'),
  ('Tamil Nadu', 'Chennai'),
  ('Gujarat', 'Ahmedabad')
) AS cities_data(state_name, city_name)
WHERE s.name = cities_data.state_name
ON CONFLICT DO NOTHING;

-- Insert sample nagars
INSERT INTO nagars (city_id, name)
SELECT c.id, nagar_name
FROM cities c,
(VALUES 
  ('Mumbai', 'Andheri West'),
  ('Mumbai', 'Bandra East'),
  ('Pune', 'Koregaon Park'),
  ('New Delhi', 'Connaught Place'),
  ('Bangalore', 'Koramangala'),
  ('Chennai', 'T Nagar'),
  ('Ahmedabad', 'Navrangpura')
) AS nagars_data(city_name, nagar_name)
WHERE c.name = nagars_data.city_name
ON CONFLICT DO NOTHING;

-- Insert sample complaints with correct enum values
INSERT INTO complaints (
  state_id, city_id, nagar_id, category, status, citizen_name, citizen_phone, 
  description, latitude, longitude, created_at, resolved_at
)
SELECT 
  s.id, c.id, n.id,
  (ARRAY['roads', 'sewage', 'sanitation', 'other'])[floor(random() * 4 + 1)]::complaint_category,
  (ARRAY['pending', 'assigned', 'in_progress', 'resolved', 'delayed'])[floor(random() * 5 + 1)]::complaint_status,
  'Citizen ' || series_num,
  '+91' || (9000000000 + floor(random() * 999999999))::text,
  'Sample complaint description ' || series_num,
  18.9 + random() * 0.5,
  72.8 + random() * 0.5,
  now() - interval '1 day' * floor(random() * 30),
  CASE WHEN random() < 0.6 THEN now() - interval '1 day' * floor(random() * 15) ELSE NULL END
FROM states s
JOIN cities c ON c.state_id = s.id
JOIN nagars n ON n.city_id = c.id
CROSS JOIN generate_series(1, 8) AS series_num;