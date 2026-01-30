import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Building2, Globe, Users, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

import { useOrganization } from '@/contexts/OrganizationContext';

export const OrganizationsScreen = () => {
  const { user } = useAuth();
  const { organizations, selectedOrganizationId, setSelectedOrganizationId, isLoading } =
    useOrganization();

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      <View className="px-6 py-4 bg-background-0 border-b border-border">
        <Text className="text-h2 font-bold text-foreground">Organisationer</Text>
        <Text className="text-caption text-muted-foreground">Välj organisation att arbeta med</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <FlatList
          data={organizations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedOrganizationId(item.id)}
              className={`mx-6 mt-4 bg-background-0 p-5 rounded-2xl border shadow-sm active:opacity-90 ${
                selectedOrganizationId === item.id ? 'border-primary' : 'border-border'
              }`}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-4">
                  <Building2 size={24} color="#0EA5E9" />
                </View>
                <View className="flex-1">
                  <Text className="text-body-lg font-bold text-foreground">{item.name}</Text>
                  <Text className="text-caption text-muted-foreground">
                    Orgnr: {item.organization_number || 'Ej angivet'}
                  </Text>
                </View>
                {selectedOrganizationId === item.id && (
                  <View className="bg-emerald-500/10 px-2 py-1 rounded">
                    <Text className="text-[10px] font-bold text-emerald-600 uppercase">Vald</Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center mr-4">
                  <Globe size={14} color="#6B7280" className="mr-1" />
                  <Text className="text-caption text-muted-foreground">SE</Text>
                </View>
                <View className="flex-row items-center">
                  <Users size={14} color="#6B7280" className="mr-1" />
                  <Text className="text-caption text-muted-foreground">
                    {user?.isAdmin ? 'Global Admin' : 'Medlem'}
                  </Text>
                </View>
              </View>

              {selectedOrganizationId === item.id && (
                <View className="mt-4 pt-4 border-t border-border flex-row justify-between items-center">
                  <Text className="text-body-sm font-medium text-primary">Aktiv organisation</Text>
                  <CheckCircle2 size={18} color="#10b981" />
                </View>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20 px-10">
              <Text className="text-body text-muted-foreground text-center">
                Inga organisationer hittades.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
