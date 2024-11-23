import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddItem = () => {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        alamat: '',
        berat: '',
        catatan: '',
        jenis: '',
        jumlah: '',
        kode_pos: '',
        nama_product: '',
        no_rumah: '',
    });

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
                            aspect: [4, 3],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            setSelectedImage(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: "Galeri",
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [4, 3],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            setSelectedImage(result.assets[0].uri);
                        }
                    },
                },
            ]
        );
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePost = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'User not logged in');
            return;
        }

        try {
            const data = {
                ...formData,
                image_url: selectedImage || '',
                timestamp: serverTimestamp(),
                userId: user.uid,
            };

            await addDoc(collection(db, 'products'), data);
            Alert.alert('Success', 'Product added successfully!');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error adding product:', error);
            Alert.alert('Error', 'Failed to add product');
        }
    };

    return (
        <ScrollView className="flex-1 p-6 bg-white">
            <View className="flex-row items-center mb-4">
                <View className="w-32 h-32 bg-gray-200 rounded-lg items-center justify-center mr-4">
                    <TouchableOpacity onPress={handleImagePicker}>
                        {selectedImage ? (
                            <Image 
                                source={{ uri: selectedImage }}
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
                    placeholder="Masukkan Nama Produk" 
                    value={formData.nama_product}
                    onChangeText={(value) => handleInputChange('nama_product', value)}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2"
                />
            </View>

            <TextInput
                placeholder="Jenis Produk"
                value={formData.jenis}
                onChangeText={(value) => handleInputChange('jenis', value)}
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
            />
            <View className="flex-row mb-4">
                <TextInput 
                    placeholder="Jumlah" 
                    value={formData.jumlah}
                    onChangeText={(value) => handleInputChange('jumlah', value)}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2 text-center"
                />
                <TextInput 
                    placeholder="Berat / pcs" 
                    value={formData.berat}
                    onChangeText={(value) => handleInputChange('berat', value)}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2 text-center"
                />
            </View>
            <TextInput 
                placeholder="Catatan" 
                value={formData.catatan}
                onChangeText={(value) => handleInputChange('catatan', value)}
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
            />

            <Text className="text-gray-800 font-semibold mb-2">Lokasi</Text>
            <TextInput 
                placeholder="Alamat Lengkap" 
                value={formData.alamat}
                onChangeText={(value) => handleInputChange('alamat', value)}
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
            />
            <View className="flex-row mb-8">
                <TextInput 
                    placeholder="No. Rumah" 
                    value={formData.no_rumah}
                    onChangeText={(value) => handleInputChange('no_rumah', value)}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2"
                />
                <TextInput 
                    placeholder="Kode Pos" 
                    value={formData.kode_pos}
                    onChangeText={(value) => handleInputChange('kode_pos', value)}
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-between rounded-lg mb-6"
            >
                <TouchableOpacity className="w-full py-4 items-center" onPress={handlePost}>
                    <Text className="text-white font-semibold">Posting</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default AddItem;
