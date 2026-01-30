import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Plus, FileText } from 'lucide-react-native';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationCard } from '@/components/features/applications/ApplicationCard';
import { StatusBar } from 'expo-status-bar';

export const ApplicationsScreen = () => {
  const { data: applications, isLoading, refetch } = useApplications();

  const renderHeader = () => (
    <View className="px-6 py-4 bg-background-0 border-b border-border flex-row justify-between items-center">
      <View>
        <Text className="text-h2 font-bold text-foreground">Mina projekt</Text>
        <Text className="text-caption text-muted-foreground">
          {applications?.length || 0} pågående ansökningar
        </Text>
      </View>
      <TouchableOpacity
        className="bg-primary w-10 h-10 rounded-full items-center justify-center shadow-lg"
        onPress={() => {
          /* TODO: Ny ansökan */
        }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      {renderHeader()}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text className="text-muted-foreground mt-4 text-body">Hämtar projekt...</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-6">
              <ApplicationCard
                application={item}
                onPress={() => {
                  // TODO: Navigate to Details/Editor
                }}
              />
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20 px-10">
              <View className="w-20 h-20 bg-background-100 rounded-full items-center justify-center mb-6">
                <FileText size={40} color="#9CA3AF" />
              </View>
              <Text className="text-h3 font-bold text-foreground text-center mb-2">
                Inga projekt än
              </Text>
              <Text className="text-body text-muted-foreground text-center">
                Du har inte skapat några ansökningar än. Starta ditt första projekt genom att trycka
                på plus-knappen.
              </Text>
            </View>
          )}
          onRefresh={() => {
            refetch();
          }}
          refreshing={isLoading}
        />
      )}
    </View>
  );
};
