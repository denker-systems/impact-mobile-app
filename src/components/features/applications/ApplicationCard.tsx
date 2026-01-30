import React from 'react';
import { View, Text, TouchableOpacity, DimensionValue } from 'react-native';
import {
  Clock,
  Building2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileEdit,
} from 'lucide-react-native';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ApplicationWithMetadata } from '@/types/applications';

interface ApplicationCardProps {
  application: ApplicationWithMetadata;
  onPress?: () => void;
}

const STATUS_CONFIG = {
  draft: {
    label: 'Utkast',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-200',
    icon: FileEdit,
  },
  submitted: {
    label: 'Inskickad',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-200',
    icon: CheckCircle2,
  },
  under_review: {
    label: 'Granskas',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-200',
    icon: Clock,
  },
  approved: {
    label: 'Beviljad',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Avslagen',
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-200',
    icon: AlertCircle,
  },
};

export const ApplicationCard = ({ application, onPress }: ApplicationCardProps) => {
  const status = STATUS_CONFIG[application.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-background-0 p-4 rounded-xl border border-border mb-4 shadow-sm active:opacity-90"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View
            className={`px-2 py-1 rounded-full border flex-row items-center ${status.bgColor} ${status.borderColor}`}
          >
            <StatusIcon size={12} color="currentColor" className={status.color} />
            <Text className={`text-[10px] font-bold ml-1 ${status.color}`}>
              {status.label.toUpperCase()}
            </Text>
          </View>
          <Text className="text-[10px] font-medium text-muted-foreground ml-2 uppercase">
            {application.type.replace('_', ' ')}
          </Text>
        </View>
        <Text className="text-caption text-muted-foreground">
          {format(new Date(application.updated_at), 'd MMM yyyy', { locale: sv })}
        </Text>
      </View>

      <Text className="text-body-lg font-bold text-foreground mb-1" numberOfLines={1}>
        {application.title || 'Namnlöst projekt'}
      </Text>

      <View className="flex-row items-center mb-4">
        <Building2 size={12} color="#6B7280" className="mr-1" />
        <Text className="text-caption text-muted-foreground flex-1" numberOfLines={1}>
          {application.opportunity_title || 'Ingen specifik utlysning'}
        </Text>
      </View>

      {application.status === 'draft' && (
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-tiny font-medium text-muted-foreground">Färdigställt</Text>
            <Text className="text-tiny font-bold text-primary">{application.progress}%</Text>
          </View>
          <View className="h-1.5 bg-background-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${application.progress}%` as DimensionValue }}
            />
          </View>
        </View>
      )}

      <View className="pt-3 border-t border-border flex-row justify-end items-center">
        <View className="flex-row items-center">
          <Text className="text-primary font-bold text-body-sm mr-1">
            {application.status === 'draft' ? 'Fortsätt skriva' : 'Visa ansökan'}
          </Text>
          <ChevronRight size={14} color="#0EA5E9" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
