import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const Login = () => {
    return (
        <View className="flex-1 items-center pr-4 pl-4 bg-white">
            <Image 
                source={require('../assets/logo.png')} 
                className="w-80 h-80"
                resizeMode="contain"
            />
            
            <Text className="text-xl font-bold text-black mb-8">Login to Bartem's</Text>
            <Text className="text-center text-gray-400 text-grey mb-8">Welcome back! Sign in using your account to continue us</Text>
            
            <TextInput
                placeholder="Email"
                className="w-full h-28 p-3 mb-3 border-b border-gray-300 rounded"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                placeholder="Password"
                className="w-full h-28 p-3 mb-24 border-b border-gray-300 rounded"
                secureTextEntry
            />
            
            <TouchableOpacity className="w-full bg-gray-100 p-3 rounded mb-4 rounded-full">
                <Text className="text-gray-500 text-center">Log in</Text>
            </TouchableOpacity>
            
            <Text className="text-gray-600">Don't have an account? Sign Up</Text>
        </View>
    );
}

export default Login;
