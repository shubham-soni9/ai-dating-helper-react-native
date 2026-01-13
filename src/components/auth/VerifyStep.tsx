import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput } from '../common/CustomTextInput';
import { CustomButton } from '../common/CustomButton';
import { ResendTimer } from './ResendTimer';
import { useTheme } from '@/theme/ThemeProvider';

interface VerifyStepProps {
  email: string;
  onEditEmail: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  loading: boolean;
  error: string;
  onErrorClear: () => void;
}

export const VerifyStep: React.FC<VerifyStepProps> = ({
  email,
  onEditEmail,
  onVerify,
  onResend,
  loading,
  error,
  onErrorClear,
}) => {
  const [code, setCode] = useState('');
  const [timerKey, setTimerKey] = useState(0);
  const { colors } = useTheme();

  const handleResend = () => {
    onResend();
    setTimerKey((prev) => prev + 1);
  };

  return (
    <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Email Display */}
      <View style={styles.emailContainer}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Email</Text>
        <View style={styles.emailBox}>
          <Text style={[styles.emailText, { color: colors.text }]}>{email}</Text>
          <TouchableOpacity onPress={onEditEmail} style={styles.closeButton}>
            <Ionicons name="close-circle" size={20} color={colors.mutedText} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.helperText, { color: colors.mutedText }]}>
        Use an organisation email to easily collaborate with teammates
      </Text>

      <View style={styles.spacer} />

      <CustomTextInput
        label="Verification code"
        value={code}
        onChangeText={(text) => {
          setCode(text.replace(/[^0-9]/g, ''));
          onErrorClear();
        }}
        placeholder="Enter code"
        maxLength={8}
        keyboardType="number-pad"
        error={error}
      />

      <Text style={[styles.sentText, { color: colors.primary }]}>
        We have sent a code to your inbox
      </Text>

      <View style={styles.spacer} />

      <CustomButton
        title="Continue"
        onPress={() => onVerify(code)}
        disabled={code.length !== 8}
        loading={loading}
      />

      <ResendTimer key={timerKey} initialSeconds={30} onResend={handleResend} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  emailContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  emailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d', // Should be replaced with theme border
  },
  emailText: {
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  helperText: {
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
    lineHeight: 20,
  },
  spacer: {
    height: 16,
  },
  sentText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
