import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig'; // Assuming firebaseConfig is correctly set up
import { doc, getDoc } from 'firebase/firestore';
import ItemsPropEditItem from './ItemsPropEditItem';
import FloatingAddButton from './FloatingAddButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Profile = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);  // To store user data from Firestore
  const [loading, setLoading] = useState(true);  // To handle loading state

  useEffect(() => {
    fetchUserData();  // Fetch user data when the component mounts
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;  // Get current user
      if (!user) {
        alert('User not logged in');
        return;  // Stop if no user is logged in
      }

      const userDocRef = doc(db, 'users', user.uid);  // Reference to the user's document in Firestore
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());  // Store the user data if the document exists
      } else {
        alert('User not found in Firestore');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching user data');
    } finally {
      setLoading(false);  // Set loading to false once the data is fetched
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    setModalVisible(true); 
  };

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    navigation.navigate('Login'); 
    setModalVisible(false);
  };

  const handleDeleteAccount = () => {
    alert('Delete Account pressed');
    setModalVisible(false);
  };

  // Render loading state or user data
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider className="flex-1 bg-white">
      <View className="relative">
        <Image 
          source={require('../assets/yellow-card.png')} 
          className="w-full h-74"
          resizeMode="cover"
        />
        
        <View className="absolute top-8 left-4 right-4 flex-row justify-between mx-4">
          <TouchableOpacity onPress={handleBackPress}>
            <Image source={require('../assets/back.png')} className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress}>
            <Image source={require('../assets/menu.png')} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center mt-[-40px] p-8 bg-white rounded-t-3xl">
        {userData && (
          <>
            <Image 
              source={{ uri: userData.photo_url || '../assets/default-profile.png' }} // Use default if no image
              className="w-24 h-24 rounded-full mb-4 border-4 border-white p-2 mt-[-62px]"
            />
            <View className="flex-row mb-8">
              <Text className="text-xl font-bold">{userData.name || 'User Name'}</Text>
              <TouchableOpacity onPress={handleEditProfilePress}>
                <Image 
                  source={require('../assets/edit.png')}
                  className="w-5 h-5 ml-2"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between w-full mb-4">
              <Text className="text-gray-500">No. Telp</Text>
              <Text className="text-black">{userData.telp || 'No Phone Number'}</Text>
            </View>
            <View className="flex-row justify-between w-full">
              <Text className="text-gray-500">Email</Text>
              <Text className="text-black">{userData.email || 'No Email'}</Text>
            </View>
          </>
        )}
      </View>

      <View className="mx-4">
        <ItemsPropEditItem />
      </View>

      <FloatingAddButton onPress={() => navigation.navigate('AddItem')} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
    </SafeAreaProvider>
  );
};

export default Profile;
