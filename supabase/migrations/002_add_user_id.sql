-- Migration: Add user_id to ingredients table for per-user fridge isolation
-- Also add user_id to recipes table for AI-generated recipe ownership

-- Add user_id to ingredients
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'default';

-- Add user_id to recipes (for AI-generated recipe ownership)
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT NULL;

-- Update existing data to belong to 'default' user
UPDATE ingredients SET user_id = 'default' WHERE user_id IS NULL;

-- Create index for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
