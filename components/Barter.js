import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Barter = () => {
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-row justify-around items-center mb-6">
                <View className="items-center">
                    <Image 
                        source={require('../assets/kardus.jpg')} 
                        className="w-24 h-24 rounded-lg mb-2"
                    />
                    <Text className="text-gray-800">Produk: Kain</Text>
                    <Text className="text-gray-500">Penjual: Anda</Text>
                </View>
                <Image 
                    source={require('../assets/exchange2.png')} 
                    className="w-6 h-6 rounded-lg mb-2"
                />
                <View className="items-center">
                    <Image 
                        source={require('../assets/kardus.jpg')}
                        className="w-24 h-24 rounded-lg mb-2"
                    />
                    <Text className="text-gray-800">Produk: Kardus</Text>
                    <Text className="text-gray-500">Pembeli: Aldo</Text>
                </View>
            </View>

            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-center p-4 rounded-lg mb-6"
            >
                <TouchableOpacity 
                    className="flex-1 items-center justify-center"
                    onPress={() => navigation.navigate('Barter')}
                >
                    <Text className="text-center text-white font-semibold" onPress={() => navigation.navigate('Home')}>Konfirmasi Barter</Text>
                </TouchableOpacity>
            </LinearGradient>

            <Text className="text-center text-gray-500 text-xs">
                By sharing information, you agree to our 
                <Text className="text-blue-500"> Terms of Use </Text>
                and acknowledge that you have read the 
                <Text className="text-blue-500"> Privacy Notice</Text>.
            </Text>
        </View>
    );
};

export default Barter;
