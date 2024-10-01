import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { Fragment } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { EXTRABOLD, LIGHT } from '../../constants/fontfamily';
import { MyStatusBar } from '../../constants/config';
import { BRAND, WHITE, DARK_GRAY, LIGHT_GRAY, BLACK } from '../../constants/color';
import { splashStyles } from '../Splash/SplashStyles';
import LinearGradient from 'react-native-linear-gradient';
import { storeObjByKey } from '../../utils/Storage';
import { checkuserToken } from '../../redux/actions/auth';
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch()
  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
      <SafeAreaView style={splashStyles.maincontainer}>

        {/* KeyboardAvoidingView handles keyboard pop-up on input */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* ScrollView ensures scrollability on smaller screens */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Linear Gradient Header */}
            {/* Linear Gradient Header */}
            <LinearGradient
              start={{ x: 0, y: 0 }} // Start gradient from the top
              end={{ x: 0, y: 1 }}   // End gradient at the bottom
              colors={['#5C6BC0', BRAND]} // Use more subtle gradient colors for better contrast
              style={styles.headerContainer}
            >
              <View style={styles.headerContent}>
                <Text style={styles.headerText}>Welcome Back!</Text>
                <Text style={styles.subHeaderText}>Login to continue</Text>
              </View>
            </LinearGradient>


            {/* Content Section */}
            <View style={styles.contentContainer}>
              <View style={styles.loginBox}>
                <Text style={styles.titleText}>Login to your account</Text>
                {/* <TextInput
                  style={styles.inputField}
                  placeholder="Email"
                  placeholderTextColor={DARK_GRAY}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"
                  placeholderTextColor={DARK_GRAY}
                  secureTextEntry={true}
                /> */}

                <TouchableOpacity
                  onPress={() => {
                    const h = 1
                    storeObjByKey('loginResponse', h)
                    dispatch(checkuserToken(true))



                  }}
                  style={styles.loginButton}>
                  <LinearGradient
                    colors={['#4CAF50', '#81C784']} // Green gradient for the button
                    style={styles.loginButtonGradient}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.footerText}>Don't have an account? Sign Up</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = {
  headerContainer: {
    width: '100%',
    paddingVertical: 60, // Increased padding for better spacing
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: BLACK, // Adding shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10, // For Android
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: WHITE,
    fontSize: RFValue(28), // Slightly larger font
    fontFamily: EXTRABOLD,
    textAlign: 'center',
  },
  subHeaderText: {
    color: LIGHT_GRAY, // Subtle secondary text
    fontSize: RFValue(14),
    fontFamily: LIGHT,
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  loginBox: {
    backgroundColor: WHITE,
    width: '85%',
    borderRadius: 20,
    padding: 20,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  titleText: {
    fontSize: RFValue(20),
    fontFamily: EXTRABOLD,
    color: BRAND,
    marginBottom: 20,
  },
  inputField: {
    width: '100%',
    borderWidth: 1,
    borderColor: LIGHT_GRAY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: RFValue(14),
    color: DARK_GRAY,
    fontFamily: LIGHT,
  },
  loginButton: {
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonGradient: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonText: {
    color: WHITE,
    fontSize: RFValue(16),
    fontFamily: EXTRABOLD,
  },
  footerText: {
    marginTop: 20,
    fontSize: RFValue(14),
    fontFamily: LIGHT,
    color: DARK_GRAY,
  },
};

export default Login;
