import React from 'react';
import { ScrollView, Pressable, Modal, View, Text, Dimensions } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react-native';
import { MenuHeader, MenuItem } from './menu';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FullscreenMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
}

export function FullscreenMenu({ visible, onClose, onNavigate, onLogout }: FullscreenMenuProps) {
  const insets = useSafeAreaInsets();
  const { mode, toggleMode } = useTheme();

  const handleItemPress = (key: string) => {
    if (key === 'logout') {
      onLogout?.();
      onClose();
    } else {
      onNavigate?.(key);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        <AnimatePresence>
          {visible && (
            <>
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'timing', duration: 250 }}
                className="absolute inset-0 bg-black/40"
              >
                <Pressable className="flex-1" onPress={onClose} />
              </MotiView>

              <MotiView
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  backgroundColor: mode === 'dark' ? '#111827' : 'white',
                  paddingTop: insets.top,
                  paddingBottom: Math.max(insets.bottom, 20),
                }}
                from={{ translateX: SCREEN_WIDTH }}
                animate={{ translateX: visible ? 0 : SCREEN_WIDTH }}
                exit={{ translateX: SCREEN_WIDTH }}
                transition={{ type: 'timing', duration: 300 }}
              >
                <MenuHeader title="Meny" onClose={onClose} />

                <ScrollView className="flex-1">
                  <View className="py-2">
                    <Text className="px-6 py-2 text-tiny font-bold text-muted-foreground uppercase tracking-wider">
                      Huvudmeny
                    </Text>
                    <MenuItem
                      icon={LayoutDashboard}
                      title="Dashboard"
                      subtitle="Översikt av dina projekt"
                      onPress={() => handleItemPress('Dashboard')}
                    />
                    <MenuItem
                      icon={Briefcase}
                      title="Projekt"
                      subtitle="Hantera dina anslagsprojekt"
                      onPress={() => handleItemPress('Projects')}
                    />
                    <MenuItem
                      icon={Search}
                      title="Discover"
                      subtitle="Hitta nya anslag"
                      onPress={() => handleItemPress('Discover')}
                    />
                    <MenuItem
                      icon={Building2}
                      title="Organisationer"
                      subtitle="Dina organisationer"
                      onPress={() => handleItemPress('Organizations')}
                    />
                    <MenuItem
                      icon={FileText}
                      title="Applications"
                      subtitle="Dina pågående ansökningar"
                      onPress={() => handleItemPress('Applications')}
                    />
                    <MenuItem
                      icon={MessageSquare}
                      title="Meddelanden"
                      subtitle="Chatt med assistenten"
                      onPress={() => handleItemPress('Messages')}
                    />
                    <MenuItem
                      icon={BarChart3}
                      title="Rapportering"
                      subtitle="Projektets framsteg"
                      onPress={() => handleItemPress('Reporting')}
                    />
                  </View>

                  <View className="py-2">
                    <Text className="px-6 py-2 text-tiny font-bold text-muted-foreground uppercase tracking-wider">
                      Profil & Inställningar
                    </Text>
                    <MenuItem
                      icon={User}
                      title="Min Profil"
                      onPress={() => handleItemPress('Profile')}
                    />
                    <MenuItem
                      icon={mode === 'dark' ? Sun : Moon}
                      title={mode === 'dark' ? 'Ljust läge' : 'Mörkt läge'}
                      onPress={toggleMode}
                    />
                    <MenuItem
                      icon={Settings}
                      title="Inställningar"
                      onPress={() => handleItemPress('Settings')}
                    />
                  </View>

                  <View className="mt-auto py-6">
                    <MenuItem
                      icon={LogOut}
                      title="Logga ut"
                      onPress={() => handleItemPress('logout')}
                    />
                  </View>
                </ScrollView>
              </MotiView>
            </>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}
