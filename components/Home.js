import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemsProp from './ItemsProp';
import FloatingAddButton from './FloatingAddButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import React, { useState } from 'react';

const Home = ({ navigation }) => {
    const currentUser = auth.currentUser;
    const [selectedCategory, setSelectedCategory] = useState(null); // State untuk kategori yang dipilih

    const categories = [
        { label: 'Kardus', value: 'box', icon: require('../assets/box.png') },
        { label: 'Kain', value: 'fabric', icon: require('../assets/hanger.png') },
        { label: 'Kamera', value: 'camera', icon: require('../assets/cam.png') },
        { label: 'Buku', value: 'book', icon: require('../assets/book.png') },
        { label: 'More', value: 'more', icon: require('../assets/more.png') },
    ];

    const renderHeader = () => (
        <View>
            {/* Search and Profile */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center bg-gray-100 rounded-lg flex-1 px-4 py-2">
                    <Image 
                        source={require('../assets/search.png')} 
                        className="w-5 h-5 mr-2"
                        resizeMode="contain"
                    />
                    <TextInput 
                        className="flex-1 text-base"
                        placeholder="Cari Produk" 
                        autoCapitalize="none"
                        textAlign="center"
                    />
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

            {/* Explore Section */}
            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-between p-4 rounded-lg mb-6"
            >
                <View className="flex-1">
                    <Text className="text-xl font-bold text-white">Explore Item's</Text>
                    <Text className="text-white text-sm">Tukarkan dengan apa yang Anda inginkan</Text>
                    <TouchableOpacity 
                        className="bg-gray-600 rounded-lg mt-2 px-3 py-2 w-32"
                        onPress={() => navigation.navigate('AddItem')}
                    >
                        <Text className="text-white text-center">Mulai Barter</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Kategori */}
            <Text className="text-xl font-bold text-black mb-4">Kategori</Text>
            <View className="flex-row flex-wrap justify-around mb-6">
                {categories.map((item, index) => (
                    <View key={index} className="flex-col items-center mb-4">
                        <TouchableOpacity
                            onPress={() =>
                                setSelectedCategory((prevCategory) =>
                                    prevCategory === item.value ? null : item.value
                                )
                            }
                            className={`py-3 px-4 rounded-md ${
                                selectedCategory === item.value ? 'bg-green-200' : 'bg-gray-100'
                            }`}
                        >
                            <Image 
                                source={item.icon}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text className="text-black mt-2">{item.label}</Text>
                    </View>
                ))}
            </View>

            {/* Rekomendasi Title */}
            <Text className="text-xl font-bold text-black mb-4">Rekomendasi</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={[1]} // Gunakan placeholder karena ItemsProp akan di-render
                renderItem={null} // ItemsProp dihandle secara terpisah
                ListHeaderComponent={renderHeader}
                ListFooterComponent={
                    <View>
                        <ItemsProp excludeUserId={currentUser?.uid} filterCategory={selectedCategory} />
                    </View>
                }
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            />
            <FloatingAddButton onPress={() => navigation.navigate('AddItem')} />
        </SafeAreaView>
    );
};

export default Home;