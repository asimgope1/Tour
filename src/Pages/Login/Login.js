import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated, StatusBar, ImageBackground, Alert } from 'react-native';
import React, { Fragment, useRef, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { clearAll, getObjByKey, storeObjByKey } from '../../utils/Storage';
import { checkuserToken } from '../../redux/actions/auth';
import { BLACK, BRAND, WHITE } from '../../constants/color';
import { RING, NEWLOGO, LOGO } from '../../constants/imagepath';
import { HEIGHT, WIDTH } from '../../constants/config';
import { BASE_URL } from '../../constants/url';
import messaging from '@react-native-firebase/messaging';
import { Loader } from '../../components/Loader';

const Login = () => {
  const dispatch = useDispatch();

  // State to capture user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Fcm, SetFcm] = useState('')
  const [loader, setLoader] = useState(false);

  // Animated values for Chakra and Name images
  const chakraAnim = useRef(new Animated.Value(-HEIGHT * 0.9)).current;
  const nameAnim = useRef(new Animated.Value(HEIGHT * 0.1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(chakraAnim, {
        toValue: -HEIGHT * 0.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(nameAnim, {
        // toValue: -1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    // RetrieveDetails();
  }, [chakraAnim, nameAnim]);

  useEffect(() => {
    getDeviceToken();
  }, []);

  const getDeviceToken = async () => {

    try {

      let token = await getObjByKey('deviceToken');
      console.log('stored token --> ', token);
      SetFcm(token)
      if (!token) {
        token = await messaging().getToken();
        await storeObjByKey('deviceToken', token);
        SetFcm(token)
        console.log('Device Token:', token);
      }
    } catch (error) {
      console.error('Error retrieving device token:', error);
    }
  };

  const GetUserDetails = (token) => {
    setLoader(true)
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(`${BASE_URL}api/userdetails`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setLoader(false)
          if (result.Code === "200") {

            console.log("GetUserDetails", result)
            storeObjByKey('userDetails', result);
          }

          else if (result.Code === 401) {
            clearAll();
            dispatch(checkuserToken(false));
          }

          else {
            clearAll();
            dispatch(checkuserToken(false));
            Alert.alert("Error", "Failed to fetch user details.");
          }

        })
        .catch((error) => console.error(error));

    }
    catch {
      Alert.alert("Error", "Failed to fetch user details.");

    }
  }





  // const RetrieveDetails = async () => {
  //   try {
  //     const deviceToken = await getObjByKey('deviceToken');


  //     if (deviceToken) {
  //       SetFcm(deviceToken)
  //       console.log('deviceTokennn', deviceToken)
  //     }


  //   } catch {
  //     console.log("Error retrieving deviceToken");
  //   }
  // }


  const FCMToken = (token) => {

    if (token != '') {
      console.log('FCMToken update ')
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
          "token": Fcm
        });
        console.log('fcmraw', raw)

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch(`${BASE_URL}api/updatefirebasetoken`, requestOptions)
          .then((response) => response.json())
          .then((result) => {

            console.log("fcmupdate", result)
          })
          .catch((error) => console.error(error));

      }
      catch {
        Alert.alert("Error", "Failed to fetch FCM token.");
      }

    }

  }

  // Function to handle login
  const handleLogin = () => {
    setLoader(true)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: email,
      password: password,
    });
    console.log('raw', raw)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${BASE_URL}api/login`, requestOptions)
      .then((response) => {
        setLoader(false)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Continue if response is okay
      })
      .then((result) => {
        console.log("object", result)
        if (result.status === "success" && result.Code === "200") {
          FCMToken(result?.token)
          GetUserDetails(result?.token)
          storeObjByKey('loginResponse', result);
          dispatch(checkuserToken());


          Alert.alert("Login Success", result.msg);
        } else {
          Alert.alert("Login Failed", result.msg || "Invalid credentials.");
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", error.message || "Something went wrong. Please try again.");
      });

  };

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style={{ flex: 1 }}
          source={LOGO}
        >
          <StatusBar barStyle={'light-content'} />

          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
              {/* Header Section with Animated Images */}
              <LinearGradient colors={[BRAND, BRAND]} style={styles.headerContainer}>
                <View style={{ position: 'absolute', width: '100%', height: '100%', bottom: HEIGHT * 0.01 }}>
                  {/* Animated Chakra Image */}
                  <Text style={styles.headerText}>Welcome Back!</Text>
                  <Text style={styles.subHeaderText}>Login to continue</Text>
                  <Animated.Image
                    source={RING}
                    resizeMode={'contain'}
                    style={{
                      position: 'absolute',
                      width: WIDTH * 0.72,
                      height: HEIGHT * 0.62,
                      alignSelf: 'center',
                      transform: [{ translateY: chakraAnim }],
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
                      position: 'absolute',
                      transform: [{ translateY: nameAnim }],
                    }}
                  />
                </View>
              </LinearGradient>

              {/* Content Section */}
              <View style={styles.loginBox}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Id"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"

                  placeholderTextColor="#666"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                  <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.loginButtonGradient}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </SafeAreaView>
      <Loader visible={loader} />
    </Fragment>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: HEIGHT * 0.1,
  },
  loginBox: {
    // flex: 1,
    marginTop: HEIGHT * 0.34,
    padding: 25,
    alignItems: 'center',
    alignSelf: 'center',
    height: HEIGHT * 0.35,
    borderRadius: 10,
    elevation: 10,
    width: WIDTH * 0.97,
    backgroundColor: 'white'

  },
  inputField: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: BLACK
  },
  loginButton: {
    width: '100%',
    marginTop: 10,
  },
  loginButtonGradient: {
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default Login;
