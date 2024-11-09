import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ItemsProp = ({ image, title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} className="bg-white rounded-lg shadow-lg p-4 m-2 w-40">
            <Image 
                source={image} 
                className="w-full h-24 rounded-lg mb-2" 
                resizeMode="cover"
            />
            <Text className="text-base font-semibold text-black">{title}</Text>
        </TouchableOpacity>
    );
};

export default ItemsProp;
