import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const ItemsProp = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsRef = collection(db, 'products');
        
        const unsubscribe = onSnapshot(productsRef, (querySnapshot) => {
            const productsList = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.nama_product && data.image_url) {
                    productsList.push({
                        id: doc.id,
                        ...data,
                    });
                }
            });
            setProducts(productsList);
        });

        return () => unsubscribe();
    }, []);

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ItemDetail', { image: item.image_url, title: item.nama_product, itemId: item.id })}
                    className="bg-white rounded-lg shadow-lg p-4 m-2 w-40"
                >
                    {item.image_url && (
                        <Image 
                            source={{ uri: item.image_url }} 
                            className="w-full h-24 rounded-lg mb-2" 
                            resizeMode="cover"
                        />
                    )}
                    <Text className="text-base font-semibold text-black">{item.nama_product}</Text>
                </TouchableOpacity>
            )}
        />
    );
};

export default ItemsProp;
