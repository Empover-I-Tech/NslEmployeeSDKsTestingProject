import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();

    const sdkConfig = {
        mobileNumber: "9963759686",      // Required: User mobile number
        fcmToken: "",      // Optional: Firebase Cloud Messaging token
        buildEnvironment: "UAT",                // Required: UAT or PROD
        languageCode: "en",              // Supported: en, hi, mr, te
        authId: "R8T26ZBC01MNSUB4",
        authToken: "ZXC26VBN01MQSUBWERTYUIOPLKJHGFDSAZXCVBNMLKJHG",

    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <Button
                title="Open Subeej SDK"
                onPress={() => {
                    navigation.navigate('LoaderScreen', { navigateItem: sdkConfig });
                }}
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Open GC SDK"
                    onPress={() => {
                        navigation.navigate('GCLoaderScreen', { navigateItem: sdkConfig });
                    }}
                />
            </View>

        </View>
    );
}