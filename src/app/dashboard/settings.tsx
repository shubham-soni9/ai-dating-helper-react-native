import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function SettingsTab() {
  const { colors, mode, setMode } = useTheme();
  const options: { key: 'system' | 'light' | 'dark'; label: string }[] = [
    { key: 'system', label: 'System' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>Settings</Text>
      <Text style={{ marginTop: 8, color: colors.mutedText }}>Theme</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        {options.map((opt) => {
          const selected = mode === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setMode(opt.key)}
              style={{
                backgroundColor: selected ? colors.primary : colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
              }}>
              <Text style={{ color: selected ? colors.onPrimary : colors.text, fontSize: 16 }}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
