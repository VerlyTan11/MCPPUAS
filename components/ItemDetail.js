import React, { useEffect, useState } from 'react'; 
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'; // Tambahkan useIsFocused
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const ItemDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused(); // Hook untuk mendeteksi fokus layar
    const { itemId } = route.params || {}; // ID produk dari navigasi
    const [product, setProduct] = useState(null); // Data produk
    const [owner, setOwner] = useState(null); // Data pemilik produk

    // Fungsi untuk Fetch Data
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
                setProduct({ ...productData, id: itemId }); // Simpan id ke product

                const ownerRef = doc(db, 'users', productData.userId);
                const ownerSnapshot = await getDoc(ownerRef);
                if (ownerSnapshot.exists()) {
                    setOwner(ownerSnapshot.data());
                }
            } else {
                Alert.alert('Error', 'Product not found!');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            Alert.alert('Error', 'Failed to fetch product details');
        }
    };

    // Fetch data saat pertama kali halaman dimuat atau layar kembali fokus
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

    const isUserOwner = auth.currentUser?.uid === product.userId;

    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            {/* Back Button */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-200 rounded-full">
                    <Image source={require('../assets/back.png')} className="w-8 h-8" />
                </TouchableOpacity>
                <Text className="ml-4 text-lg font-semibold text-gray-800">Detail Produk</Text>
            </View>

            {/* Product Image */}
            <View className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
                <Image 
                    source={product.image_url ? { uri: product.image_url } : require('../assets/kardus.jpg')}
                    className="w-full h-64"
                    resizeMode="cover"
                />
            </View>

            {/* Owner Information */}
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

            {/* Product Details */}
            <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                <Text className="text-xl font-bold text-gray-800 mb-2">{product.nama_product}</Text>
                <Text className="text-gray-500 text-sm mb-4">
                    {new Date(product.timestamp).toLocaleString() || 'Unknown time'}
                </Text>

                {/* Tags */}
                <View className="flex-row flex-wrap mb-4">
                    <Text className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs mr-2 mb-2">Barter Online</Text>
                    <Text className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs mr-2 mb-2">Best Product</Text>
                </View>

                {/* Description */}
                <Text className="text-gray-800 font-semibold mb-2">Catatan</Text>
                <Text className="text-gray-700">{product.catatan || 'No notes available.'}</Text>
            </View>

            {/* Additional Details */}
            <View className="bg-white p-4 rounded-lg shadow-md mb-6">
                <Text className="text-gray-800 font-semibold mb-2">Detail Tambahan</Text>
                <Text className="text-gray-700 mb-2">Alamat: {product.alamat || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Berat: {product.berat || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Jenis: {product.jenis || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Jumlah: {product.jumlah || 'N/A'}</Text>
                <Text className="text-gray-700 mb-2">Kode Pos: {product.kode_pos || 'N/A'}</Text>
                <Text className="text-gray-700">No Rumah: {product.no_rumah || 'N/A'}</Text>
            </View>

            {/* Action Button */}
            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-center p-4 rounded-lg shadow-md mb-8"
            >
                <TouchableOpacity 
                    className="flex-1 items-center justify-center"
                    onPress={() => {
                        if (isUserOwner) {
                            navigation.navigate('EditItem', { itemId: product.id }); // Send product.id
                        } else {
                            navigation.navigate('PilihItem', { itemId: product.id }); // Send product.id
                        }
                    }}
                >
                    <Text className="text-center text-white font-semibold">
                        {isUserOwner ? 'Edit' : 'Barter'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default ItemDetail;