import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

import { EditScreenInfo } from './EditScreenInfo';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  const { colors } = useTheme();
  return (
    <View className={styles.container} style={{ backgroundColor: colors.background }}>
      <Text className={styles.title} style={{ color: colors.text }}>
        {title}
      </Text>
      <View className={styles.separator} style={{ backgroundColor: colors.border }} />
      <View style={{ padding: 8 }}>
        <EditScreenInfo path={path} />
      </View>
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5`,
  title: `text-xl font-bold`,
};
