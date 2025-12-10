import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/auth/AuthProvider';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress: () => void;
  isDestructive?: boolean;
  showArrow?: boolean;
}

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: colors.mutedText }]}>{message}</Text>

          {isLoading && (
            <View style={styles.modalLoading}>
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={[styles.modalLoadingText, { color: colors.mutedText }]}>
                Please wait...
              </Text>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onCancel}
              disabled={isLoading}>
              <Text style={[styles.modalButtonText, { color: colors.mutedText }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonConfirm,
                { backgroundColor: colors.primary },
              ]}
              onPress={onConfirm}
              disabled={isLoading}>
              <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function ProfileTab() {
  const { colors, isDark, setMode } = useTheme();
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const openEmailClient = (subject: string, body: string = '') => {
    const email = 'support@aidatingassistant.com';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Email App Not Found', 'Please set up an email app to send feedback.', [
          { text: 'OK' },
        ]);
      }
    });
  };

  const handleSignOut = async () => {
    setShowSignOutModal(false);
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace('/welcome');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Sign Out Error', 'Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  const profileSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile-info',
          title: 'Profile Information',
          subtitle: 'View and edit your profile',
          icon: 'person-circle',
          color: '#007AFF',
          onPress: () => {
            // Navigate to profile edit screen
            Alert.alert('Coming Soon', 'Profile editing will be available soon!');
          },
          showArrow: true,
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          icon: 'notifications',
          color: '#FF9500',
          onPress: () => {
            Alert.alert('Coming Soon', 'Notification settings will be available soon!');
          },
          showArrow: true,
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Control your privacy settings',
          icon: 'shield-checkmark',
          color: '#30D158',
          onPress: () => {
            Alert.alert('Coming Soon', 'Privacy settings will be available soon!');
          },
          showArrow: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'report-bug',
          title: 'Report a Bug',
          subtitle: "Tell us about any issues you're experiencing",
          icon: 'bug',
          color: '#FF3B30',
          onPress: () => {
            openEmailClient(
              'Bug Report - AI Dating Assistant',
              `App Version: ${Platform.OS} ${Platform.Version}\nDevice: ${Platform.OS}\n\nPlease describe the bug:\n\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behavior:\n\nActual behavior:\n\nScreenshots or screen recordings are helpful!`
            );
          },
        },
        {
          id: 'feature-request',
          title: 'Request a Feature',
          subtitle: 'Suggest new features or improvements',
          icon: 'bulb-outline',
          color: '#FFCC00',
          onPress: () => {
            openEmailClient(
              'Feature Request - AI Dating Assistant',
              `What feature would you like to see?\n\nFeature description:\n\nWhy would this be useful?\n\nHow should it work?\n\nAny examples or references?`
            );
          },
        },
        {
          id: 'contact-support',
          title: 'Contact Support',
          subtitle: 'Get help with any questions',
          icon: 'help-circle',
          color: '#5856D6',
          onPress: () => {
            openEmailClient(
              'Support Request - AI Dating Assistant',
              `How can we help you?\n\nYour question or issue:\n\nAny relevant details:\n\n`
            );
          },
        },
        {
          id: 'faq',
          title: 'FAQ & Help Center',
          subtitle: 'Find answers to common questions',
          icon: 'information-circle',
          color: '#5AC8FA',
          onPress: () => {
            Alert.alert(
              'FAQ',
              'Frequently Asked Questions:\n\n• How do I get better matches?\n• What tools should I use first?\n• How is my data protected?\n• Can I share my success stories?\n\nMore detailed FAQ coming soon!'
            );
          },
        },
      ],
    },
    {
      title: 'App Info',
      items: [
        {
          id: 'rate-app',
          title: 'Rate App',
          subtitle: 'Leave us a review on the App Store',
          icon: 'star',
          color: '#FFCC00',
          onPress: () => {
            Alert.alert('Rate AI Dating Assistant', 'Enjoying the app? Leave us a review!', [
              { text: 'Later', style: 'cancel' },
              { text: 'Rate Now', onPress: () => console.log('Navigate to app store') },
            ]);
          },
        },
        {
          id: 'share-app',
          title: 'Share App',
          subtitle: 'Recommend us to friends',
          icon: 'share-social',
          color: '#007AFF',
          onPress: () => {
            const shareText =
              "Check out AI Dating Assistant - it's helped me improve my dating game! 🚀";
            Alert.alert('Share App', shareText, [
              { text: 'Copy Link', onPress: () => console.log('Copy to clipboard') },
              { text: 'Share', onPress: () => console.log('Open share sheet') },
              { text: 'Cancel', style: 'cancel' },
            ]);
          },
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          icon: 'document-text',
          color: '#8E8E93',
          onPress: () => {
            Alert.alert('Terms of Service', 'Terms of Service will open in your browser');
          },
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          subtitle: 'Learn how we protect your data',
          icon: 'lock-closed',
          color: '#8E8E93',
          onPress: () => {
            Alert.alert('Privacy Policy', 'Privacy Policy will open in your browser');
          },
        },
        {
          id: 'app-version',
          title: 'App Version',
          subtitle: '1.0.0',
          icon: 'phone-portrait',
          color: '#8E8E93',
          onPress: () => {
            Alert.alert(
              'App Information',
              `AI Dating Assistant\nVersion: 1.0.0\nPlatform: ${Platform.OS}\nOS Version: ${Platform.Version}\n\nBuilt with ❤️ for better dating`
            );
          },
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={item.onPress}>
      <View style={styles.menuItemContent}>
        <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.menuSubtitle, { color: colors.mutedText }]}>{item.subtitle}</Text>
          )}
        </View>
        {item.showArrow && <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.profileCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="person" size={32} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {profile?.name || 'Guest User'}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.mutedText }]}>
                  {profile?.email || 'Not signed in'}
                </Text>
              </View>
            </View>

            {/* Dark Mode Toggle */}
            <View style={[styles.darkModeContainer, { borderTopColor: colors.border }]}>
              <View style={styles.darkModeContent}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.primary} />
                <View style={styles.darkModeTextContainer}>
                  <Text style={[styles.darkModeTitle, { color: colors.text }]}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                  <Text style={[styles.darkModeSubtitle, { color: colors.mutedText }]}>
                    {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={(v) => setMode(v ? 'dark' : 'light')}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={'#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {profileSections.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.mutedText }]}>{section.title}</Text>
            <View style={[styles.sectionItems, { borderColor: colors.border }]}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={[
              styles.signOutButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => setShowSignOutModal(true)}
            disabled={isSigningOut}>
            <Ionicons name="log-out" size={24} color="#FF3B30" />
            <Text style={[styles.signOutText, { color: '#FF3B30' }]}>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Footer */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.mutedText }]}>AI Dating Assistant</Text>
          <Text style={[styles.footerVersion, { color: colors.mutedText }]}>
            Version 1.0.0 • Built with ❤️
          </Text>
        </View>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <ConfirmationModal
        visible={showSignOutModal}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your account."
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutModal(false)}
        isLoading={isSigningOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  darkModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  darkModeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  darkModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  darkModeSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionItems: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  signOutContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLoading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalLoadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F2F2F7',
  },
  modalButtonConfirm: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
