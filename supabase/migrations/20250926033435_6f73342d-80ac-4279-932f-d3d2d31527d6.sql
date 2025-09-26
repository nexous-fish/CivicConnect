-- Add before and after photo fields to complaints table for resolved highlights
ALTER TABLE public.complaints 
ADD COLUMN before_photo_url text,
ADD COLUMN after_photo_url text;