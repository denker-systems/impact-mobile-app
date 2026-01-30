import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Shield, ChevronRight } from 'lucide-react-native';
import { useMaturity } from '@/hooks/useMaturity';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { StatusBar } from 'expo-status-bar';

export const ProfileScreen = () => {
  const { user } = useAuth();
  const { selectedOrganizationId } = useOrganization();
  const { data: categories, isLoading } = useMaturity(selectedOrganizationId || undefined);

  const calculateTotalScore = () => {
    if (!categories || categories.length === 0) return 0;
    const totalCompleted = categories.reduce((sum, cat) => sum + cat.completedCount, 0);
    const totalCriteria = categories.reduce((sum, cat) => sum + cat.totalCount, 0);
    return totalCriteria > 0 ? Math.round((totalCompleted / totalCriteria) * 100) : 0;
  };

  const getMaturityLevel = (score: number) => {
    if (score < 20) return { label: 'Grundläggande', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (score < 40)
      return { label: 'Utvecklande', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    if (score < 60)
      return { label: 'Etablerad', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (score < 80) return { label: 'Avancerad', color: 'text-blue-500', bgColor: 'bg-blue-500' };
    return { label: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-500' };
  };

  const totalScore = calculateTotalScore();
  const maturity = getMaturityLevel(totalScore);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background-50">
      <StatusBar style="auto" />

      {/* Profile Header */}
      <View className="bg-background-0 px-6 pt-8 pb-10 rounded-b-[40px] shadow-sm">
        <View className="flex-row items-center mb-6">
          <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mr-4">
            <Shield size={32} color="#0EA5E9" />
          </View>
          <View>
            <Text className="text-h2 font-bold text-foreground">{user?.name}</Text>
            <Text className="text-body text-muted-foreground">{user?.email}</Text>
          </View>
        </View>

        <View className="bg-background-50 p-6 rounded-3xl border border-border">
          <View className="flex-row justify-between items-end mb-2">
            <View>
              <Text className="text-caption font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Bidragsmognad
              </Text>
              <Text className={`text-h2 font-bold ${maturity.color}`}>{maturity.label}</Text>
            </View>
            <Text className={`text-display font-bold ${maturity.color}`}>{totalScore}%</Text>
          </View>

          <View className="h-3 bg-background-200 rounded-full overflow-hidden mt-2">
            <View className={`h-full ${maturity.bgColor}`} style={{ width: `${totalScore}%` }} />
          </View>
        </View>
      </View>

      {/* Maturity Categories */}
      <View className="px-6 py-8">
        <Text className="text-h3 font-bold text-foreground mb-4">Kategorier</Text>

        {categories?.map((category) => {
          const categoryScore =
            category.totalCount > 0
              ? Math.round((category.completedCount / category.totalCount) * 100)
              : 0;
          const catMaturity = getMaturityLevel(categoryScore);

          return (
            <TouchableOpacity
              key={category.id}
              className="bg-background-0 p-5 rounded-2xl border border-border mb-4 flex-row items-center active:opacity-90"
            >
              <View className="flex-1">
                <Text className="text-body-lg font-bold text-foreground mb-1">{category.name}</Text>
                <View className="flex-row items-center">
                  <Text className="text-caption text-muted-foreground">
                    {category.completedCount} av {category.totalCount} kriterier
                  </Text>
                  <View className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-2" />
                  <Text className={`text-caption font-bold ${catMaturity.color}`}>
                    {categoryScore}%
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Account Settings */}
      <View className="px-6 pb-12">
        <Text className="text-h3 font-bold text-foreground mb-4">Konto</Text>
        <TouchableOpacity className="bg-background-0 p-5 rounded-2xl border border-border mb-3 flex-row items-center">
          <Text className="text-body-lg font-medium text-foreground flex-1">Redigera profil</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-background-0 p-5 rounded-2xl border border-border flex-row items-center">
          <Text className="text-body-lg font-medium text-foreground flex-1">
            Säkerhetsinställningar
          </Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
