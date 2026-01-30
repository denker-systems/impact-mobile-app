import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch {
      // Fel hanteras av AuthContext men vi kan visa lokalt om vi vill
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-0"
    >
      <StatusBar style="auto" />
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
          <Text className="text-display font-bold text-primary">Impact</Text>
          <Text className="text-body text-muted-foreground">Logga in på ditt anslagskonto</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-body-sm font-medium text-foreground mb-1">E-post</Text>
            <TextInput
              className="bg-background-50 border border-border p-4 rounded-md text-foreground"
              placeholder="namn@exempel.se"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-body-sm font-medium text-foreground mb-1">Lösenord</Text>
            <TextInput
              className="bg-background-50 border border-border p-4 rounded-md text-foreground"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && (
            <Text className="text-error text-body-sm mt-2">
              {error.message || 'Ett fel uppstod vid inloggning'}
            </Text>
          )}

          <TouchableOpacity
            className={`bg-primary p-4 rounded-md items-center mt-4 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-body-lg">Logga in</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
