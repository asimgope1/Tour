import React, {Fragment, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {HEIGHT, MyStatusBar} from '../../constants/config';
import {BLACK, BRAND, GRAY, LIGHTGRAY, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import {Loader} from '../../components/Loader';
import Header from '../../components/Header';
import styles from './TermsStyles';
import {BOLD, MEDIUM} from '../../constants/fontfamily';
import {RFValue} from 'react-native-responsive-fontsize';
import CustomButton from '../../components/CustomButton';
import {CHECKMARK, CROSS, LOGO, TICK} from '../../constants/imagepath';
import Alertmodal from '../../components/Alertmodal/Alertmodal';

const Terms = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const handleAccept = () => {
    // Handle accept logic
    console.log('User accepted terms');
  };

  const handleDecline = () => {
    // Handle decline logic
    console.log('User declined terms');
    navigation.navigate('Login');
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
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              paddingBottom: 20, // Adjust padding bottom to ensure space for scrolling
            }}>
            <View style={{}}>
              <View
                style={{
                  width: '90%',
                }}>
                <Text
                  style={{
                    color: BLACK,
                    fontFamily: BOLD,
                    fontSize: RFValue(25),
                  }}>
                  Terms of Services
                </Text>
                <Text
                  style={{
                    color: '#C8C8C8',
                    fontFamily: MEDIUM,
                    fontSize: RFValue(18),
                  }}>
                  Last Updated on Jan 2024
                </Text>
              </View>
              <View style={{width: '90%'}}>
                <Text style={styles.heading}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                  Welcome to ZeroTfree! These Terms of Service ("Terms") govern
                  your access and use of our mobile application ("ZeroTfree
                  App"). By accessing or using the App, you agree to be bound by
                  these Terms.
                </Text>
                <Text style={styles.heading}>2. Data Collection and Use</Text>
                <Text style={{...styles.heading, fontSize: RFValue(16)}}>
                  A. Location Data:
                </Text>
                <Text style={styles.paragraph}>
                  ● We collect your location data.
                </Text>
                <Text style={styles.paragraph}>
                  ● We use your location data.
                </Text>
                <Text style={styles.paragraph}>
                  ● You can control or disable location tracking in the App
                  settings.
                </Text>
                <Text style={styles.paragraph}>
                  ● We collect your location data to be sure that you are not
                  from these countries : Afghanistan, Balkans, Belarus
                  Sanctions, Burma, Central African, Chinese Military, Cuba
                  Sanctions, Ethiopia, Hong Kong, Iran, Iraq, Lebanon, Libya,
                  Mali, Nicaragua, North Korea, Russian, Somalia, South Sudan,
                  Sudan and Darfur, Syria, Ukraine-/Russia, Venezuela, Yemen,
                  Zimbabwe.
                </Text>
                <Text style={{...styles.heading, fontSize: RFValue(16)}}>
                  B. IP Address:
                </Text>
                <Text style={styles.paragraph}>
                  ● We collect your IP address automatically.
                </Text>
                <Text style={styles.paragraph}>
                  ● We use your IP address for security purposes and analytics.
                </Text>
                <Text style={styles.paragraph}>
                  ● Your IP address may be linked to other user data.
                </Text>
                <Text style={styles.heading}>3. Data Security and Privacy</Text>
                <Text style={styles.paragraph}>
                  ● We take the protection of your data very seriously and
                  employ a multi-layered approach to ensure its security.
                </Text>
                <Text style={styles.paragraph}>
                  ● We retain your data for or until you delete it.
                </Text>
                <Text style={styles.paragraph}>
                  ● We may share your data with third-party service providers.
                </Text>
                <Text style={styles.paragraph}>
                  ● You can access, correct, or delete your data.
                </Text>
                <Text style={styles.heading}>4. Third-Party Services</Text>
                <Text style={styles.paragraph}>
                  ● We use third-party services.
                </Text>
                <Text style={styles.paragraph}>
                  ● We use third-party services that may collect [list specific
                  types of data, e.g., device identifiers, usage data, location
                  information]. Please note that their data collection and
                  privacy practices are governed by their own policies, which
                  you can access by clicking the links provided.
                </Text>
                <Text style={styles.heading}>5. Disclaimer and Warranties</Text>
                <Text style={styles.paragraph}>
                  ● We provide the App "as is" without warranties.
                </Text>
                <Text style={styles.paragraph}>
                  ● While we strive to create a safe and secure App, we cannot
                  guarantee that your use will be entirely free of risks or
                  errors. You acknowledge and agree that you use the App at your
                  own risk and that we are not liable for any direct, indirect,
                  incidental, consequential, or punitive damages arising from
                  your use of the App. This includes, but is not limited to,
                  damages for lost profits, data loss, personal injury, or
                  property damage.
                </Text>
                <Text style={styles.heading}>6. Intellectual Property</Text>
                <Text style={styles.paragraph}>
                  ● We own all intellectual property rights, including
                  copyrights, trademarks, patents, and trade secrets, associated
                  with the App and its content. This includes the App itself,
                  its design, code, graphics, user interface, and all other
                  materials within the App.
                </Text>
                <Text style={styles.paragraph}>
                  ● You may only use the App for its intended purpose, which is
                  to [clearly describe the app's core functionality and approved
                  uses]. Any other use of the App, including but not limited to
                  [list examples of prohibited activities], is strictly
                  prohibited..
                </Text>
                <Text style={styles.heading}>7. Termination</Text>
                <Text style={styles.paragraph}>
                  ● Respecting these Terms is essential for maintaining a safe
                  and enjoyable environment for all users. We take violations
                  seriously and may terminate your account without prior notice
                  if your actions negatively impact the community or violate the
                  core principles of the App. We encourage you to familiarize
                  yourself thoroughly with these Terms and contact us if you
                  have any questions.
                </Text>
                <Text style={styles.heading}>
                  8. Governing Law and Dispute Resolution
                </Text>
                <Text style={styles.paragraph}>
                  ● These Terms are governed by the laws of France.
                </Text>
                <Text style={styles.paragraph}>
                  ● Any disputes will be resolved.
                </Text>
                <Text style={styles.heading}>
                  9. Updates to Terms of Service
                </Text>
                <Text style={styles.paragraph}>
                  ● These Terms are governed by the laws of France.
                </Text>
                <Text style={styles.paragraph}>
                  ● We reserve the right to modify these Terms at any time, as
                  needed to comply with applicable laws and regulations,
                  introduce new features or functionalities, or improve the user
                  experience. We will endeavor to notify you of any significant
                  changes through in-app notifications, emails, or website
                  updates. It is your responsibility to periodically review
                  these Terms to stay informed of any changes. Your continued
                  use of the App following the posting of updated Terms
                  constitutes your acceptance of the changes.
                </Text>
                <Text style={styles.heading}>10. Contact Information</Text>
                <Text style={styles.paragraph}>
                  ● You can contact us at{' '}
                  <Text style={{color: BRAND}}>deploy310@gmail.com</Text>
                </Text>
              </View>
            </View>
            <View style={{height: HEIGHT * 0.2}} />
          </ScrollView>
          <View
            style={{
              width: '90%',
              backgroundColor: WHITE,
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
              height: HEIGHT * 0.15,
              alignSelf: 'center',
            }}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={{
                  ...styles.checkbox,
                  borderColor: isChecked ? BRAND : BLACK,
                }}>
                {isChecked && (
                  <Image
                    tintColor={BRAND}
                    resizeMode="contain"
                    style={{
                      width: '80%',
                      height: '80%',
                    }}
                    source={CHECKMARK}
                  />
                )}
              </TouchableOpacity>
              <Text
                onPress={() => {
                  setIsChecked(!isChecked);
                }}
                style={styles.checkboxLabel}>
                I have read the all terms and conditions
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleDecline}
                title={'Decline'}
                borderColor="#A6A4A4"
                backgroundColor={WHITE}
                textColor={BLACK}
                icon={CROSS}
                width="47%"
              />
              <CustomButton
                onPress={() => {
                  if (isChecked) {
                    navigation.navigate('Claim');
                  } else {
                    // Alert.alert('Please accept by clicking checkbox !');
                    setAlertMsg('Please accept by clicking checkbox !');
                    setAlertModal(true);
                  }
                }}
                icon={TICK}
                borderColor={BRAND}
                title={'Accept'}
                width="47%"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Fragment>
  );
};

export default Terms;

/*

 <Text style={styles.subHeading}>About</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non
            dui sagittis, consectetur libero non, sodales massa. Integer sed
            enim et odio sagittis elementum ut vitae nunc. Maecenas consequat,
            risus et facilisis tincidunt, justo purus ultricies enim, id posuere
            lectus lorem sit amet elit.
          </Text>
          <Text style={styles.heading}>Terms and Conditions</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non
            dui sagittis, consectetur libero non, sodales massa. Integer sed
            enim et odio sagittis elementum ut vitae nunc. Maecenas consequat,
            risus et facilisis tincidunt, justo purus ultricies enim, id posuere
            lectus lorem sit amet elit.
          </Text>
*/

/*
<View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={styles.checkbox}>
            {isChecked ? <Text>X</Text> : null}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I accept the terms and conditions
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button]} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={handleDecline}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>

*/
