import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

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
  const { colors } = useTheme();

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
      {label && <Text style={[styles.label, { color: colors.mutedText }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: '#27272a', // Slightly lighter than background #191919 or #0f172a
            borderColor: colors.border,
          },
          isFocused && { borderColor: colors.primary },
          !!error && { borderColor: colors.accent }, // Using accent for error temporarily or define error color in theme
        ]}>
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.mutedText}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showClearButton && value ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.mutedText} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
