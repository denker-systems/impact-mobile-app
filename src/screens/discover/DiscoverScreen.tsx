import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Search, Filter, RefreshCcw, X } from 'lucide-react-native';
import { useSwedishGrants } from '@/hooks/useSwedishGrants';
import { GrantCard } from '@/components/features/discover/GrantCard';
import { FilterModal } from '@/components/features/discover/FilterModal';
import { INITIAL_FILTER_STATE } from '@/constants/grants';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export const DiscoverScreen = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { grants, publishers, themeCategories, isLoading, refetch } = useSwedishGrants(
    filters,
    searchTerm,
  );

  const activeFilterCount =
    filters.levels.length +
    filters.themes.length +
    filters.publishers.length +
    (filters.hasIntelligence ? 1 : 0) +
    (filters.hasDocuments ? 1 : 0) +
    (filters.hasFormGuides ? 1 : 0) +
    (filters.gdpSource !== 'all' ? 1 : 0);

  const renderHeader = () => (
    <View className="bg-background-0">
      <View className="px-6 py-4">
        <View className="flex-row items-center bg-background-50 border border-border rounded-xl px-4 py-2 mb-4">
          <Search size={20} color="#6B7280" className="mr-2" />
          <TextInput
            className="flex-1 text-foreground text-body"
            placeholder="Sök anslag, finansiär..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-body-sm font-medium text-muted-foreground">
            {grants.length} anslag hittades
          </Text>
          <TouchableOpacity
            className={`flex-row items-center px-3 py-1.5 rounded-lg border ${
              activeFilterCount > 0
                ? 'bg-primary border-primary'
                : 'bg-primary/10 border-primary/20'
            }`}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Filter
              size={16}
              color={activeFilterCount > 0 ? 'white' : '#0EA5E9'}
              className="mr-1.5"
            />
            <Text
              className={`font-bold text-body-sm ${
                activeFilterCount > 0 ? 'text-white' : 'text-primary'
              }`}
            >
              Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeFilterCount > 0 && (
        <View className="px-6 pb-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => setFilters(INITIAL_FILTER_STATE)}
            className="bg-background-100 px-3 py-1 rounded-full border border-border flex-row items-center"
          >
            <Text className="text-tiny font-bold text-muted-foreground uppercase mr-1">
              Rensa alla filter
            </Text>
            <X size={12} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background-50">
      <StatusBar style="auto" />
      {renderHeader()}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text className="text-muted-foreground mt-4 text-body">Hämtar anslag...</Text>
        </View>
      ) : (
        <FlatList
          data={grants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-6">
              <GrantCard
                grant={item}
                onPress={() => {
                  (navigation as any).navigate('SwedishGrantDetails', { id: item.id });
                }}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center py-20 px-10">
              <Text className="text-h3 font-bold text-foreground text-center mb-2">
                Inga anslag hittades
              </Text>
              <Text className="text-body text-muted-foreground text-center">
                Prova att ändra din sökning eller nollställ filtren.
              </Text>
              <TouchableOpacity
                className="mt-6 flex-row items-center bg-background-100 px-4 py-2 rounded-lg border border-border"
                onPress={() => {
                  setSearchTerm('');
                  setFilters(INITIAL_FILTER_STATE);
                  refetch();
                }}
              >
                <RefreshCcw size={16} color="#4B5563" className="mr-2" />
                <Text className="text-foreground font-medium">Nollställ sökning</Text>
              </TouchableOpacity>
            </View>
          )}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        themeCategories={themeCategories || []}
        publishers={publishers || []}
      />
    </View>
  );
};
