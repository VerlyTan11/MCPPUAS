import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const ItemsProp = ({ excludeUserId, filterCategory, searchQuery }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let productsRef = collection(db, 'products');
        if (filterCategory) {
            productsRef = query(
                productsRef,
                where('jenis', '==', filterCategory),
                orderBy('timestamp', 'desc')
            );
        } else {
            productsRef = query(productsRef, orderBy('timestamp', 'desc'));
        }

        const unsubscribe = onSnapshot(
            productsRef,
            (querySnapshot) => {
                let productsList = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.nama_product && data.image_url && data.userId !== excludeUserId) {
                        productsList.push({ id: doc.id, ...data });
                    }
                });

                // Filter by search query
                if (searchQuery) {
                    productsList = productsList.filter((product) =>
                        product.nama_product.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                setProducts(productsList);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [excludeUserId, filterCategory, searchQuery]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500 text-lg">Loading...</Text>
            </View>
        );
    }

    if (products.length === 0) {
        return (
            <View className="flex-1 justify-center items-center mt-5">
                <Text className="text-lg font-bold text-gray-500">Tidak ada barang yang ditemukan.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ItemDetail', {
                            image: item.image_url,
                            title: item.nama_product,
                            itemId: item.id,
                        })
                    }
                    className="bg-white rounded-lg shadow p-2 w-[30%]"
                >
                    <Image
                        source={{ uri: item.image_url }}
                        className="w-full h-20 rounded mb-2"
                        resizeMode="cover"
                    />
                    <Text className="text-sm font-semibold text-black text-center">{item.nama_product}</Text>
                </TouchableOpacity>
            )}
        />
    );
};

export default ItemsProp;
