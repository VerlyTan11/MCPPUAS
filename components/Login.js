import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = () => {
        if (email && password) {
            navigation.navigate('Home');
        } else {
            alert('Please enter both email and password');
        }
    };

    return (
        <View className="flex-1 items-center p-8 bg-white">
            <Image 
                source={require('../assets/logo-bartems.png')} 
                className="w-36 h-36 mt-8 mb-4"
                resizeMode="contain"
            />
            
            <Text className="text-2xl font-bold text-black mb-8">Login to Bartem's</Text>
            <Text className="text-center text-gray-400 mb-8">Welcome back! Sign in using your account to continue us</Text>
            
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
                <View className="flex-row items-center border-b border-gray-300 mb-80">
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
                className="w-full bg-gray-100 p-3 mb-4 rounded-full"
            >
                <Text className="text-gray-500 text-center">Log in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Register')} className="flex-row">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Text className="text-black font-bold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;
