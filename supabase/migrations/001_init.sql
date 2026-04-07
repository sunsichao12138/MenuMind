-- ============================================
-- Zenith Culinaria - Supabase Database Schema
-- ============================================

-- 1. 食材表
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  expiry_days INTEGER NOT NULL DEFAULT 7,
  category TEXT NOT NULL DEFAULT '其他',
  image TEXT DEFAULT '',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 菜谱表
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  time TEXT DEFAULT '',
  difficulty TEXT DEFAULT '',
  calories TEXT DEFAULT '',
  recommendation_reason TEXT DEFAULT '',
  match_percentage INTEGER,
  inventory_match INTEGER,
  ingredients_have JSONB DEFAULT '[]',
  ingredients_missing JSONB DEFAULT '[]',
  steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'default',
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- 4. 用餐计划表
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'default',
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- 5. 浏览历史表
CREATE TABLE IF NOT EXISTS history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'default',
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- 6. 用户配置表
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY DEFAULT 'default',
  display_name TEXT DEFAULT '美食探险家',
  avatar_url TEXT DEFAULT '',
  level INTEGER DEFAULT 5,
  points INTEGER DEFAULT 1280,
  restrictions TEXT[] DEFAULT '{}',
  taste_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);

-- 默认用户配置
INSERT INTO user_profiles (user_id, display_name, restrictions, taste_preferences)
VALUES ('default', '美食探险家', ARRAY['葱', '姜'], ARRAY['清淡'])
ON CONFLICT (user_id) DO NOTHING;
