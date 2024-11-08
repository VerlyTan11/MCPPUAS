import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import ItemsProp from './ItemsProp';

const Home = () => {
    return(
        <View className="flex-1 flex-row p-8">
            <View className="flex-col justify-between">
                <TouchableOpacity>
                <Image 
                        source={require('../assets/search.png')} 
                        className="w-16 h-16 p-2"
                        resizeMode="contain"
                    />
                <TextInput className="h-20 p-2 border-b border-gray-300 rounded ml-4" placeholder="Cari Produk" autoCapitalize="none">
                </TextInput>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image 
                        source={require('../assets/profile.png')} 
                        className="w-16 h-16 p-2"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <View className="bg-grey-200 flex-col">
                <View className="flex-row">
                    <Text className="text-xl font-bold text-white">Explore Item's</Text>
                    <Text className="text-white">Tukarkan dengan apa yang Anda inginkan</Text>
                    <TouchableOpacity className="bg-gray-600 rounded">
                        <Text className="text-white">Mulai Barter</Text>
                    </TouchableOpacity>
                </View>
                <Image 
                    source={require('../assets/kardus.jpg')} 
                    className="w-36 h-36 p-2"
                    resizeMode="contain"
                />
            </View>

            <Text className="text-xl font-bold text-black">Kategori</Text>

            <View className="flex-col">
                <View className="flex-row">
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/icon-box.png')} 
                            className="w-16 h-16 p-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text className="text-black">Kardus</Text>
                </View>

                <View className="flex-row">
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/icon-hanger.png')} 
                            className="w-16 h-16 p-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text className="text-black">Kain</Text>
                </View>

                <View className="flex-row">
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/camera.png')} 
                            className="w-16 h-16 p-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text className="text-black">Kamera</Text>
                </View>

                <View className="flex-row">
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/book.png')} 
                            className="w-16 h-16 p-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text className="text-black">Book</Text>
                </View>

                <View className="flex-row">
                    <TouchableOpacity>
                        <Image 
                            source={require('../assets/bag.png')} 
                            className="w-16 h-16 p-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Text className="text-black">Bag</Text>
                </View>
            </View>

            <Text className="text-xl text-black">Recomendation</Text>

            <View>
                {/* <ItemsProp /> */}
            </View>
        </View>
    )
}

export default Home;