import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';

export default function DashboardLayout() {
  const { colors } = useTheme();
  const { subscription } = useAuth();
  // Dummy Change
  // const isPaid = subscription.isSubscribed || subscription.trialActive;
  const isPaid = true;
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Protected guard={isPaid}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: 'Home',
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            tabBarLabel: 'History',
            title: 'History',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'time' : 'time-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            tabBarLabel: 'Tools',
            title: 'Tools',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="resources"
          options={{
            tabBarLabel: 'Resources',
            title: 'Resources',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'Profile',
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
