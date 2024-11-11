import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', justifyContent: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 16 }}>
            <Image source={require('../assets/back.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Chat for deal!</Text>
    </View>


      {/* Profile Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', justifyContent: 'center' }}>
        <Image
          source={require('../assets/foto-aldo.jpeg')}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
        />
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Aldo Wijaya</Text>
      </View>

      {/* Chat Area */}
      <View style={{ flex: 1, padding: 16 }}>
        {/* Empty chat area, you can add chat bubbles here */}
      </View>

      {/* Message Input Area */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: '#ddd' }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 20,
            marginRight: 8,
          }}
          placeholder="Write a message"
        />
        <TouchableOpacity style={{ marginRight: 8 }}>
          <Image source={require('../assets/emoticon.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 8 }}>
          <Image source={require('../assets/attach-file.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/send.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
