import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PilihItem = () => {
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-row justify-around items-center mb-6">
                <TouchableOpacity 
                    className="items-center"
                    onPress={() => navigation.navigate('Barter')} // Navigasi ke halaman Barter
                >
                    <Image 
                        source={require('../assets/kardus.jpg')} 
                        className="w-24 h-24 rounded-lg mb-2"
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    className="items-center"
                    onPress={() => navigation.navigate('Barter')} // Navigasi ke halaman Barter
                >
                    <Image 
                        source={require('../assets/kardus.jpg')}
                        className="w-24 h-24 rounded-lg mb-2"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PilihItem;
