import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { MenuProvider, useMenu } from '@/contexts/MenuContext';
import { RootStackParamList } from '@/types/navigation';
import { FullscreenMenu } from '@/components/ui/FullscreenMenu';
import { Menu as MenuIcon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

// Skärmar
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { DiscoverScreen } from '@/screens/discover/DiscoverScreen';
import { SwedishGrantDetailsScreen } from '@/screens/discover/SwedishGrantDetailsScreen';
import { ApplicationsScreen } from '@/screens/applications/ApplicationsScreen';
import { ProjectsScreen } from '@/screens/projects/ProjectsScreen';
import { ProjectDetailsScreen } from '@/screens/projects/ProjectDetailsScreen';
import { OrganizationsScreen } from '@/screens/organizations/OrganizationsScreen';
import { MessagesScreen } from '@/screens/messages/MessagesScreen';
import { ReportingScreen } from '@/screens/reporting/ReportingScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

let navigationRef: any = null;

const AppNavigatorContent = () => {
  const { user, isLoading, logout } = useAuth();
  const { menuVisible, closeMenu, openMenu } = useMenu();
  const { mode } = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  const handleNavigate = (screen: string) => {
    if (navigationRef) {
      navigationRef.navigate(screen);
    }
  };

  return (
    <NavigationContainer
      ref={(ref) => {
        navigationRef = ref;
      }}
    >
      <View className="flex-1">
        <Stack.Navigator
          screenOptions={{
            headerShown: user ? true : false,
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: mode === 'dark' ? '#111827' : 'white',
            },
            headerTintColor: mode === 'dark' ? 'white' : 'black',
            headerRight: () =>
              user ? (
                <TouchableOpacity onPress={openMenu} className="p-4">
                  <MenuIcon size={24} color="#0EA5E9" />
                </TouchableOpacity>
              ) : null,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Impact' }} />
              <Stack.Screen name="Dashboard" component={HomeScreen} />
              <Stack.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{ title: 'Discover' }}
              />
              <Stack.Screen
                name="SwedishGrantDetails"
                component={SwedishGrantDetailsScreen}
                options={{ title: 'Detaljer' }}
              />
              <Stack.Screen
                name="Applications"
                component={ApplicationsScreen}
                options={{ title: 'Ansökningar' }}
              />
              <Stack.Screen
                name="Organizations"
                component={OrganizationsScreen}
                options={{ title: 'Organisationer' }}
              />
              <Stack.Screen
                name="Messages"
                component={MessagesScreen}
                options={{ title: 'Meddelanden' }}
              />
              <Stack.Screen
                name="Projects"
                component={ProjectsScreen}
                options={{ title: 'Projekt' }}
              />
              <Stack.Screen
                name="ProjectDetails"
                component={ProjectDetailsScreen}
                options={{ title: 'Projektinformation' }}
              />
              <Stack.Screen
                name="Reporting"
                component={ReportingScreen}
                options={{ title: 'Rapportering' }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Min Profil' }}
              />
              <Stack.Screen name="Settings" component={HomeScreen} />
            </>
          )}
        </Stack.Navigator>

        {user && (
          <FullscreenMenu
            visible={menuVisible}
            onClose={closeMenu}
            onNavigate={handleNavigate}
            onLogout={logout}
          />
        )}
      </View>
    </NavigationContainer>
  );
};

export const AppNavigator = () => (
  <MenuProvider>
    <AppNavigatorContent />
  </MenuProvider>
);
