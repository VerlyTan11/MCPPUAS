import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 p-8 bg-white">
      <View className="flex-row items-center mb-4">
        <View className="w-32 h-32 bg-gray-200 rounded-lg items-center justify-center mr-4">
          <TouchableOpacity>
            <Image 
              source={require('../assets/plus.png')}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TextInput 
          placeholder="Masukkan Nama Anda" 
          className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2"
        />
      </View>

      <TextInput
        placeholder="Jenis Produk"
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
      />
      <TextInput 
        placeholder="Catatan" 
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
      />

      <LinearGradient 
        colors={['#697565', '#ECDFCC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 0 }}
        className="flex-row items-center justify-between rounded-lg mb-6"
      >
        <TouchableOpacity className="w-full py-4 items-center">
          <Text className="text-white font-semibold">Simpan</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditProfile;