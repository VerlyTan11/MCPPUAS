import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';

const EditItem = ({ route, navigation }) => {
    const { image, title, itemId } = route.params; // Receive the data passed from ItemsProp

    const [newTitle, setNewTitle] = useState(title);

    useEffect(() => {
        // You can initialize your form or fetch other data based on the itemId if necessary
    }, [itemId]);

    const handleSave = () => {
        // Save changes or update the item
        alert(`Item saved: ${newTitle}`);
        navigation.goBack(); // Navigate back after saving
    };

    return (
        <View className="flex-1 p-8 bg-white">
            <Text className="text-2xl font-bold text-black mb-8">Edit Item</Text>

            <Image 
                source={image ? { uri: image } : require('../assets/kardus.jpg')}
                className="w-full h-40 rounded-lg mb-4" 
                resizeMode="cover"
            />

            <Text className="text-xl font-bold text-black mb-4">Title</Text>
            <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                className="h-12 p-3 border-b border-gray-300 rounded mb-6"
            />

            <TouchableOpacity onPress={handleSave} className="w-full bg-blue-500 p-3 rounded-full">
                <Text className="text-white text-center">Save</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditItem;
