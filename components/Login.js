import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Tambahkan AsyncStorage

const Login = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Fungsi untuk login menggunakan email dan password
    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('userEmail', email); // Simpan email ke AsyncStorage
            alert('Login successful!');
            navigation.navigate('Home');
        } catch (error) {
            alert(error.message);
        }
    };

    const fallBackToDefaultAuth = () => {
        console.log('Fallback to password authentication');
    };

    const alertComponent = (title, message, buttonText, buttonFunction) => {
        Alert.alert(title, message, [
            { text: buttonText, onPress: buttonFunction },
        ]);
    };

    const TwoButtonAlert = (userEmail) =>
        Alert.alert('Berhasil Login', '', [
            { text: 'Back', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
            { text: 'Proceed', onPress: () => navigation.navigate('Home', { email: userEmail }) },
        ]);

    // Fungsi untuk otentikasi biometrik
    const handleBiometricAuth = async () => {
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
        if (!isBiometricAvailable) {
            return alertComponent(
                'Please enter your password',
                'Biometric authentication is not supported',
                'OK',
                fallBackToDefaultAuth
            );
        }

        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        if (!savedBiometrics) {
            return alertComponent(
                'Biometric record not found',
                'Please login with your password',
                'OK',
                fallBackToDefaultAuth
            );
        }

        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login to Bartems app',
            cancelLabel: 'Cancel',
            disableDeviceFallback: true,
        });

        if (biometricAuth.success) {
            const userEmail = await AsyncStorage.getItem('userEmail'); // Ambil email dari AsyncStorage
            if (userEmail) {
                TwoButtonAlert(userEmail);
            } else {
                alert('No saved account. Please log in manually first.');
            }
        }
    };

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (isMounted) {
                setIsBiometricSupported(compatible);
            }
        })();

        return () => {
            isMounted = false; // Cleanup on unmount
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 items-center px-8 bg-white">
            <Image
                source={require('../assets/logo-bartems.png')}
                className="w-36 h-36 mb-4"
                resizeMode="contain"
            />

            <Text className="text-2xl font-bold text-black mb-8">Login to Bartem's</Text>
            <Text className="text-center text-gray-400 mb-8">
                Welcome back! Sign in using your account to continue
            </Text>

            <View className="w-full">
                <Text className="text-gray-400">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text className="text-gray-400">Password</Text>
                <View className="flex-row items-center border-b border-gray-300">
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        className="flex-1 h-20 p-3"
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Text className="text-gray-500">
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleLogin}
                className="w-full bg-gray-100 p-3 mb-4 rounded-full mt-10"
            >
                <Text className="text-gray-500 text-center">Log in</Text>
            </TouchableOpacity>

            <Text>
                {isBiometricSupported
                    ? 'Your device is compatible with biometric'
                    : 'Fingerprint scanner is unavailable on this device'}
            </Text>

            <TouchableOpacity onPress={handleBiometricAuth}>
                <Image
                    source={require('../assets/fingerprint.png')}
                    className="w-16 h-16"
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} className="flex-row">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Text className="text-black font-bold">Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Login;
