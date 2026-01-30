import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CheckSquare, Clock, Building2, ChevronRight } from 'lucide-react-native';
import { Task } from '@/types/reporting';
import { useTasks } from '@/hooks/useTasks';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  showProjectBadge?: boolean;
}

export const TaskCard = ({ task, onPress, showProjectBadge }: TaskCardProps) => {
  const { toggleSubtaskStatus } = useTasks();

  const priorityConfig = {
    low: { color: '#2563eb', bgColor: 'bg-blue-500/10', label: 'Låg' },
    medium: { color: '#d97706', bgColor: 'bg-yellow-500/10', label: 'Medel' },
    high: { color: '#ea580c', bgColor: 'bg-orange-500/10', label: 'Hög' },
    urgent: { color: '#dc2626', bgColor: 'bg-red-500/10', label: 'Brådskande' },
  };

  const config = priorityConfig[task.priority] || priorityConfig.medium;

  const completedSubtasks = task.subtasks?.filter((s) => s.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const handleToggleSubtask = (id: string, currentStatus: 'todo' | 'done') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSubtaskStatus.mutate({ id, currentStatus });
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        activeOpacity={0.7}
        className="mb-4"
      >
        <Card variant="elevated" className="p-5">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-3">
              <Text variant="body-lg" className="font-bold leading-tight" numberOfLines={2}>
                {task.title}
              </Text>
            </View>
            <View className={`${config.bgColor} px-2.5 py-1 rounded-lg border border-white/10`}>
              <Text style={{ color: config.color }} className="text-[10px] font-bold uppercase">
                {config.label}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {showProjectBadge && task.project && (
              <View className="flex-row items-center bg-background-50 px-2 py-1 rounded-md border border-border/50">
                <Building2 size={10} color="#6B7280" className="mr-1.5" />
                <Text variant="tiny" muted>
                  {task.project.name}
                </Text>
              </View>
            )}
            {task.due_date && (
              <View className="flex-row items-center bg-background-50 px-2 py-1 rounded-md border border-border/50">
                <Clock size={10} color="#6B7280" className="mr-1.5" />
                <Text variant="tiny" muted>
                  {new Date(task.due_date).toLocaleDateString('sv-SE', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>

          {task.subtasks && task.subtasks.length > 0 && (
            <View className="mb-4 space-y-2">
              {task.subtasks.slice(0, 3).map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() => handleToggleSubtask(sub.id, sub.status)}
                  className="flex-row items-center bg-background-50/50 p-2 rounded-xl"
                >
                  {sub.status === 'done' ? (
                    <CheckSquare size={14} color="#10b981" />
                  ) : (
                    <View className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />
                  )}
                  <Text
                    variant="body-sm"
                    className={`ml-2.5 flex-1 ${
                      sub.status === 'done' ? 'line-through opacity-50' : ''
                    }`}
                    numberOfLines={1}
                  >
                    {sub.title}
                  </Text>
                </TouchableOpacity>
              ))}
              {task.subtasks.length > 3 && (
                <Text variant="tiny" muted className="ml-1 italic">
                  + {task.subtasks.length - 3} till...
                </Text>
              )}
            </View>
          )}

          <View className="flex-row justify-between items-center pt-4 border-t border-border/30">
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center mr-2">
                <CheckSquare size={12} color="#0EA5E9" />
              </View>
              <Text variant="caption" muted className="font-bold uppercase tracking-wider">
                {completedSubtasks}/{totalSubtasks} KLARA
              </Text>
            </View>
            <View className="flex-row items-center bg-primary/5 px-3 py-1 rounded-full">
              <Text variant="tiny" className="text-primary font-bold uppercase mr-1">Detaljer</Text>
              <ChevronRight size={12} color="#0EA5E9" />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </MotiView>
  );
};
