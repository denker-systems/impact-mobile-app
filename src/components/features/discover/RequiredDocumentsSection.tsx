import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { FileText, ExternalLink } from 'lucide-react-native';

interface RequiredDocumentsSectionProps {
  documents?: {
    name: string;
    description?: string;
    url?: string;
  }[];
}

export const RequiredDocumentsSection = ({ documents }: RequiredDocumentsSectionProps) => {
  if (!documents || documents.length === 0) return null;

  return (
    <View className="space-y-4">
      <View className="flex-row items-center mb-4">
        <FileText size={24} color="#3b82f6" />
        <Text className="text-h3 font-bold text-foreground ml-2">Dokument som krävs</Text>
      </View>

      <View className="space-y-3">
        {documents.map((doc, idx) => (
          <View
            key={idx}
            className="bg-background-0 p-5 rounded-3xl border border-border shadow-sm"
          >
            <View className="flex-row items-start">
              <View className="h-10 w-10 rounded-xl bg-blue-50 items-center justify-center mr-4">
                <FileText size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-body font-bold text-foreground">{doc.name}</Text>
                {doc.description && (
                  <Text className="text-body-sm text-muted-foreground mt-1">{doc.description}</Text>
                )}
                {doc.url && doc.url.startsWith('http') && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(doc.url!)}
                    className="mt-3 flex-row items-center"
                  >
                    <Text className="text-primary font-bold text-body-sm mr-1">Ladda ner mall</Text>
                    <ExternalLink size={14} color="#0EA5E9" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
