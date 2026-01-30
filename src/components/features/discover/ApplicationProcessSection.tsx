import React from 'react';
import { View, Text } from 'react-native';
import { Clock, Info } from 'lucide-react-native';

interface ApplicationProcessSectionProps {
  processSteps?: {
    step?: number | string;
    title: string;
    description: string;
  }[];
}

export const ApplicationProcessSection = ({ processSteps }: ApplicationProcessSectionProps) => {
  return (
    <View className="space-y-4">
      <View className="flex-row items-center mb-4">
        <Clock size={24} color="#8b5cf6" />
        <Text className="text-h3 font-bold text-foreground ml-2">Ansökningsprocess</Text>
      </View>

      {processSteps && processSteps.length > 0 ? (
        <View className="pl-4">
          {processSteps.map((step, idx) => (
            <View key={idx} className="flex-row mb-6 last:mb-0">
              {/* Steg Indikator */}
              <View className="items-center mr-4">
                <View className="w-8 h-8 rounded-full bg-background-0 border-2 border-purple-500 items-center justify-center z-10 shadow-sm">
                  <Text className="text-xs font-bold text-purple-600">{step.step || idx + 1}</Text>
                </View>
                {idx < processSteps.length - 1 && <View className="w-0.5 flex-1 bg-border my-1" />}
              </View>

              {/* Steg Innehåll */}
              <View className="flex-1 bg-background-0 p-4 rounded-2xl border border-border shadow-sm">
                <Text className="text-body font-bold text-foreground">{step.title}</Text>
                <Text className="text-body-sm text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex-row items-start">
          <Info size={20} color="#d97706" className="mt-0.5 mr-3" />
          <View className="flex-1">
            <Text className="text-body font-bold text-amber-900 mb-1">
              Ansökningsprocess ej tillgänglig än
            </Text>
            <Text className="text-body-sm text-amber-700 leading-relaxed">
              Vår AI-crawler har inte hittat detaljerad processinformation än. Besök den officiella
              webbplatsen för instruktioner.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
