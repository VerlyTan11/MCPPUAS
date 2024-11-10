import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ItemsProp = ({ image, title }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('ItemDetail')}
            className="bg-white rounded-lg shadow-lg p-4 m-2 w-40"
        >
            <Image 
                source={require('../assets/kardus.jpg')}
                className="w-full h-24 rounded-lg mb-2" 
                resizeMode="cover"
            />
            <Text className="text-base font-semibold text-black">{title}</Text>
        </TouchableOpacity>
    );
};

export default ItemsProp;
