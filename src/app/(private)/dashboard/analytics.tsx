import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { UserStatsBadge, RecentAchievements } from '@/components/home';
import { UserProgress, UserAchievement } from '@/types/home';

type QuickMetric = {
  key: string;
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type RecentTool = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  timestamp: number;
};

export default function AnalyticsTab() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([]);
  const [metrics, setMetrics] = useState<QuickMetric[]>([]);
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.userId) return;
      try {
        setLoading(true);

        const [progressRes, achievementsRes, viewsRes, completionsRes, challengesRes] =
          await Promise.all([
            supabase.from('user_progress').select('*').eq('user_id', session.userId).single(),
            supabase
              .from('user_achievements')
              .select('*')
              .eq('user_id', session.userId)
              .order('unlocked_at', { ascending: false })
              .limit(6),
            supabase
              .from('user_content_interactions')
              .select('*', { count: 'exact' })
              .eq('user_id', session.userId)
              .eq('interaction_type', 'view'),
            supabase
              .from('user_content_interactions')
              .select('*', { count: 'exact' })
              .eq('user_id', session.userId)
              .eq('interaction_type', 'complete'),
            supabase
              .from('user_challenge_completions')
              .select('*', { count: 'exact' })
              .eq('user_id', session.userId),
          ]);

        const progress = 'data' in progressRes ? (progressRes.data as UserProgress) : null;
        const achievements =
          'data' in achievementsRes ? (achievementsRes.data as UserAchievement[]) || [] : [];
        const totalViews = (viewsRes.count as number) || 0;
        const totalCompletions = (completionsRes.count as number) || 0;
        const totalChallengesCompleted = (challengesRes.count as number) || 0;

        setUserProgress(progress);
        setRecentAchievements(achievements);
        setMetrics([
          {
            key: 'views',
            label: 'Content Views',
            value: totalViews,
            icon: 'eye-outline',
            color: '#3b82f6',
          },
          {
            key: 'completions',
            label: 'Completions',
            value: totalCompletions,
            icon: 'checkmark-done-outline',
            color: '#10b981',
          },
          {
            key: 'challenges',
            label: 'Challenges',
            value: totalChallengesCompleted,
            icon: 'trophy-outline',
            color: '#f59e0b',
          },
          {
            key: 'achievements',
            label: 'Achievements',
            value: achievements.length,
            icon: 'sparkles-outline',
            color: '#a855f7',
          },
        ]);

        const recentRaw = await SecureStore.getItemAsync('recent_tools');
        const tools = recentRaw ? (JSON.parse(recentRaw) as RecentTool[]) : [];
        tools.sort((a, b) => b.timestamp - a.timestamp);
        setRecentTools(tools.slice(0, 8));
      } catch (e) {
        setRecentAchievements([]);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.userId]);

  const title = useMemo(() => 'Analytics', []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading insights…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            Your dating journey insights
          </Text>
        </View>

        {userProgress && (
          <View style={styles.section}>
            <UserStatsBadge userProgress={userProgress} />
          </View>
        )}

        {metrics.length > 0 && (
          <View style={styles.section}>
            <View style={styles.metricsGrid}>
              {metrics.map((m) => (
                <View
                  key={m.key}
                  style={[
                    styles.metricCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <View style={[styles.metricIcon, { backgroundColor: m.color + '20' }]}>
                    <Ionicons name={m.icon} size={20} color={m.color} />
                  </View>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{m.value}</Text>
                  <Text style={[styles.metricLabel, { color: colors.mutedText }]}>{m.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {recentAchievements.length > 0 && (
          <View style={styles.section}>
            <RecentAchievements achievements={recentAchievements} onViewAll={() => {}} />
          </View>
        )}

        {recentTools.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently Used Tools</Text>
            </View>
            <FlatList
              horizontal
              data={recentTools}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/tools/${item.key}` as any)}
                  style={[
                    styles.toolCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  <View style={[styles.toolIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.toolText, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 8 },
  header: { paddingHorizontal: 16, marginTop: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  section: { marginBottom: 28 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  metricCard: {
    width: '47%',
    marginHorizontal: '1.5%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: { fontSize: 22, fontWeight: '800' },
  metricLabel: { fontSize: 12, fontWeight: '600' },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  toolCard: {
    width: 120,
    height: 120,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolText: { fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
});
