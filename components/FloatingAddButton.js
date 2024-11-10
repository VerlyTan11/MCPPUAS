import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const FloatingAddButton = ({ onPress }) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="absolute bottom-8 right-8"
        >
            <Image 
                source={require('../assets/button-add.png')}
                className="w-20 h-20"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

export default FloatingAddButton;
