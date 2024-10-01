import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../Pages/Splash/Splash';
import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Terms from '../Pages/Terms/Terms';
import Admin from '../Pages/Admin/Admin';

const Stack = createNativeStackNavigator();
export default LoginStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Signup"
        component={Signup}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="Terms"
        component={Terms}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Admin"
        component={Admin}
      />
    </Stack.Navigator>
  );
};
