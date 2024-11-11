import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './components/Splash';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AddItem from './components/AddItem';
import "./global.css";
import ItemDetail from './components/ItemDetail';
import Barter from './components/Barter';
import ChatStart from './components/ChatStart';
import ChatScreen from './components/ChatScreen';
import EditProfile from './components/EditProfile';
import EditItem from './components/EditItem';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={Splash}  
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="EditItem" component={EditItem} options={{ headerShown: false }} />
        <Stack.Screen 
          name="AddItem" 
          component={AddItem} 
          options={{ 
            title: "Posting Item's",
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Barter" component={Barter} options={{ headerTitleAlign: 'center' }}/>
        <Stack.Screen name="ChatStart" component={ChatStart} options={{headerShown: false}}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
