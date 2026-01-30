import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import {
  BookOpen,
  TrendingUp,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  BarChart3,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useOrganization } from '@/contexts/OrganizationContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { organizations, selectedOrganizationId } = useOrganization();

  const selectedOrg = organizations.find((o) => o.id === selectedOrganizationId);

  const quickActions = [
    {
      title: 'Discover',
      description: 'Hitta nya anslag',
      icon: <TrendingUp size={20} color="#059669" />,
      onPress: () => navigation.navigate('Discover'),
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Projekt',
      description: 'Mina ansökningar',
      icon: <FileText size={20} color="#7c3aed" />,
      onPress: () => navigation.navigate('Applications'),
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Mognad',
      description: 'Analysera profil',
      icon: <Activity size={20} color="#ea580c" />,
      onPress: () => navigation.navigate('Profile'),
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Meddelanden',
      description: 'Visa chattar',
      icon: <MessageSquare size={20} color="#0284c7" />,
      onPress: () => navigation.navigate('Messages'),
      bgColor: 'bg-sky-100',
    },
    {
      title: 'Rapporter',
      description: 'Framsteg',
      icon: <BarChart3 size={20} color="#2563eb" />,
      onPress: () => navigation.navigate('Reporting'),
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Dokument',
      description: 'Systemguider',
      icon: <BookOpen size={20} color="#4f46e5" />,
      onPress: () => {
        /* TODO */
      },
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4 pb-8">
          <View className="mb-8 flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-body text-muted-foreground">Välkommen tillbaka,</Text>
              <Text className="text-h1 font-bold text-foreground">{user?.name || 'Användare'}</Text>
            </View>
            {selectedOrg && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Organizations')}
                className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
              >
                <Text className="text-primary font-bold text-tiny uppercase">
                  {selectedOrg.name}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-h3 font-bold text-foreground mb-4">Snabbåtgärder</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                className="w-[48%] bg-background-0 p-4 rounded-2xl border border-border mb-4 shadow-sm active:opacity-90"
              >
                <View
                  className={`w-10 h-10 rounded-xl ${action.bgColor} items-center justify-center mb-3`}
                >
                  {action.icon}
                </View>
                <Text className="text-body-lg font-bold text-foreground">{action.title}</Text>
                <Text className="text-caption text-muted-foreground mt-1">
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="bg-background-0 p-6 rounded-2xl border border-border mb-6 shadow-sm">
            <Text className="text-h3 font-bold text-foreground mb-4">Systemstatus</Text>
            <View className="space-y-3">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <CheckCircle2 size={16} color="#10b981" />
                  <Text className="text-body-sm text-foreground ml-2">Autentisering</Text>
                </View>
                <Text className="text-body-sm font-medium text-green-600">Aktiv</Text>
              </View>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <CheckCircle2 size={16} color="#10b981" />
                  <Text className="text-body-sm text-foreground ml-2">Databas</Text>
                </View>
                <Text className="text-body-sm font-medium text-green-600">Ansluten</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <AlertTriangle size={16} color="#f59e0b" />
                  <Text className="text-body-sm text-foreground ml-2">AI-tjänster</Text>
                </View>
                <Text className="text-body-sm font-medium text-amber-600">Konfigureras</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-background-100 border border-border p-4 rounded-xl items-center"
            onPress={logout}
          >
            <Text className="text-foreground font-medium">Logga ut</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
