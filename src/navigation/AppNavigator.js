import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SDUIScreen from '../screens/SDUIScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={SDUIScreen}
        initialParams={{ screenName: 'home-screen' }}
        options={{ title: 'Shop' }}
      />
      
      <Stack.Screen 
        name="SDUIScreen" 
        component={SDUIScreen}
        options={({ route }) => ({ 
          title: route.params?.title || 'Detail',
        })}
      />
    </Stack.Navigator>
  );
}