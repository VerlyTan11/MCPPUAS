import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation();

    return (
        <View className="flex-1 items-center pr-4 pl-4 bg-white">
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
                    className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <Text className="text-gray-400">Password</Text>
                <TextInput
                    className="h-20 p-3 mb-44 border-b border-gray-300 rounded"
                    secureTextEntry
                />
            </View>
            
            <TouchableOpacity className="w-full bg-gray-100 p-3 rounded mb-4 rounded-full">
                <Text className="text-gray-500 text-center">Log in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Register')} className="flex-row">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Text className="text-black font-bold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Login;
