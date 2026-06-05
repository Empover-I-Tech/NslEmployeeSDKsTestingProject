import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';

import HomeScreen from './HomeScreen';

import * as SDK from 'nslsubeejemployeesdk';

import * as GCSDK from 'NslGoldClubEmployeeSdk';
import { StatusBar } from 'react-native';
console.log("SDKKK", SDK)
const Stack = createNativeStackNavigator();


const AppContainer = ({ sdkScreens, GCSDKScreens }) => {
  const state = useSelector(state => state);

  console.log(
    'FULL REDUX STATE',
    JSON.stringify(state, null, 2)
  );
  console.log("state.companyStyles", state?.companyStyles?.companyStyles?.primaryColor)

  // Adjust this after checking console
  const themeColor =
    state?.companyStyles?.companyStyles?.primaryColor ||
    '#FFFFFF';

  return (
    <>
      <StatusBar
        backgroundColor={themeColor}
        barStyle="light-content"
        translucent={false}
      />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themeColor,
        }}
        edges={['top', 'bottom']}
      >
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            {sdkScreens.map((screenName) => {
              const ScreenComponent = SDK[screenName];

              if (!ScreenComponent) {
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

            {GCSDKScreens.map((screenName) => {
              const ScreenComponent = GCSDK[screenName];

              if (!ScreenComponent) {
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
      </SafeAreaView>
    </>
  );
};

export default function App() {
  useEffect(() => {
    SDK.initLocalisation();
  }, []);

  const sdkScreens = [
    'LoaderScreen',
    'BottomTabsNavigatorEmp',
    // ...
  ];

  const GCSDKScreens = [
    'GCLoaderScreen',
  ];

  return (
    <Provider store={SDK.store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContainer
            sdkScreens={sdkScreens}
            GCSDKScreens={GCSDKScreens}
          />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}