UPDATE media_settings 
SET data = data::jsonb - 'heroVideoUrl' - 'heroVideoEnabled' 
WHERE id = 'global';
