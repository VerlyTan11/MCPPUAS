import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const EditItem = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemId } = route.params || {}; // Mendapatkan itemId dari parameter route

    const [product, setProduct] = useState({
        nama_product: '',
        jenis: '',
        jumlah: '',
        berat: '',
        catatan: '',
        alamat: '',
        no_rumah: '',
        kode_pos: '',
        image_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch data produk dari Firestore
    useEffect(() => {
        if (!itemId) {
            Alert.alert('Error', 'Item ID is missing!');
            navigation.goBack();
            return;
        }

        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', itemId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                } else {
                    Alert.alert('Error', 'Product not found!');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                Alert.alert('Error', 'Failed to fetch product data');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [itemId]);

    // Fungsi untuk mengedit gambar produk
    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProduct({ ...product, image_url: result.assets[0].uri });
        }
    };

    // Fungsi untuk mengupdate produk
    const handleUpdateProduct = async () => {
        try {
            if (!product.nama_product.trim()) {
                Alert.alert('Error', 'Nama produk tidak boleh kosong');
                return;
            }
            const docRef = doc(db, 'products', itemId);
            await updateDoc(docRef, {
                ...product,
                timestamp: new Date().toISOString(),
            });
            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product');
        }
    };

    // Fungsi untuk menghapus produk
    const handleDeleteProduct = async () => {
        try {
            const docRef = doc(db, 'products', itemId);
            await deleteDoc(docRef);
            Alert.alert('Success', 'Product deleted successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Profile'), // Navigasi ke halaman Profile setelah delete
                },
            ]);
        } catch (error) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'Failed to delete product');
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
        <ScrollView className="flex-1 bg-white p-8">
            {/* Header dengan tombol kembali dan delete */}
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/back.png')} className="w-10 h-10" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setModalVisible(true)}
                    className="bg-gray-200 rounded-full p-1"
                    style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Image 
                        source={require('../assets/delete-black.png')}
                        className="w-6 h-6"
                    />
                </TouchableOpacity>
            </View>

            {/* Gambar Produk */}
            <View className="relative">
                <TouchableOpacity onPress={handleImagePicker}>
                    <Image 
                        source={product.image_url ? { uri: product.image_url } : require('../assets/kardus.jpg')}
                        className="w-full h-64 rounded-lg mb-4"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>

            {/* Form Edit Produk */}
            {[
                { label: 'Nama Produk', value: 'nama_product', placeholder: 'Nama Produk' },
                { label: 'Jenis Produk', value: 'jenis', placeholder: 'Jenis Produk' },
                { label: 'Jumlah', value: 'jumlah', placeholder: 'Jumlah' },
                { label: 'Berat / pcs', value: 'berat', placeholder: 'Berat / pcs' },
                { label: 'Catatan', value: 'catatan', placeholder: 'Catatan' },
                { label: 'Alamat Lengkap', value: 'alamat', placeholder: 'Alamat Lengkap' },
                { label: 'No. Rumah', value: 'no_rumah', placeholder: 'No. Rumah' },
                { label: 'Kode Pos', value: 'kode_pos', placeholder: 'Kode Pos' },
            ].map((field, index) => (
                <View className="mb-4" key={index}>
                    <Text className="text-gray-600 mb-2">{field.label}</Text>
                    <TextInput
                        value={product[field.value]}
                        onChangeText={(text) => setProduct({ ...product, [field.value]: text })}
                        placeholder={field.placeholder}
                        className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                    />
                </View>
            ))}

            {/* Tombol Update */}
            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-center p-4 rounded-lg mb-6"
            >
                <TouchableOpacity
                    className="flex-1 items-center justify-center"
                    onPress={handleUpdateProduct}
                >
                    <Text className="text-center text-white font-semibold">Update</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Jarak tambahan di bawah tombol */}
            <View style={{ marginBottom: 20 }}></View>

            {/* Modal Konfirmasi Delete */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg w-3/4">
                        <Text className="text-lg font-semibold text-center mb-4">Hapus Produk</Text>
                        <Text className="text-gray-700 text-center mb-6">Apakah Anda yakin ingin menghapus produk ini?</Text>
                        <View className="flex-row justify-around">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="px-6 py-2 rounded-lg bg-gray-200"
                            >
                                <Text className="text-gray-700">Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    handleDeleteProduct();
                                }}
                                className="px-6 py-2 rounded-lg bg-red-500"
                            >
                                <Text className="text-white">Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default EditItem;