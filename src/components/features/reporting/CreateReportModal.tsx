import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Clock, CreditCard, CheckSquare, Layers } from 'lucide-react-native';
import { useReports } from '@/hooks/useReports';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface CreateReportModalProps {
  visible: boolean;
  onClose: () => void;
}

const REPORT_TYPES = [
  { value: 'daily_admin', label: 'Daglig (Admin)' },
  { value: 'daily_client', label: 'Daglig (Klient)' },
  { value: 'monthly_project', label: 'Månadsrapport' },
];

export const CreateReportModal = ({ visible, onClose }: CreateReportModalProps) => {
  const { selectedOrganizationId } = useOrganization();
  const { createReport } = useReports(selectedOrganizationId || undefined);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('daily_admin');
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [hours, setHours] = useState('');
  const [expenses, setExpenses] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', selectedOrganizationId],
    queryFn: async () => {
      if (!selectedOrganizationId) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('organization_id', selectedOrganizationId);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedOrganizationId && visible,
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];
      const { data, error } = await supabase
        .from('swedish_iq_tasks')
        .select('id, title, status')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: projectIds.length > 0 && visible,
  });

  const toggleProject = (id: string) => {
    setProjectIds((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]));
  };

  const toggleTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!title || projectIds.length === 0 || !selectedOrganizationId) return;

    try {
      await createReport.mutateAsync({
        title,
        description,
        project_id: projectIds[0], // Första för bakåtkompatibilitet
        project_ids: projectIds,
        organization_id: selectedOrganizationId,
        report_type: reportType,
        report_date: new Date().toISOString().split('T')[0],
        hours_worked: parseFloat(hours) || 0,
        total_expenses: parseFloat(expenses) || 0,
        status: 'draft',
        task_ids: selectedTaskIds,
      });
      // Reset state
      setTitle('');
      setDescription('');
      setProjectIds([]);
      setReportType('daily_admin');
      setHours('');
      setExpenses('');
      setSelectedTaskIds([]);
      onClose();
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="bg-background-0 rounded-t-[40px] h-[90%]"
        >
          <View className="px-6 py-6 border-b border-border flex-row justify-between items-center">
            <Text className="text-h2 font-bold text-foreground">Ny rapport</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            <View className="space-y-6">
              {/* Rapporttyp */}
              <View>
                <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                  Rapporttyp
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {REPORT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setReportType(type.value)}
                      className={`px-4 py-2 rounded-full border ${
                        reportType === type.value
                          ? 'bg-primary border-primary'
                          : 'bg-background-50 border-border'
                      }`}
                    >
                      <Text
                        className={`text-body-sm font-medium ${
                          reportType === type.value ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Titel */}
              <View>
                <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                  Titel
                </Text>
                <TextInput
                  className="bg-background-50 p-4 rounded-2xl border border-border text-foreground"
                  placeholder="Rapportens titel..."
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Projekt (Multi-select) */}
              <View>
                <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                  Projekt
                </Text>
                {isLoadingProjects ? (
                  <ActivityIndicator size="small" color="#0EA5E9" />
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {projects?.map((project) => (
                      <TouchableOpacity
                        key={project.id}
                        onPress={() => toggleProject(project.id)}
                        className={`px-4 py-2 rounded-xl border flex-row items-center ${
                          projectIds.includes(project.id)
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background-50 border-border'
                        }`}
                      >
                        {projectIds.includes(project.id) && (
                          <Layers size={14} color="#0EA5E9" className="mr-2" />
                        )}
                        <Text
                          className={`text-body-sm font-medium ${
                            projectIds.includes(project.id) ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {project.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Uppgifter (Tasks) */}
              {projectIds.length > 0 && (
                <View>
                  <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                    Koppla uppgifter
                  </Text>
                  {isLoadingTasks ? (
                    <ActivityIndicator size="small" color="#0EA5E9" />
                  ) : tasks && tasks.length > 0 ? (
                    <View className="space-y-2">
                      {tasks.map((task) => (
                        <TouchableOpacity
                          key={task.id}
                          onPress={() => toggleTask(task.id)}
                          className={`p-4 rounded-2xl border flex-row items-center ${
                            selectedTaskIds.includes(task.id)
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-background-50 border-border'
                          }`}
                        >
                          <CheckSquare
                            size={18}
                            color={selectedTaskIds.includes(task.id) ? '#10b981' : '#6B7280'}
                            className="mr-3"
                          />
                          <Text
                            className={`text-body-sm flex-1 ${
                              selectedTaskIds.includes(task.id)
                                ? 'text-emerald-900 font-semibold'
                                : 'text-foreground'
                            }`}
                          >
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text className="text-caption text-muted-foreground italic">
                      Inga uppgifter hittades för valda projekt.
                    </Text>
                  )}
                </View>
              )}

              {/* Beskrivning */}
              <View>
                <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                  Beskrivning
                </Text>
                <TextInput
                  className="bg-background-50 p-4 rounded-2xl border border-border text-foreground min-h-[100px]"
                  placeholder="Vad har gjorts?"
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View className="flex-row justify-between">
                {/* Timmar */}
                <View className="w-[48%]">
                  <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                    Timmar
                  </Text>
                  <View className="flex-row items-center bg-background-50 rounded-2xl border border-border px-4">
                    <Clock size={18} color="#6B7280" />
                    <TextInput
                      className="flex-1 p-4 text-foreground"
                      placeholder="0"
                      keyboardType="numeric"
                      value={hours}
                      onChangeText={setHours}
                    />
                  </View>
                </View>

                {/* Kostnader */}
                <View className="w-[48%]">
                  <Text className="text-body-sm font-bold text-muted-foreground uppercase mb-2">
                    Kostnader (kr)
                  </Text>
                  <View className="flex-row items-center bg-background-50 rounded-2xl border border-border px-4">
                    <CreditCard size={18} color="#6B7280" />
                    <TextInput
                      className="flex-1 p-4 text-foreground"
                      placeholder="0"
                      keyboardType="numeric"
                      value={expenses}
                      onChangeText={setExpenses}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View className="h-20" />
          </ScrollView>

          <View className="px-6 py-8 border-t border-border bg-background-0">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={createReport.isPending || !title || projectIds.length === 0}
              className={`bg-primary p-4 rounded-2xl items-center shadow-lg shadow-primary/30 ${
                createReport.isPending || !title || projectIds.length === 0 ? 'opacity-50' : ''
              }`}
            >
              {createReport.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-body-lg">Spara rapport</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
