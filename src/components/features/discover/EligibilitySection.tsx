import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2, Info } from 'lucide-react-native';

interface EligibilitySectionProps {
  eligibility?: string[];
  eligibilityLong?: string;
}

export const EligibilitySection = ({ eligibility, eligibilityLong }: EligibilitySectionProps) => {
  return (
    <View className="space-y-4">
      <View className="flex-row items-center mb-4">
        <CheckCircle2 size={24} color="#10b981" />
        <Text className="text-h3 font-bold text-foreground ml-2">Vem kan söka?</Text>
      </View>

      <View className="bg-background-0 p-6 rounded-3xl border border-border shadow-sm">
        {eligibility && eligibility.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-4">
            {eligibility.map((item, idx) => (
              <View
                key={idx}
                className="bg-background-100 px-3 py-1 rounded-full border border-border"
              >
                <Text className="text-body-sm text-muted-foreground">{item}</Text>
              </View>
            ))}
          </View>
        )}
        <View>
          {eligibilityLong ? (
            <Text className="text-body text-foreground leading-relaxed">{eligibilityLong}</Text>
          ) : (
            <View className="flex-row items-start">
              <Info size={16} color="#6B7280" className="mt-0.5 mr-2" />
              <Text className="text-body-sm text-muted-foreground italic flex-1">
                Se finansiärens webbplats för detaljerade behörighetskrav.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
