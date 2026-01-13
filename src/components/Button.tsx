import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
};

export default function Button({ title, onPress, variant = 'primary', style, disabled }: Props) {
  const { colors } = useTheme();
  const base = [styles.base, style];
  const themed =
    variant === 'primary'
      ? { backgroundColor: colors.primary }
      : { borderColor: colors.border, borderWidth: 1, backgroundColor: 'transparent' };
  const textColor = variant === 'primary' ? colors.onPrimary : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[...base, themed, disabled ? { opacity: 0.6 } : null]}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
