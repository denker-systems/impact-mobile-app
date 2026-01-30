import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Building2, Bot, FileText, Database } from 'lucide-react-native';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { GrantWithMetadata } from '@/types/swedish-grants';

import { ChevronRight } from 'lucide-react-native';

interface GrantCardProps {
  grant: GrantWithMetadata;
  onPress?: () => void;
}

const GDP_SOURCE_COLORS: Record<string, string> = {
  formas: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  forte: 'bg-purple-500/10 text-purple-600 border-purple-200',
  vr: 'bg-blue-500/10 text-blue-600 border-blue-200',
  vinnova: 'bg-orange-500/10 text-orange-600 border-orange-200',
  energimyndigheten: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
};

const GDP_SOURCE_LABELS: Record<string, string> = {
  formas: 'Formas',
  forte: 'Forte',
  vr: 'VR',
  vinnova: 'Vinnova',
  energimyndigheten: 'Energimyndigheten',
};

export const GrantCard = ({ grant, onPress }: GrantCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-background-0 p-4 rounded-xl border border-border mb-4 shadow-sm active:opacity-90"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row flex-wrap gap-1 flex-1">
          <View className="bg-background-100 px-2 py-0.5 rounded-full border border-border">
            <Text className="text-[10px] font-medium text-muted-foreground capitalize">
              {grant.publisher?.level || 'Statlig'}
            </Text>
          </View>
          {grant.gdp_source && (
            <View
              className={`px-2 py-0.5 rounded-full border flex-row items-center ${GDP_SOURCE_COLORS[grant.gdp_source] || 'bg-background-100 border-border'}`}
            >
              <Database size={10} className="mr-1" color="currentColor" />
              <Text className="text-[10px] font-medium text-inherit">
                {GDP_SOURCE_LABELS[grant.gdp_source] || grant.gdp_source}
              </Text>
            </View>
          )}
        </View>

        {grant.status === 'active' && (
          <View className="bg-green-600 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-bold text-white">Öppen</Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-1 mb-2">
        {grant.details_count > 0 && (
          <View className="bg-blue-500/10 px-1.5 py-0.5 rounded flex-row items-center border border-blue-200">
            <Bot size={10} color="#2563eb" className="mr-1" />
            <Text className="text-[10px] font-medium text-blue-600">Intelligence</Text>
          </View>
        )}
        {grant.documents_count > 0 && (
          <View className="bg-orange-500/10 px-1.5 py-0.5 rounded flex-row items-center border border-orange-200">
            <FileText size={10} color="#ea580c" className="mr-1" />
            <Text className="text-[10px] font-medium text-orange-600">
              {grant.documents_count} Dok
            </Text>
          </View>
        )}
      </View>

      <Text className="text-body-lg font-bold text-foreground mb-1 leading-tight" numberOfLines={2}>
        {grant.title}
      </Text>

      <View className="flex-row items-center mb-3">
        <Building2 size={12} color="#6B7280" className="mr-1" />
        <Text className="text-caption text-muted-foreground flex-1" numberOfLines={1}>
          {grant.publisher?.name}
        </Text>
      </View>

      {grant.description && (
        <Text className="text-body-sm text-muted-foreground mb-4" numberOfLines={3}>
          {grant.description}
        </Text>
      )}

      <View className="pt-3 border-t border-border flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Calendar size={12} color="#6B7280" className="mr-1" />
          <Text className="text-caption text-muted-foreground">
            {grant.deadline
              ? format(new Date(grant.deadline), 'd MMM yyyy', { locale: sv })
              : grant.status === 'recurring'
                ? 'Löpande'
                : 'Inget datum'}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-primary font-bold text-body-sm mr-1">Visa detaljer</Text>
          <ChevronRight size={14} color="#0EA5E9" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
