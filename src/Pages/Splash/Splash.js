import { View, Image, SafeAreaView, ImageBackground, Animated, Platform, PermissionsAndroid } from 'react-native';
import React, { Fragment, useEffect, useRef } from 'react';
import { BRAND, WHITE } from '../../constants/color';
import { CHAKRA, LOGO, LOGOZZ, NAME, NEWLOGO, RING } from '../../constants/imagepath';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { splashStyles } from './SplashStyles';
import Geolocation from '@react-native-community/geolocation';

const Splash = ({ navigation }) => {
  useEffect(() => {
    requestLocationPermission();
    NotificationPermission()
  }, []);

  const NotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
      }
    }
  }
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'ProTime Location Permission',
            message:
              'ProTime needs access to your location to provide attendance tracking. Your location data will only be used for this purpose and will not be shared with third parties. Tap "Allow" to grant permission or "Deny" to decline.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (locationGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        // For iOS, no need to request permissions manually, it's done automatically
        getCurrentLocation();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);

        // Call the reverse geocode API
      },
      error => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  // Animated values for Chakra and Name images
  const chakraAnim = useRef(new Animated.Value(-HEIGHT * 0.9)).current; // Start off-screen from the top
  const nameAnim = useRef(new Animated.Value(HEIGHT)).current; // Start off-screen from the bottom

  useEffect(() => {
    // Animation for both images coming into view
    Animated.parallel([
      Animated.timing(chakraAnim, {
        toValue: HEIGHT * 0.13, // Target position for Chakra image
        duration: 1000, // Duration for the animation
        useNativeDriver: true,
      }),
      Animated.timing(nameAnim, {
        toValue: HEIGHT * 0.27, // Target position for Name image
        duration: 1000, // Duration for the animation
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Login screen after the animation
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000); // Ensure this is longer than the animation

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [chakraAnim, nameAnim, navigation]);

  return (
    <Fragment>
      <MyStatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
      <SafeAreaView style={splashStyles.maincontainer}>
        <ImageBackground
          style={{
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center'
          }}
          source={LOGO}
        >
          {/* Animated Chakra Image */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // backgroundColor: 'rgba(255, 255, 255, 0.6)',
              alignItems: 'center',
              alignSelf: 'center'
            }}
          >


            <Animated.Image
              source={RING}
              resizeMode={'contain'}
              style={{
                position: 'absolute', // Make sure the image is positioned absolutely
                width: WIDTH * 0.72,
                height: HEIGHT * 0.7,
                alignSelf: 'center',
                alignItems: 'center',
                transform: [{ translateY: chakraAnim }], // Add animation if required
              }}
            />

            {/* Foreground Logo Image */}
            <Animated.Image
              source={NEWLOGO}
              style={{
                width: WIDTH * 0.6,
                height: HEIGHT * 0.4,
                marginLeft: 5,
                resizeMode: 'contain',
                alignSelf: 'center',
                alignItems: 'center',
                position: 'absolute', // Ensure this stays on top
                transform: [{ translateY: nameAnim }], // Add animation for the logo
              }}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </Fragment>
  );
};

export default Splash;
