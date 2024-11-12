import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ItemsPropEditItem from './ItemsPropEditItem';
import FloatingAddButton from './FloatingAddButton';

const Profile = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false); // State untuk mengontrol modal

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    setModalVisible(true); // Menampilkan modal saat tombol menu ditekan
  };

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    // Navigate to Login page upon logout
    navigation.navigate('Login'); 
    setModalVisible(false); // Menutup modal setelah logout
  };

  const handleDeleteAccount = () => {
    alert('Delete Account pressed');
    setModalVisible(false); // Menutup modal setelah menghapus akun
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
            <Image source={require('../assets/back.png')} className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress}>
            <Image source={require('../assets/menu.png')} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center mt-[-40px] p-8 bg-white rounded-t-3xl">
        <Image 
          source={require('../assets/foto-aldo.jpeg')}
          className="w-24 h-24 rounded-full mb-4 border-4 border-white p-2 mt-[-62px]"
        />
        <View className="flex-row mb-8">
          <Text className="text-xl font-bold">Aldo Wijaya</Text>
          <TouchableOpacity onPress={handleEditProfilePress}>
            <Image 
              source={require('../assets/edit.png')}
              className="w-5 h-5 ml-2"
            />
          </TouchableOpacity>
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
        <ItemsPropEditItem/>
      </View>

      <FloatingAddButton onPress={() => navigation.navigate('AddItem')} />

      {/* Modal untuk menu dengan pilihan Logout dan Delete Account */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Menutup modal ketika menekan tombol back
      >
        <View className="flex-1 justify-center items-center bg-black opacity-80">
          <View className="w-80 bg-white p-4 rounded-lg">
            <Text className="text-xl text-center font-bold mb-4">Options</Text>
            <Pressable onPress={handleLogout}>
              <Text className="text-red-500 text-center py-2">Logout</Text>
            </Pressable>
            <Pressable onPress={handleDeleteAccount}>
              <Text className="text-red-500 text-center py-2">Delete Account</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-gray-500 text-center py-2">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
