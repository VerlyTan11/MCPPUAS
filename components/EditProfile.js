import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditProfile = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [telp, setTelp] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setName(data.name || '');
        setTelp(data.telp || '');
        setEmail(data.email || '');
        setProfileImage(data.photo_url || null);
      } else {
        Alert.alert('Error', 'User data not found in Firestore');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch user data');
    }
  };

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

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        name: name,
        telp: telp,
        email: email,
        photo_url: profileImage || '', 
      });

      Alert.alert('Berhasil', 'Profil berhasil diperbarui');
      navigation.navigate('Profile');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal memperbarui profil');
    }
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
          value={name}
          onChangeText={setName}
          className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2"
        />
      </View>

      <TextInput
        placeholder="No. Telp"
        value={telp}
        onChangeText={setTelp}
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
      />
      
      <TextInput 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        editable={false}
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
        style={{ color: '#A9A9A9' }}
      />

      <LinearGradient
          colors={['#697565', '#ECDFCC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.2, y: 0 }}
          className="flex-row items-center justify-between mb-6"
          style={{
              borderRadius: 16, 
              overflow: 'hidden', 
          }}
      >
          <TouchableOpacity
              className="w-full py-4 items-center"
              style={{
                  borderRadius: 16, 
              }}
              onPress={handleSaveProfile}
          >
              <Text className="text-white font-semibold">Edit</Text>
          </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditProfile;