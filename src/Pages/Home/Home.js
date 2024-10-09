import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Animated,
    Alert,
    Modal,
    TextInput,
    RefreshControl,
} from 'react-native';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { BLACK, GRAY, WHITE } from '../../constants/color';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { splashStyles } from '../Splash/SplashStyles';
import LinearGradient from 'react-native-linear-gradient';
import { BOLD, EXTRABOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../../components/Header';
import { getObjByKey, storeObjByKey } from '../../utils/Storage';
import { BASE_URL } from '../../constants/url';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Loader } from '../../components/Loader';

const Home = ({ navigation }) => {
    const [Dashboard, setDashBoard] = useState({
        TotalAssigned: 0,
        Pending: 0,
        Completed: 0,
        BookDetails: [],
    });
    const todayDate = moment().format('YYYY-MM-DD');
    const [selectedDate, setSelectedDate] = useState(
        moment().format('YYYY-MM-DD'),
    );
    const flatListRef = useRef(null); // Ref to control FlatList for auto-scroll
    const [token, setToken] = useState();
    const [showModal, setShowModal] = useState(false);
    const [confirmModal, setconfirmModal] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);
    const [selected, setSelected] = useState({});
    const [startkm, setStartkm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [latitude, Setlatitude] = useState();
    const [longitude, Setlongitude] = useState();
    const [type, SetType] = useState('');
    const [loader, setLoader] = useState(false);
    const [adminData, setAdminData] = useState();

    const handleOtpChange = (text, index) => {
        // Handle OTP change in each box
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Automatically move to next input box if a digit is entered
        if (text.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus(); // Safely access the next ref
        }
    };

    // Handle backspace to move to the previous input box
    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus(); // Safely access the previous ref
        }
    };
    useEffect(() => {
        RetrieveDetails();
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        setLoader(true);
        Geolocation.getCurrentPosition(
            position => {
                setLoader(false);
                const { latitude, longitude } = position.coords;
                // console.log('Latitude:', latitude);
                // console.log('Longitude:', longitude);
                Setlatitude(latitude);
                Setlongitude(longitude);

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


    const RetrieveDetails = async () => {
        setLoader(true);

        setTimeout(() => {
            // Update your data source
            setLoader(true);
            GetType();
            setLoader(false);
        }, 500);

        try {
            const loginResponse = await getObjByKey('loginResponse');
            setLoader(false);
            console.log('tokennnnnn', loginResponse.token);
            GetDashBoard(loginResponse.token, todayDate);
            setToken(loginResponse.token);
            GetAdminData(loginResponse.token);
        } catch {
            console.log('Error retrieving loginResponse');
        }
    };

    const onRefresh = useCallback(() => {
        setLoader(true);
        setRefreshing(true);
        // Fetch your data here
        RetrieveDetails();
        setLoader(false);
        // Simulating data fetch with setTimeout
        setTimeout(() => {
            // Update your data source
            setRefreshing(false);
            const todayIndex = calendarDates.indexOf(moment().format('YYYY-MM-DD'));

            if (flatListRef.current && todayIndex !== -1) {
                flatListRef.current.scrollToIndex({ index: todayIndex, animated: true });
            }
        }, 2000);
    }, []);
    useEffect(() => {
        // console.log('token', token)
        if (token) {
            GetDashBoard(token);
        }
    }, [selectedDate]);

    const GetDashBoard = (token, date) => {
        console.log('selecteddtate', selectedDate)
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            if (date) {
                fetch(
                    `${BASE_URL}api/userdashbaorddate/?fromdate=${date}`,
                    requestOptions,
                )
                    .then(response => response.json())
                    .then(result => {
                        console.log('Dashboard Data: ', result);
                        setDashBoard(result);
                    })
                    .catch(error => console.error(error));
            }
            else {

                fetch(
                    `${BASE_URL}api/userdashbaorddate/?fromdate=${selectedDate}`,
                    requestOptions,
                )
                    .then(response => response.json())
                    .then(result => {
                        console.log('Dashboard Data: ', result);
                        setDashBoard(result);
                    })
                    .catch(error => console.error(error));
            }


        } catch (error) {
            console.log('Dashboard Fetch Error: ', error);
        }
    };

    // Generate the next 30 days' dates for the calendar
    const calendarDates = Array.from({ length: 32 }, (_, index) => {
        return moment().subtract(2, 'days').add(index, 'days').format('YYYY-MM-DD');
    });

    const [isListReady, setIsListReady] = useState(false); // Track if list is ready for scrolling

    useEffect(() => {
        const todayIndex = calendarDates.indexOf(moment().format('YYYY-MM-DD'));

        if (isListReady && flatListRef.current && todayIndex !== -1) {
            // Ensure the list has been laid out before scrolling
            flatListRef.current.scrollToIndex({ index: todayIndex, animated: true });
        }
    }, [isListReady, calendarDates, selectedDate]);

    // Render each date in the horizontal calendar
    const renderDateItem = ({ item }) => {
        const isSelected = item === selectedDate;

        return (
            <TouchableOpacity
                style={[styles.dateItem, isSelected && styles.selectedDateItem]}
                onPress={() => {
                    setSelectedDate(item);
                }}>
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                    {moment(item).format('DD')}
                </Text>
                <Text
                    style={[styles.monthText, isSelected && styles.selectedMonthText]}>
                    {moment(item).format('MMM')}
                </Text>
            </TouchableOpacity>
        );
    };

    // Blink animation for the status indicator
    const blinkAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
        // GetType()
    }, [blinkAnim]);
    // Function to render each item in the FlatList
    const GetType = async () => {
        const Type = await getObjByKey('userDetails');
        console.log('type', Type.data_value[0].UserType);
        SetType(Type?.data_value[0]?.UserType);
    };

    const handleVerify = () => {
        // console.log('OTP', selected)
        handleStart(selected.BookSl, selected.type);
        setShowModal(false);
    };

    const handleStart = (id, type) => {
        // console.log('id', id, type)
        const OTP = otp.join('');

        if (type === 'Tour')
            try {
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const raw = JSON.stringify({
                    address: '',
                    longitude: longitude,
                    latitude: latitude,
                    OTP: OTP,
                });

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };

                fetch(`${BASE_URL}api/starttour/${id}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log('handleStart', result)
                        if (result.Code) {
                            Alert.alert('Success', result.msg);
                            // call the dashboard
                            GetDashBoard(token);
                        }
                    })
                    .catch(error => console.error(error));
            } catch {
                console.log('Error starting tour');
            }
        else if (type === 'Travels') {
            try {
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const raw = JSON.stringify({
                    address: '',
                    longitude: longitude,
                    latitude: latitude,
                    OTP: OTP,
                    startkm: startkm,
                });
                // console.log('travelraw', raw

                // )

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };

                fetch(`${BASE_URL}api/starttravel/${id}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log('handleStart', result)
                        if (result.Code) {
                            Alert.alert('Success', result.msg);
                            //clear the otp and strat km
                            setStartkm('');
                            setOtp(['', '', '', '']);
                            setShowModal(false);

                            // call the dashboard
                            GetDashBoard(token);
                        }
                    })
                    .catch(error => console.error(error));
            } catch {
                console.log('Error starting tour');
            }
        }
    };
    const handleStop = (id, type) => {
        // console.log('id', id)
        const OTP = otp.join('');

        if (type === 'Tour')
            try {
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const raw = JSON.stringify({
                    address: '',
                    longitude: longitude,
                    latitude: latitude,
                    OTP: OTP,
                });

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };

                fetch(`${BASE_URL}api/stoptour/${id}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log('handleStart', result)
                        if (result.Code) {
                            Alert.alert('Success', result.msg);
                            // call the dashboard
                            GetDashBoard(token);
                        }
                    })
                    .catch(error => console.error(error));
            } catch {
                console.log('Error starting tour');
            }
        else if (type === 'Travels') {
            try {
                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', `Bearer ${token}`);

                const raw = JSON.stringify({
                    address: '',
                    longitude: longitude,
                    latitude: latitude,
                    endkm: '1802',
                });

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                };

                fetch(`${BASE_URL}api/stoptravel/${id}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log('handleStart', result)
                        if (result.Code) {
                            Alert.alert('Success', result.msg);
                            // call the dashboard
                            GetDashBoard(token);
                        }
                    })
                    .catch(error => console.error(error));
            } catch {
                console.log('Error starting tour');
            }
        }
    };

    const confirm = () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const raw = JSON.stringify({
                "BookDate": "2024-09-30 15:53",
                "Adults": "3",
                "Child": "2",
                "PickupPoints": "Jaganath Mandir",
                "CustumerName": "Saswat Panda",
                "MobileNo": "8093957601",
                "TourSl": "1",
                "status": "Confirmed",
                "amount": "3500",
                "paid": "1000"
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("https://protimes.co.in/shreedham/api/confirmtourbooking/2", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));

        }
        catch {
            console.log('Error starting tour');
        }
    }

    const Data = [

        {
            name: 'Next Tour',
            icon: 'car',
            color: '#009e36',
        },
        {
            name: 'Next Travel',
            icon: 'car',
            color: '#ffce00',
        },
        {
            name: 'Todays Tour',
            icon: 'car',
            color: '#f31a5f',
        },
        {
            name: 'Todays Travel',
            icon: 'car',
            color: '#4d07fb',
        },
    ];

    const renderItem = ({ item }) => {
        let borderColor, blinkColor;

        // Set border and blink color based on the BookStatus
        switch (item.BookStatus) {
            case 'Assigned':
                borderColor = 'green';
                blinkColor = 'green';
                break;
            // Add more status checks if needed
            default:
                borderColor = 'gray';
                blinkColor = 'gray';
        }

        // Check if there is data in Dashboard.BookDetails
        if (Dashboard.BookDetails.length === 0) {
            return (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No Data Available</Text>
                </View>
            );
        }

        // Render the card for each item when there is data
        return (
            <View style={[styles.card, { borderLeftColor: borderColor }]}>
                <View>
                    <Text style={styles.cardTitle}>{item.TourName}</Text>
                    <Text style={styles.cardSubtitle}>Customer: {item.CustumerName}</Text>
                    <Text style={styles.cardSubtitle}>Pickup: {item.PickupPoints}</Text>
                    <Text style={styles.cardSubtitle}>MobileNo: {item.MobileNo}</Text>

                    {/* Conditionally render the "Start" button at the bottom if the status is 'Assigned' */}
                    {item.BookStatus === 'Assigned' && type !== 'A' && (
                        <TouchableOpacity
                            style={{
                                ...styles.startButton,
                                backgroundColor: todayDate === selectedDate ? 'green' : 'grey',
                            }}
                            disabled={todayDate !== selectedDate}
                            onPress={() => {
                                setShowModal(true);
                                setSelected(item);
                            }}
                        >
                            <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                    )}

                    {item.BookStatus === 'Started' && type !== 'A' && (
                        <TouchableOpacity
                            style={{
                                ...styles.stopButton,
                                backgroundColor: todayDate === selectedDate ? 'red' : 'grey',
                            }}
                            onPress={() => handleStop(item.BookSl, item.type)}
                        >
                            <Text style={styles.startButtonText}>Stop</Text>
                        </TouchableOpacity>
                    )}

                    {type === 'A' && (
                        <TouchableOpacity
                            style={{
                                ...styles.stopButton,
                                backgroundColor: todayDate === selectedDate ? 'green' : 'grey',
                            }}
                            onPress={() => setconfirmModal(true)}
                        >
                            <Text style={styles.startButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statusContainer}>
                    <Text style={styles.cardStatus}>{item.BookStatus}</Text>
                    <Animated.View
                        style={[
                            styles.blinkingCircle,
                            { opacity: blinkAnim, backgroundColor: blinkColor },
                        ]}
                    />
                </View>
            </View>
        );
    };


    const GetAdminData = token => {
        setLoader(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            fetch(`${BASE_URL}api/userdashbaord`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // setLoader(false)
                    console.log('GetAdminData', result);
                    setAdminData(result);
                })
                .catch(error => console.error(error));
        } catch {
            console.log('Error fetching data');
        }
    };

    return (
        <Fragment>
            <MyStatusBar backgroundColor={'#215be9'} barStyle={'light-content'} />
            <SafeAreaView style={splashStyles.maincontainer}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={false}>
                        <View>
                            <Header
                                title="Trip Management"
                                onMenuPress={() => navigation.toggleDrawer()}
                            />

                            {/* Floating Banner Card */}
                            {type !== 'A' ? (
                                <View style={styles.bannerContainer}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['white', 'white']}
                                        style={styles.bannerCard}>
                                        <View style={styles.bannerContent}>
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>Total</Text>
                                                <Text style={styles.sectionData}>
                                                    {Dashboard.TotalAssigned}
                                                </Text>
                                            </View>
                                            <View style={styles.separator} />
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>Pending</Text>
                                                <Text style={styles.sectionData}>
                                                    {Dashboard.Pending}
                                                </Text>
                                            </View>
                                            <View style={styles.separator} />
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>Completed</Text>
                                                <Text style={styles.sectionData}>
                                                    {Dashboard.Completed}
                                                </Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.bannerContainer1}>
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['white', 'white']}
                                            style={styles.bannerCard1}>
                                            <View
                                                style={{
                                                    height: '50%',
                                                    width: '100%',
                                                    alignSelf: 'center',

                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                }}>
                                                <View
                                                    style={{
                                                        height: '100%',
                                                        width: '65%',
                                                        justifyContent: 'center',
                                                        alignItems: 'flex-start',
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: RFValue(12),
                                                            fontFamily: REGULAR,
                                                            color: 'white',
                                                            // textAlign: 'left',
                                                            color: GRAY,
                                                        }}>
                                                        This Month
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: RFValue(25),
                                                            fontFamily: SEMIBOLD,
                                                            color: 'white',
                                                            textAlign: 'left',
                                                            marginRight: 35,
                                                            color: BLACK,
                                                        }}>
                                                        ₹ {adminData?.amount}.00
                                                    </Text>
                                                </View>


                                                <TouchableOpacity
                                                    style={{
                                                        marginLeft: 25,
                                                        height: 50,
                                                        width: 55,
                                                        elevation: 4,
                                                        backgroundColor: 'white',
                                                        alignSelf: 'center',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: 4,
                                                    }}>
                                                    <Icon
                                                        name="plus" // Example icon name (replace with your desired icon)
                                                        size={35} // Adjust the size as needed
                                                        color={BLACK} // Adjust the color as needed
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    borderTopWidth: 1, // Top separator line
                                                    borderBottomWidth: 1, // Bottom separator line
                                                    borderColor: '#ddd', // Light gray color for the separator lines
                                                    margin: 5,
                                                }}>
                                                {/* Your item content goes here */}
                                            </View>

                                            <View
                                                style={{
                                                    height: '50%',
                                                    width: '100%',

                                                    alignSelf: 'center',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <FlatList
                                                    data={Data}
                                                    horizontal
                                                    renderItem={({ item }) => (
                                                        <View>
                                                            {/* Container to add separation lines above and below */}
                                                            <View
                                                                style={{
                                                                    marginTop: 5,
                                                                }}>
                                                                <TouchableOpacity
                                                                    style={{
                                                                        width: WIDTH * 0.15,
                                                                        height: HEIGHT * 0.07,
                                                                        backgroundColor: item.color,
                                                                        marginHorizontal: 10,
                                                                        borderRadius: 10,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        marginBottom: 10,
                                                                        padding: 10,
                                                                        elevation: 10,
                                                                    }}>
                                                                    <Text
                                                                        style={{
                                                                            fontFamily: EXTRABOLD,
                                                                            fontSize: RFValue(22),
                                                                            color: WHITE,
                                                                            textAlign: 'center',
                                                                        }}>
                                                                        {item.name === 'Todays Tour'
                                                                            ? adminData?.todaystour
                                                                            : item.name === 'Todays Travel'
                                                                                ? adminData?.todaystravel
                                                                                : item.name === 'Next Tour'
                                                                                    ? adminData?.totaltournew
                                                                                    : item.name === 'Next Travel'
                                                                                        ? adminData?.totaltravelnew
                                                                                        : ''}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                <Text
                                                                    style={{
                                                                        fontFamily: REGULAR,
                                                                        fontSize: RFValue(9.5),
                                                                        color: BLACK,
                                                                        textAlign: 'center',
                                                                    }}>
                                                                    {item.name}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                />
                                            </View>
                                        </LinearGradient>
                                    </View>
                                </>
                            )}
                            {/* Elevated Calendar and Trip List */}
                            <View style={styles.mainContent}>
                                {/* <View style={styles.calendarContainer}> */}
                                <FlatList
                                    ref={flatListRef} // Ref for auto-scroll
                                    data={calendarDates}
                                    renderItem={renderDateItem}
                                    keyExtractor={item => item}
                                    horizontal={true}
                                    contentContainerStyle={styles.calendarList}
                                    showsHorizontalScrollIndicator={false}
                                />
                                {/* </View> */}
                                <View
                                    style={{
                                        height: HEIGHT * 0.6,
                                        marginBottom: 20, // Add bottom m
                                        borderRadius: 10, // Add rounded corners for the elevated look
                                    }}>
                                    <FlatList
                                        data={Dashboard.BookDetails} // Use the real data from Dashboard
                                        renderItem={renderItem}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                                colors={['#215be9']} // Customize color
                                            />
                                        }
                                        removeClippedSubviews={false} // Disable to prevent flickering
                                        initialNumToRender={10} // Start rendering only 10 items
                                        windowSize={5} // Optimize the rendering window
                                        ListFooterComponent={
                                            <View
                                                style={{
                                                    height: type === 'A' ? HEIGHT * 0.18 : 25,
                                                    width: '100%',
                                                    backgroundColor: '#f2f2f2',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    paddingHorizontal: 20,
                                                }}
                                            />
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent={false}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>OTP Verification</Text>
                        <Text style={styles.modalSubtitle}>
                            Please enter the OTP sent to your mobile number
                        </Text>

                        {/* 4 OTP Input Boxes */}
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs[index]}
                                    style={styles.otpBox}
                                    maxLength={1}
                                    keyboardType="numeric"
                                    value={digit}
                                    onChangeText={text => handleOtpChange(text, index)}
                                    onKeyPress={e => handleKeyPress(e, index)}
                                />
                            ))}
                        </View>
                        {selected.type === 'Travels' ? (
                            <>
                                <Text style={styles.modalSubtitle}>Start KM </Text>
                                <TextInput
                                    style={{
                                        height: 50,
                                        borderColor: 'gray',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        marginBottom: 10,
                                        fontSize: 18,
                                        color: 'black',
                                        width: WIDTH * 0.7,
                                        textAlign: 'center',
                                    }}
                                    keyboardType="numeric"
                                    value={startkm}
                                    onChangeText={text => setStartkm(text)}
                                />
                            </>
                        ) : (
                            <></>
                        )}

                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={handleVerify}>
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={false}
                visible={confirmModal}
                onRequestClose={() => setconfirmModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Details</Text>





                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={confirm()}>
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Loader visible={loader} />
        </Fragment>
    );
};

