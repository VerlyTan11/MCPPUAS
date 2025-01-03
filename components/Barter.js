import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Modal from 'react-native-modal'; // Import Modal

const Barter = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        ownerProductId,
        requesterProductId,
        requestQty,
        exchangeQty,
    } = route.params || {};

    const [ownerProduct, setOwnerProduct] = useState(null);
    const [requesterProduct, setRequesterProduct] = useState(null);
    const [owner, setOwner] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                if (ownerProductId) {
                    const ownerProductRef = doc(db, 'products', ownerProductId);
                    const ownerProductSnap = await getDoc(ownerProductRef);
                    if (ownerProductSnap.exists()) {
                        setOwnerProduct({ id: ownerProductId, ...ownerProductSnap.data() });

                        const ownerRef = doc(db, 'users', ownerProductSnap.data().userId);
                        const ownerSnap = await getDoc(ownerRef);
                        if (ownerSnap.exists()) {
                            setOwner(ownerSnap.data());
                        }
                    }
                }
                if (requesterProductId) {
                    const requesterProductRef = doc(db, 'products', requesterProductId);
                    const requesterProductSnap = await getDoc(requesterProductRef);
                    if (requesterProductSnap.exists()) {
                        setRequesterProduct({
                            id: requesterProductId,
                            ...requesterProductSnap.data(),
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
                Alert.alert('Error', 'Failed to fetch product data.');
            }
        };

        fetchProductData();
    }, [ownerProductId, requesterProductId]);

    useEffect(() => {
        console.log('Route Params:', route.params);
        if (!requestQty || isNaN(requestQty)) {
            Alert.alert('Error', 'Jumlah yang diminta tidak valid.');
        }
        if (!exchangeQty || isNaN(exchangeQty)) {
            Alert.alert('Error', 'Jumlah yang ditukar tidak valid.');
        }
    }, [route.params]);

    const handleConfirmBarter = async () => {
        try {
            if (!ownerProduct || !requesterProduct) {
                Alert.alert('Error', 'Data produk tidak lengkap.');
                return;
            }

            await addDoc(collection(db, 'barterRequests'), {
                ownerId: ownerProduct?.userId,
                ownerProductId,
                ownerProductName: ownerProduct?.nama_product || 'Barang Pemilik',
                ownerProductImage: ownerProduct?.image_url || null,
                ownerLocation: ownerProduct?.alamat || 'Lokasi tidak tersedia',
                ownerName: owner?.name || 'Unknown Owner',
                ownerQuantity: ownerProduct?.jumlah || 'N/A',
                requesterId: auth.currentUser.uid,
                requesterProductId,
                requesterProductName: requesterProduct?.nama_product || 'Barang Anda',
                requesterProductImage: requesterProduct?.image_url || null,
                requesterLocation: requesterProduct?.alamat || 'Lokasi tidak tersedia',
                requesterQuantity: requestQty,
                exchangeQty,
                timestamp: serverTimestamp(),
                processed: false,
            });

            // Show the success modal after request is sent
            setIsModalVisible(true);

            // Automatically close the modal and navigate after a short delay
            setTimeout(() => {
                setIsModalVisible(false);
                navigation.navigate('Home');
            }, 2000);

        } catch (error) {
            console.error('Error sending barter request:', error);
            Alert.alert('Error', 'Gagal mengirim permintaan barter.');
        }
    };

    return (
        <View className="flex-1 bg-white p-4">
            {/* Product Info Section */}
            <View className="flex-row justify-around items-center mb-6">
                <View className="items-center">
                    <Image
                        source={
                            requesterProduct?.image_url
                                ? { uri: requesterProduct.image_url }
                                : require('../assets/kardus.jpg')
                        }
                        className="w-24 h-24 rounded-lg mb-2"
                    />
                    <Text className="text-gray-800">
                        {requesterProduct?.nama_product || 'Barang Anda'}
                    </Text>
                    <Text className="text-gray-500">Jumlah Ditukar: {exchangeQty}</Text>
                    <Text className="text-gray-500">Lokasi: {requesterProduct?.alamat || 'Lokasi tidak tersedia'}</Text>
                    <Text className="text-gray-500">Pemilik: Anda</Text>
                </View>

                <Image
                    source={require('../assets/exchange2.png')}
                    className="w-6 h-6 rounded-lg mb-2"
                />

                <View className="items-center">
                    <Image
                        source={
                            ownerProduct?.image_url
                                ? { uri: ownerProduct.image_url }
                                : require('../assets/kardus.jpg')
                        }
                        className="w-24 h-24 rounded-lg mb-2"
                    />
                    <Text className="text-gray-800">{ownerProduct?.nama_product || 'Barang Pemilik'}</Text>
                    <Text className="text-gray-500">Jumlah Diminta: {requestQty}</Text>
                    <Text className="text-gray-500">Lokasi: {ownerProduct?.alamat || 'Lokasi tidak tersedia'}</Text>
                    <Text className="text-gray-500">Pemilik: {owner?.name || 'Unknown'}</Text>
                </View>
            </View>

            <LinearGradient
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-center p-4 rounded-lg mb-6"
            >
                <TouchableOpacity
                    className="flex-1 items-center justify-center"
                    onPress={handleConfirmBarter}
                >
                    <Text className="text-center text-white font-semibold">Konfirmasi Barter</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Privacy and Terms */}
            <Text className="text-center text-gray-500 text-xs">
                Dengan melanjutkan, Anda setuju dengan{' '}
                <Text className="text-blue-500">Ketentuan Layanan</Text> kami dan
                <Text className="text-blue-500"> Kebijakan Privasi</Text>.
            </Text>

            {/* Success Modal */}
            <Modal isVisible={isModalVisible} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 5
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4CAF50' }}>
                        Permintaan Barter Berhasil
                    </Text>
                    <Text style={{ color: '#555', marginTop: 10 }}>Permintaan barter Anda telah berhasil dikirim!</Text>
                </View>
            </Modal>
        </View>
    );
};

export default Barter;