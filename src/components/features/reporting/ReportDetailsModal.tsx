import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X, FileText, Clock, CreditCard, Building2 } from 'lucide-react-native';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Report } from '@/types/reporting';
import { supabase } from '@/lib/supabaseClient';

interface ReportDetailsModalProps {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
}

export const ReportDetailsModal = ({ report, visible, onClose }: ReportDetailsModalProps) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!report?.id || !visible) return;

      setLoadingTasks(true);
      try {
        // I huvudappen kopplas tasks via swedish_iq_report_tasks
        const { data, error } = await supabase
          .from('swedish_iq_report_tasks')
          .select(
            `
            *,
            task:swedish_iq_tasks(*)
          `,
          )
          .eq('report_id', report.id);

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching report tasks:', error);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [report?.id, visible]);

  if (!report) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Slutförd';
      case 'submitted':
        return 'Inskickad';
      case 'in_progress':
        return 'Pågående';
      default:
        return 'Utkast';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background-0 rounded-t-[40px] h-[90%]">
          <View className="px-6 py-6 border-b border-border flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-h2 font-bold text-foreground" numberOfLines={1}>
                {report.title}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="bg-primary/10 px-2 py-0.5 rounded mr-2">
                  <Text className="text-[10px] font-bold text-primary uppercase">
                    {getStatusLabel(report.status)}
                  </Text>
                </View>
                <Text className="text-caption text-muted-foreground">
                  {format(new Date(report.report_date), 'd MMMM yyyy', { locale: sv })}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 bg-background-50 rounded-full">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            <View className="space-y-8 pb-10">
              {/* Metadata */}
              <View className="bg-background-50 p-5 rounded-3xl border border-border">
                <View className="flex-row items-center mb-4">
                  <Building2 size={18} color="#6B7280" className="mr-3" />
                  <View>
                    <Text className="text-tiny font-bold text-muted-foreground uppercase">
                      Projekt
                    </Text>
                    <Text className="text-body-sm font-semibold text-foreground">
                      {report.project?.name || 'Inget projekt angivet'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <Clock size={18} color="#6B7280" className="mr-3" />
                    <View>
                      <Text className="text-tiny font-bold text-muted-foreground uppercase">
                        Tid
                      </Text>
                      <Text className="text-body-sm font-semibold text-foreground">
                        {report.hours_worked || 0} timmar
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <CreditCard size={18} color="#6B7280" className="mr-3" />
                    <View>
                      <Text className="text-tiny font-bold text-muted-foreground uppercase">
                        Kostnad
                      </Text>
                      <Text className="text-body-sm font-semibold text-foreground">
                        {(report.total_expenses || 0).toLocaleString('sv-SE')} kr
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Beskrivning */}
              {report.description && (
                <View>
                  <Text className="text-h3 font-bold text-foreground mb-3">Beskrivning</Text>
                  <Text className="text-body text-muted-foreground leading-relaxed">
                    {report.description}
                  </Text>
                </View>
              )}

              {/* Uppgifter */}
              <View>
                <Text className="text-h3 font-bold text-foreground mb-4">Kopplade uppgifter</Text>
                {loadingTasks ? (
                  <ActivityIndicator size="small" color="#0EA5E9" />
                ) : tasks.length > 0 ? (
                  tasks.map((item, index) => (
                    <View
                      key={index}
                      className="bg-background-0 p-4 rounded-2xl border border-border mb-3 flex-row items-center"
                    >
                      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
                        <FileText size={16} color="#0EA5E9" />
                      </View>
                      <Text className="text-body-sm font-medium text-foreground flex-1">
                        {item.task?.title || 'Uppgift'}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-body-sm text-muted-foreground italic">
                    Inga uppgifter kopplade till denna rapport.
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View className="px-6 py-8 border-t border-border bg-background-0">
            <TouchableOpacity
              onPress={onClose}
              className="bg-background-100 p-4 rounded-2xl items-center"
            >
              <Text className="text-foreground font-bold text-body-lg">Stäng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
