import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Animated,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import PagerView, {
  PagerViewOnPageScrollEvent,
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import { Image as ExpoImage } from 'expo-image';

const TABS = [
  { key: 'trending', title: 'Trending' },
  { key: 'nearby', title: 'Nearby' },
  { key: 'top', title: 'Top Rated' },
];

export default function ExploreTab() {
  const pagerRef = useRef<PagerView>(null);
  const { width } = useWindowDimensions();
  const tabWidth = width / TABS.length;
  const indicatorX = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);

  type RandomUser = {
    name: { first: string; last: string };
    email: string;
    login: { uuid: string };
    nat: string;
    picture: { thumbnail: string; medium: string };
    location: { city: string; country: string };
    phone: string;
  };

  const [topUsers, setTopUsers] = useState<RandomUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadTopUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://randomuser.me/api/?results=10');
      const json = await res.json();
      setTopUsers(json.results as RandomUser[]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefreshUsers = async () => {
    setRefreshing(true);
    try {
      await loadTopUsers();
    } finally {
      setRefreshing(false);
    }
  };

  const onPageScroll = (e: PagerViewOnPageScrollEvent) => {
    const { position, offset } = e.nativeEvent;
    const progress = (position + offset) * tabWidth;
    indicatorX.setValue(progress);
  };

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    const { position } = e.nativeEvent;
    setSelectedIndex(position);
    if (position === 2 && topUsers.length === 0) {
      loadTopUsers();
    }
  };

  const goTo = (index: number) => {
    pagerRef.current?.setPage(index);
    if (index === 2 && topUsers.length === 0) {
      loadTopUsers();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          {TABS.map((t, i) => (
            <Pressable
              key={t.key}
              onPress={() => goTo(i)}
              style={{ width: tabWidth, paddingVertical: 12, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: i === selectedIndex ? '700' : '600',
                  color: i === selectedIndex ? colors.primary : colors.text,
                }}>
                {t.title}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 2, backgroundColor: colors.border }} />
        <Animated.View
          style={{
            height: 3,
            width: tabWidth,
            backgroundColor: colors.primary,
            transform: [{ translateX: indicatorX }],
          }}
        />
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageScroll={onPageScroll}
        onPageSelected={onPageSelected}>
        <View key="trending" style={{ flex: 1, backgroundColor: colors.surface, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text }}>Trending</Text>
          <Text style={{ marginTop: 8, color: colors.mutedText }}>
            Curated content that’s popular right now.
          </Text>
        </View>
        <View key="nearby" style={{ flex: 1, backgroundColor: colors.surface, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text }}>Nearby</Text>
          <Text style={{ marginTop: 8, color: colors.mutedText }}>
            Discover items close to your location.
          </Text>
        </View>
        <View key="top" style={{ flex: 1, backgroundColor: colors.surface }}>
          {loading && topUsers.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.mutedText }}>Loading…</Text>
            </View>
          ) : (
            <FlatList
              data={topUsers}
              keyExtractor={(item) => item.login.uuid}
              refreshing={refreshing}
              onRefresh={onRefreshUsers}
              contentContainerStyle={{ padding: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}>
                  <ExpoImage
                    source={{ uri: item.picture.medium }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    contentFit="cover"
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      {item.name.first} {item.name.last}
                    </Text>
                    <Text style={{ marginTop: 2, color: colors.mutedText }}>{item.email}</Text>
                    <Text style={{ marginTop: 2, color: colors.mutedText }}>
                      {item.location.city}, {item.location.country} · {item.nat}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </PagerView>
    </View>
  );
}
