import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemsProp from './ItemsProp';

const Profile = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    alert('Menu button pressed');
  };

  return (
    <View className="flex-1 bg-white mt-8">
        <View className="relative">
            <Image 
            source={require('../assets/yellow-card.png')} 
            className="w-full h-74"
            resizeMode="cover"
            />
            
            <View className="absolute top-8 left-4 right-4 flex-row justify-between mx-4 my-4">
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={require('../assets/Back.png')} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMenuPress}>
                <Image source={require('../assets/menu.png')} className="w-6 h-6" />
            </TouchableOpacity>
            </View>
        </View>

        <View className="items-center mt-[-40px] p-8 bg-white rounded-t-3xl">
            <Image 
            source={require('../assets/logo-bartems.png')}
            className="w-24 h-24 rounded-full mb-4 border-4 border-white p-2 mt-[-62px]"
            />
            <View className="flex-row mb-8">
                <Text className="text-xl font-bold">Aldo Wijaya</Text>
                <Image 
                    source={require('../assets/edit.png')}
                    className="w-5 h-5 ml-2"
                />
            </View>
            <View className="flex-row justify-between w-full mb-4">
                <Text className="text-gray-500">No. Telp</Text>
                <Text className="text-black">+62812345678</Text>
            </View>
            <View className="flex-row justify-between w-full">
                <Text className="text-gray-500">Email</Text>
                <Text className="text-black">aldowi@gmail.com</Text>
            </View>
        </View>

        <View className="mx-4">
            <ItemsProp/>
        </View>
    </View>
  );
};

export default Profile;
