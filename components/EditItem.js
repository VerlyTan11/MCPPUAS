import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const EditItem = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { itemId } = route.params || {};

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
    const [originalProduct, setOriginalProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
                    const data = docSnap.data();
                    setProduct(data);
                    setOriginalProduct(data);
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

    const hasChanges = () => {
        return JSON.stringify(product) !== JSON.stringify(originalProduct);
    };

    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setIsUploading(true);
            const uploadedUrl = await handleImageUpload(result.assets[0].uri);
            if (uploadedUrl) {
                setProduct({ ...product, image_url: uploadedUrl });
            }
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (uri) => {
        try {
            const fileRef = ref(storage, `item_images/${itemId}-${Date.now()}`);
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
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error('Error during image upload:', error.message);
            Alert.alert('Error', `Failed to upload image: ${error.message}`);
            return null;
        }
    };

    const handleUpdateProduct = async () => {
        if (!hasChanges()) {
            navigation.goBack();
            return;
        }

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
            setOriginalProduct(product);
            navigation.goBack();
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product');
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const docRef = doc(db, 'products', itemId);
            await deleteDoc(docRef);
            Alert.alert('Success', 'Product deleted successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Profile'),
                },
            ]);
        } catch (error) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'Failed to delete product');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/back.png')} style={{ width: 40, height: 40 }} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: 50,
                            padding: 8,
                        }}
                    >
                        <Image source={require('../assets/delete-black.png')} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>

                    <Modal
                        transparent={true}
                        visible={modalVisible}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    padding: 20,
                                    borderRadius: 10,
                                    width: '80%',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>
                                    Apakah Anda yakin ingin menghapus barang ini?
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={{
                                            flex: 1,
                                            marginHorizontal: 5,
                                            backgroundColor: '#f5f5f5',
                                            paddingVertical: 10,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: '#333' }}>Tidak</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible(false);
                                            handleDeleteProduct();
                                        }}
                                        style={{
                                            flex: 1,
                                            marginHorizontal: 5,
                                            backgroundColor: '#f44336',
                                            paddingVertical: 10,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Ya</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>

                <TouchableOpacity onPress={handleImagePicker}>
                    <Image
                        source={product.image_url ? { uri: product.image_url } : require('../assets/kardus.jpg')}
                        style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 10,
                            marginBottom: 16,
                        }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>

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
                    <View key={index} style={{ marginBottom: 16 }}>
                        <Text style={{ marginBottom: 8, color: '#555' }}>{field.label}</Text>
                        <TextInput
                            value={product[field.value]}
                            onChangeText={(text) => setProduct({ ...product, [field.value]: text })}
                            placeholder={field.placeholder}
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: 12,
                                borderRadius: 8,
                                color: '#333',
                            }}
                        />
                    </View>
                ))}

                <LinearGradient
                    colors={['#697565', '#ECDFCC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.2, y: 0 }}
                    style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        marginBottom: 16,
                    }}
                >
                    <TouchableOpacity onPress={handleUpdateProduct} style={{ paddingVertical: 16 }}>
                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
                            {hasChanges() ? 'Simpan' : 'Cancel'}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
                <View style={{ marginBottom: 20 }} />
            </ScrollView>

            <Modal transparent={true} visible={isUploading} animationType="fade">
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

export default EditItem;