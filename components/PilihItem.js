import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../firebaseConfig';

const PilihItem = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { ownerProductId, ownerId, ownerLocation, ownerProductName, ownerProductImage } = route.params || {};
    const [userProducts, setUserProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputQty, setInputQty] = useState('');
    const [exchangeQty, setExchangeQty] = useState('');
    const [noItemsModalVisible, setNoItemsModalVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const productsRef = collection(db, 'products');
                const userProductsQuery = query(
                    productsRef,
                    where('userId', '==', auth.currentUser.uid)
                );
                const querySnapshot = await getDocs(userProductsQuery);
                const products = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserProducts(products);

                // Jika tidak ada produk, tampilkan modal
                if (products.length === 0) {
                    setNoItemsModalVisible(true);
                }
            } catch (error) {
                console.error('Error fetching user products:', error);
            }
        };

        fetchUserProducts();
    }, []);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleSubmit = () => {
        const availableQty = parseInt(selectedProduct.jumlah, 10);
        const requestedQty = parseInt(inputQty, 10);
        const exchangeQtyValue = parseInt(exchangeQty, 10);

        if (isNaN(requestedQty) || isNaN(exchangeQtyValue)) {
            Alert.alert('Error', 'Masukkan jumlah yang valid.');
            return;
        }

        if (requestedQty <= 0 || exchangeQtyValue <= 0) {
            Alert.alert('Error', 'Jumlah harus lebih dari nol.');
            return;
        }

        if (exchangeQtyValue > availableQty) {
            Alert.alert(
                'Error',
                'Jumlah barang yang Anda tukarkan melebihi stok Anda.'
            );
            return;
        }

        setModalVisible(false);

        navigation.navigate('Barter', {
            ownerProductId,
            ownerId,
            ownerLocation,
            ownerProductName,
            ownerProductImage,
            requesterProductId: selectedProduct.id,
            requesterProductName: selectedProduct.nama_product,
            requesterProductImage: selectedProduct.image_url,
            requesterLocation: selectedProduct.alamat,
            requestQty: requestedQty,
            exchangeQty: exchangeQtyValue,
        });
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleAddItemNavigation = () => {
        navigation.navigate('AddItem');
        setNoItemsModalVisible(false);
    };

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-row mb-8 items-center">
                <TouchableOpacity onPress={handleBackPress}>
                    <Image source={require('../assets/back.png')} className="w-10 h-10" />
                </TouchableOpacity>
                <View className="flex-1 justify-center mr-10">
                    <Text className="text-xl font-semibold text-center">Pilih Item</Text>
                </View>
            </View>
            <View className="flex-row flex-wrap justify-around">
                {userProducts.length > 0 ? (
                    userProducts.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            className="items-center mb-6"
                            onPress={() => handleSelectProduct(product)}
                        >
                            <Image
                                source={
                                    product.image_url
                                        ? { uri: product.image_url }
                                        : require('../assets/kardus.jpg')
                                }
                                className="w-24 h-24 rounded-lg mb-2"
                            />
                            <Text className="text-gray-800">{product.nama_product}</Text>
                            <Text className="text-gray-500">Stok: {product.jumlah}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text className="text-center text-gray-500 mb-6">Tidak ada item yang diposting.</Text>
                )}
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-transparent">
                    <View className="w-4/5 bg-white rounded-xl p-6 items-center shadow-lg">
                        <Text className="text-xl font-bold text-gray-800 mb-4">Input Jumlah</Text>
                        <TextInput
                            placeholder="Jumlah barang yang diminta"
                            keyboardType="number-pad"
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
                            value={inputQty}
                            onChangeText={setInputQty}
                        />
                        <TextInput
                            placeholder="Jumlah barang Anda untuk ditukar"
                            keyboardType="number-pad"
                            className="w-full border border-gray-300 rounded-lg p-2 mb-6 text-sm"
                            value={exchangeQty}
                            onChangeText={setExchangeQty}
                        />
                       <View className="flex-row justify-between w-full">
                            {/* Cancel Button */}
                            <TouchableOpacity
                                className="flex-1 bg-gray-300 py-3 rounded-lg" // Added rounded-lg for the cancel button
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
                            </TouchableOpacity>

                            {/* Submit Button */}
                            <TouchableOpacity
                                className={`flex-1 py-4 mx-2 items-center justify-center rounded-lg ${isPressed ? 'bg-[#697565]' : 'bg-gray-300'}`} // Added rounded-lg for the submit button
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                onPress={handleSubmit}
                            >
                                <Text className="text-center text-gray-700 font-semibold">Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={noItemsModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setNoItemsModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-gray-400 opacity-80">
                    <View className="w-4/5 bg-white rounded-xl p-6 items-center shadow-lg">
                        <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            Tidak ada item yang diposting, silahkan tambahkan item yang ingin ditukar terlebih dahulu.
                        </Text>
                        <TouchableOpacity
                           className="bg-[#4A4A4A] rounded-lg py-2 px-4"
                            onPress={handleAddItemNavigation}
                        >
                            <Text className="text-white font-semibold">Tambah Item</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PilihItem;
