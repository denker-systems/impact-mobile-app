import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckSquare, Clock, Building2, ChevronRight } from 'lucide-react-native';
import { Task } from '@/types/reporting';
import { useTasks } from '@/hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  showProjectBadge?: boolean;
}

export const TaskCard = ({ task, onPress, showProjectBadge }: TaskCardProps) => {
  const { toggleSubtaskStatus } = useTasks();

  const priorityConfig = {
    low: { color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Låg' },
    medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: 'Medel' },
    high: { color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Hög' },
    urgent: { color: 'text-red-600', bgColor: 'bg-red-50', label: 'Brådskande' },
  };

  const config = priorityConfig[task.priority] || priorityConfig.medium;

  const completedSubtasks = task.subtasks?.filter((s) => s.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-background-0 p-4 rounded-3xl border border-border mb-3 shadow-sm active:opacity-90"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-body font-bold text-foreground leading-tight" numberOfLines={2}>
            {task.title}
          </Text>
        </View>
        <View className={`${config.bgColor} px-2 py-0.5 rounded-full border border-border/50`}>
          <Text className={`text-[10px] font-bold ${config.color} uppercase`}>{config.label}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-3">
        {showProjectBadge && task.project && (
          <View className="flex-row items-center bg-background-50 px-2 py-0.5 rounded border border-border">
            <Building2 size={10} color="#6B7280" className="mr-1" />
            <Text className="text-[10px] text-muted-foreground">{task.project.name}</Text>
          </View>
        )}
        {task.due_date && (
          <View className="flex-row items-center">
            <Clock size={12} color="#6B7280" className="mr-1" />
            <Text className="text-[10px] text-muted-foreground">
              {new Date(task.due_date).toLocaleDateString('sv-SE', {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}
      </View>

      {task.subtasks && task.subtasks.length > 0 && (
        <View className="mb-3 space-y-1">
          {task.subtasks.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              onPress={() => toggleSubtaskStatus.mutate({ id: sub.id, currentStatus: sub.status })}
              className="flex-row items-center"
            >
              {sub.status === 'done' ? (
                <CheckSquare size={12} color="#10b981" />
              ) : (
                <View className="w-3 h-3 rounded-full border border-gray-400" />
              )}
              <Text
                className={`text-[11px] ml-2 flex-1 ${
                  sub.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
                numberOfLines={1}
              >
                {sub.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View className="flex-row justify-between items-center pt-3 border-t border-border/30">
        <View className="flex-row items-center">
          <CheckSquare size={14} color="#6B7280" className="mr-1" />
          <Text className="text-caption text-muted-foreground">
            {completedSubtasks}/{totalSubtasks} deluppgifter
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-primary font-bold text-tiny uppercase mr-1">Visa detaljer</Text>
          <ChevronRight size={12} color="#0EA5E9" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
