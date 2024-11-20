import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View className="flex-1 justify-center items-center mx-10">
            <Image 
                source={require('../assets/logo.png')}
            />
        </View>
    );
};

export default Splash;
