import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { X, CheckCircle2, Circle } from 'lucide-react-native';
import { Task, TaskStatus, Subtask } from '@/types/reporting';
import { useTasks } from '@/hooks/useTasks';

interface TaskDetailsModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
}

export const TaskDetailsModal = ({ task, visible, onClose }: TaskDetailsModalProps) => {
  const { updateTaskStatus, toggleSubtaskStatus } = useTasks();

  if (!task) return null;

  const priorityColors = {
    low: 'text-blue-600 bg-blue-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    urgent: 'text-red-600 bg-red-50',
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTaskStatus.mutate({ id: task.id, status: newStatus });
  };

  const handleToggleSubtask = (subtask: Subtask) => {
    toggleSubtaskStatus.mutate({ id: subtask.id, currentStatus: subtask.status });
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView className="bg-background-0 rounded-t-[40px] h-[90%]">
          <View className="px-6 py-6 border-b border-border flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-h2 font-bold text-foreground" numberOfLines={1}>
                {task.title}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className={`px-2 py-0.5 rounded mr-2 ${priorityColors[task.priority]}`}>
                  <Text className="text-[10px] font-bold uppercase">{task.priority}</Text>
                </View>
                <Text className="text-caption text-muted-foreground">
                  {task.project?.name || 'Inget projekt'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 bg-background-50 rounded-full">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            <View className="space-y-8 pb-10">
              {/* Status Selector */}
              <View>
                <Text className="text-h3 font-bold text-foreground mb-4">Status</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(['todo', 'in_progress', 'done', 'blocked'] as TaskStatus[]).map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => handleStatusChange(status)}
                      className={`px-4 py-2 rounded-xl border flex-row items-center ${
                        task.status === status
                          ? 'bg-primary border-primary'
                          : 'bg-background-50 border-border'
                      }`}
                    >
                      <Text
                        className={`text-body-sm font-bold ${
                          task.status === status ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        {status === 'todo'
                          ? 'Att göra'
                          : status === 'in_progress'
                            ? 'Pågående'
                            : status === 'done'
                              ? 'Klart'
                              : 'Blockerad'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View>
                <Text className="text-h3 font-bold text-foreground mb-3">Beskrivning</Text>
                <View className="bg-background-50 p-4 rounded-3xl border border-border">
                  <Text className="text-body text-foreground leading-relaxed">
                    {task.description || 'Ingen beskrivning angiven.'}
                  </Text>
                </View>
              </View>

              {/* Subtasks */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-h3 font-bold text-foreground">Deluppgifter</Text>
                  <View className="bg-background-100 px-2 py-0.5 rounded">
                    <Text className="text-tiny font-bold text-muted-foreground">
                      {completedSubtasks}/{totalSubtasks}
                    </Text>
                  </View>
                </View>

                {task.subtasks && task.subtasks.length > 0 ? (
                  <View className="space-y-2">
                    {task.subtasks.map((sub) => (
                      <TouchableOpacity
                        key={sub.id}
                        onPress={() => handleToggleSubtask(sub)}
                        className="bg-background-0 p-4 rounded-2xl border border-border flex-row items-center"
                      >
                        <View className="mr-3">
                          {sub.status === 'done' ? (
                            <CheckCircle2 size={20} color="#10b981" />
                          ) : (
                            <Circle size={20} color="#6B7280" />
                          )}
                        </View>
                        <Text
                          className={`text-body-sm flex-1 ${
                            sub.status === 'done'
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {sub.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="bg-background-50 p-4 rounded-3xl border border-border items-center py-8">
                    <Text className="text-body-sm text-muted-foreground italic">
                      Inga deluppgifter kopplade till denna uppgift.
                    </Text>
                  </View>
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
        </SafeAreaView>
      </View>
    </Modal>
  );
};
