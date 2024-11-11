import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AddItem = () => {
    return (
        <ScrollView className="flex-1 p-6 bg-white">
            <View className="flex-row items-center mb-4">
                <View className="w-32 h-32 bg-gray-200 rounded-lg items-center justify-center mr-4">
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/plus.png')}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <TextInput 
                    placeholder="Masukkan Nama Produk" 
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2"
                />
            </View>

            <TextInput
                placeholder="Jenis Produk"
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
            />
            <View className="flex-row mb-4">
                <TextInput 
                    placeholder="Jumlah" 
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2"
                />
                <TextInput 
                    placeholder="Berat / pcs" 
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2"
                />
                <TextInput 
                    placeholder="kg" 
                    className="w-12 bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>
            <TextInput 
                placeholder="Catatan" 
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
            />
            <TextInput
                placeholder="Hashtag"
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-6"
            />

            <Text className="text-gray-800 font-semibold mb-2">Lokasi</Text>
            <TextInput 
                placeholder="Alamat Lengkap" 
                className="bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mb-4"
            />
            <View className="flex-row mb-8">
                <TextInput 
                    placeholder="No. Rumah" 
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3 mr-2"
                />
                <TextInput 
                    placeholder="Kode Pos" 
                    className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-3"
                />
            </View>

            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-between rounded-lg mb-6"
            >
                <TouchableOpacity className="w-full py-4 items-center">
                    <Text className="text-white font-semibold">Posting</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
};

export default AddItem;
