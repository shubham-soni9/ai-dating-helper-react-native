import { Tabs } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Tabs initialRouteName="home" screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
      <Tabs.Screen name="home" options={{ tabBarLabel: 'Home', title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ tabBarLabel: 'Explore', title: 'Explore' }} />
      <Tabs.Screen name="favorites" options={{ tabBarLabel: 'Favorites', title: 'Favorites' }} />
      <Tabs.Screen name="messages" options={{ tabBarLabel: 'Messages', title: 'Messages' }} />
      <Tabs.Screen name="settings" options={{ tabBarLabel: 'Settings', title: 'Settings' }} />
    </Tabs>
  );
}
