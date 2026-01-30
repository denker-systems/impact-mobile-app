import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outline';
  children: React.ReactNode;
}

export function Card({ variant = 'default', children, style, ...props }: CardProps) {
  const { isDark } = useTheme();

  const getVariantStyle = () => {
    const bgColor = isDark ? '#1F1F1F' : '#FFFFFF';
    const borderColor = isDark ? '#3D3D3D' : '#E5E5E5';

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: bgColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          elevation: 4,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isDark ? '#3D3D3D' : '#E5E5E5',
        };
      default:
        return {
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: borderColor,
        };
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export function CardHeader({ children, style, ...props }: { children: React.ReactNode } & ViewProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ children, style, ...props }: { children: React.ReactNode } & ViewProps) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, style, ...props }: { children: React.ReactNode } & ViewProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

export default Card;
