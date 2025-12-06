import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authColors } from '../../theme/authColors';
import { CustomTextInput } from '../common/CustomTextInput';
import { CustomButton } from '../common/CustomButton';
import { ResendTimer } from './ResendTimer';

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
        <Text style={styles.label}>Email</Text>
        <View style={styles.emailBox}>
          <Text style={styles.emailText}>{email}</Text>
          <TouchableOpacity onPress={onEditEmail} style={styles.closeButton}>
            <Ionicons name="close-circle" size={20} color={authColors.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.helperText}>
        Use an organisation email to easily collaborate with teammates
      </Text>

      <View style={styles.spacer} />

      <CustomTextInput
        label="Verification code"
        value={code}
        onChangeText={(text) => {
          setCode(text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
          onErrorClear();
        }}
        placeholder="Enter code"
        maxLength={8}
        autoCapitalize="characters"
        error={error}
      />

      <Text style={styles.sentText}>We have sent a code to your inbox</Text>

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
    marginBottom: 8,
  },
  label: {
    color: authColors.secondaryText,
    fontSize: 14,
    marginBottom: 8,
  },
  emailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: authColors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: authColors.inputBorder,
  },
  emailText: {
    color: authColors.text,
    fontSize: 16,
  },
  closeButton: {
    padding: 4,
  },
  helperText: {
    color: authColors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  spacer: {
    height: 16,
  },
  sentText: {
    color: authColors.secondaryText,
    fontSize: 14,
    marginTop: 8,
  },
});
