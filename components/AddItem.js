import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/itemsSlice';

const AddItem = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // Untuk modal loading
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

    const handleImageUpload = async (uri) => {
        try {
            setIsUploading(true); // Tampilkan modal loading
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Error', 'User not authenticated');
                setIsUploading(false);
                return null;
            }

            const fileRef = ref(storage, `item_images/${user.uid}-${Date.now()}`);
            const response = await fetch(uri);
            const blob = await response.blob();

            const uploadTask = uploadBytesResumable(fileRef, blob);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.error('Upload failed:', error.message);
                        Alert.alert('Error', `Upload failed: ${error.message}`);
                        setIsUploading(false);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log('Download URL:', downloadURL);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error('Error during image upload:', error.message);
            Alert.alert('Error', `Failed to upload image: ${error.message}`);
            setIsUploading(false);
            return null;
        }
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

        if (!formData.jenis) {
            Alert.alert('Error', 'Harap pilih jenis produk terlebih dahulu!');
            return;
        }

        try {
            setIsUploading(true); // Tampilkan modal loading
            let imageUrl = '';
            if (selectedImage) {
                imageUrl = await handleImageUpload(selectedImage); // Upload gambar ke Firebase Storage
            }

            const data = {
                ...formData,
                image_url: imageUrl, // Simpan URL dari Firebase Storage
                timestamp: new Date().toISOString(),
                userId: user.uid,
            };

            const docRef = await addDoc(collection(db, 'products'), data);

            dispatch(addItem({ id: docRef.id, ...data }));

            setIsUploading(false); // Sembunyikan modal loading
            Alert.alert('Success', 'Product added successfully!');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error adding product:', error);
            setIsUploading(false); // Sembunyikan modal loading
            Alert.alert('Error', 'Failed to add product');
        }
    };

    return (
        <>
            <ScrollView style={{ flex: 1, padding: 24, backgroundColor: 'white' }}>
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

                <View className="bg-gray-100 rounded-lg mb-4">
                    <Picker
                        selectedValue={formData.jenis}
                        onValueChange={(value) => handleInputChange('jenis', value)}
                    >
                        <Picker.Item 
                            label="Pilih Jenis Produk" 
                            value="" 
                            color="#888"
                        />
                        <Picker.Item label="Kardus" value="kardus" />
                        <Picker.Item label="Kain" value="kain" />
                        <Picker.Item label="Kamera" value="kamera" />
                        <Picker.Item label="Buku" value="buku" />
                        <Picker.Item label="More" value="more" />
                    </Picker>
                </View>

                <View className="flex-row mb-4">
                    <TextInput 
                        placeholder="Jumlah" 
                        value={formData.jumlah}
                        onChangeText={(value) => handleInputChange('jumlah', value)}
                        className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2 text-center"
                    />
                    <TextInput 
                        placeholder="Berat / pcs | kg" 
                        value={formData.berat}
                        onChangeText={(value) => handleInputChange('berat', value)}
                        className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 text-center"
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
                    className="flex-row items-center justify-between mb-6"
                    style={{
                        borderRadius: 16, 
                        overflow: 'hidden',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            paddingVertical: 16,
                            alignItems: 'center',
                            borderRadius: 16, 
                        }}
                        onPress={handlePost}
                    >
                        <Text className="text-white font-semibold">Posting</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>

            <Modal
                transparent={true}
                animationType="fade"
                visible={isUploading}
                onRequestClose={() => {}}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={{ marginTop: 16, color: '#ffffff', fontSize: 16 }}>Uploading...</Text>
                </View>
            </Modal>
        </>
    );
};

export default AddItem;