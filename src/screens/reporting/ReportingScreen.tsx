import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  BarChart3,
  ChevronRight,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  LayoutGrid,
  Calendar,
} from 'lucide-react-native';
import { useReports, useReportingStats } from '@/hooks/useReports';
import { useOrganization } from '@/contexts/OrganizationContext';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { StatusBar } from 'expo-status-bar';
import { ReportStatus, Report } from '@/types/reporting';
import { CreateReportModal } from '@/components/features/reporting/CreateReportModal';
import { ReportDetailsModal } from '@/components/features/reporting/ReportDetailsModal';

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Utkast', color: 'text-orange-600', bgColor: 'bg-orange-500/10' },
  in_progress: { label: 'Pågår', color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
  completed: { label: 'Klar', color: 'text-green-600', bgColor: 'bg-green-500/10' },
  submitted: { label: 'Inskickad', color: 'text-purple-600', bgColor: 'bg-purple-500/10' },
};

export const ReportingScreen = () => {
  const { selectedOrganizationId } = useOrganization();
  const [view, setView] = useState<'list' | 'stats'>('list');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const {
    data: reports,
    isLoading: isLoadingReports,
    refetch,
  } = useReports(selectedOrganizationId || undefined);
  const { data: stats, isLoading: isLoadingStats } = useReportingStats(
    selectedOrganizationId || undefined,
  );

  const handleOpenReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsModalVisible(true);
  };

  const renderStats = () => (
    <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] bg-background-0 p-5 rounded-3xl border border-border mb-4 shadow-sm">
          <View className="w-10 h-10 rounded-2xl bg-blue-100 items-center justify-center mb-3">
            <Clock size={20} color="#2563eb" />
          </View>
          <Text className="text-display font-bold text-foreground">{stats?.total_hours || 0}</Text>
          <Text className="text-caption font-bold text-muted-foreground uppercase">Timmar</Text>
        </View>

        <View className="w-[48%] bg-background-0 p-5 rounded-3xl border border-border mb-4 shadow-sm">
          <View className="w-10 h-10 rounded-2xl bg-emerald-100 items-center justify-center mb-3">
            <TrendingUp size={20} color="#059669" />
          </View>
          <Text className="text-display font-bold text-foreground">
            {stats?.active_projects || 0}
          </Text>
          <Text className="text-caption font-bold text-muted-foreground uppercase">Projekt</Text>
        </View>

        <View className="w-full bg-background-0 p-6 rounded-3xl border border-border mb-6 shadow-sm">
          <Text className="text-h3 font-bold text-foreground mb-4">Ekonomi</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-caption font-bold text-muted-foreground uppercase">
                Totala Kostnader
              </Text>
              <Text className="text-h1 font-bold text-primary mt-1">
                {(stats?.total_expenses || 0).toLocaleString('sv-SE')} kr
              </Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
              <BarChart3 size={24} color="#0EA5E9" />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderReportItem = ({ item }: { item: Report }) => {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;
    return (
      <TouchableOpacity
        onPress={() => handleOpenReport(item)}
        className="mx-6 mt-4 bg-background-0 p-5 rounded-3xl border border-border shadow-sm active:opacity-90"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className={`${status.bgColor} px-3 py-1 rounded-full`}>
            <Text className={`text-[10px] font-bold ${status.color} uppercase`}>
              {status.label}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={12} color="#6B7280" className="mr-1" />
            <Text className="text-caption text-muted-foreground">
              {format(new Date(item.report_date), 'd MMM yyyy', { locale: sv })}
            </Text>
          </View>
        </View>

        <Text className="text-body-lg font-bold text-foreground mb-1">{item.title}</Text>

        <View className="flex-row items-center mb-4">
          <FileText size={14} color="#6B7280" className="mr-1" />
          <Text className="text-caption text-muted-foreground flex-1" numberOfLines={1}>
            {item.project?.name || 'Inget projekt'}
          </Text>
        </View>

        <View className="flex-row justify-between items-center pt-4 border-t border-border/50">
          <View className="flex-row space-x-4">
            {item.hours_worked !== undefined && (
              <View className="flex-row items-center mr-4">
                <Clock size={12} color="#6B7280" className="mr-1" />
                <Text className="text-caption font-bold text-foreground">{item.hours_worked}h</Text>
              </View>
            )}
            <Text className="text-caption font-bold text-primary">
              {item.total_expenses.toLocaleString('sv-SE')} kr
            </Text>
          </View>
          <ChevronRight size={18} color="#0EA5E9" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 py-4 bg-background-0 border-b border-border">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-h2 font-bold text-foreground">Rapportering</Text>
            <Text className="text-caption text-muted-foreground">
              Projektuppföljning och statistik
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsCreateModalVisible(true)}
            className="bg-primary w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View className="flex-row bg-background-50 p-1 rounded-2xl border border-border">
          <TouchableOpacity
            onPress={() => setView('list')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${view === 'list' ? 'bg-background-0 shadow-sm' : ''}`}
          >
            <LayoutGrid
              size={16}
              color={view === 'list' ? '#0EA5E9' : '#6B7280'}
              className="mr-2"
            />
            <Text
              className={`text-body-sm font-bold ${view === 'list' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Lista
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setView('stats')}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${view === 'stats' ? 'bg-background-0 shadow-sm' : ''}`}
          >
            <BarChart3
              size={16}
              color={view === 'stats' ? '#0EA5E9' : '#6B7280'}
              className="mr-2"
            />
            <Text
              className={`text-body-sm font-bold ${view === 'stats' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Statistik
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {view === 'list' ? (
        isLoadingReports ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0EA5E9" />
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={renderReportItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            onRefresh={refetch}
            refreshing={isLoadingReports}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center py-20 px-10">
                <BarChart3 size={48} color="#9CA3AF" />
                <Text className="text-h3 font-bold text-foreground mt-4 text-center">
                  Inga rapporter
                </Text>
                <Text className="text-body text-muted-foreground text-center mt-2">
                  Här samlas alla dina projektrapporter.
                </Text>
              </View>
            )}
          />
        )
      ) : isLoadingStats ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        renderStats()
      )}

      {/* Modaler */}
      <CreateReportModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />
      <ReportDetailsModal
        report={selectedReport}
        visible={isDetailsModalVisible}
        onClose={() => {
          setIsDetailsModalVisible(false);
          setSelectedReport(null);
        }}
      />
    </SafeAreaView>
  );
};
