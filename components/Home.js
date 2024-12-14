import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingAddButton from './FloatingAddButton';
import { useSelector, useDispatch } from 'react-redux';
import { setCategory } from '../redux/categorySlice';
import { auth } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

const Home = ({ navigation }) => {
    const currentUser = auth.currentUser;
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.category.selected);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [userItems, setUserItems] = useState([]); // Barang milik user
    const [selectedItem, setSelectedItem] = useState(null); // Barang yang dipilih
    const [preferences, setPreferences] = useState([]); // Preferensi sesuai barang
    const scrollViewRef = useRef(null);
    const preferencesRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Fetching categories...');
                const categoriesRef = collection(db, 'categories');
                const querySnapshot = await getDocs(categoriesRef);
                console.log('Categories fetched:', querySnapshot.docs.length);
                const categoriesList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategories(categoriesList);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const fetchProfileImage = async () => {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        if (data.photo_url) setProfileImageUrl(data.photo_url);
                    }
                } catch (error) {
                    console.error('Error fetching profile image:', error);
                }
            };
            fetchProfileImage();
        }
    }, [currentUser]);

    useEffect(() => {
        let productsRef = collection(db, 'products');
        if (selectedCategory) {
            productsRef = query(
                productsRef,
                where('jenis', '==', selectedCategory),
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
                    if (data.nama_product && data.image_url && data.userId !== currentUser?.uid) {
                        productsList.push({ id: doc.id, ...data });
                    }
                });

                // Apply search filter
                if (searchText) {
                    productsList = productsList.filter((product) =>
                        product.nama_product.toLowerCase().includes(searchText.toLowerCase())
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
    }, [selectedCategory, searchText, currentUser?.uid]);

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category === selectedCategory ? null : category));
    };

        useEffect(() => {
        const fetchUserItems = async () => {
            try {
                const userItemsRef = query(
                    collection(db, 'products'),
                    where('userId', '==', currentUser?.uid)
                );
                const querySnapshot = await getDocs(userItemsRef);
                const items = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserItems(items);
            } catch (error) {
                console.error('Error fetching user items:', error);
            }
        };

        if (currentUser) fetchUserItems();
    }, [currentUser]);

        useEffect(() => {
        const fetchPreferences = async () => {
            if (!selectedItem) return;

            try {
                const item = userItems.find((item) => item.id === selectedItem);
                const preferencesRef = query(
                    collection(db, 'products'),
                    where('jenis', '==', item?.preferensi || '')
                );
                const querySnapshot = await getDocs(preferencesRef);
                const preferencesList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPreferences(preferencesList);
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };

        fetchPreferences();
    }, [selectedItem, userItems]);

    const renderHeader = () => (
        <View>
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center bg-gray-100 rounded-lg flex-1 px-4">
                    <TextInput
                        className="flex-1 text-base"
                        placeholder="Cari Produk"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/search.png')}
                            className="w-5 h-5 ml-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    className="ml-4 bg-gray-100 p-2 rounded-md"
                >
                    <Image
                        source={require('../assets/profile.png')}
                        className="w-6 h-6"
                    />
                </TouchableOpacity>
            </View>
            <LinearGradient
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="p-4 mb-6"
                style={{ borderRadius: 16, overflow: 'hidden' }}
            >
                <View className="bg-white opacity-90 rounded-xl p-4 flex-row items-center justify-between">
                    <View className="flex-1 mr-3">
                        <Text className="text-xl font-bold text-black mb-1">Explore Item's</Text>
                        <Text className="text-black text-sm mb-3">Tukarkan dengan apa yang Anda inginkan</Text>
                        <TouchableOpacity
                            className="bg-[#4A4A4A] rounded-lg py-2 px-4 self-start"
                            onPress={() => {
                                preferencesRef.current?.measureLayout(
                                    scrollViewRef.current,
                                    (x, y, width, height) => {
                                        scrollViewRef.current?.scrollTo({ y: y, animated: true });
                                    }
                                );
                            }}
                        >
                            <Text className="text-white text-center">Mulai Barter</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require('../assets/logo-bartems.png')}
                        style={{ width: 60, height: 60 }}
                        resizeMode="contain"
                    />
                </View>
            </LinearGradient>
            <Text className="text-xl font-bold text-black mb-4">Kategori</Text>
            <View className="flex-row flex-wrap justify-between">
                {categories.map((item) => (
                    <View key={item.id} className="flex items-center mb-4">
                        <TouchableOpacity
                            onPress={() => handleCategorySelect(item.value)}
                            className="p-2 rounded-md"
                        >
                            <LinearGradient
                                colors={selectedCategory === item.value ? ['#697565', '#ECDFCC'] : ['#f1f1f1', '#f1f1f1']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1.2, y: 0 }}
                                className="rounded-md p-4"
                                style={{ borderRadius: 16, overflow: 'hidden' }}
                            >
                                <Image source={{ uri: item.icon }} className="w-6 h-6" resizeMode="contain" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text className="text-black mt-2 text-center">{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderProducts = () => (
        <View className="flex-row flex-wrap justify-between mb-4">
            {products.length > 0 ? (
                products.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                            navigation.navigate('ItemDetail', {
                                image: item.image_url,
                                title: item.nama_product,
                                itemId: item.id,
                            })
                        }
                        className="bg-white rounded-lg shadow p-2 w-[30%] mb-4"
                    >
                        <Image
                            source={{ uri: item.image_url }}
                            className="w-full h-20 rounded mb-2"
                            resizeMode="cover"
                        />
                        <Text className="text-sm font-semibold text-black text-center">{item.nama_product}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text className="text-center text-gray-500 w-full mt-4">
                    Tidak ada barang untuk preferensi {selectedItem || 'terpilih'}
                </Text>
            )}
        </View>
    );

    const renderPreferences = () => (
        <View ref={preferencesRef}>
            <Text className="text-xl font-bold text-black mb-4">Preferensi Sesuai Barang Anda</Text>
            <View className="flex-row items-center mb-4">
                <Text className="flex-1 text-base">Pilih Barang:</Text>
                <View className="flex-1 bg-gray-100 rounded-lg px-2">
                    <Picker
                        selectedValue={selectedItem}
                        onValueChange={(itemValue) => setSelectedItem(itemValue)}
                    >
                        <Picker.Item label="Pilih Barang" value={null} enabled={false} />
                        {userItems.map((item) => (
                            <Picker.Item key={item.id} label={item.nama_product} value={item.id} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View className="flex-row flex-wrap justify-between">
                {preferences.length > 0 ? (
                    preferences.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() =>
                                navigation.navigate('ItemDetail', {
                                    image: item.image_url,
                                    title: item.nama_product,
                                    itemId: item.id,
                                })
                            }
                            className="bg-white rounded-lg shadow p-2 w-[30%] mb-4"
                        >
                            <Image
                                source={{ uri: item.image_url }}
                                className="w-full h-20 rounded mb-2"
                                resizeMode="cover"
                            />
                            <Text className="text-sm font-semibold text-black text-center">{item.nama_product}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text className="text-center text-gray-500 w-full mt-4">
                        {selectedItem ? (
                            `Tidak ada barang untuk preferensi ${selectedItem.nama_product || 'terpilih'}`
                        ) : (
                            'Silakan pilih barang untuk melihat preferensi'
                        )}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {renderHeader()}
                        <Text className="text-xl font-bold text-black mb-4">Beranda</Text>
                        {renderProducts()}
                        {renderPreferences()}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <FloatingAddButton onPress={() => navigation.navigate('AddItem')} />
        </SafeAreaView>
    );
};

export default Home;
