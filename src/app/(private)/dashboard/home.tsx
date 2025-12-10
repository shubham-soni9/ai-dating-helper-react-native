import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { HomePageAPIService } from '@/services/home/HomePageAPIService';
import { HomePageSessionManager } from '@/services/home/HomePageSessionManager';
import {
  UserStatsBadge,
  DailyChallengeBanner,
  RecommendedContent,
  CommunitySection,
  RecentAchievements,
} from '@/components/home';
import {
  UserProgress,
  DailyChallenge,
  UserChallengeCompletion,
  LearningResource,
  CommunityPost,
  UserAchievement,
} from '@/types/home';

type RecentTool = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  timestamp: number;
};

export default function HomeTab() {
  const { colors } = useTheme();
  const router = useRouter();
  const { session, profile } = useAuth();
  const [recent, setRecent] = useState<RecentTool[]>([]);
  const [loading, setLoading] = useState(true);

  // Home page data
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [challengeCompletion, setChallengeCompletion] = useState<UserChallengeCompletion | null>(
    null
  );
  const [recommendedContent, setRecommendedContent] = useState<LearningResource[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([]);

  // Services
  const [apiService, setApiService] = useState<HomePageAPIService | null>(null);
  const [sessionManager, setSessionManager] = useState<HomePageSessionManager | null>(null);

  useEffect(() => {
    if (session?.userId) {
      const service = new HomePageAPIService(session.userId);
      const manager = service.getSessionManager();
      setSessionManager(manager);
      setApiService(service);
      loadHomeData(service, manager);
    }
  }, [session?.userId]);

  const loadHomeData = async (service: HomePageAPIService, manager: HomePageSessionManager) => {
    try {
      setLoading(true);

      // Load all home page data in parallel
      const [progress, challenge, completion, content, posts, achievements] = await Promise.all([
        service.getUserProgress(),
        service.getTodayChallenge(),
        Promise.resolve(null), // Will get completion after challenge is loaded
        service.getRecommendedContent(5),
        service.getCommunityPosts('5'),
        service.getUserAchievements(3),
      ]);

      // Get challenge completion if challenge exists
      let challengeCompletion = null;
      if (challenge) {
        challengeCompletion = await service.getUserChallengeCompletion(challenge.id);
      }

      setUserProgress(progress);
      setDailyChallenge(challenge);
      setChallengeCompletion(challengeCompletion);
      setRecommendedContent(content);
      setCommunityPosts(posts);
      setRecentAchievements(achievements);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const raw = await SecureStore.getItemAsync('recent_tools');
      if (raw) {
        const tools = JSON.parse(raw);
        // Sort by timestamp (most recent first)
        tools.sort((a: RecentTool, b: RecentTool) => b.timestamp - a.timestamp);
        setRecent(tools);
      }
    };
    load();
  }, []);

  const handleRecentToolPress = (tool: RecentTool) => {
    // Navigate to the tool's route
    router.push(`/tools/${tool.key}` as any);
  };

  const handleResourcePress = async (resource: LearningResource) => {
    if (apiService && sessionManager) {
      try {
        // Record the interaction
        sessionManager.recordContentView(resource.id, 'article');

        // Navigate to the resource
        router.push(`/learning/${resource.id}` as any);

        // Add XP for viewing
        await apiService.addUserXP(5);
      } catch (error) {
        console.error('Error handling resource press:', error);
      }
    }
  };

  const handleChallengeComplete = async () => {
    if (apiService && dailyChallenge) {
      try {
        await apiService.completeDailyChallenge(dailyChallenge.id);
        // Reload data to update UI
        if (sessionManager) {
          await loadHomeData(apiService, sessionManager);
        }
      } catch (error) {
        console.error('Error completing challenge:', error);
      }
    }
  };

  const handlePostPress = (post: CommunityPost) => {
    router.push(`/community/post/${post.id}` as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading your personalized experience...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Stats and Progress */}
        {userProgress && (
          <UserStatsBadge
            userProgress={userProgress}
            onPress={() => router.push('/profile/progress' as any)}
          />
        )}

        {/* Recently Used Tools - Now First Section */}
        {recent.length > 0 && (
          <View style={{ paddingVertical: 16 }}>
            <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: '600', color: colors.text }}>
              Recently Used Tools
            </Text>
            <FlatList
              horizontal
              data={recent}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleRecentToolPress(item)}
                  style={({ pressed }) => [
                    styles.recentToolCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    },
                  ]}>
                  <View style={[styles.recentToolIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.recentToolText, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Daily Challenge */}
        <DailyChallengeBanner
          challenge={dailyChallenge}
          completion={challengeCompletion}
          onPress={() => router.push('/challenges' as any)}
          onComplete={handleChallengeComplete}
        />

        {/* Recommended Content */}
        {recommendedContent.length > 0 && (
          <RecommendedContent
            resources={recommendedContent}
            onResourcePress={handleResourcePress}
            onViewAll={() => router.push('/learning' as any)}
          />
        )}

        {/* Community Posts */}
        {communityPosts.length > 0 && (
          <CommunitySection
            posts={communityPosts}
            onPostPress={handlePostPress}
            onViewAll={() => router.push('/community' as any)}
          />
        )}

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <RecentAchievements
            achievements={recentAchievements}
            onViewAll={() => router.push('/profile/achievements' as any)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentToolCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentToolIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recentToolText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});
