import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ItemsProp = ({ image, title, itemId }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('EditItem', { image, title, itemId })}
            className="bg-white rounded-lg shadow-lg p-4 m-2 w-40"
        >
            <Image 
                source={image ? { uri: image } : require('../assets/kardus.jpg')}
                className="w-full h-24 rounded-lg mb-2" 
                resizeMode="cover"
            />
            <Text className="text-base font-semibold text-black">{title}</Text>
        </TouchableOpacity>
    );
};

export default ItemsProp;