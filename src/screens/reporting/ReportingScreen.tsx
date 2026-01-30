import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  BarChart3,
  ChevronRight,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  Calendar,
  ChevronLeft,
  CheckSquare,
} from 'lucide-react-native';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { useReports, useReportingStats } from '@/hooks/useReports';
import { useTasks } from '@/hooks/useTasks';
import { useOrganization } from '@/contexts/OrganizationContext';
import { StatusBar } from 'expo-status-bar';
import { ReportStatus, Report, TaskStatus, Task } from '@/types/reporting';
import { CreateReportModal } from '@/components/features/reporting/CreateReportModal';
import { ReportDetailsModal } from '@/components/features/reporting/ReportDetailsModal';
import { TaskDetailsModal } from '@/components/features/reporting/TaskDetailsModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Utkast', color: 'text-orange-600', bgColor: 'bg-orange-500/10' },
  in_progress: { label: 'Pågår', color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
  completed: { label: 'Klar', color: 'text-green-600', bgColor: 'bg-green-500/10' },
  submitted: { label: 'Inskickad', color: 'text-purple-600', bgColor: 'bg-purple-500/10' },
};

export const ReportingScreen = () => {
  const { selectedOrganizationId } = useOrganization();
  const [view, setView] = useState<'list' | 'timeline' | 'tasks' | 'stats'>('list');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailsModalVisible, setIsTaskDetailsModalVisible] = useState(false);

  const {
    data: reports,
    isLoading: isLoadingReports,
    refetch,
  } = useReports(selectedOrganizationId || undefined);
  const { data: stats, isLoading: isLoadingStats } = useReportingStats(
    selectedOrganizationId || undefined,
  );
  const { tasks, isLoading: isLoadingTasks } = useTasks(
    selectedOrganizationId ? { organization_id: selectedOrganizationId } : undefined,
  );

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const reportsByDay = daysInWeek.map((day) => ({
    date: day,
    reports: reports?.filter((report) => isSameDay(new Date(report.report_date), day)) || [],
  }));

  const handleOpenReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailsModalVisible(true);
  };

  const renderTimeline = () => (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-6 py-4 bg-background-0 border-b border-border/50">
        <TouchableOpacity onPress={() => setCurrentWeek(subWeeks(currentWeek, 1))} className="p-2">
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-body font-bold text-foreground">
          Vecka {format(currentWeek, 'w, yyyy', { locale: sv })}
        </Text>
        <TouchableOpacity onPress={() => setCurrentWeek(addWeeks(currentWeek, 1))} className="p-2">
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        {reportsByDay.map(({ date, reports: dayReports }: { date: Date; reports: Report[] }) => (
          <View
            key={date.toISOString()}
            style={{ width: SCREEN_WIDTH * 0.8 }}
            className={`border-r border-border/30 p-4 ${
              isSameDay(date, new Date()) ? 'bg-primary/5' : ''
            }`}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text
                  className={`text-body-sm font-bold ${
                    isSameDay(date, new Date()) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {format(date, 'EEEE', { locale: sv })}
                </Text>
                <Text className="text-tiny text-muted-foreground">
                  {format(date, 'd MMMM', { locale: sv })}
                </Text>
              </View>
              {dayReports.length > 0 && (
                <View className="bg-background-100 px-2 py-0.5 rounded">
                  <Text className="text-tiny font-bold text-muted-foreground">
                    {dayReports.length}
                  </Text>
                </View>
              )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {dayReports.length === 0 ? (
                <View className="py-10 items-center">
                  <Text className="text-tiny text-muted-foreground italic">Inga rapporter</Text>
                </View>
              ) : (
                dayReports.map((report: Report) => (
                  <TouchableOpacity
                    key={report.id}
                    onPress={() => handleOpenReport(report)}
                    className="bg-background-0 p-3 rounded-2xl border border-border mb-2 shadow-sm"
                  >
                    <Text className="text-body-sm font-bold text-foreground" numberOfLines={1}>
                      {report.title}
                    </Text>
                    <Text className="text-tiny text-muted-foreground mt-1" numberOfLines={1}>
                      {report.project?.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderTasks = () => {
    const columns: { title: string; status: TaskStatus; color: string }[] = [
      { title: 'Att göra', status: 'todo', color: 'border-slate-200' },
      { title: 'Pågående', status: 'in_progress', color: 'border-blue-200' },
      { title: 'Klart', status: 'done', color: 'border-green-200' },
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
        {columns.map((col) => (
          <View
            key={col.status}
            style={{ width: SCREEN_WIDTH * 0.85 }}
            className="p-4 border-r border-border/30"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-body font-bold text-foreground">{col.title}</Text>
              <View className="bg-background-100 px-2 py-0.5 rounded">
                <Text className="text-tiny font-bold text-muted-foreground">
                  {tasks?.filter((t: Task) => t.status === col.status).length || 0}
                </Text>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {tasks
                ?.filter((t: Task) => t.status === col.status)
                .map((task: Task) => (
                  <View
                    key={task.id}
                    className={`bg-background-0 p-4 rounded-2xl border ${col.color} mb-3 shadow-sm`}
                  >
                    <Text className="text-body-sm font-bold text-foreground mb-1">
                      {task.title}
                    </Text>
                    {task.description && (
                      <Text className="text-tiny text-muted-foreground mb-2" numberOfLines={2}>
                        {task.description}
                      </Text>
                    )}
                    <View className="flex-row justify-between items-center mt-2">
                      <View className="bg-background-50 px-2 py-0.5 rounded border border-border">
                        <Text className="text-[10px] text-muted-foreground uppercase">
                          {task.priority}
                        </Text>
                      </View>
                      {task.project && (
                        <Text className="text-[10px] text-primary font-medium">
                          {task.project.name}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    );
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

  const TABS = [
    { id: 'list', label: 'Rapporter', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'tasks', label: 'Uppgifter', icon: CheckSquare },
    { id: 'stats', label: 'Statistik', icon: BarChart3 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <StatusBar style="auto" />

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

        <View className="flex-row bg-background-50 p-1 rounded-2xl border border-border">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = view === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setView(tab.id as any)}
                  className={`flex-row items-center justify-center py-2 px-4 rounded-xl mx-0.5 ${
                    isActive ? 'bg-background-0 shadow-sm border border-border/50' : ''
                  }`}
                >
                  <Icon size={16} color={isActive ? '#0EA5E9' : '#6B7280'} className="mr-2" />
                  <Text
                    className={`text-body-sm font-bold ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <View className="flex-1">
        {view === 'list' &&
          (isLoadingReports ? (
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
          ))}
        {view === 'timeline' &&
          (isLoadingReports ? (
            <ActivityIndicator className="mt-20" color="#0EA5E9" />
          ) : (
            renderTimeline()
          ))}
        {view === 'tasks' &&
          (isLoadingTasks ? (
            <ActivityIndicator className="mt-20" color="#0EA5E9" />
          ) : (
            renderTasks()
          ))}
        {view === 'stats' &&
          (isLoadingStats ? (
            <ActivityIndicator className="mt-20" color="#0EA5E9" />
          ) : (
            renderStats()
          ))}
      </View>

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
      <TaskDetailsModal
        task={selectedTask}
        visible={isTaskDetailsModalVisible}
        onClose={() => {
          setIsTaskDetailsModalVisible(false);
          setSelectedTask(null);
        }}
      />
    </SafeAreaView>
  );
};
