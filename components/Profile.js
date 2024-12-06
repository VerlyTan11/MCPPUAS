import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { doc, deleteDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RequestBarter from './RequestBarter'; // Import komponen RequestBarter

const Profile = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [barterModalVisible, setBarterModalVisible] = useState(false); // State untuk modal Request Barter
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;  
    if (!user) {
      alert('User not logged in');
      return;
    }

    // Realtime listener untuk data pengguna
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      } else {
        alert('User data not found in Firestore');
      }
    });

    // Realtime listener untuk postingan pengguna
    const fetchProducts = () => {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('userId', '==', user.uid));

      const unsubscribeProducts = onSnapshot(q, (snapshot) => {
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        setLoading(false);
      });

      return unsubscribeProducts;
    };

    const unsubscribeProducts = fetchProducts();

    // Cleanup listener saat komponen di-unmount
    return () => {
      unsubscribeUser();
      unsubscribeProducts();
    };
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
      await deleteDoc(doc(db, 'users', user.uid));
      await user.delete();
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
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setBarterModalVisible(true)}>
              <Image source={require('../assets/notification.png')} className="w-6 h-6 mr-4" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMenuPress}>
              <Image source={require('../assets/menu.png')} className="w-6 h-6" />
            </TouchableOpacity>
          </View>
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

      {/* Postingan Produk */}
      <View className="flex-1 bg-gray-100 p-4">
        <Text className="text-lg font-bold mb-4">Your Posts</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
              style={{ width: '48%' }}
            >
              <Image 
                source={item.image_url ? { uri: item.image_url } : require('../assets/kardus.jpg')}
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 10,
                  backgroundColor: '#ccc',
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
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

      {/* Request Barter Modal */}
      <RequestBarter visible={barterModalVisible} onClose={() => setBarterModalVisible(false)} />
    </SafeAreaProvider>
  );
};

export default Profile;