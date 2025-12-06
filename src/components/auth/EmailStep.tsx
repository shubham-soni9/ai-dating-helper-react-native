import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { authColors } from '../../theme/authColors';
import { CustomTextInput } from '../common/CustomTextInput';
import { CustomButton } from '../common/CustomButton';
import { validateEmail } from '../../utils/validation';

interface EmailStepProps {
  email: string;
  onChangeEmail: (text: string) => void;
  onContinue: () => void;
  loading: boolean;
  error: string;
  onErrorClear: () => void;
}

export const EmailStep: React.FC<EmailStepProps> = ({
  email,
  onChangeEmail,
  onContinue,
  loading,
  error,
  onErrorClear,
}) => {
  const isValid = validateEmail(email);

  return (
    <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <CustomTextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          onChangeEmail(text);
          onErrorClear();
        }}
        placeholder="name@work-email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        showClearButton
        onClear={() => {
          onChangeEmail('');
          onErrorClear();
        }}
        error={error}
      />

      <Text style={styles.helperText}>
        Use an organisation email to easily collaborate with teammates
      </Text>

      <View style={styles.spacer} />

      <CustomButton
        title="Continue"
        onPress={onContinue}
        disabled={!isValid}
        loading={loading}
      />
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
  helperText: {
    color: authColors.secondaryText,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
    lineHeight: 20,
  },
  spacer: {
    height: 16,
  },
});
