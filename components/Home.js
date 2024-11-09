import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ItemsProp from './ItemsProp';

const Home = ({ navigation }) => {
    return (
        <View className="flex-1 p-8 bg-white mt-8">
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

            <LinearGradient 
                colors={['#697565', '#ECDFCC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                className="flex-row items-center justify-between p-4 rounded-lg mb-6"
            >
                <View className="flex-1">
                    <Text className="text-xl font-bold text-white">Explore Item's</Text>
                    <Text className="text-white text-sm">Tukarkan dengan apa yang Anda inginkan</Text>
                    <TouchableOpacity className="bg-gray-600 rounded-lg mt-2 px-3 py-2 w-32">
                        <Text className="text-white text-center">Mulai Barter</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <Text className="text-xl font-bold text-black mb-4">Kategori</Text>
            <View className="flex-row flex-wrap justify-around mb-6">
                {[
                    { label: 'Kardus', icon: require('../assets/box.png') },
                    { label: 'Kain', icon: require('../assets/hanger.png') },
                    { label: 'Kamera', icon: require('../assets/cam.png') },
                    { label: 'Buku', icon: require('../assets/book.png') },
                    { label: 'Tas', icon: require('../assets/bag.png') }
                ].map((item, index) => (
                    <View key={index} className="flex-col items-center mb-4">
                        <TouchableOpacity className="bg-gray-100 py-3 px-4 rounded-md">
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

            <Text className="text-xl font-bold text-black mb-4">Rekomendasi</Text>
            <View>
                <ItemsProp />
            </View>
        </View>
    );
}

export default Home;
