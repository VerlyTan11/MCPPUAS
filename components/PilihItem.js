import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs, where, query } from 'firebase/firestore';
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

    return (
        <View className="flex-1 bg-white p-4">
            <View className="flex-row flex-wrap justify-around">
                {userProducts.map((product) => (
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
                ))}
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Input Jumlah</Text>
                        <TextInput
                            placeholder="Jumlah barang yang diminta"
                            keyboardType="number-pad"
                            style={styles.input}
                            value={inputQty}
                            onChangeText={setInputQty}
                        />
                        <TextInput
                            placeholder="Jumlah barang Anda untuk ditukar"
                            keyboardType="number-pad"
                            style={styles.input}
                            value={exchangeQty}
                            onChangeText={setExchangeQty}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = {
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#d3d3d3',
    },
    cancelText: {
        color: '#555',
        fontWeight: 'bold',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#28a745',
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
};

export default PilihItem;