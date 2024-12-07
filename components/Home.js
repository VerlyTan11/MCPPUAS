import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemsProp from './ItemsProp';
import FloatingAddButton from './FloatingAddButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../redux/searchSlice';
import { setCategory } from '../redux/categorySlice';

const Home = ({ navigation }) => {
    const currentUser  = auth.currentUser ;
    const dispatch = useDispatch();
    const searchQuery = useSelector((state) => state.search.query);
    const selectedCategory = useSelector((state) => state.category.selected);
    const [triggeredSearchQuery, setTriggeredSearchQuery] = useState('');
    const inputRef = useRef(null);

    const categories = [
        { label: 'Kardus', value: 'box', icon: require('../assets/box.png') },
        { label: 'Kain', value: 'fabric', icon: require('../assets/hanger.png') },
        { label: 'Kamera', value: 'camera', icon: require('../assets/cam.png') },
        { label: 'Buku', value: 'book', icon: require('../assets/book.png') },
        { label: 'More', value: 'more', icon: require('../assets/more.png') },
    ];

    const triggerSearch = () => {
        setTriggeredSearchQuery(searchQuery);
        Keyboard.dismiss(); // Hanya tutup keyboard saat pencarian dipicu
    };

    const handleSearchChange = (text) => {
        dispatch(setSearchQuery(text));
        if (text.trim() === '') {
            setTriggeredSearchQuery('');
        }
    };

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category === selectedCategory ? null : category));
    };

    const renderHeader = () => (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <View className="flex-row items-center bg-gray-100 rounded-lg flex-1 px-4 py-2">
                    <TextInput
                        ref={inputRef}
                        className="flex-1 text-base"
                        placeholder="Cari Produk"
                        autoCapitalize="none"
                        textAlign="left"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        returnKeyType="search"
                        onSubmitEditing={triggerSearch} // Tutup keyboard saat tombol search ditekan
                        blurOnSubmit={false} // Pastikan ini diatur ke false
                    />
                    <TouchableOpacity onPress={triggerSearch}>
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
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="p-4 mb-6"
                style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                }}
            >
                <View style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                    borderRadius: 16, 
                    padding: 16, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
                            Explore Item's
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14, marginBottom: 12 }}>
                            Tukarkan dengan apa yang Anda inginkan
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#4A4A4A',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                alignSelf: 'flex-start',
                            }}
                            onPress={() => navigation.navigate('AddItem')}
                        >
                            <Text style={{ color: 'white', textAlign: 'center' }}>Mulai Barter</Text>
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
                            className="py-2 px-4 rounded-md"
                        >
                            <LinearGradient
                                colors={selectedCategory === item.value ? ['#697565', '#ECDFCC'] : ['#f1f1f1', '#f1f1f1']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1.2, y: 0 }}
                                className="rounded-md p-3"
                                style={{
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                }}
                            >
                                <Image
                                    source={item.icon}
                                    className="w-6 h-6"
                                    resizeMode="contain"
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text className="text-black mt-2">{item.label}</Text>
                    </View>
                ))}
            </View>
            <Text className="text-xl font-bold text-black mb-4">Rekomendasi</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        const currentInput = inputRef.current;
                        if (currentInput && !currentInput.isFocused()) {
                            Keyboard.dismiss();
                        }
                    }}
                >
                    <FlatList
                        data={[1]}
                        renderItem={null}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={
                            <View>
                                <ItemsProp
                                    excludeUser Id={currentUser ?.uid}
                                    filterCategory={selectedCategory}
                                    searchQuery={triggeredSearchQuery}
                                />
                            </View>
                        }
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <FloatingAddButton onPress={() => navigation.navigate('AddItem')} />
        </SafeAreaView>
    );
};

export default Home; 