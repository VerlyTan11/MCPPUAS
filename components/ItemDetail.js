import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const ItemDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { itemId } = route.params || {};
    const [product, setProduct] = useState(null);
    const [owner, setOwner] = useState(null);
    const [noItemsModalVisible, setNoItemsModalVisible] = useState(false);

    const fetchProductDetails = async () => {
        try {
            if (!itemId) {
                Alert.alert('Error', 'Product ID is missing!');
                navigation.goBack();
                return;
            }

            const productRef = doc(db, 'products', itemId);
            const productSnapshot = await getDoc(productRef);

            if (productSnapshot.exists()) {
                const productData = productSnapshot.data();
                setProduct({ ...productData, id: itemId });

                const ownerRef = doc(db, 'users', productData.userId);
                const ownerSnapshot = await getDoc(ownerRef);

                if (ownerSnapshot.exists()) {
                    setOwner(ownerSnapshot.data());
                } else {
                    console.warn('Owner not found');
                    setOwner({ name: 'Unknown User', email: 'Not available', photo_url: null });
                }
            } else {
                Alert.alert('Error', 'Product not found!');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            Alert.alert('Error', 'Failed to fetch product details. Check your internet connection or permissions.');
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleBarterPress = () => {
        if (!auth.currentUser?.phoneNumber) {
            setNoItemsModalVisible(true);
        } else {
            const isUserOwner = auth.currentUser?.uid === product.userId;
            if (isUserOwner) {
                navigation.navigate('EditItem', { itemId: product.id });
            } else {
                navigation.navigate('PilihItem', {
                    ownerProductId: product.id,
                    ownerId: product.userId,
                    ownerLocation: product.alamat || 'Lokasi tidak tersedia',
                    ownerProductName: product.nama_product,
                    ownerProductImage: product.image_url || null,
                });
            }
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchProductDetails();
        }
    }, [isFocused]);

    if (!product || !owner) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-500 text-lg">Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <View className="flex-row mb-8 items-center">
                <TouchableOpacity onPress={handleBackPress}>
                    <Image source={require('../assets/back.png')} className="w-10 h-10" />
                </TouchableOpacity>
                <View className="flex-1 justify-center mr-10">
                    <Text className="text-xl font-semibold text-center">Posting Item</Text>
                </View>
            </View>

            <View className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
                <Image 
                    source={product.image_url ? { uri: product.image_url } : require('../assets/kardus.jpg')}
                    className="w-full h-64"
                    resizeMode="cover"
                />
            </View>

            <View className="flex-row items-center bg-white p-4 rounded-lg shadow-md mb-4">
                <Image 
                    source={owner.photo_url ? { uri: owner.photo_url } : require('../assets/user.png')}
                    className="w-12 h-12 rounded-full mr-4"
                />
                <View>
                    <Text className="text-gray-800 font-semibold">{owner.name || 'Unknown User'}</Text>
                    <Text className="text-gray-500 text-sm">{owner.email || 'No email available'}</Text>
                </View>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                <Text className="text-xl font-bold text-gray-800 mb-2">{product.nama_product}</Text>
                <Text className="text-gray-500 text-sm mb-4">
                    {new Date(product.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }) 
                    ? `Diposting tanggal ${new Date(product.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}` 
                    : 'Unknown time'}
                </Text>

                <View className="flex-row flex-wrap mb-4">
                    <Text className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs mr-2 mb-2">Barter Online</Text>
                    <Text className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs mr-2 mb-2">Best Product</Text>
                </View>

                <Text className="text-gray-800 font-semibold mb-2">Catatan</Text>
                <Text className="text-gray-700">{product.catatan || 'No notes available.'}</Text>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-md mb-6">
                <Text className="text-gray-800 font-semibold mb-2">Detail Tambahan</Text>
                <Text className="text-gray-700 mb-2">Alamat: {product.alamat || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Berat: {product.berat || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Jenis: {product.jenis || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Jumlah: {product.jumlah !== undefined ? product.jumlah : 'Tidak tersedia'}</Text>
                <Text className="text-gray-700 mb-2">Kode Pos: {product.kode_pos || 'N/A'}</Text>
                <Text className="text-gray-700">No Rumah: {product.no_rumah || 'N/A'}</Text>
            </View>

            <LinearGradient
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 16,
                }}
                className="flex-row items-center justify-center p-4 rounded-lg shadow-md mb-8"
            >
                <TouchableOpacity
                    className="flex-1 items-center justify-center"
                    style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                    }}
                    onPress={handleBarterPress}
                >
                    <Text className="text-center text-white font-semibold">
                        {auth.currentUser?.uid === product.userId ? 'Edit' : 'Barter'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Modal for missing phone number */}
            <Modal
                visible={noItemsModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setNoItemsModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-gray-400 opacity-80">
                    <View className="w-4/5 bg-white rounded-xl p-6 items-center shadow-lg">
                        <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            Tidak bisa barter jika belum memasukkan nomor telepon.
                        </Text>
                        <TouchableOpacity
                            className="bg-[#4A4A4A] rounded-lg py-2 px-4"
                            onPress={() => {
                                setNoItemsModalVisible(false);
                                navigation.navigate('EditProfile');
                            }}
                        >
                            <Text className="text-white font-semibold">Masukkan Nomor Telepon</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={{ marginBottom: 20 }} />
        </ScrollView>
    );
};

export default ItemDetail;
