import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Building2, Calendar, Coins, ExternalLink, ArrowLeft } from 'lucide-react-native';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { GrantWithDetails } from '@/types/grant-details';
import { GdpDetailsSection } from '@/components/features/discover/GdpDetailsSection';
import { EligibilitySection } from '@/components/features/discover/EligibilitySection';
import { RequiredDocumentsSection } from '@/components/features/discover/RequiredDocumentsSection';
import { ApplicationProcessSection } from '@/components/features/discover/ApplicationProcessSection';
import { ThemesSummary } from '@/components/features/discover/ThemesSummary';
import { StatusBar } from 'expo-status-bar';

export const SwedishGrantDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;

  const { data: grant, isLoading } = useQuery({
    queryKey: ['grant-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('swedish_grants')
        .select(
          `
          *,
          publisher:grant_publishers(*),
          details:grant_application_details(*)
        `,
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as GrantWithDetails;
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (!grant) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-h3 font-bold text-foreground">Hittade inte anslaget</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-primary font-bold">Gå tillbaka</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      <View className="flex-row items-center px-6 py-4 bg-background-0 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#0EA5E9" />
        </TouchableOpacity>
        <Text className="text-body-lg font-bold text-foreground flex-1" numberOfLines={1}>
          {grant.title}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 space-y-8">
          {/* Hero Header */}
          <View className="bg-background-0 p-6 rounded-3xl border border-border shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="bg-primary/10 px-2 py-1 rounded-md mr-2">
                <Text className="text-[10px] font-bold text-primary uppercase">
                  {grant.publisher?.level || 'Statlig'}
                </Text>
              </View>
              <Text className="text-caption text-muted-foreground flex-1">
                {grant.publisher?.name}
              </Text>
            </View>

            <Text className="text-h2 font-bold text-foreground mb-4 leading-tight">
              {grant.title}
            </Text>

            <View className="flex-row flex-wrap gap-4">
              <View className="flex-row items-center">
                <Calendar size={14} color="#6B7280" className="mr-1.5" />
                <Text className="text-caption text-muted-foreground">
                  Deadline:{' '}
                  {grant.deadline
                    ? format(new Date(grant.deadline), 'd MMM yyyy', { locale: sv })
                    : 'Löpande'}
                </Text>
              </View>
              {(grant.amount_min || grant.amount_max) && (
                <View className="flex-row items-center">
                  <Coins size={14} color="#6B7280" className="mr-1.5" />
                  <Text className="text-caption text-muted-foreground">
                    {grant.amount_max
                      ? `${grant.amount_max.toLocaleString('sv-SE')} kr`
                      : 'Se detaljer'}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              className="bg-primary p-4 rounded-xl items-center mt-6 shadow-lg shadow-primary/20"
              onPress={() => Linking.openURL(grant.url)}
            >
              <View className="flex-row items-center">
                <ExternalLink size={18} color="white" />
                <Text className="text-white font-bold text-body-lg ml-2">Öppna i webbläsare</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="space-y-2">
            <Text className="text-h3 font-bold text-foreground">Beskrivning</Text>
            <Text className="text-body text-muted-foreground leading-relaxed">
              {grant.description}
            </Text>
          </View>

          {/* GDP Information */}
          {grant.gdp_source && (
            <GdpDetailsSection
              gdpSource={grant.gdp_source}
              diarienummer={grant.diarienummer}
              bidragsformer={grant.bidragsformer}
              program={grant.program}
              gdpLastSyncedAt={grant.gdp_last_synced_at}
              openingDate={grant.opening_date}
              url={grant.url}
              forskningsamnen={grant.forskningsamnen}
              hallbarhetsmal={grant.hallbarhetsmal}
              nyckelord={grant.nyckelord}
              publiceringsplatser={grant.publiceringsplatser}
            />
          )}

          {/* Eligibility */}
          <EligibilitySection
            eligibility={grant.eligibility}
            eligibilityLong={grant.details?.eligibility_long}
          />

          {/* Application Process */}
          <ApplicationProcessSection processSteps={grant.details?.process_steps} />

          {/* Required Documents */}
          <RequiredDocumentsSection documents={grant.details?.required_docs} />

          {/* Themes Summary */}
          <ThemesSummary themes={grant.themes} />

          {/* Publisher Card */}
          <View className="bg-background-0 p-6 rounded-3xl border border-border mb-8 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Building2 size={24} color="#6B7280" />
              <Text className="text-body-lg font-bold text-foreground ml-2">Om finansiären</Text>
            </View>
            <Text className="text-body font-semibold text-foreground mb-1">
              {grant.publisher?.name}
            </Text>
            <Text className="text-caption text-muted-foreground mb-4">
              Nivå: {grant.publisher?.level}
            </Text>
            {grant.publisher?.website_url && (
              <TouchableOpacity onPress={() => Linking.openURL(grant.publisher?.website_url || '')}>
                <Text className="text-primary font-bold text-body-sm">Besök webbplats</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
