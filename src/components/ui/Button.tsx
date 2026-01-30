import React from 'react';
import { Pressable, PressableProps, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary dark:bg-primary-400',
    text: 'text-white dark:text-background-0',
  },
  secondary: {
    container: 'bg-background-100 dark:bg-background-200',
    text: 'text-foreground',
  },
  outline: {
    container: 'border border-border bg-transparent',
    text: 'text-foreground',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-foreground',
  },
  destructive: {
    container: 'bg-red-500 dark:bg-red-600',
    text: 'text-white',
  },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'h-9 px-4',
    text: 'text-[13px]',
  },
  md: {
    container: 'h-12 px-6',
    text: 'text-[15px]',
  },
  lg: {
    container: 'h-14 px-8',
    text: 'text-[17px]',
  },
  icon: {
    container: 'h-11 w-11',
    text: '',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onPress,
  ...props
}: ButtonProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  const handlePress = (e: any) => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.(e);
    }
  };

  const containerClasses = `
    flex-row items-center justify-center rounded-2xl
    ${variantStyle.container}
    ${sizeStyle.container}
    ${disabled ? 'opacity-50' : ''}
    ${className}
  `.trim();

  const textClasses = `
    font-bold
    ${variantStyle.text}
    ${sizeStyle.text}
  `.trim();

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={containerClasses}
      {...props}
    >
      {({ pressed }) => (
        <MotiView
          animate={{
            scale: pressed ? 0.96 : 1,
            opacity: pressed ? 0.9 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 300,
          }}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
          {typeof children === 'string' ? (
            <Text className={textClasses}>{children}</Text>
          ) : (
            children
          )}
          {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
        </MotiView>
      )}
    </Pressable>
  );
}

export default Button;
