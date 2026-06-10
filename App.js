import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './HomeScreen';

import { SubeejSDK } from 'nslsubeejemployeesdk';
import { GoldClubSDK } from 'NslGoldClubEmployeeSdk';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>

          <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="SubeejSDK"
              component={SubeejSDK}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="GoldClubSDK"
              component={GoldClubSDK}
              options={{ headerShown: false }}
            />

          </Stack.Navigator>

        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}