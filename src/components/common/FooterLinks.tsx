import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { authColors } from '../../theme/authColors';

interface FooterLinksProps {
  onTermsPress: () => void;
  onPrivacyPress: () => void;
  onHelpPress?: () => void;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({
  onTermsPress,
  onPrivacyPress,
  onHelpPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={onPrivacyPress}>
          <Text style={styles.linkText}>Privacy & terms</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity onPress={onHelpPress}>
          <Text style={styles.linkText}>Need help?</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>© 2025 Notion Labs, Inc.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    paddingBottom: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  linksRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  linkText: {
    color: authColors.secondaryText,
    fontSize: 14,
  },
  spacer: {
    width: 20,
  },
  copyright: {
    color: authColors.secondaryText,
    fontSize: 14,
    opacity: 0.6,
  },
});
