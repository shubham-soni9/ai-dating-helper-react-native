import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LearningResource } from '@/types/home';
import { HomePageAPIService } from '@/services/home/HomePageAPIService';
import { useAuth } from '@/auth/AuthProvider';
import { WebView } from 'react-native-webview';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearningDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { session } = useAuth();

  const [resource, setResource] = useState<LearningResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiService, setApiService] = useState<HomePageAPIService | null>(null);
  const [webViewLoading, setWebViewLoading] = useState(true);

  const loadResource = useCallback(
    async (service: HomePageAPIService) => {
      try {
        setLoading(true);

        // Fetch the resource from the API
        const { data, error } = await supabase
          .from('learning_resources')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Resource not found
            setResource(null);
          } else {
            throw error;
          }
        } else if (data) {
          setResource(data as LearningResource);
        }
      } catch (error) {
        console.error('Error loading resource:', error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (session?.userId) {
      const service = new HomePageAPIService(session.userId);
      setApiService(service);
      loadResource(service);
    }
  }, [session?.userId, id, loadResource]);

  const handleComplete = async () => {
    if (apiService && resource) {
      try {
        // Record completion interaction
        await apiService.recordContentInteraction(
          resource.id,
          'article',
          'complete',
          resource.estimated_read_time
        );

        // Add XP for completing
        await apiService.addUserXP(resource.xp_reward);

        // Navigate back
        router.back();
      } catch (error) {
        console.error('Error completing resource:', error);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading resource...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!resource) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color={colors.mutedText} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Resource Not Found</Text>
          <Text style={[styles.emptyDescription, { color: colors.mutedText }]}>
            The learning resource you&apos;re looking for doesn&apos;t exist or has been removed.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryIcons = {
    messaging: 'chatbubble',
    profile: 'person',
    dating: 'heart',
    social: 'people',
    relationship: 'infinite',
  };

  const categoryColors = {
    messaging: '#3B82F6',
    profile: '#10B981',
    dating: '#EF4444',
    social: '#8B5CF6',
    relationship: '#F59E0B',
  };

  const iconName =
    categoryIcons[resource.category as keyof typeof categoryIcons] || 'document-text';
  const iconColor = categoryColors[resource.category as keyof typeof categoryColors] || '#6B7280';

  const formatReadTime = (minutes: number): string => {
    if (minutes < 1) return '< 1 min read';
    return `${minutes} min read`;
  };

  const getDifficultyLabel = (level: number): string => {
    const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[level - 1] || 'Medium';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Learning Resource</Text>
        <View style={styles.viewModeButton} />
      </View>

      {resource?.url ? (
        // WebView Mode
        <View style={styles.webViewContainer}>
          {webViewLoading && (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>Loading article...</Text>
            </View>
          )}
          <WebView
            source={{ uri: resource.url }}
            style={styles.webView}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            startInLoadingState={false}
          />
          {/* Complete Button for WebView */}
          <TouchableOpacity
            style={[
              styles.completeButtonSticky,
              {
                backgroundColor: colors.primary,
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
              },
            ]}
            onPress={handleComplete}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Complete (+{resource.xp_reward} XP)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Content Mode (existing implementation)
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Content */}
          <View
            style={[
              styles.contentCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                shadowOpacity: 0.06,
                shadowRadius: 3,
                elevation: 2,
              },
            ]}>
            {/* Category Icon */}
            <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
              <Ionicons name={iconName as any} size={32} color={iconColor} />
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>{resource.title}</Text>

            {/* Author */}
            {resource.author_name && (
              <View style={styles.authorContainer}>
                <Text style={[styles.authorName, { color: colors.text }]}>
                  {resource.author_name}
                </Text>
                {resource.author_title && (
                  <Text style={[styles.authorTitle, { color: colors.mutedText }]}>
                    {resource.author_title}
                  </Text>
                )}
              </View>
            )}

            {/* Meta Info */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="time" size={16} color={colors.mutedText} />
                <Text style={[styles.metaText, { color: colors.mutedText }]}>
                  {formatReadTime(resource.estimated_read_time)}
                </Text>
              </View>

              <View style={[styles.difficultyBadge, { backgroundColor: iconColor + '20' }]}>
                <Text style={[styles.difficultyText, { color: iconColor }]}>
                  {getDifficultyLabel(resource.difficulty_level)}
                </Text>
              </View>
            </View>

            {/* Content */}
            <Text style={[styles.content, { color: colors.text }]}>{resource.content}</Text>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {resource.tags.map((tag, index) => (
                  <View
                    key={`${tag}-${index}`}
                    style={[styles.tag, { backgroundColor: colors.border }]}>
                    <Text style={[styles.tagText, { color: colors.mutedText }]}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={16} color={colors.mutedText} />
                <Text style={[styles.statText, { color: colors.mutedText }]}>
                  {resource.views_count} views
                </Text>
              </View>
              {resource.completion_count > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.mutedText} />
                  <Text style={[styles.statText, { color: colors.mutedText }]}>
                    {resource.completion_count} completed
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              {
                backgroundColor: colors.primary,
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
              },
            ]}
            onPress={handleComplete}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Complete (+{resource.xp_reward} XP)</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackButton: {
    padding: 8,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  contentCard: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 30,
  },
  authorContainer: {
    marginBottom: 16,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonSticky: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewModeButton: {
    padding: 8,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
  },
});