export default Home;

const styles = StyleSheet.create({
    calendarContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 20, // Add top margin to elevate the calendar
        marginBottom: 20, // Add bottom margin
        backgroundColor: 'white',
        borderRadius: 10, // Add rounded corners for the elevated look
        elevation: 5, // Add shadow for elevation
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
    },
    calendarList: {
        flexDirection: 'row',
    },
    dateItem: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        elevation: 4,
        margin: 10,
    },
    selectedDateItem: {
        backgroundColor: '#215be9',
    },
    dateText: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Poppins-Regular',
    },
    selectedDateText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
    },
    monthText: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Poppins-Regular',
    },
    selectedMonthText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
    },
    bannerContainer: {
        marginTop: -25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerContainer1: {
        marginTop: 70,
        alignItems: 'center',
        justifyContent: 'center',
        height: HEIGHT * 0.1,
        marginBottom: 80,
    },
    bannerCard: {
        width: WIDTH * 0.9,
        height: HEIGHT * 0.12,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        elevation: 5,
    },
    bannerCard1: {
        width: WIDTH * 0.9,
        height: HEIGHT * 0.3,
        borderRadius: 10,
        backgroundColor: 'white',
        // paddingHorizontal: 20,
        // paddingVertical: 15,
        elevation: 5,
        padding: 20,
    },
    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontFamily: EXTRABOLD,
        fontSize: RFValue(12),
        color: BLACK,
    },
    sectionData: {
        fontFamily: EXTRABOLD,
        fontSize: RFValue(16),
        color: BLACK,
    },
    separator: {
        width: 1,
        height: 40,
        backgroundColor: 'lightgray',
    },
    mainContent: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        borderRadius: 10,
        borderLeftWidth: 5,
        backgroundColor: WHITE,
        elevation: 5,
    },
    cardTitle: {
        fontSize: RFValue(16),
        color: BLACK,
        fontFamily: EXTRABOLD,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardStatus: {
        fontSize: RFValue(12),
        color: BLACK,
        fontFamily: 'Poppins-Medium',
        marginRight: 10,
    },
    blinkingCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    listContainer: {
        paddingBottom: 30,
    },
    cardSubtitle: {
        fontSize: RFValue(14),
        color: 'gray',
        fontFamily: 'Poppins-Regular',
    },
    startButton: {
        marginTop: 10, // Adds space between the status and the button
        padding: 10,

        borderRadius: 5,
        alignItems: 'center',
    },
    stopButton: {
        marginTop: 10, // Adds space between the status and the button
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        width: WIDTH * 0.8,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: RFValue(18),
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: EXTRABOLD,
        color: BLACK,
    },
    modalSubtitle: {
        fontSize: RFValue(14),
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        color: BLACK,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpBox: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: 50,
        height: 50,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
        color: BLACK,
    },
    verifyButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'red'
    },
    noDataText: {
        fontSize: 18,
        color: 'black',
    },
});
