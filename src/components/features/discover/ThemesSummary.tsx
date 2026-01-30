import React from 'react';
import { View, Text } from 'react-native';

interface ThemesSummaryProps {
  themes?: string[];
}

export const ThemesSummary = ({ themes }: ThemesSummaryProps) => {
  if (!themes || themes.length === 0) return null;

  return (
    <View className="bg-background-0 p-6 rounded-3xl border border-border shadow-sm">
      <Text className="text-tiny font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Kategorier & Teman
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {themes.map((theme) => (
          <View
            key={theme}
            className="bg-background-50 px-3 py-1.5 rounded-xl border border-border"
          >
            <Text className="text-caption font-medium text-foreground">{theme}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
