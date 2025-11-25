import { useRef } from 'react';
import { View, Text, Pressable, useWindowDimensions, Animated } from 'react-native';
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

  const onPageScroll = (e: PagerViewOnPageScrollEvent) => {
    const { position, offset } = e.nativeEvent;
    const progress = (position + offset) * tabWidth;
    indicatorX.setValue(progress);
  };

  const goTo = (index: number) => pagerRef.current?.setPage(index);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ paddingTop: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          {TABS.map((t, i) => (
            <Pressable
              key={t.key}
              onPress={() => goTo(i)}
              style={{ width: tabWidth, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{t.title}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 2, backgroundColor: '#e5e7eb' }} />
        <Animated.View
          style={{
            height: 3,
            width: tabWidth,
            backgroundColor: '#2563eb',
            transform: [{ translateX: indicatorX }],
          }}
        />
      </View>

      <PagerView ref={pagerRef} style={{ flex: 1 }} initialPage={0} onPageScroll={onPageScroll}>
        <View key="trending" style={{ flex: 1, backgroundColor: '#f0f9ff', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#0f172a' }}>Trending</Text>
          <Text style={{ marginTop: 8, color: '#334155' }}>
            Curated content that’s popular right now.
          </Text>
        </View>
        <View key="nearby" style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#0f172a' }}>Nearby</Text>
          <Text style={{ marginTop: 8, color: '#334155' }}>
            Discover items close to your location.
          </Text>
        </View>
        <View key="top" style={{ flex: 1, backgroundColor: '#fff7ed', padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#0f172a' }}>Top Rated</Text>
          <Text style={{ marginTop: 8, color: '#334155' }}>
            Highly rated picks handpicked for you.
          </Text>
        </View>
      </PagerView>
    </View>
  );
}
