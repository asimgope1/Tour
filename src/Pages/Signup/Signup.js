// SignUp.js

import React, {Fragment, useState} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BRAND, WHITE} from '../../constants/color';
import CustomButton from '../../components/CustomButton';
import {CustomTextInput} from '../../components/CustomTextInput';
import signupStyles from './SignupStyles'; // Import signupStyles from SignUpsignupStyles
import {LOGO, ZZWHITE} from '../../constants/imagepath';
import {appStyles} from '../../styles/AppStyles';
import {Loader} from '../../components/Loader';
import Header from '../../components/Header';
import {loginStyles} from '../Login/LoginStyles';
import {EXTRABOLD, REGULAR} from '../../constants/fontfamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {POSTNETWORK} from '../../utils/Network';
import {BASE_URL} from '../../constants/url';
import {storeObjByKey} from '../../utils/Storage';
import Alertmodal from '../../components/Alertmodal/Alertmodal';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertModal, setAlertModal] = useState(false);

  const handleSignup = () => {
    const url = `${BASE_URL}register/`;
    const obj = {
      username: name,
      email: email,
      password: password,
    };
    setLoader(true);
    console.log(obj);
    POSTNETWORK(url, obj)
      .then(res => {
        console.log('result', res);
        if (res.code === 201) {
          // async-storage-processing
          storeObjByKey('loginResponse', obj).then(() => {
            navigation.navigate('Login', {registered: true});
            // alert('Registered successfully, Please login!');
          });
        } else {
          // alert(res?.msg);
          setAlertMsg(res?.msg);
          setAlertModal(true);
        }
      })
      .catch(err => {
        // alert('Something went wrong!');
        setAlertMsg('Something went wrong!');
        setAlertModal(true);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
      <SafeAreaView style={appStyles.safeareacontainer}>
        <Loader visible={loader} />
        <Alertmodal
          title={alertMsg}
          visible={alertModal}
          onBackpress={setAlertModal}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <Header
              title={''}
              onIconPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              paddingBottom: 20, // Adjust padding bottom to ensure space for scrolling
            }}>
            <View style={loginStyles.imageContainer}>
              <Image
                source={ZZWHITE}
                resizeMode="contain"
                style={loginStyles.image}
              />
            </View>
            <View style={{...loginStyles.logincontainer, height: HEIGHT * 0.5}}>
              <View style={loginStyles.loginheader}>
                <Text
                  style={{
                    ...loginStyles.msgtext,
                  }}>
                  Create Account
                </Text>
                <Text
                  style={{
                    color: '#787878',
                    fontFamily: REGULAR,
                    fontSize: RFValue(14),
                    marginBottom: HEIGHT * 0.02,
                  }}>
                  Sign in to claim ID!
                </Text>
              </View>
              <View style={loginStyles.credentialView}>
                <CustomTextInput
                  title="Name"
                  placeholder="Enter your name"
                  width={'90%'}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={loginStyles.credentialView}>
                <CustomTextInput
                  title="Email"
                  placeholder="Enter your email"
                  width={'90%'}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={loginStyles.credentialView}>
                <CustomTextInput
                  title="Password"
                  placeholder="Enter your Password"
                  width={'90%'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
              </View>
              <View
                style={{
                  ...loginStyles.credentialView,
                  alignItems: 'right',
                  width: '90%',
                }}>
                {/* <Text
                  style={{
                    textAlign: 'right',
                    color: '#787878',
                    fontFamily: REGULAR,
                    fontSize: RFValue(14),
                  }}>
                  Forgot password?
                </Text> */}
              </View>
            </View>
            <CustomButton
              onPress={() => {
                if (name == '' && email == '' && password == '') {
                  // alert('Please fill all the details to create account!');
                  setAlertMsg('Please fill all the details to create account!');
                  setAlertModal(true);
                } else if (name == '') {
                  // alert('Please enter your name');
                  setAlertMsg('Please enter your name!');
                  setAlertModal(true);
                } else if (email == '') {
                  // alert('Please enter your email');
                  setAlertMsg('Please enter your email');
                  setAlertModal(true);
                } else if (password == '') {
                  // alert('Please enter your password');
                  setAlertMsg('Please enter your password');
                  setAlertModal(true);
                } else {
                  handleSignup();
                }
              }}
              title={'Create Account'}
              width={'81%'}
              borderColor={BRAND}
            />
            <View
              style={{
                ...loginStyles.credentialView,
                marginTop: HEIGHT * 0.03,
              }}>
              <Text
                style={{
                  color: '#787878',
                  fontFamily: EXTRABOLD,
                  fontSize: RFValue(14),
                  fontWeight: 'bold',
                }}>
                Already have an account?
                <Text
                  onPress={() => {
                    navigation.navigate('Login');
                  }}
                  style={{
                    color: BRAND,
                  }}>
                  {' Log in'}
                </Text>
              </Text>
            </View>
            <View style={{height: HEIGHT * 0.05}} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Fragment>
  );
};

export default SignUp;

/*

*/
