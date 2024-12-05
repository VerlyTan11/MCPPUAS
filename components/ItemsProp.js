import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const ItemsProp = ({ excludeUserId }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsRef = collection(db, 'products');

        const unsubscribe = onSnapshot(productsRef, (querySnapshot) => {
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
        });

        return () => unsubscribe();
    }, [excludeUserId]);

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={3} // Menentukan jumlah kolom
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }} // Style untuk baris
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('ItemDetail', { image: item.image_url, title: item.nama_product, itemId: item.id })}
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