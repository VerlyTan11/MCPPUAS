import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';

const Login = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            dispatch(setUser({ uid: user.uid, email: user.email }));

            await AsyncStorage.setItem('userEmail', email);
    
            const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
            if (!isBiometricAvailable) {
                alert('Biometric authentication is not supported on this device.');
                navigation.navigate('Home');
                return;
            }
    
            const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!savedBiometrics) {
                alert('No biometric record found. Proceeding without biometric verification.');
                navigation.navigate('Home');
                return;
            }
    
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify your identity',
                cancelLabel: 'Cancel',
                disableDeviceFallback: true,
            });
    
            if (biometricAuth.success) {
                alert('Biometric verification successful!');
                navigation.navigate('Home');
            } else {
                alert('Biometric verification failed. Please try again.');
            }
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
            const userEmail = await AsyncStorage.getItem('userEmail');
            if (userEmail) {
                TwoButtonAlert(userEmail);
            } else {
                alert('No saved account. Please log in manually first.');
            }
        }
    };

    useEffect(() => {
        let isMounted = true; 
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (isMounted) {
                setIsBiometricSupported(compatible);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', paddingHorizontal: 32, backgroundColor: 'white' }}>
            <Image
                source={require('../assets/logo-bartems.png')}
                className="w-36 h-36 mb-4"
                resizeMode="contain"
            />

            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black', marginBottom: 32 }}>
            Login to Bartem's
            </Text>

            <Text style={{ textAlign: 'center', color: 'gray', marginBottom: 8 }}>
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
                style={{ 
                    width: '100%', 
                    backgroundColor: '#f0f0f0', 
                    padding: 12, 
                    marginBottom: 16, 
                    borderRadius: 24, 
                    marginTop: 20
                }}
            >
                <Text style={{ color: '#808080', textAlign: 'center' }}>Log in</Text>
            </TouchableOpacity>

            <Text>
                {isBiometricSupported
                    ? 'Your device is compatible with biometric!'
                    : 'Fingerprint scanner is unavailable on this device'}
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} className="flex-row">
                <Text className="text-gray-600 mt-2">Don't have an account? </Text>
                <Text className="text-black font-bold mt-2">Sign Up</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Login;