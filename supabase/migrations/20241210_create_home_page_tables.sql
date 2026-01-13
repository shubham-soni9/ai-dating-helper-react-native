-- User Progress Tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  weekly_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  topics_mastered TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  icon TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_data JSONB DEFAULT '{}'
);

-- Content Interactions
CREATE TABLE user_content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL, -- 'article', 'quiz', 'video', 'tip'
  interaction_type TEXT NOT NULL, -- 'view', 'like', 'share', 'complete', 'bookmark'
  time_spent INTEGER DEFAULT 0, -- seconds
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Challenges
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  category TEXT NOT NULL, -- 'messaging', 'profile', 'dating', 'social'
  difficulty_level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Challenge Completions
CREATE TABLE user_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, challenge_id)
);

-- Learning Resources
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'messaging', 'profile', 'dating', 'social', 'relationship'
  difficulty_level INTEGER DEFAULT 1, -- 1-5
  estimated_read_time INTEGER DEFAULT 5, -- minutes
  xp_reward INTEGER DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT,
  author_title TEXT,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'success_story', 'question', 'tip', 'discussion'
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Learning Sessions
CREATE TABLE user_learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  total_xp_earned INTEGER DEFAULT 0,
  achievements_unlocked TEXT[] DEFAULT '{}',
  resources_completed UUID[] DEFAULT '{}',
  challenges_completed UUID[] DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);
CREATE INDEX idx_user_content_interactions_user_id ON user_content_interactions(user_id);
CREATE INDEX idx_user_content_interactions_content_id ON user_content_interactions(content_id);
CREATE INDEX idx_user_content_interactions_created_at ON user_content_interactions(created_at);
CREATE INDEX idx_daily_challenges_date ON daily_challenges(date);
CREATE INDEX idx_daily_challenges_active ON daily_challenges(is_active) WHERE is_active = true;
CREATE INDEX idx_user_challenge_completions_user_id ON user_challenge_completions(user_id);
CREATE INDEX idx_learning_resources_category ON learning_resources(category);
CREATE INDEX idx_learning_resources_difficulty ON learning_resources(difficulty_level);
CREATE INDEX idx_learning_resources_featured ON learning_resources(is_featured) WHERE is_featured = true;
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_featured ON community_posts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_user_learning_sessions_user_id ON user_learning_sessions(user_id);
CREATE INDEX idx_user_learning_sessions_session_id ON user_learning_sessions(session_id);

-- Row Level Security (RLS) Policies

-- User Progress RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own progress" ON user_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- User Achievements RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own achievements" ON user_achievements
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Content Interactions RLS
ALTER TABLE user_content_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own interactions" ON user_content_interactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Daily Challenges RLS (public read, user-specific completions)
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active challenges" ON daily_challenges
  FOR SELECT TO authenticated
  USING (is_active = true);

-- User Challenge Completions RLS
ALTER TABLE user_challenge_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own completions" ON user_challenge_completions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Learning Resources RLS (public read)
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active resources" ON learning_resources
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Community Posts RLS (public read, user-specific write)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved posts" ON community_posts
  FOR SELECT TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can create their own posts" ON community_posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON community_posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- User Learning Sessions RLS
ALTER TABLE user_learning_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view their own sessions" ON user_learning_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Functions for XP calculation and level progression
CREATE OR REPLACE FUNCTION calculate_level(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE 
    WHEN total_xp < 100 THEN 1
    WHEN total_xp < 300 THEN 2
    WHEN total_xp < 600 THEN 3
    WHEN total_xp < 1000 THEN 4
    WHEN total_xp < 1500 THEN 5
    WHEN total_xp < 2100 THEN 6
    WHEN total_xp < 2800 THEN 7
    WHEN total_xp < 3600 THEN 8
    WHEN total_xp < 4500 THEN 9
    ELSE 10 + (total_xp - 4500) / 1000
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress with XP
CREATE OR REPLACE FUNCTION add_user_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
  current_total INTEGER;
  new_total INTEGER;
  new_level INTEGER;
BEGIN
  -- Get current XP
  SELECT total_xp INTO current_total 
  FROM user_progress 
  WHERE user_id = user_uuid;
  
  -- Calculate new totals
  new_total := current_total + xp_amount;
  new_level := calculate_level(new_total);
  
  -- Update user progress
  UPDATE user_progress 
  SET 
    total_xp = new_total,
    current_level = new_level,
    updated_at = NOW()
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert sample daily challenges
INSERT INTO daily_challenges (date, title, description, xp_reward, category, difficulty_level) VALUES
(NOW()::DATE, 'Message Mastery', 'Send 3 personalized messages today', 50, 'messaging', 1),
(NOW()::DATE + 1, 'Profile Power-Up', 'Update your dating app bio', 75, 'profile', 2),
(NOW()::DATE + 2, 'Social Detective', 'Analyze 2 profile photos for red flags', 60, 'social', 2),
(NOW()::DATE + 3, 'First Date Prep', 'Plan a creative first date idea', 100, 'dating', 3),
(NOW()::DATE + 4, 'Empathy Exercise', 'Practice active listening in a conversation', 80, 'messaging', 2);

-- Insert sample learning resources
INSERT INTO learning_resources (title, content, category, difficulty_level, estimated_read_time, xp_reward, tags, author_name, author_title) VALUES
('The Art of the Perfect First Message', 'Learn the psychology behind compelling opening messages that get responses...', 'messaging', 1, 5, 15, ARRAY['messaging', 'first-message', 'conversation-starters'], 'Dr. Sarah Chen', 'Dating Psychology Expert'),
('5 Profile Photos That Actually Work', 'Discover the science behind profile photos that attract quality matches...', 'profile', 2, 8, 20, ARRAY['photos', 'profile', 'attraction'], 'Mike Rodriguez', 'Online Dating Coach'),
('Reading Between the Lines: Spotting Red Flags Early', 'Master the skill of identifying potential issues before you invest time...', 'social', 3, 10, 25, ARRAY['red-flags', 'safety', 'screening'], 'Lisa Thompson', 'Relationship Therapist'),
('The First Date Blueprint: From Nervous to Natural', 'A step-by-step guide to planning and executing memorable first dates...', 'dating', 2, 12, 30, ARRAY['first-date', 'planning', 'conversation'], 'James Wilson', 'Social Skills Coach'),
('Emotional Intelligence in Modern Dating', 'Develop the emotional awareness that creates deeper connections...', 'relationship', 3, 15, 35, ARRAY['emotional-intelligence', 'communication', 'connection'], 'Dr. Amanda Foster', 'Clinical Psychologist');