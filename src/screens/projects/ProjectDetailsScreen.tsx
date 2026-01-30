import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useProject } from '@/hooks/useProjects';
import { ArrowLeft, Briefcase, Info, FileText, Users } from 'lucide-react-native';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';

export const ProjectDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (!project) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-h3 font-bold text-foreground">Hittade inte projektet</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-primary font-bold">Gå tillbaka</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Section = ({ title, children, icon: Icon }: any) => (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        {Icon && <Icon size={20} color="#6B7280" className="mr-2" />}
        <Text className="text-h3 font-bold text-foreground">{title}</Text>
      </View>
      <View className="bg-background-0 p-6 rounded-3xl border border-border shadow-sm">
        {children}
      </View>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between py-2 border-b border-border/30 last:border-0">
      <Text className="text-body-sm text-muted-foreground">{label}</Text>
      <Text className="text-body-sm font-semibold text-foreground">{value}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      <View className="flex-row items-center px-6 py-4 bg-background-0 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ArrowLeft size={24} color="#0EA5E9" />
        </TouchableOpacity>
        <Text className="text-body-lg font-bold text-foreground flex-1" numberOfLines={1}>
          {project.name}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Project Hero Card */}
          <View className="bg-background-0 p-6 rounded-[40px] border border-border shadow-sm mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                <Briefcase size={24} color="#0EA5E9" />
              </View>
              <View className="flex-1">
                <Text className="text-h2 font-bold text-foreground">{project.name}</Text>
                <View className="bg-emerald-500/10 self-start px-2 py-0.5 rounded mt-1">
                  <Text className="text-[10px] font-bold text-emerald-600 uppercase">
                    {project.status || 'Aktiv'}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between mt-4">
              <View>
                <Text className="text-tiny font-bold text-muted-foreground uppercase">
                  Startdatum
                </Text>
                <Text className="text-body-sm font-semibold text-foreground">
                  {project.start_date
                    ? format(new Date(project.start_date), 'd MMM yyyy', { locale: sv })
                    : '—'}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-tiny font-bold text-muted-foreground uppercase">
                  Slutdatum
                </Text>
                <Text className="text-body-sm font-semibold text-foreground">
                  {project.end_date
                    ? format(new Date(project.end_date), 'd MMM yyyy', { locale: sv })
                    : '—'}
                </Text>
              </View>
            </View>
          </View>

          {/* Project Details */}
          <Section title="Projektinformation" icon={Info}>
            <InfoRow label="Status" value={project.status || 'Utkast'} />
            <InfoRow label="Projekttyp" value={project.project_type || 'Ej specificerad'} />
            <InfoRow label="Diarienummer" value={project.grant_diarienummer || '—'} />
            <InfoRow
              label="Projektledare"
              value={project.project_lead_details?.name || 'Ej angiven'}
            />
          </Section>

          {/* Description */}
          {project.description && (
            <Section title="Beskrivning" icon={FileText}>
              <Text className="text-body text-muted-foreground leading-relaxed">
                {project.description}
              </Text>
            </Section>
          )}

          {/* Partners */}
          {project.partners && project.partners.length > 0 && (
            <Section title="Partners" icon={Users}>
              {project.partners.map((partner: any, idx: number) => (
                <View
                  key={idx}
                  className="flex-row justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <Text className="text-body-sm font-semibold text-foreground">
                    {partner.name || partner.organization}
                  </Text>
                  <View className="bg-background-50 px-2 py-0.5 rounded">
                    <Text className="text-[10px] font-bold text-muted-foreground uppercase">
                      {partner.role || 'Partner'}
                    </Text>
                  </View>
                </View>
              ))}
            </Section>
          )}

          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
