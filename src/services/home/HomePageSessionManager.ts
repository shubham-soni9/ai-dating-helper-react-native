import { LearningResource, SessionCache, SessionInteraction, UserProgress } from '@/types/home';

/**
 * Session-based state management for HomePage
 * Manages user interactions and data caching during a single app session
 * without requiring persistent storage
 */
export class HomePageSessionManager {
  private sessionId: string;
  private userId: string;
  private cache: Map<string, SessionCache>;
  private interactionQueue: SessionInteraction[] = [];
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL_MS = 30000; // 30 seconds
  private readonly CACHE_TTL_MS = 300000; // 5 minutes

  constructor(userId: string) {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    this.cache = new Map();
    this.startPeriodicSync();
  }

  private generateSessionId(): string {
    return `${this.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cache user progress data for the session
   */
  cacheUserProgress(progress: UserProgress): void {
    const cacheKey = `user-progress-${this.userId}`;
    const cacheData: SessionCache = {
      userProgress: progress,
      interactions: this.interactionQueue,
      timestamp: Date.now(),
    };

    this.cache.set(cacheKey, cacheData);
  }

  /**
   * Get cached user progress if available and not expired
   */
  getCachedUserProgress(): UserProgress | null {
    const cacheKey = `user-progress-${this.userId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      return cached.userProgress || null;
    }

    return null;
  }

  /**
   * Cache recommended content for the session
   */
  cacheRecommendedContent(content: LearningResource[]): void {
    const cacheKey = `recommended-content-${this.userId}`;
    const cacheData: SessionCache = {
      recommendedContent: content,
      interactions: this.interactionQueue,
      timestamp: Date.now(),
    };

    this.cache.set(cacheKey, cacheData);
  }

  /**
   * Get cached recommended content if available and not expired
   */
  getCachedRecommendedContent(): LearningResource[] | null {
    const cacheKey = `recommended-content-${this.userId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      return cached.recommendedContent || null;
    }

    return null;
  }

  /**
   * Record a user interaction for batch processing
   */
  recordInteraction(interaction: SessionInteraction): void {
    const interactionWithSession = {
      ...interaction,
      timestamp: Date.now(),
    };

    this.interactionQueue.push(interactionWithSession);

    // Sync immediately if we have 10+ interactions
    if (this.interactionQueue.length >= 10) {
      this.syncInteractions();
    }
  }

  /**
   * Record content view interaction
   */
  recordContentView(contentId: string, contentType: string, timeSpent: number = 0): void {
    this.recordInteraction({
      content_id: contentId,
      content_type: contentType,
      interaction_type: 'view',
      time_spent: timeSpent,
      timestamp: Date.now(),
    });
  }

  /**
   * Record content completion interaction
   */
  recordContentCompletion(contentId: string, contentType: string, timeSpent: number): void {
    this.recordInteraction({
      content_id: contentId,
      content_type: contentType,
      interaction_type: 'complete',
      time_spent: timeSpent,
      timestamp: Date.now(),
    });
  }

  /**
   * Record content like interaction
   */
  recordContentLike(contentId: string, contentType: string): void {
    this.recordInteraction({
      content_id: contentId,
      content_type: contentType,
      interaction_type: 'like',
      time_spent: 0,
      timestamp: Date.now(),
    });
  }

  /**
   * Get session analytics
   */
  getSessionAnalytics() {
    const views = this.interactionQueue.filter((i) => i.interaction_type === 'view').length;
    const completions = this.interactionQueue.filter(
      (i) => i.interaction_type === 'complete'
    ).length;
    const likes = this.interactionQueue.filter((i) => i.interaction_type === 'like').length;
    const totalTime = this.interactionQueue.reduce((sum, i) => sum + i.time_spent, 0);

    return {
      sessionId: this.sessionId,
      totalInteractions: this.interactionQueue.length,
      contentViews: views,
      contentCompletions: completions,
      contentLikes: likes,
      totalTimeSpent: totalTime,
      sessionDuration: Date.now() - parseInt(this.sessionId.split('-')[1]),
    };
  }

  /**
   * Sync interactions with backend (to be implemented by API service)
   */
  private async syncInteractions(): Promise<void> {
    if (this.interactionQueue.length === 0) return;

    try {
      // This will be implemented by the API service layer
      console.log(
        `Syncing ${this.interactionQueue.length} interactions for session ${this.sessionId}`
      );

      // Clear the queue after successful sync
      this.interactionQueue = [];
    } catch (error) {
      console.error('Failed to sync interactions:', error);
      // Keep interactions in queue for retry
    }
  }

  /**
   * Start periodic sync interval
   */
  private startPeriodicSync(): void {
    this.syncInterval = setInterval(() => {
      this.syncInteractions();
    }, this.SYNC_INTERVAL_MS);
  }

  /**
   * Stop periodic sync and clean up
   */
  cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Final sync before cleanup
    this.syncInteractions();

    // Clear cache
    this.cache.clear();
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cached: SessionCache): boolean {
    return Date.now() - cached.timestamp < this.CACHE_TTL_MS;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get current user ID
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * Get pending interactions count
   */
  getPendingInteractionsCount(): number {
    return this.interactionQueue.length;
  }
}
