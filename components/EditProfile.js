import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);

  const handleImagePicker = async () => {
    Alert.alert(
      "Pilih Gambar",
      "Ambil foto atau pilih dari galeri",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Kamera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Galeri",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 p-8 bg-white">
      <View className="flex-row items-center mb-4">
        <View className="w-32 h-32 bg-gray-200 rounded-lg items-center justify-center mr-4">
          <TouchableOpacity onPress={handleImagePicker}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }}
                className="w-32 h-32 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <Image 
                source={require('../assets/plus.png')}
                className="w-6 h-6"
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
        <TextInput 
          placeholder="Masukkan Nama Anda" 
          className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2"
        />
      </View>

      <TextInput
        placeholder="No. Telp"
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
      />
      <TextInput 
        placeholder="Email" 
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
      />

      <LinearGradient 
        colors={['#697565', '#ECDFCC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 0 }}
        className="flex-row items-center justify-between rounded-lg mb-6"
      >
        <TouchableOpacity className="w-full py-4 items-center">
          <Text className="text-white font-semibold" onPress={() => navigation.navigate('Profile')}>Simpan</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditProfile;
