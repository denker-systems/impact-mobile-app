import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import {
  X,
  ChevronDown,
  ChevronUp,
  Bot,
  Database,
  Clock,
  Layers,
  Filter,
} from 'lucide-react-native';
import { FilterState, GrantCategory, Publisher } from '@/types/swedish-grants';
import { ALL_GDP_PROVIDERS, LEVEL_OPTIONS } from '@/constants/grants';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  themeCategories: GrantCategory[];
  publishers: Publisher[];
}

const GDP_PROVIDERS: { value: string; label: string; color: string }[] = [
  { value: 'formas', label: 'Formas', color: 'bg-emerald-500' },
  { value: 'forte', label: 'Forte', color: 'bg-purple-500' },
  { value: 'vr', label: 'VR', color: 'bg-sky-500' },
  { value: 'vinnova', label: 'Vinnova', color: 'bg-orange-500' },
  { value: 'energimyndigheten', label: 'Energimyndigheten', color: 'bg-yellow-500' },
];

export const FilterModal = ({
  visible,
  onClose,
  filters,
  setFilters,
  themeCategories,
  publishers,
}: FilterModalProps) => {
  const [openSections, setOpenSections] = useState({
    intelligence: true,
    dataSource: true,
    level: false,
    theme: false,
    deadline: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev: any) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [key]: current.includes(value)
            ? current.filter((v: any) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const CheckboxRow = ({ label, checked, onPress, icon: Icon, iconColor }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3 border-b border-border/30"
    >
      <View
        className={`w-6 h-6 rounded border items-center justify-center mr-3 ${
          checked ? 'bg-primary border-primary' : 'bg-background-50 border-border'
        }`}
      >
        {checked && <View className="w-2.5 h-2.5 bg-white rounded-sm" />}
      </View>
      {Icon && <Icon size={16} color={iconColor || '#6B7280'} className="mr-2" />}
      <Text className="text-body-sm text-foreground flex-1">{label}</Text>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, section, icon: Icon }: any) => (
    <TouchableOpacity
      onPress={() => toggleSection(section)}
      className="flex-row items-center justify-between py-4 border-b border-border"
    >
      <View className="flex-row items-center">
        {Icon && <Icon size={18} color="#6B7280" className="mr-2" />}
        <Text className="text-body font-bold text-foreground">{title}</Text>
      </View>
      {openSections[section as keyof typeof openSections] ? (
        <ChevronUp size={20} color="#9CA3AF" />
      ) : (
        <ChevronDown size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView className="bg-background-0 rounded-t-[40px] h-[90%]">
          <View className="px-6 py-6 border-b border-border flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Filter size={20} color="#0EA5E9" className="mr-2" />
              <Text className="text-h2 font-bold text-foreground">Filter</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 bg-background-50 rounded-full">
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Intelligence */}
            <SectionHeader title="Grant Intelligence" section="intelligence" icon={Bot} />
            {openSections.intelligence && (
              <View className="pb-4">
                <CheckboxRow
                  label="Ansökningsdata"
                  checked={filters.hasIntelligence}
                  onPress={() => toggleFilter('hasIntelligence', !filters.hasIntelligence)}
                />
                <CheckboxRow
                  label="Mallar & Blanketter"
                  checked={filters.hasDocuments}
                  onPress={() => toggleFilter('hasDocuments', !filters.hasDocuments)}
                />
                <CheckboxRow
                  label="Form Guides"
                  checked={filters.hasFormGuides}
                  onPress={() => toggleFilter('hasFormGuides', !filters.hasFormGuides)}
                />
              </View>
            )}

            {/* Data Source */}
            <SectionHeader title="Datakälla" section="dataSource" icon={Database} />
            {openSections.dataSource && (
              <View className="pb-4">
                <TouchableOpacity
                  onPress={() => toggleFilter('gdpSource', 'all')}
                  className="flex-row items-center py-3"
                >
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${filters.gdpSource === 'all' ? 'border-primary' : 'border-border'}`}
                  >
                    {filters.gdpSource === 'all' && (
                      <View className="w-2.5 h-2.5 bg-primary rounded-full" />
                    )}
                  </View>
                  <Text className="text-body-sm text-foreground">Alla källor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleFilter('gdpSource', 'gdp')}
                  className="flex-row items-center py-3"
                >
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${filters.gdpSource === 'gdp' ? 'border-primary' : 'border-border'}`}
                  >
                    {filters.gdpSource === 'gdp' && (
                      <View className="w-2.5 h-2.5 bg-primary rounded-full" />
                    )}
                  </View>
                  <Text className="text-body-sm text-foreground">GDP-utlysningar</Text>
                </TouchableOpacity>
                {filters.gdpSource === 'gdp' && (
                  <View className="ml-8 border-l border-border pl-4">
                    {GDP_PROVIDERS.map((provider) => (
                      <CheckboxRow
                        key={provider.value}
                        label={provider.label}
                        checked={filters.gdpProviders.includes(provider.value)}
                        onPress={() => toggleFilter('gdpProviders', provider.value)}
                      />
                    ))}
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => toggleFilter('gdpSource', 'crawler')}
                  className="flex-row items-center py-3"
                >
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${filters.gdpSource === 'crawler' ? 'border-primary' : 'border-border'}`}
                  >
                    {filters.gdpSource === 'crawler' && (
                      <View className="w-2.5 h-2.5 bg-primary rounded-full" />
                    )}
                  </View>
                  <Text className="text-body-sm text-foreground">Crawler-data</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Level */}
            <SectionHeader title="Nivå" section="level" icon={Layers} />
            {openSections.level && (
              <View className="pb-4">
                {LEVEL_OPTIONS.map((option) => (
                  <CheckboxRow
                    key={option.value}
                    label={option.label}
                    checked={filters.levels.includes(option.value)}
                    onPress={() => toggleFilter('levels', option.value)}
                  />
                ))}
              </View>
            )}

            {/* Theme */}
            <SectionHeader title="Tema" section="theme" icon={Layers} />
            {openSections.theme && (
              <View className="pb-4">
                {themeCategories.map((cat) => (
                  <CheckboxRow
                    key={cat.id}
                    label={cat.name}
                    checked={filters.themes.includes(cat.name)}
                    onPress={() => toggleFilter('themes', cat.name)}
                  />
                ))}
              </View>
            )}

            {/* Deadline */}
            <SectionHeader title="Deadline" section="deadline" icon={Clock} />
            {openSections.deadline && (
              <View className="pb-4">
                <CheckboxRow
                  label="Öppna nu"
                  checked={filters.showOpen}
                  onPress={() => toggleFilter('showOpen', !filters.showOpen)}
                />
                <CheckboxRow
                  label="Löpande ansökan"
                  checked={filters.showRecurring}
                  onPress={() => toggleFilter('showRecurring', !filters.showRecurring)}
                />
                <CheckboxRow
                  label="Inkl. passerade"
                  checked={filters.showExpired}
                  onPress={() => toggleFilter('showExpired', !filters.showExpired)}
                />
              </View>
            )}

            <View className="h-10" />
          </ScrollView>

          <View className="px-6 py-8 border-t border-border bg-background-0 flex-row gap-4">
            <TouchableOpacity
              onPress={() =>
                setFilters({
                  levels: [],
                  themes: [],
                  publishers: [],
                  showExpired: false,
                  showOpen: true,
                  showRecurring: true,
                  hasIntelligence: false,
                  hasDocuments: false,
                  hasFormGuides: false,
                  gdpSource: 'all',
                  gdpProviders: [...ALL_GDP_PROVIDERS],
                })
              }
              className="flex-1 bg-background-100 p-4 rounded-2xl items-center border border-border"
            >
              <Text className="text-foreground font-bold text-body-lg">Nollställ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="flex-[2] bg-primary p-4 rounded-2xl items-center shadow-lg shadow-primary/30"
            >
              <Text className="text-white font-bold text-body-lg">Visa resultat</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
