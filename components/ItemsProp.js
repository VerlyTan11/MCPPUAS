import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import debounce from 'lodash.debounce';

const ItemsProp = ({ excludeUserId, filterCategory, searchQuery }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil data produk dari Firestore
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
                const productsList = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.nama_product && data.image_url && data.userId !== excludeUserId) {
                        productsList.push({
                            id: doc.id,
                            ...data,
                        });
                    }
                });

                setProducts(productsList);
                setFilteredProducts(productsList); // Default filter
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [excludeUserId, filterCategory]);

    // Debounce fungsi filter
    const debouncedFilter = useMemo(
        () =>
            debounce((query) => {
                if (query.trim()) {
                    setFilteredProducts(
                        products.filter((product) =>
                            product.nama_product.toLowerCase().includes(query.toLowerCase())
                        )
                    );
                } else {
                    setFilteredProducts(products);
                }
            }, 100), // Kurangi debounce delay untuk lebih responsif
        [products]
    );

    // Perbarui filter ketika searchQuery berubah
    useEffect(() => {
        debouncedFilter(searchQuery);
        return () => debouncedFilter.cancel(); // Cleanup debounce
    }, [searchQuery, debouncedFilter]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'gray', fontSize: 16 }}>Loading...</Text>
            </View>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>
                    Tidak ada barang yang ditemukan.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={filteredProducts}
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
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        elevation: 3,
                        padding: 8,
                        width: '30%',
                    }}
                >
                    {item.image_url && (
                        <Image
                            source={{ uri: item.image_url }}
                            style={{
                                width: '100%',
                                height: 80,
                                borderRadius: 8,
                                marginBottom: 8,
                            }}
                            resizeMode="cover"
                        />
                    )}
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'black', textAlign: 'center' }}>
                        {item.nama_product}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );
};

export default ItemsProp;