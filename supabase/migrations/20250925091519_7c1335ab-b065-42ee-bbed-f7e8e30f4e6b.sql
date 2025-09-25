-- Add remaining Indian states
INSERT INTO states (name) VALUES
('Andhra Pradesh'), ('Arunachal Pradesh'), ('Assam'), ('Bihar'), 
('Goa'), ('Haryana'), ('Himachal Pradesh'), ('Jharkhand'), 
('Kerala'), ('Madhya Pradesh'), ('Manipur'), ('Meghalaya'), 
('Mizoram'), ('Nagaland'), ('Odisha'), ('Punjab'), ('Rajasthan'), 
('Sikkim'), ('Tamil Nadu'), ('Telangana'), ('Tripura'), 
('Uttar Pradesh'), ('Uttarakhand'), ('West Bengal'), 
('Jammu and Kashmir'), ('Ladakh'), ('Chandigarh'), 
('Dadra and Nagar Haveli and Daman and Diu'), ('Lakshadweep'), 
('Puducherry'), ('Andaman and Nicobar Islands');

-- Add demo nagars for Durg and Bhilai
DO $$
DECLARE
    durg_id UUID;
    bhilai_id UUID;
BEGIN
    -- Get city IDs
    SELECT id INTO durg_id FROM cities WHERE name = 'Durg';
    SELECT id INTO bhilai_id FROM cities WHERE name = 'Bhilai';
    
    -- Clear existing nagars for these cities and add new ones
    DELETE FROM nagars WHERE city_id = durg_id;
    DELETE FROM nagars WHERE city_id = bhilai_id;
    
    -- Insert nagars for Durg
    INSERT INTO nagars (city_id, name) VALUES
    (durg_id, 'Subhas Nagar'),
    (durg_id, 'Padmanapur'),
    (durg_id, 'Kolihapuri'),
    (durg_id, 'Adarsh Nagar'),
    (durg_id, 'Ganj Para');
    
    -- Insert nagars for Bhilai
    INSERT INTO nagars (city_id, name) VALUES
    (bhilai_id, 'Central Avenue'),
    (bhilai_id, 'Sec 2'),
    (bhilai_id, 'Sec 4'),
    (bhilai_id, 'Sec 10'),
    (bhilai_id, 'Sec 9'),
    (bhilai_id, 'Supela');
    
END $$;