import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const dispatch = useDispatch();

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    // Function to handle Biometric Check
    useEffect(() => {
        let isMounted = true;
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (isMounted) {
                setIsBiometricSupported(compatible);
                if (!compatible) {
                    showModal(
                        "Warning!",
                        "Fingerprint scanner is unavailable on this device.",
                        "OK"
                    );
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            showModal('Error', 'Please enter both email and password', 'OK');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            dispatch(setUser({ uid: user.uid, email: user.email }));
            await AsyncStorage.setItem('userEmail', email);

            const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
            if (!isBiometricAvailable) {
                showModal('Error', 'Biometric authentication is not supported on this device.', 'OK');
                navigation.navigate('Home');
                return;
            }

            const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
            if (!savedBiometrics) {
                showModal('Error', 'No biometric record found. Proceeding without biometric verification.', 'OK');
                navigation.navigate('Home');
                return;
            }

            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify your identity',
                cancelLabel: 'Cancel',
                disableDeviceFallback: true,
            });

            if (biometricAuth.success) {
                showModal('Success', 'Biometric verification successful!', 'OK');
                navigation.navigate('Home');
            } else {
                showModal('Error', 'Biometric verification failed. Please try again.', 'OK');
            }
        } catch (error) {
            showModal('Error', error.message, 'OK');
        }
    };

    const showModal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);

        setTimeout(() => {
            setModalVisible(false);
        }, 10000);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 items-center px-8 bg-white">
            <Image
                source={require('../assets/logo-bartems.png')}
                className="w-36 h-36 mb-4"
                resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-black">
                Login to Bartem's
            </Text>
            <Text className="text-center text-gray-500 mb-8">
                Welcome back! Sign in using your account to continue
            </Text>

            <View className="w-full mb-16 mt-8">
                <Text className="text-gray-400">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="h-15 pl-0 border-b border-gray-300 rounded mb-12"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text className="text-gray-400">Password</Text>
                <View className="flex-row items-center border-b border-gray-300">
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        className="flex-1 h-15 pl-0"
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Text className="text-gray-500">
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <LinearGradient
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={{
                    borderRadius: 16,
                }}
                className="flex-row items-center justify-center rounded-lg shadow-md mb-4"
            >
                <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                        width: '100%',
                        marginBottom: 16,
                        borderRadius: 24,
                        marginTop: 16,
                    }}
                >
                    <Text className="color-white text-center">Log in</Text>
                </TouchableOpacity>
            </LinearGradient>

            {!isBiometricSupported && (
                <View className="flex items-center mt-8">
                    <Image
                        source={require('../assets/warning.png')}
                        className="w-16 h-16 mb-4"
                        resizeMode="contain"
                    />
                    <Text className="text-red-600 font-bold text-center">
                        Fingerprint scanner is unavailable on this device
                    </Text>
                </View>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Register')} className="flex-row">
                <Text className="text-gray-600 mt-2">Don't have an account? </Text>
                <Text className="text-black font-bold mt-2">Sign Up</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View className="flex-1 justify-center items-center bg-gray-400 opacity-90">
                    <View className="bg-white p-6 rounded-lg items-center">
                        <Text className="text-xl font-bold text-black mb-4">{modalTitle}</Text>
                        <Text className="text-lg text-black mb-4">{modalMessage}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Login;
