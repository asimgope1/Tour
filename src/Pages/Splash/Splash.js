import { View, Image, SafeAreaView, ImageBackground, Animated } from 'react-native';
import React, { Fragment, useEffect, useRef } from 'react';
import { BRAND, WHITE } from '../../constants/color';
import { CHAKRA, LOGO, LOGOZZ, NAME, NEWLOGO, RING } from '../../constants/imagepath';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { splashStyles } from './SplashStyles';

const Splash = ({ navigation }) => {
  // Animated values for Chakra and Name images
  const chakraAnim = useRef(new Animated.Value(-HEIGHT * 0.9)).current; // Start off-screen from the top
  const nameAnim = useRef(new Animated.Value(HEIGHT)).current; // Start off-screen from the bottom

  useEffect(() => {
    // Animation for both images coming into view
    Animated.parallel([
      Animated.timing(chakraAnim, {
        toValue: HEIGHT * 0.18, // Target position for Chakra image
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
                width: WIDTH * 0.68,
                height: HEIGHT * 0.62,
                alignSelf: 'center',
                alignItems: 'center',
                transform: [{ translateY: chakraAnim }], // Add animation if required
              }}
            />

            {/* Foreground Logo Image */}
            <Animated.Image
              source={NEWLOGO}
              style={{
                width: WIDTH * 0.78,
                height: HEIGHT * 0.42,
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
