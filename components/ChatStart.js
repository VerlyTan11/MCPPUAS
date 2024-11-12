import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ChatStart = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white pt-8 mt-8">
      <View className="flex-row items-center justify-between px-4 mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/Back.png')} className="w-10 h-10" />
        </TouchableOpacity>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 font-semibold mr-10 text-lg">Chat with buyer!</Text>
        </View>
      </View>

      <View className="items-center">
        <View className="w-11/12 bg-gray-100 rounded-lg items-center p-4">
          <Image 
            source={require('../assets/foto-aldo.jpeg')}
            className="w-20 h-20 rounded-full mb-2"
          />
          <Text className="text-lg font-semibold">Aldo Wijaya</Text>
          <Text className="text-gray-500 text-center my-2">
            Gunakan layanan chat ini sebagai akses barter barangmu!
          </Text>

          <TouchableOpacity
            className="w-full mt-4"
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <LinearGradient
              colors={['#697565', '#ECDFCC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20 }} 
            >
              <Text className="text-center text-white py-3 font-semibold">Mulai Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatStart;
