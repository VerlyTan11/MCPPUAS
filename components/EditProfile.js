import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const EditProfile = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [name, setName] = useState('');
  const [telp, setTelp] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

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
        console.log('Fetched user data:', data);
        setName(data.name || '');
        setTelp(data.telp || '');
        setEmail(data.email || '');
        setProfileImage(data.photo_url || null);
        setOriginalData({
          name: data.name || '',
          telp: data.telp || '',
          photo_url: data.photo_url || '',
        });
      } else {
        Alert.alert('Error', 'User data not found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      Alert.alert('Error', `Gagal mengambil data pengguna: ${error.message}`);
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
              console.log('Selected image URI:', result.assets[0].uri);
              await handleImageUpload(result.assets[0].uri);
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
              console.log('Selected image URI:', result.assets[0].uri);
              await handleImageUpload(result.assets[0].uri);
            }
          },
        },
      ]
    );
  };

  const handleImageUpload = async (uri) => {
    try {
      setLoadingImage(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        setLoadingImage(false);
        return;
      }

      const fileRef = ref(storage, `profile_pictures/${user.uid}`);
      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Upload failed:', error.message);
          Alert.alert('Error', `Upload failed: ${error.message}`);
          setLoadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Download URL:', downloadURL);
          setProfileImage(downloadURL);
          setIsEditing(true);
          setLoadingImage(false);
        }
      );
    } catch (error) {
      console.error('Error during image upload:', error.message);
      Alert.alert('Error', `Gagal mengunggah gambar: ${error.message}`);
      setLoadingImage(false);
    }
  };

  const hasChanges = () => {
    return (
      name !== originalData.name ||
      telp !== originalData.telp ||
      profileImage !== originalData.photo_url
    );
  };

  const handleSaveProfile = async () => {
    if (!hasChanges()) {
      navigation.navigate('Profile');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      console.log('Saving profile data:', {
        name,
        telp,
        photo_url: profileImage,
      });

      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        name: name,
        telp: telp,
        photo_url: profileImage || '',
      });

      Alert.alert('Berhasil', 'Profil berhasil diperbarui');
      setIsEditing(false);
      setOriginalData({
        name: name,
        telp: telp,
        photo_url: profileImage || '',
      });
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error saving profile:', error.message);
      Alert.alert('Error', `Gagal menyimpan profil: ${error.message}`);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 p-8 bg-white">
      <View className="flex-row mb-8 items-center">
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={require('../assets/back.png')} className="w-10 h-10" />
        </TouchableOpacity>
        <View className="flex-1 justify-center mr-10">
          <Text className="text-xl font-semibold text-center">Edit Profile</Text>
        </View>
      </View>

      {/* Nama */}
      <View className="flex-row items-center mb-4">
        <View className="w-32 h-32 bg-gray-200 rounded-lg items-center justify-center mr-4">
          <TouchableOpacity onPress={handleImagePicker}>
            {loadingImage ? (
              <ActivityIndicator size="large" color="#697565" />
            ) : profileImage ? (
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
          onChangeText={(text) => {
            setName(text);
            setIsEditing(true);
          }}
          className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2"
        />
      </View>

      {/* No Telp */}
      <Text className="text-gray-600 mb-2">No. Telp</Text>
      <TextInput
        placeholder="No. Telp"
        value={telp}
        onChangeText={(text) => {
          setTelp(text);
          setIsEditing(true);
        }}
        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
      />

      {/* Email */}
      <Text className="text-gray-600 mb-2">Email</Text>
      <TextInput 
        placeholder="Email" 
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setIsEditing(true);
        }}
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
              <Text className="text-white font-semibold">{isEditing ? 'Simpan' : 'Kembali'}</Text>
          </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditProfile;
