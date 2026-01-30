import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface MenuHeaderProps {
  title: string;
  onClose: () => void;
}

export const MenuHeader = ({ title, onClose }: MenuHeaderProps) => {
  const { mode } = useTheme();
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-4 border-b ${mode === 'dark' ? 'border-gray-800' : 'border-border'}`}
    >
      <Text className="text-h2 font-bold text-foreground ml-2">{title}</Text>
      <TouchableOpacity onPress={onClose} className="p-2">
        <X size={24} color={mode === 'dark' ? '#9CA3AF' : '#0EA5E9'} />
      </TouchableOpacity>
    </View>
  );
};

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const MenuItem = ({ icon: Icon, title, subtitle, onPress }: MenuItemProps) => {
  const { mode } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-6 py-4 border-b ${mode === 'dark' ? 'border-gray-800/50' : 'border-border/50'}`}
    >
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
        <Icon size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <Text className="text-body-lg font-semibold text-foreground">{title}</Text>
        {subtitle && <Text className="text-caption text-muted-foreground">{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};
