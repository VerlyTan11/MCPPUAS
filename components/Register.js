import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const navigation = useNavigation();

    return (
        <View className="flex-1 items-center p-8 bg-white">
            <Image 
                source={require('../assets/logo-bartems.png')} 
                className="w-28 h-28 mt-8 mb-4"
                resizeMode="contain"
            />
            
            <Text className="text-xl font-bold text-black mb-8">Sign Up With Email</Text>
            <Text className="text-center text-gray-400 text-grey mb-8">Get barter for your item's with everyone by signing up for our barter app!</Text>
            
            <View className="w-full">
                <Text className="text-gray-400">Name</Text>
                <TextInput
                    className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                    keyboardType="name"
                    autoCapitalize="none"
                />

                <Text className="text-gray-400">Email</Text>
                <TextInput
                    className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text className="text-gray-400">Password</Text>
                <TextInput
                    className="h-20 p-3 border-b border-gray-300 rounded mb-4"
                    secureTextEntry
                />
                
                <Text className="text-gray-400">Confirm Password</Text>
                <TextInput
                    className="h-20 p-3 mb-24 border-b border-gray-300 rounded"
                    secureTextEntry
                />
            </View>
            
            <TouchableOpacity className="w-full bg-gray-100 p-3 mb-4 rounded-full">
                <Text className="text-gray-500 text-center">Create an account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Login')} className="flex-row">
                <Text className="text-gray-600">Have an account?</Text>
                <Text className="text-black font-bold">Login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Register;