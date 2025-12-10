import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {/* User Stats and Progress */}
        {userProgress && (
          <View style={styles.section}>
            <UserStatsBadge
              userProgress={userProgress}
              onPress={() => router.push('/profile/progress' as any)}
            />
          </View>
        )}

        {/* Recently Used Tools - Redesigned Section */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                marginBottom: 16,
              }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
                Quick Access
              </Text>
              <TouchableOpacity onPress={() => router.push('/(private)/dashboard/tools' as any)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={recent}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
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
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    },
                  ]}>
                  <View style={[styles.recentToolIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>
                  <Text
                    style={[styles.recentToolText, { color: colors.text, marginTop: 12 }]}
                    numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Ionicons name="time-outline" size={14} color={colors.mutedText} />
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Daily Challenge - Only show if challenge exists for current date */}
        {dailyChallenge && (
          <View style={styles.section}>
            <DailyChallengeBanner
              challenge={dailyChallenge}
              completion={challengeCompletion}
              onComplete={handleChallengeComplete}
            />
          </View>
        )}

        {/* Recommended Content */}
        {recommendedContent.length > 0 && (
          <View style={styles.section}>
            <RecommendedContent
              resources={recommendedContent}
              onResourcePress={handleResourcePress}
              onViewAll={() => router.push('/learning' as any)}
            />
          </View>
        )}

        {/* Community Posts */}
        {communityPosts.length > 0 && (
          <View style={styles.section}>
            <CommunitySection
              posts={communityPosts}
              onPostPress={handlePostPress}
              onViewAll={() => router.push('/community' as any)}
            />
          </View>
        )}

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <View style={styles.section}>
            <RecentAchievements
              achievements={recentAchievements}
              onViewAll={() => router.push('/profile/achievements' as any)}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
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
    width: 110,
    height: 130,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentToolIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recentToolText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});
