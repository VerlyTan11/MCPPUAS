import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig'; // Make sure firebaseConfig is set up correctly
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';


const EditItem = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemId, image, title } = route.params; // Get itemId, image, and title passed from the previous screen

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

    // Fetch product data from Firestore
    const fetchProduct = async () => {
        try {
            const docRef = doc(db, 'products', itemId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProduct(docSnap.data());
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct(); // Fetch product data when the component mounts
    }, [itemId]);

    // Function to handle image picker
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

    // Function to update product data in Firestore
    const handleUpdateProduct = async () => {
        try {
            const docRef = doc(db, 'products', itemId);
            await updateDoc(docRef, {
                ...product,
                timestamp: new Date().toISOString(), // Timestamp when the product was updated
            });
            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack(); // Go back to the previous screen after successful update
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product');
        }
    };

    // Function to delete product data from Firestore
    const handleDeleteProduct = async () => {
        try {
            const docRef = doc(db, 'products', itemId);
            await deleteDoc(docRef); // Delete the document
            Alert.alert('Success', 'Product deleted successfully');
            navigation.goBack(); // Navigate back after successful deletion
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
        <ScrollView className="flex-1 bg-white p-8 mt-8">
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/back.png')} className="w-10 h-10" />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => Alert.alert(
                        'Delete Item',
                        'Are you sure you want to delete this item?',
                        [
                            {
                                text: 'No',
                                onPress: () => console.log('Delete canceled'),
                                style: 'cancel',
                            },
                            {
                                text: 'Yes',
                                onPress: handleDeleteProduct,
                            },
                        ],
                        { cancelable: true }
                    )}
                    className="bg-gray-200 rounded-full p-1"
                    style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Image 
                        source={require('../assets/delete-black.png')}
                        className="w-6 h-6"
                    />
                </TouchableOpacity>
            </View>

            <View className="relative">
                <TouchableOpacity onPress={handleImagePicker}>
                    <Image 
                        source={product.image_url ? { uri: product.image_url } : require('../assets/kardus.jpg')}
                        className="w-full h-64 rounded-lg mb-4"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Nama Produk</Text>
                <TextInput
                    value={product.nama_product}
                    onChangeText={(text) => setProduct({ ...product, nama_product: text })}
                    placeholder="Nama Produk"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Jenis Produk</Text>
                <TextInput
                    value={product.jenis}
                    onChangeText={(text) => setProduct({ ...product, jenis: text })}
                    placeholder="Jenis Produk"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Jumlah</Text>
                <TextInput
                    value={product.jumlah}
                    onChangeText={(text) => setProduct({ ...product, jumlah: text })}
                    placeholder="Jumlah"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Berat / pcs</Text>
                <TextInput
                    value={product.berat}
                    onChangeText={(text) => setProduct({ ...product, berat: text })}
                    placeholder="Berat / pcs"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Catatan</Text>
                <TextInput
                    value={product.catatan}
                    onChangeText={(text) => setProduct({ ...product, catatan: text })}
                    placeholder="Catatan"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Alamat Lengkap</Text>
                <TextInput
                    value={product.alamat}
                    onChangeText={(text) => setProduct({ ...product, alamat: text })}
                    placeholder="Alamat Lengkap"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">No. Rumah</Text>
                <TextInput
                    value={product.no_rumah}
                    onChangeText={(text) => setProduct({ ...product, no_rumah: text })}
                    placeholder="No. Rumah"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-2">Kode Pos</Text>
                <TextInput
                    value={product.kode_pos}
                    onChangeText={(text) => setProduct({ ...product, kode_pos: text })}
                    placeholder="Kode Pos"
                    className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

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
                    <Text className="text-center text-white font-semibold mb-4">Update</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default EditItem;
