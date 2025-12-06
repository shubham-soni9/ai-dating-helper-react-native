import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authColors } from '../../theme/authColors';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  showClearButton,
  onClear,
  style,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          !!error && styles.inputContainerError,
        ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={authColors.secondaryText}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showClearButton && value ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={authColors.secondaryText} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: authColors.secondaryText,
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authColors.inputBackground,
    borderWidth: 1,
    borderColor: authColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  inputContainerFocused: {
    borderColor: authColors.inputBorderFocused,
  },
  inputContainerError: {
    borderColor: authColors.error,
  },
  input: {
    flex: 1,
    color: authColors.text,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  errorText: {
    color: authColors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
