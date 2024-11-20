import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const EditItem = () => {
    const navigation = useNavigation();

    const showDeleteConfirmation = () => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Delete canceled'), 
                    style: 'cancel',
                },
                {
                    text: 'Yes', 
                    onPress: () => console.log('Item deleted'), 
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView className="flex-1 bg-white p-8 mt-8">
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/back.png')} className="w-10 h-10" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={showDeleteConfirmation}
                    className="bg-gray-200 rounded-full p-1"
                    style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Image 
                        source={require('../assets/delete-black.png')}
                        className="w-6 h-6"
                    />
                </TouchableOpacity>
            </View>

            <View className="relative">
                <Image 
                    source={require('../assets/kardus.jpg')}
                    className="w-full h-64 rounded-lg mb-4"
                    resizeMode="cover"
                />
            </View>

            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                    <Image 
                        source={require('../assets/foto-aldo.jpeg')}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <Text className="text-gray-800 font-semibold">Aldo Wijaya</Text>
                </View>
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
                    onPress={() => navigation.navigate('PageEdit')}
                >
                    <Text className="text-center text-white font-semibold">Edit</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default EditItem;
