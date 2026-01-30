import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { X, CheckCircle2, Circle, LayoutGrid, Type, AlignLeft } from 'lucide-react-native';
import { Task, TaskStatus, Subtask } from '@/types/reporting';
import { useTasks } from '@/hooks/useTasks';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from 'moti';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TaskDetailsModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
}

export const TaskDetailsModal = ({ task, visible, onClose }: TaskDetailsModalProps) => {
  const { updateTaskStatus, toggleSubtaskStatus } = useTasks();

  if (!task) return null;

  const priorityColors = {
    low: { text: 'text-blue-600', bg: 'bg-blue-500/10' },
    medium: { text: 'text-yellow-600', bg: 'bg-yellow-500/10' },
    high: { text: 'text-orange-600', bg: 'bg-orange-500/10' },
    urgent: { text: 'text-red-600', bg: 'bg-red-500/10' },
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateTaskStatus.mutate({ id: task.id, status: newStatus });
  };

  const handleToggleSubtask = (subtask: Subtask) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSubtaskStatus.mutate({ id: subtask.id, currentStatus: subtask.status });
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View className="flex-1 bg-black/60 justify-end">
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={onClose} 
          className="absolute inset-0" 
        />
        
        <AnimatePresence>
          {visible && (
            <MotiView
              from={{ translateY: SCREEN_HEIGHT }}
              animate={{ translateY: 0 }}
              exit={{ translateY: SCREEN_HEIGHT }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ height: SCREEN_HEIGHT * 0.85 }}
              className="bg-background-0 rounded-t-[40px] overflow-hidden"
            >
              {/* Header Handle */}
              <View className="items-center pt-3 pb-1">
                <View className="w-12 h-1.5 bg-border/50 rounded-full" />
              </View>

              <View className="px-6 py-4 border-b border-border/50 flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                  <Text variant="h2" className="font-bold" numberOfLines={1}>
                    {task.title}
                  </Text>
                  <View className="flex-row items-center mt-1.5">
                    <View className={`px-2.5 py-0.5 rounded-md mr-2 ${priorityColors[task.priority].bg}`}>
                      <Text variant="tiny" className={`font-bold uppercase ${priorityColors[task.priority].text}`}>
                        {task.priority}
                      </Text>
                    </View>
                    <Text variant="caption" muted>
                      {task.project?.name || 'Inget projekt'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={onClose} 
                  className="w-10 h-10 bg-background-100 rounded-full items-center justify-center shadow-sm"
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                className="flex-1 px-6 pt-6" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                <View className="space-y-8">
                  {/* Status Selector */}
                  <View>
                    <View className="flex-row items-center mb-4">
                      <LayoutGrid size={18} color="#0EA5E9" className="mr-2" />
                      <Text variant="h3" className="font-bold">Status</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-2.5">
                      {(['todo', 'in_progress', 'done', 'blocked'] as TaskStatus[]).map((status) => {
                        const isActive = task.status === status;
                        return (
                          <TouchableOpacity
                            key={status}
                            onPress={() => handleStatusChange(status)}
                            className={`px-4 py-2.5 rounded-2xl border ${
                              isActive
                                ? 'bg-primary border-primary shadow-md shadow-primary/30'
                                : 'bg-background-50 border-border'
                            }`}
                          >
                            <Text
                              className={`text-[13px] font-bold ${
                                isActive ? 'text-white' : 'text-muted-foreground'
                              }`}
                            >
                              {status === 'todo' ? 'Att göra' : 
                               status === 'in_progress' ? 'Pågående' : 
                               status === 'done' ? 'Klart' : 'Blockerad'}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Description */}
                  <View>
                    <View className="flex-row items-center mb-3">
                      <AlignLeft size={18} color="#0EA5E9" className="mr-2" />
                      <Text variant="h3" className="font-bold">Beskrivning</Text>
                    </View>
                    <Surface elevation={1} className="p-5 rounded-[24px]">
                      <Text variant="body" className="leading-relaxed">
                        {task.description || 'Ingen beskrivning angiven.'}
                      </Text>
                    </Surface>
                  </View>

                  {/* Subtasks */}
                  <View>
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="flex-row items-center">
                        <CheckCircle2 size={18} color="#0EA5E9" className="mr-2" />
                        <Text variant="h3" className="font-bold">Deluppgifter</Text>
                      </View>
                      <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <Text variant="tiny" className="font-bold text-primary">
                          {completedSubtasks}/{totalSubtasks}
                        </Text>
                      </View>
                    </View>

                    {task.subtasks && task.subtasks.length > 0 ? (
                      <View className="space-y-3">
                        {task.subtasks.map((sub) => (
                          <TouchableOpacity
                            key={sub.id}
                            onPress={() => handleToggleSubtask(sub)}
                            activeOpacity={0.6}
                          >
                            <Card 
                              variant={sub.status === 'done' ? 'default' : 'outline'} 
                              className={`flex-row items-center p-4 rounded-2xl ${
                                sub.status === 'done' ? 'bg-background-50/50 opacity-60' : ''
                              }`}
                            >
                              <View className="mr-3.5">
                                {sub.status === 'done' ? (
                                  <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center shadow-sm">
                                    <CheckCircle2 size={16} color="white" />
                                  </View>
                                ) : (
                                  <Circle size={24} color="#CBD5E1" />
                                )}
                              </View>
                              <Text
                                variant="body"
                                className={`flex-1 ${
                                  sub.status === 'done' ? 'line-through' : ''
                                }`}
                              >
                                {sub.title}
                              </Text>
                            </Card>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Surface elevation={0} className="bg-background-50 p-8 rounded-[24px] items-center border border-dashed border-border">
                        <Text variant="body-sm" muted className="italic">
                          Inga deluppgifter kopplade till denna uppgift.
                        </Text>
                      </Surface>
                    )}
                  </View>
                </View>
              </ScrollView>

              <SafeAreaView className="px-6 py-6 border-t border-border/50 bg-background-0">
                <Button 
                  onPress={onClose}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Stäng fönster
                </Button>
              </SafeAreaView>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
};
