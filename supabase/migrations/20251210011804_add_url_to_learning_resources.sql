-- Add URL column to learning_resources table
ALTER TABLE learning_resources 
ADD COLUMN url TEXT;

-- Add index for URL lookups
CREATE INDEX idx_learning_resources_url ON learning_resources(url) 
WHERE url IS NOT NULL;

-- Update RLS policy to allow URL field
-- The existing policy already allows SELECT for active resources, so URL will be included