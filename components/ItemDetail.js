import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const ItemDetail = () => {
    const navigation = useNavigation();

    return (
        <ScrollView className="flex-1 bg-white p-8 mt-8">
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/back.png')} className="w-10 h-10" />
                </TouchableOpacity>
            </View>

            <Image 
                source={require('../assets/kardus.jpg')}
                className="w-full h-64 rounded-lg mb-4"
                resizeMode="cover"
            />

            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                    <Image 
                        source={require('../assets/foto-aldo.jpeg')}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <Text className="text-gray-800 font-semibold">Aldo Wijaya</Text>
                </View>

                {/* Wrap the chat icon in TouchableOpacity for navigation */}
                <TouchableOpacity 
                    className="bg-blue-950 rounded-full w-14 h-8 items-center justify-center"
                    onPress={() => navigation.navigate('ChatStart')} // Move onPress here
                >
                    <Image 
                        source={require('../assets/Chat.png')}
                        className="w-6 h-6"
                    />
                </TouchableOpacity>
            </View>

            <Text className="text-xl font-semibold text-gray-800 mb-2">Kardus</Text>
            <Text className="text-gray-500 mb-4">Diunggah 1 jam yang lalu</Text>

            <View className="flex-row space-x-2 mb-4">
                <Text className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Barter Online</Text>
                <Text className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Best Product</Text>
            </View>

            <Text className="text-gray-800 mb-4">
                Kardus is an ideal solution for creating a cozy atmosphere in your home. This stylish and functional lighting element provides comfortable ...
                <Text className="text-blue-500"> Read more</Text>
            </Text>

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
                    <Text className="text-center text-white font-semibold">Barter</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default ItemDetail;
