import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import HomeScreen from './HomeScreen';

import * as SDK from 'nslsubeejemployeesdk';

import * as GCSDK from 'NslGoldClubEmployeeSdk';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    SDK.initLocalisation();
  }, []);

  // Screens exported from SDK that should be added to navigation
  const sdkScreens = [
    'LoaderScreen',
    'BottomTabsNavigatorEmp',
    'HomeScreenEmp',
    'FertilizerSeeds',
    'YieldCalculator',
    'SeedsCalculator',
    'SamadhanScreen',
    'RaiseComplaintScreen',
    'MoreScreenRn',
    'QRScannerRn',
    'NearByScreen',
    'KnowledgeCenterRn',
    'CropDesiesDetection',
    'CropDiagonstic',
    'LanguageScreenRn',
    'Agronomy',
    'WeatherScreen',
    'Remedyrecommendation',
  ];

  const GCSDKScreens = [
    'GCLoaderScreen'
  ];

  return (
    <Provider store={SDK.store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Local App Screen */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            {/* SDK Screens */}
            {sdkScreens.map((screenName) => {
              const ScreenComponent = SDK[screenName];

              if (!ScreenComponent) {
                console.warn(
                  `Screen '${screenName}' is not exported from nslsubeejemployeesdk`
                );
                return null;
              }


              return (
                <Stack.Screen
                  key={screenName}
                  name={screenName}
                  component={ScreenComponent}
                  options={{ headerShown: false }}
                />
              );
            })}

            {/* GC SDK Screens */}
            {GCSDKScreens.map((screenName) => {
              const ScreenComponent = GCSDK[screenName];

              if (!ScreenComponent) {
                console.warn(
                  `Screen '${screenName}' is not exported from NslGoldClubEmployeeSdk`
                );
                return null;
              }


              return (
                <Stack.Screen
                  key={screenName}
                  name={screenName}
                  component={ScreenComponent}
                  options={{ headerShown: false }}
                />
              );
            })}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}