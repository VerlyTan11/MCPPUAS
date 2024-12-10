import React, { useState, useEffect } from 'react';
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
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Home = ({ navigation }) => {
    const currentUser = auth.currentUser;
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.category.selected);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { label: 'Kardus', value: 'kardus', icon: require('../assets/box.png') },
        { label: 'Kain', value: 'kain', icon: require('../assets/hanger.png') },
        { label: 'Kamera', value: 'kamera', icon: require('../assets/cam.png') },
        { label: 'Buku', value: 'buku', icon: require('../assets/book.png') },
        { label: 'More', value: 'more', icon: require('../assets/more.png') },
    ];

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
                        source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/profile.png')}
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
                            onPress={() => navigation.navigate('AddItem')}
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
            <View className="flex-row flex-wrap justify-around mb-6">
                {categories.map((item, index) => (
                    <View key={index} className="flex-col items-center mb-4">
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
                                <Image source={item.icon} className="w-6 h-6" resizeMode="contain" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text className="text-black mt-2">{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderProducts = () => (
        <View className="flex-row flex-wrap justify-between">
            {products.map((item) => (
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
            ))}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {renderHeader()}
                        <Text className="text-xl font-bold text-black mb-4">Beranda</Text>
                        {renderProducts()}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <FloatingAddButton onPress={() => navigation.navigate('AddItem')} />
        </SafeAreaView>
    );
};

export default Home;
