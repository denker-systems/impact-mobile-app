import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { UserOrganization } from '@/types/organization';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface OrganizationContextType {
  organizations: UserOrganization[];
  selectedOrganizationId: string | null;
  setSelectedOrganizationId: (id: string | null) => void;
  refreshOrganizations: () => Promise<void>;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const STORAGE_KEY = 'selected-organization-id';

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Custom setter to save to storage
  const setSelectedOrganizationId = useCallback(async (id: string | null) => {
    setSelectedOrganizationIdState(id);
    try {
      if (id) {
        if (Platform.OS === 'web') {
          localStorage.setItem(STORAGE_KEY, id);
        } else {
          await SecureStore.setItemAsync(STORAGE_KEY, id);
        }
      } else {
        if (Platform.OS === 'web') {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          await SecureStore.deleteItemAsync(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Error saving organization to storage:', e);
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Admin ser alla organisationer, vanliga användare ser bara sina egna
      let query = supabase.from('user_organizations').select('*');

      // Filtrera på user_id om användaren INTE är admin
      if (!user.isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching organizations:', error);
        setOrganizations([]);
      } else {
        setOrganizations(data || []);

        // Validera och sätt organisation
        if (data && data.length > 0) {
          let savedId: string | null = null;
          if (Platform.OS === 'web') {
            savedId = localStorage.getItem(STORAGE_KEY);
          } else {
            savedId = await SecureStore.getItemAsync(STORAGE_KEY);
          }

          const savedOrgExists = savedId && data.some((org) => org.id === savedId);

          if (savedOrgExists) {
            setSelectedOrganizationIdState(savedId);
          } else {
            setSelectedOrganizationIdState(data[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchOrganizations:', error);
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Removed setSelectedOrganizationId to fix unnecessary dependency warning

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrganizations();
    }
  }, [fetchOrganizations, authLoading, user]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        selectedOrganizationId,
        setSelectedOrganizationId,
        refreshOrganizations: fetchOrganizations,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
