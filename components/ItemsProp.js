import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const ItemsProp = ({ excludeUserId, filterCategory }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let productsRef = collection(db, 'products');

        if (filterCategory) {
            // Tambahkan filter berdasarkan kategori
            productsRef = query(
                productsRef,
                where('jenis', '==', filterCategory),
                orderBy('timestamp', 'desc')
            );
        } else {
            // Tanpa filter kategori
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
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [excludeUserId, filterCategory]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'gray', fontSize: 16 }}>Loading...</Text>
            </View>
        );
    }

    if (products.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray' }}>
                    Tidak ada barang di kategori ini.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={3} // Menentukan jumlah kolom
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }} // Style untuk baris
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
                        width: '30%', // Lebar kotak dalam baris
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