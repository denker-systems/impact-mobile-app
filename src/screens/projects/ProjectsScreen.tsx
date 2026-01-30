import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Plus, Briefcase, ChevronRight, Calendar, Info } from 'lucide-react-native';
import { useProjects } from '@/hooks/useProjects';
import { useOrganization } from '@/contexts/OrganizationContext';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProjectsScreen = () => {
  const { selectedOrganizationId } = useOrganization();
  const navigation = useNavigation<NavigationProp>();
  const { data: projects, isLoading, refetch } = useProjects(selectedOrganizationId || undefined);

  const renderHeader = () => (
    <View className="px-6 py-4 bg-background-0 border-b border-border flex-row justify-between items-center">
      <View>
        <Text className="text-h2 font-bold text-foreground">Projekt</Text>
        <Text className="text-caption text-muted-foreground">
          {projects?.length || 0} aktiva projekt
        </Text>
      </View>
      <TouchableOpacity
        className="bg-primary w-10 h-10 rounded-full items-center justify-center shadow-lg"
        onPress={() => {
          /* TODO: Skapa projekt modal */
        }}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      {renderHeader()}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProjectDetails', { id: item.id })}
              className="mx-6 mt-4 bg-background-0 p-5 rounded-3xl border border-border shadow-sm active:opacity-90"
            >
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                  <Briefcase size={24} color="#0EA5E9" />
                </View>
                <View className="flex-1">
                  <Text className="text-body-lg font-bold text-foreground mb-1" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View className="bg-background-100 self-start px-2 py-0.5 rounded border border-border">
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                      {item.status || 'Utkast'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>

              {item.description && (
                <Text className="text-caption text-muted-foreground mb-4" numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              <View className="flex-row items-center pt-4 border-t border-border/50">
                <Calendar size={14} color="#6B7280" className="mr-1.5" />
                <Text className="text-caption text-muted-foreground">
                  Skapad {format(new Date(item.created_at), 'd MMM yyyy', { locale: sv })}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20 px-10">
              <Info size={48} color="#9CA3AF" />
              <Text className="text-h3 font-bold text-foreground mt-4 text-center">
                Inga projekt än
              </Text>
              <Text className="text-body text-muted-foreground text-center mt-2">
                Här samlas alla dina anslagsfinansierade projekt.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
