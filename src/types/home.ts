// User Progress and Gamification Types
export interface UserProgress {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  weekly_streak: number;
  last_activity_date: string;
  topics_mastered: string[];
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  title: string;
  description: string;
  xp_reward: number;
  icon?: string;
  unlocked_at: string;
  progress_data: Record<string, any>;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  xp_reward: number;
  category: string;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
}

export interface UserChallengeCompletion {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  xp_earned: number;
}

export interface LearningResource {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty_level: number;
  estimated_read_time: number;
  xp_reward: number;
  is_featured: boolean;
  tags: string[];
  author_name?: string;
  author_title?: string;
  likes_count: number;
  views_count: number;
  completion_count: number;
  is_active: boolean;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    email?: string;
    username?: string;
  };
}

export interface UserContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  content_type: "article" | "quiz" | "video" | "tip";
  interaction_type: "view" | "like" | "share" | "complete" | "bookmark";
  time_spent: number;
  session_id: string;
  created_at: string;
}

export interface UserLearningSession {
  id: string;
  user_id: string;
  session_id: string;
  start_time: string;
  end_time?: string;
  total_xp_earned: number;
  achievements_unlocked: string[];
  resources_completed: string[];
  challenges_completed: string[];
}

// Home Page State Types
export interface HomePageState {
  userProgress: UserProgress | null;
  recentAchievements: UserAchievement[];
  dailyChallenge: DailyChallenge | null;
  userChallengeCompletion: UserChallengeCompletion | null;
  recommendedContent: LearningResource[];
  featuredContent: LearningResource[];
  communityPosts: CommunityPost[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  lastSyncTime: number;
}

// Achievement Definitions
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  icon: string;
  category: string;
  unlock_condition: {
    type:
      | "content_views"
      | "content_completions"
      | "challenge_completions"
      | "consecutive_days"
      | "total_xp";
    threshold: number;
    content_category?: string;
  };
}

// Content Categories and Filters
export interface ContentFilter {
  category?: string;
  difficulty_level?: number;
  tags?: string[];
  is_featured?: boolean;
  estimated_read_time_max?: number;
}

export interface ContentRecommendation {
  resource: LearningResource;
  relevance_score: number;
  reason: string;
}

// Session Management Types
export interface SessionInteraction {
  content_id: string;
  content_type: string;
  interaction_type: string;
  time_spent: number;
  timestamp: number;
}

export interface SessionCache {
  userProgress?: UserProgress;
  recommendedContent?: LearningResource[];
  interactions: SessionInteraction[];
  timestamp: number;
}

// Daily Tip and Icebreaker Types
export interface DailyTip {
  id: string;
  date: string;
  tip: string;
  category: string;
  difficulty_level: number;
  is_active: boolean;
}

export interface DailyIcebreaker {
  id: string;
  date: string;
  icebreaker: string;
  category: string;
  context_hint: string;
  is_active: boolean;
}

// Gamification and Progress Types
export interface LevelProgression {
  current_level: number;
  current_xp: number;
  xp_to_next_level: number;
  total_xp_for_level: number;
  progress_percentage: number;
}

export interface WeeklyStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  is_active_today: boolean;
}

export interface UserStats {
  total_content_views: number;
  total_content_completions: number;
  total_challenges_completed: number;
  total_achievements_unlocked: number;
  favorite_category: string;
  average_session_time: number;
  join_date: string;
}
