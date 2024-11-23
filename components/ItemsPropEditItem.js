import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ItemsProEditItem = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserProducts = async () => {
        try {
            const userId = auth.currentUser.uid;
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            
            const productsList = [];
            querySnapshot.forEach((doc) => {
                productsList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProducts();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    onPress={() => navigation.navigate('EditItem', { image: item.image_url, title: item.nama_product, itemId: item.id })}
                    className="bg-white rounded-lg shadow-lg p-4 m-2 w-40"
                >
                    <Image 
                        source={item.image_url ? { uri: item.image_url } : require('../assets/kardus.jpg')}
                        className="w-full h-24 rounded-lg mb-2" 
                        resizeMode="cover"
                    />
                    <Text className="text-base font-semibold text-black text-center">{item.nama_product}</Text>
                </TouchableOpacity>
            )}
        />
    );
};

export default ItemsProEditItem;
