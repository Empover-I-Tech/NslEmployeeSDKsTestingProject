import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

export default function HomeScreen() {

    const navigation = useNavigation();

    const [mobileNumber, setMobileNumber] = useState('9963759686');
    const [authId, setAuthId] = useState('R8T26ZBC01MNSUB4');
    const [authToken, setAuthToken] = useState(
        'ZXC26VBN01MQSUBWERTYUIOPLKJHGFDSAZXCVBNMLKJHG'
    );
    const [fcmToken, setFcmToken] = useState('');
    const [languageCode, setLanguageCode] = useState('en');
    const [buildEnvironment, setBuildEnvironment] = useState('UAT');

    const languageData = [
        { label: 'English', value: 'en' },
        { label: 'Telugu', value: 'te' },
        { label: 'Hindi', value: 'hi' },
        { label: 'Marathi', value: 'mr' },
    ];

    const environmentData = [
        { label: 'UAT', value: 'UAT' },
        { label: 'PROD', value: 'PROD' },
    ];

    const getConfig = () => ({
        mobileNumber,
        fcmToken,
        buildEnvironment,
        languageCode,
        authId,
        authToken,
    });

    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >

            <Text style={styles.title}>
                SDK Testing Application
            </Text>

            <Text style={styles.label}>
                Mobile Number
            </Text>

            <TextInput
                style={styles.input}
                value={mobileNumber}
                keyboardType="phone-pad"
                onChangeText={setMobileNumber}
            />

            <Text style={styles.label}>
                Auth ID
            </Text>

            <TextInput
                style={styles.input}
                value={authId}
                onChangeText={setAuthId}
            />

            <Text style={styles.label}>
                Auth Token
            </Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        height: 100,
                        textAlignVertical: 'top',
                    },
                ]}
                multiline
                value={authToken}
                onChangeText={setAuthToken}
            />

            <Text style={styles.label}>
                FCM Token
            </Text>

            <TextInput
                style={styles.input}
                value={fcmToken}
                onChangeText={setFcmToken}
            />

            <Text style={styles.label}>
                Language
            </Text>

            <Dropdown
                style={styles.dropdown}
                data={languageData}
                labelField="label"
                valueField="value"
                value={languageCode}
                onChange={item =>
                    setLanguageCode(item.value)
                }
            />

            <Text style={styles.label}>
                Environment
            </Text>

            <Dropdown
                style={styles.dropdown}
                data={environmentData}
                labelField="label"
                valueField="value"
                value={buildEnvironment}
                onChange={item =>
                    setBuildEnvironment(item.value)
                }
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Open Subeej SDK"
                    onPress={() =>
                        navigation.navigate(
                            'SubeejSDK',
                            {
                                navigateItem: getConfig(),
                            }
                        )
                    }
                />
            </View>

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Open GC SDK"
                    onPress={() =>
                        navigation.navigate('GoldClubSDK', {
                            navigateItem: getConfig(),
                            onSDKClose: () => {
                                navigation.navigate('HomeScreen'); // your main app screen
                            },
                        })
                    }
                />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '600',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
    },

    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 50,
    },
});