import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { Database, Layers, Calendar, ExternalLink } from 'lucide-react-native';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import {
  Bidragsform,
  Program,
  Forskningsamne,
  Hallbarhetsmal,
  Nyckelord,
  Publiceringsplats,
} from '@/types/grant-details';

interface GdpDetailsSectionProps {
  gdpSource: string;
  diarienummer?: string;
  bidragsformer?: Bidragsform[];
  program?: Program[];
  gdpLastSyncedAt?: string;
  openingDate?: string;
  url?: string;
  forskningsamnen?: Forskningsamne[];
  hallbarhetsmal?: Hallbarhetsmal[];
  nyckelord?: Nyckelord[];
  publiceringsplatser?: Publiceringsplats[];
}

const GDP_SOURCE_LABELS: Record<string, string> = {
  formas: 'Formas',
  forte: 'Forte',
  vr: 'Vetenskapsrådet',
  vinnova: 'Vinnova',
  energimyndigheten: 'Energimyndigheten',
};

export const GdpDetailsSection = ({
  gdpSource,
  diarienummer,
  bidragsformer,
  program,
  gdpLastSyncedAt,
  openingDate,
  url,
  forskningsamnen,
  hallbarhetsmal,
  nyckelord,
  publiceringsplatser,
}: GdpDetailsSectionProps) => {
  return (
    <View className="space-y-6">
      <View className="flex-row items-center mb-4">
        <Database size={24} color="#3b82f6" />
        <Text className="text-h3 font-bold text-foreground ml-2">GDP-information</Text>
      </View>

      <View className="bg-background-0 p-6 rounded-2xl border border-border shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="bg-primary px-2 py-1 rounded-md mr-2">
              <Text className="text-[10px] font-bold text-white uppercase">
                {GDP_SOURCE_LABELS[gdpSource] || gdpSource}
              </Text>
            </View>
            <Text className="text-caption text-muted-foreground">Data via GDP API</Text>
          </View>
          {gdpLastSyncedAt && (
            <View className="flex-row items-center">
              <Calendar size={12} color="#6B7280" />
              <Text className="text-[10px] text-muted-foreground ml-1">
                {format(new Date(gdpLastSyncedAt), 'd MMM yyyy', { locale: sv })}
              </Text>
            </View>
          )}
        </View>

        <View className="space-y-6">
          {/* Main Info Grid */}
          <View className="flex-row flex-wrap">
            {diarienummer && (
              <View className="w-1/2 mb-4">
                <Text className="text-tiny font-bold text-muted-foreground uppercase mb-1">
                  Diarienummer
                </Text>
                <Text className="text-body-sm font-mono text-foreground bg-background-50 px-2 py-1 rounded self-start">
                  {diarienummer}
                </Text>
              </View>
            )}
            {openingDate && (
              <View className="w-1/2 mb-4">
                <Text className="text-tiny font-bold text-muted-foreground uppercase mb-1">
                  Öppningsdatum
                </Text>
                <Text className="text-body-sm text-foreground">
                  {format(new Date(openingDate), 'd MMMM yyyy', { locale: sv })}
                </Text>
              </View>
            )}
          </View>

          {url && (
            <TouchableOpacity
              onPress={() => Linking.openURL(url)}
              className="flex-row items-center bg-primary/5 p-3 rounded-xl border border-primary/10"
            >
              <ExternalLink size={16} color="#0EA5E9" />
              <Text className="text-primary font-bold text-body-sm ml-2">
                Besök officiell utlysning
              </Text>
            </TouchableOpacity>
          )}

          {/* Bidragsformer */}
          {bidragsformer && bidragsformer.length > 0 && (
            <View className="mt-4">
              <View className="flex-row items-center mb-3">
                <Layers size={16} color="#6B7280" />
                <Text className="text-body font-bold text-foreground ml-2">
                  Bidragsformer ({bidragsformer.length})
                </Text>
              </View>
              {bidragsformer.map((form, index) => (
                <View
                  key={index}
                  className="bg-background-50 p-4 rounded-xl border border-border mb-3"
                >
                  <View className="flex-row items-center mb-1">
                    <Text className="text-body-sm font-bold text-foreground mr-2">{form.namn}</Text>
                    {form.stodform?.namn && (
                      <View className="bg-background-100 px-2 py-0.5 rounded border border-border">
                        <Text className="text-[10px] text-muted-foreground">
                          {form.stodform.namn}
                        </Text>
                      </View>
                    )}
                  </View>
                  {form.beskrivning && (
                    <Text className="text-caption text-muted-foreground">{form.beskrivning}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Forskningsämnen */}
          {forskningsamnen && forskningsamnen.length > 0 && (
            <View className="mt-4">
              <Text className="text-body font-bold text-foreground mb-3">Forskningsämnen</Text>
              <View className="flex-row flex-wrap gap-2">
                {forskningsamnen.map((f, index) => (
                  <View
                    key={index}
                    className="bg-background-50 px-3 py-1 rounded-full border border-border"
                  >
                    <Text className="text-caption text-foreground">
                      {f.kod && <Text className="font-mono">{f.kod} </Text>}
                      {f.namn || f.namnEng}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Hållbarhetsmål */}
          {hallbarhetsmal && hallbarhetsmal.length > 0 && (
            <View className="mt-4">
              <Text className="text-body font-bold text-foreground mb-3">Hållbarhetsmål</Text>
              <View className="flex-row flex-wrap gap-2">
                {hallbarhetsmal.map((h, index) => (
                  <View
                    key={index}
                    className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
                  >
                    <Text className="text-caption text-emerald-700 font-medium">
                      {h.nummer && <Text className="font-bold">#{h.nummer} </Text>}
                      {h.namn}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
