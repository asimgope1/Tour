import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { Fragment } from 'react'
import { BLACK, BRAND, WHITE } from '../../constants/color'
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config'
import { splashStyles } from '../Splash/SplashStyles'
import LinearGradient from 'react-native-linear-gradient'
import { EXTRABOLD } from '../../constants/fontfamily'
import { RFValue } from 'react-native-responsive-fontsize'
import { MENU, PLUS } from '../../constants/imagepath'

const Home = () => {
    return (
        <Fragment>
            <MyStatusBar backgroundColor={'#215be9'} barStyle={'light-content'} />
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

                        <LinearGradient
                            start={{ x: 0, y: 0 }} // Start gradient from the top
                            end={{ x: 0, y: 1 }}   // End gradient at the bottom
                            colors={['#215be9', '#215be9']} // Use more subtle gradient colors for better contrast
                            style={styles.headerContainer}
                        >
                            <View
                                style={{
                                    ...splashStyles.logoContainer,
                                    width: WIDTH * 0.9,
                                    height: HEIGHT * 0.08,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingBottom: 20,
                                }}

                            >
                                <View
                                    style={{
                                        height: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        flexDirection: 'row',
                                    }}
                                >


                                    <TouchableOpacity onPress={() => console.log('Hamburger menu pressed')}>
                                        {/* <Icon name="menu" type="material" color={WHITE} size={24} /> Adjust the color and size as needed */}
                                        <Image
                                            style={{
                                                width: 40,
                                                height: 40,
                                                resizeMode: 'contain',
                                                tintColor: WHITE
                                            }}
                                            source={MENU}
                                        />
                                    </TouchableOpacity>

                                    {/* Heading Text */}
                                    <Text style={{
                                        color: WHITE, // Adjust the color as per your design
                                        fontSize: RFValue(16), // Responsive font size
                                        fontFamily: EXTRABOLD, // Use your custom font
                                    }}>
                                        Inventory Management
                                    </Text>

                                    {/* Add Icon */}
                                    <TouchableOpacity onPress={() => console.log('Add pressed')}>
                                        {/* <Icon name="add" type="material" color={WHITE} size={24} /> Adjust the color and size as needed */}
                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: 'contain',
                                                tintColor: WHITE
                                            }}
                                            source={PLUS}
                                        />
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </LinearGradient>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    )
}

export default Home

const styles = {
    headerContainer: {
        width: '100%',
        paddingVertical: 20, // Increased padding for better spacing
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: BLACK, // Adding shadow for depth
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10, // For Android
        flexDirection: 'row'
    },
}