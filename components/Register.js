import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Gunakan setDoc untuk menyimpan dengan ID tertentu

const Register = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill all fields');
            return;
        }
    
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        try {
            // Buat akun pengguna di Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user; // Ambil UID pengguna yang baru dibuat
    
            // Simpan data pengguna ke Firestore dengan id yang sama dengan UID
            await setDoc(doc(db, 'users', uid), {
                name,  // Simpan nama pengguna
                email, // Simpan email pengguna
            });
    
            // Tampilkan pop-up dan arahkan ke halaman login
            alert('Account created successfully!');
            navigation.navigate('Login');
        } catch (error) {
            alert(error.message);
        }
    };
    

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View className="flex-1 items-center p-8 bg-white">
                <Image
                    source={require('../assets/logo-bartems.png')}
                    className="w-28 h-28 mt-8 mb-4"
                    resizeMode="contain"
                />

                <Text className="text-xl font-bold text-black mb-8">Sign Up With Email</Text>
                <Text className="text-center text-gray-400 text-grey mb-8">
                    Get barter for your items with everyone by signing up for our barter app!
                </Text>

                <View className="w-full">
                    <Text className="text-gray-400">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-400">Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-400">Password</Text>
                    <View className="flex-row items-center border-b border-gray-300 mb-4">
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

                    <Text className="text-gray-400">Confirm Password</Text>
                    <View className="flex-row items-center border-b border-gray-300 mb-4">
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            className="flex-1 h-20 p-3"
                            secureTextEntry={!isConfirmPasswordVisible}
                        />
                        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                            <Text className="text-gray-500">
                                {isConfirmPasswordVisible ? 'Hide' : 'Show'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    className="w-full bg-gray-100 p-3 mb-4 rounded-full"
                >
                    <Text className="text-gray-500 text-center">Create an account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} className="flex-row">
                    <Text className="text-gray-600">Have an account?</Text>
                    <Text className="text-black font-bold"> Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Register;
