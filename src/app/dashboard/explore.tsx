import { useRef } from 'react';
import { View, Text, Pressable, useWindowDimensions, Animated } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';

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

  const onPageScroll = (e: PagerViewOnPageScrollEvent) => {
    const { position, offset } = e.nativeEvent;
    const progress = (position + offset) * tabWidth;
    indicatorX.setValue(progress);
  };

  const goTo = (index: number) => pagerRef.current?.setPage(index);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          {TABS.map((t, i) => (
            <Pressable
              key={t.key}
              onPress={() => goTo(i)}
              style={{ width: tabWidth, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{t.title}</Text>
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

      <PagerView ref={pagerRef} style={{ flex: 1 }} initialPage={0} onPageScroll={onPageScroll}>
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
        <View key="top" style={{ flex: 1, backgroundColor: colors.surface, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text }}>Top Rated</Text>
          <Text style={{ marginTop: 8, color: colors.mutedText }}>
            Highly rated picks handpicked for you.
          </Text>
        </View>
      </PagerView>
    </View>
  );
}
