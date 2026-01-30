import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MessageSquare, ChevronRight, Clock } from 'lucide-react-native';
import { useMessages } from '@/hooks/useMessages';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';

export const MessagesScreen = () => {
  const { sessions } = useMessages();

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      <View className="px-6 py-4 bg-background-0 border-b border-border">
        <Text className="text-h2 font-bold text-foreground">Meddelanden</Text>
        <Text className="text-caption text-muted-foreground">
          Din konversation med AI-assistenten
        </Text>
      </View>

      {sessions.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <FlatList
          data={sessions.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity className="mx-6 mt-4 bg-background-0 p-5 rounded-2xl border border-border shadow-sm flex-row items-center active:opacity-90">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
                <MessageSquare size={24} color="#0EA5E9" />
              </View>
              <View className="flex-1">
                <Text className="text-body-lg font-bold text-foreground mb-1" numberOfLines={1}>
                  {item.title}
                </Text>
                <View className="flex-row items-center">
                  <Clock size={12} color="#6B7280" className="mr-1" />
                  <Text className="text-caption text-muted-foreground">
                    {format(new Date(item.updated_at), 'd MMM HH:mm', { locale: sv })}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20 px-10">
              <MessageSquare size={48} color="#9CA3AF" />
              <Text className="text-h3 font-bold text-foreground mt-4 text-center">
                Inga meddelanden än
              </Text>
              <Text className="text-body text-muted-foreground text-center mt-2">
                Starta en konversation med assistenten på webben för att se dem här.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
