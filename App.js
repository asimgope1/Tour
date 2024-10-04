import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import Navigation from './src/navigation/Navigation';
import messaging from '@react-native-firebase/messaging';
import { getObjByKey, storeObjByKey } from './src/utils/Storage';

const App = () => {
  useEffect(() => {
    getDeviceToken();
  }, []);

  const getDeviceToken = async () => {
    try {
      let token = await getObjByKey('deviceToken');
      console.log('stored token --> ', token);
      if (!token) {
        token = await messaging().getToken();
        await storeObjByKey('deviceToken', token);
        console.log('Device Token:', token);
      }
    } catch (error) {
      console.error('Error retrieving device token:', error);
    }
  };
  return <Navigation />;
};

export default App;
