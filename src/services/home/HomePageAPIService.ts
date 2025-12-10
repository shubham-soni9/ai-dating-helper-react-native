import { supabase } from '@/lib/supabase';
import {
  CommunityPost,
  ContentFilter,
  ContentRecommendation,
  DailyChallenge,
  LearningResource,
  UserAchievement,
  UserChallengeCompletion,
  UserContentInteraction,
  UserLearningSession,
  UserProgress,
} from '@/types/home';
import { HomePageSessionManager } from './HomePageSessionManager';

/**
 * API Service for HomePage functionality
 * Handles all database operations and integrates with session management
 */
export class HomePageAPIService {
  private sessionManager: HomePageSessionManager;

  constructor(userId: string) {
    this.sessionManager = new HomePageSessionManager(userId);
  }

  /**
   * Get or create user progress
   */
  async getUserProgress(): Promise<UserProgress> {
    // Check session cache first
    const cached = this.sessionManager.getCachedUserProgress();
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', this.sessionManager.getUserId())
        .single();

      if (error && error.code === 'PGRST116') {
        // No progress found, create default
        return await this.createDefaultUserProgress();
      }

      if (error) throw error;

      // Cache for session
      this.sessionManager.cacheUserProgress(data);
      return data;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  /**
   * Create default user progress
   */
  private async createDefaultUserProgress(): Promise<UserProgress> {
    const userId = this.sessionManager.getUserId();

    // First, try to get existing progress
    const { data: existingData, error: existingError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingData && !existingError) {
      // Progress already exists, return it
      this.sessionManager.cacheUserProgress(existingData);
      return existingData;
    }

    // Create new progress if it doesn't exist
    const defaultProgress = {
      user_id: userId,
      total_xp: 0,
      current_level: 1,
      weekly_streak: 0,
      last_activity_date: new Date().toISOString().split('T')[0],
      topics_mastered: [],
    };

    const { data, error } = await supabase
      .from('user_progress')
      .insert(defaultProgress)
      .select()
      .single();

    if (error) {
      // If insert fails due to race condition, try to get the existing record
      if (error.code === '23505') {
        // Unique constraint violation
        const { data: retryData, error: retryError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (retryData && !retryError) {
          this.sessionManager.cacheUserProgress(retryData);
          return retryData;
        }
      }
      throw error;
    }

    this.sessionManager.cacheUserProgress(data);
    return data;
  }

  /**
   * Add XP to user and update level
   */
  async addUserXP(xpAmount: number): Promise<UserProgress> {
    try {
      const { data, error } = await supabase.rpc('add_user_xp', {
        user_uuid: this.sessionManager.getUserId(),
        xp_amount: xpAmount,
      });

      if (error) throw error;

      // Get updated progress
      const updatedProgress = await this.getUserProgress();
      this.sessionManager.cacheUserProgress(updatedProgress);

      return updatedProgress;
    } catch (error) {
      console.error('Error adding user XP:', error);
      throw error;
    }
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(limit: number = 10): Promise<UserAchievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', this.sessionManager.getUserId())
        .order('unlocked_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  }

  /**
   * Get today's daily challenge or the last uncompleted challenge if user missed days
   * This ensures users can complete all 100 challenges in sequence without skipping
   */
  async getTodayChallenge(): Promise<DailyChallenge | null> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get today's challenge (regardless of completion status)
      const { data: todayChallenge, error: todayError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('date', today)
        .eq('is_active', true)
        .single();

      if (todayError && todayError.code !== 'PGRST116') throw todayError;

      // Return today's challenge if it exists (null if it doesn't exist)
      return todayChallenge || null;
    } catch (error) {
      console.error('Error getting today challenge:', error);
      throw error;
    }
  }

  /**
   * Check if user completed today's challenge
   */
  async getUserChallengeCompletion(challengeId: string): Promise<UserChallengeCompletion | null> {
    try {
      const { data, error } = await supabase
        .from('user_challenge_completions')
        .select('*')
        .eq('user_id', this.sessionManager.getUserId())
        .eq('challenge_id', challengeId)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting challenge completion:', error);
      throw error;
    }
  }

  /**
   * Complete daily challenge
   */
  async completeDailyChallenge(challengeId: string): Promise<void> {
    try {
      // Get challenge details
      const { data: challenge } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (!challenge) throw new Error('Challenge not found');

      // Check if already completed
      const existingCompletion = await this.getUserChallengeCompletion(challengeId);
      if (existingCompletion) {
        console.log('Challenge already completed, skipping...');
        return;
      }

      // Record completion
      const { error: completionError } = await supabase.from('user_challenge_completions').insert({
        user_id: this.sessionManager.getUserId(),
        challenge_id: challengeId,
        xp_earned: challenge.xp_reward,
      });

      if (completionError) throw completionError;

      // Add XP to user
      await this.addUserXP(challenge.xp_reward);
    } catch (error) {
      console.error('Error completing daily challenge:', error);
      throw error;
    }
  }

  /**
   * Get personalized content recommendations
   */
  async getRecommendedContent(limit: number = 5): Promise<LearningResource[]> {
    // Check session cache first
    const cached = this.sessionManager.getCachedRecommendedContent();
    if (cached) return cached;

    try {
      // Get user progress to understand preferences
      const userProgress = await this.getUserProgress();

      // Get user's recent interactions
      const { data: interactions } = await supabase
        .from('user_content_interactions')
        .select('content_id, content_type, interaction_type')
        .eq('user_id', this.sessionManager.getUserId())
        .order('created_at', { ascending: false })
        .limit(20);

      // Get recommended content based on user level and preferences
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('is_active', true)
        .gte('difficulty_level', Math.max(1, userProgress.current_level - 1))
        .lte('difficulty_level', userProgress.current_level + 1)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Get more to filter

      if (error) throw error;

      // Simple recommendation algorithm - can be enhanced
      const recommended = this.personalizeContent(data || [], interactions || [], userProgress);
      const finalRecommendations = recommended.slice(0, limit);

      // Cache for session
      this.sessionManager.cacheRecommendedContent(finalRecommendations);

      return finalRecommendations;
    } catch (error) {
      console.error('Error getting recommended content:', error);
      throw error;
    }
  }

  /**
   * Simple content personalization algorithm
   */
  private personalizeContent(
    resources: LearningResource[],
    interactions: any[],
    userProgress: UserProgress
  ): LearningResource[] {
    // Score content based on various factors
    const scored = resources.map((resource) => {
      let score = 0;

      // Base score from difficulty match
      const levelDiff = Math.abs(resource.difficulty_level - userProgress.current_level);
      score += Math.max(0, 10 - levelDiff * 2);

      // Boost featured content
      if (resource.is_featured) score += 5;

      // Boost new content
      const daysSinceCreated =
        (Date.now() - new Date(resource.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 7) score += 3;

      // Penalize already viewed content
      const hasViewed = interactions.some(
        (i) => i.content_id === resource.id && i.interaction_type === 'view'
      );
      if (hasViewed) score -= 10;

      // Boost based on completion rate (popularity)
      if (resource.completion_count > 0 && resource.views_count > 0) {
        const completionRate = resource.completion_count / resource.views_count;
        score += completionRate * 5;
      }

      return { resource, score };
    });

    // Sort by score and return resources
    return scored.sort((a, b) => b.score - a.score).map((item) => item.resource);
  }

  /**
   * Get featured content
   */
  async getFeaturedContent(limit: number = 3): Promise<LearningResource[]> {
    try {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting featured content:', error);
      throw error;
    }
  }

  /**
   * Get community posts
   */
  async getCommunityPosts(category?: string, limit: number = 5): Promise<CommunityPost[]> {
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting community posts:', error);
      throw error;
    }
  }

  /**
   * Record content interaction
   */
  async recordContentInteraction(
    contentId: string,
    contentType: string,
    interactionType: string,
    timeSpent: number = 0
  ): Promise<void> {
    try {
      // Record in session
      this.sessionManager.recordContentView(contentId, contentType, timeSpent);

      // Record in database
      const { error } = await supabase.from('user_content_interactions').insert({
        user_id: this.sessionManager.getUserId(),
        content_id: contentId,
        content_type: contentType,
        interaction_type: interactionType,
        time_spent: timeSpent,
        session_id: this.sessionManager.getSessionId(),
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording content interaction:', error);
      throw error;
    }
  }

  /**
   * Start learning session
   */
  async startLearningSession(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('user_learning_sessions')
        .insert({
          user_id: this.sessionManager.getUserId(),
          session_id: this.sessionManager.getSessionId(),
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error starting learning session:', error);
      throw error;
    }
  }

  /**
   * Get session analytics
   */
  getSessionAnalytics() {
    return this.sessionManager.getSessionAnalytics();
  }

  /**
   * Get the session manager instance
   */
  getSessionManager(): HomePageSessionManager {
    return this.sessionManager;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.sessionManager.cleanup();
  }
}
