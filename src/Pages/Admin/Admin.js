import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  BackHandler,
} from 'react-native';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BLACK, BRAND, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import Header from '../../components/Header';
import {Loader} from '../../components/Loader';
import {loginStyles} from '../Login/LoginStyles';
import {BOLD, REGULAR} from '../../constants/fontfamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {CustomTextInput} from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import {adminStyles} from './AdminStyles';
import {DELETE} from '../../constants/imagepath';
import {BASE_URL} from '../../constants/url';
import {POSTNETWORK} from '../../utils/Network';
import Alertmodal from '../../components/Alertmodal/Alertmodal';
import {clearAll} from '../../utils/Storage';
import Exitmodal from '../../components/Exitmodal';
import {useFocusEffect} from '@react-navigation/native';

const Admin = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailMessages, setEmailMessages] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [exitModal, setExitModal] = useState(false);

  useFocusEffect(() => {
    const backAction = () => {
      setExitModal(true);
      setAlertMsg('Are you sure you want to Exit app?');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  const skipCallback = () => {
    setLoader(true);
    clearAll().then(() => {
      setTimeout(() => {
        navigation.navigate('Login');
        setLoader(false);
      }, 1000);
    });
  };

  const handleAdd = () => {
    if (email && message) {
      setEmailMessages(prevState => [
        ...prevState,
        {email: email, message: message},
      ]);
      setEmail('');
      setMessage('');
    }
  };

  const handleDelete = index => {
    setEmailMessages(prevState =>
      prevState.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const saveEmailMessages = () => {
    console.log(emailMessages);
    const url = `${BASE_URL}user-message/`;
    const obj = {
      messages: emailMessages,
    };
    setLoader(true);
    console.log(obj);
    POSTNETWORK(url, obj)
      .then(res => {
        console.log('result', res);
        if (res.code === 201) {
          setAlertMsg('Your messages saved successfully with emails!!');
          setAlertModal(true);
          setEmailMessages([]);
        } else {
          setAlertMsg(res?.msg);
          setAlertModal(true);
        }
      })
      .catch(err => {
        alert('Something went wrong!');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <MyStatusBar backgroundColor={WHITE} barStyle={'dark-content'} />
      <SafeAreaView style={appStyles.safeareacontainer}>
        <Loader visible={loader} />
        <Alertmodal
          title={alertMsg}
          visible={alertModal}
          onBackpress={setAlertModal}
        />
        <Exitmodal
          title={alertMsg}
          visible={exitModal}
          onBackpress={setExitModal}
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
              logoutShown={true}
              adminShown={true}
              skipCallback={skipCallback}
            />
          </View>
          <ScrollView
            scrollEnabled={true}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              paddingBottom: 20, // Adjust padding bottom to ensure space for scrolling
            }}>
            <View style={{...loginStyles.loginheader, marginTop: 0}}>
              <Text
                style={{
                  ...loginStyles.msgtext,
                  marginBottom: HEIGHT * 0.01,
                }}>
                Welcome Admin! Add Emails !!
              </Text>
            </View>
            <View style={loginStyles.credentialView}>
              <CustomTextInput
                title="Email"
                placeholder="Enter email!"
                width={'90%'}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={loginStyles.credentialView}>
              <CustomTextInput
                textAlignVertical="top"
                title="Message"
                numberOfLines={3}
                placeholder="Enter message!"
                width={'90%'}
                value={message}
                height={HEIGHT * 0.1}
                onChangeText={setMessage}
              />
            </View>
            <View
              style={{
                height: HEIGHT * 0.06,
                width: '90%',
                marginTop: HEIGHT * 0.01,
              }}>
              <TouchableOpacity
                style={adminStyles.addBtnContainer}
                onPress={handleAdd}>
                <Text style={adminStyles.addText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={emailMessages}
              ListHeaderComponent={() => {
                return (
                  emailMessages.length > 0 && (
                    <View
                      style={{
                        width: WIDTH * 0.9,
                        marginBottom: HEIGHT * 0.01,
                      }}>
                      <Text
                        style={{
                          color: BLACK,
                          fontFamily: BOLD,
                          fontWeight: 'bold',
                          fontSize: RFValue(14),
                        }}>
                        Hit submit to save !!
                      </Text>
                    </View>
                  )
                );
              }}
              ListFooterComponent={() => {
                return (
                  emailMessages.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        saveEmailMessages();
                      }}
                      style={{
                        height: 47,
                        borderRadius: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        alignSelf: 'center',
                        width: WIDTH * 0.9,
                        borderRadius: 6,
                        backgroundColor: BRAND,
                        // borderWidth: 1,
                        marginTop: HEIGHT * 0.002,
                      }}>
                      <Text
                        style={{
                          color: WHITE,
                          fontFamily: BOLD,
                          fontSize: RFValue(14),
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  )
                );
              }}
              renderItem={({item, index}) => (
                <View style={adminStyles.itemContainer}>
                  <View style={{width: '80%', padding: '2%'}}>
                    <Text
                      style={{
                        color: BLACK,
                        fontFamily: REGULAR,
                        fontSize: RFValue(12),
                      }}>
                      Email:{' '}
                      <Text
                        style={{
                          color: '#6FA0FF',
                          fontFamily: BOLD,
                          fontWeight: 'bold',
                        }}>
                        {item.email}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        color: BLACK,
                        fontFamily: REGULAR,
                        fontSize: RFValue(12),
                      }}>
                      Message:{' '}
                      <Text
                        style={{
                          color: '#6FA0FF',
                          fontFamily: BOLD,
                          fontWeight: 'bold',
                        }}>
                        {item.message}
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(index)}
                    style={adminStyles.deleteBtn}>
                    <Image
                      resizeMode="contain"
                      style={{width: WIDTH * 0.13, height: HEIGHT * 0.04}}
                      source={DELETE}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{height: HEIGHT * 0.05}} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Admin;
