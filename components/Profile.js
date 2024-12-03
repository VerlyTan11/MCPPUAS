import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { doc, deleteDoc, onSnapshot } from 'firebase/firestore'; // Add onSnapshot import
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Profile = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const user = auth.currentUser;  
    if (!user) {
      alert('User not logged in');
      return;
    }

    // Realtime listener untuk data pengguna
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      } else {
        alert('User data not found in Firestore');
      }
      setLoading(false); // Set loading selesai setelah data diambil
    });

    // Cleanup listener saat komponen di-unmount
    return () => unsubscribe();
  }, []);

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

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('User not authenticated');
      return;
    }

    try {
      // Hapus data pengguna dari Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      console.log('User data deleted from Firestore');

      // Hapus akun pengguna dari Firebase Authentication
      await user.delete();
      console.log('User account deleted from Firebase Authentication');

      // Navigate ke halaman login setelah akun dihapus
      navigation.navigate('Login');
      setModalVisible(false);
      alert('Account successfully deleted');
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert('You need to log in again to delete your account.');
      } else {
        alert('An error occurred while deleting the account.');
      }
    }
  };

  // Render loading state atau user data
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
              source={userData.photo_url ? { uri: userData.photo_url } : require('../assets/user.png')}
              className="w-24 h-24 rounded-full mb-4 border-4 border-white p-2 mt-[-62px]"
            />
            <View className="flex-row mb-8">
              <Text className="text-xl font-bold">{userData.name || 'User Name'}</Text>
              <TouchableOpacity onPress={handleEditProfilePress}>
                <Image source={require('../assets/edit.png')} className="w-5 h-5 ml-2" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between w-11/12 mb-4">
              <Text className="text-gray-500">No. Telp</Text>
              <Text className="text-black">{userData.telp || 'No Phone Number'}</Text>
            </View>
            <View className="flex-row justify-between w-11/12">
              <Text className="text-gray-500">Email</Text>
              <Text className="text-black">{userData.email || 'No Email'}</Text>
            </View>
          </>
        )}
      </View>

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
