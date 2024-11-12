import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white mt-8 py-8">
      <View className="flex-row items-center justify-between px-4 mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/Back.png')} className="w-10 h-10" />
        </TouchableOpacity>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 font-semibold mr-10 text-lg">Chat with deal!</Text>
        </View>
      </View>

      <View className="flex-row items-center px-4 py-4 border-b border-gray-300 justify-center">
        <Image
          source={require('../assets/foto-aldo.jpeg')}
          className="w-12 h-12 rounded-full mr-4"
        />
        <Text className="text-lg font-semibold">Aldo Wijaya</Text>
      </View>

      <View className="flex-1 px-4 py-2">
      </View>

      <View className="flex-row items-center px-4 py-2 border-t border-gray-300">
        <TextInput
          className="flex-1 h-10 px-4 border border-gray-300 rounded-full mr-2"
          placeholder="Write a message"
        />
        <TouchableOpacity className="mr-2">
          <Image source={require('../assets/emoticon.png')} className="w-6 h-6" />
        </TouchableOpacity>
        <TouchableOpacity className="mr-2">
          <Image source={require('../assets/attach-file.png')} className="w-6 h-6" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/send.png')} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
