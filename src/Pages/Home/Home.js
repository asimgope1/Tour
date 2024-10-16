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
import { clearAll, getObjByKey, storeObjByKey } from '../../utils/Storage';
import { BASE_URL } from '../../constants/url';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Loader } from '../../components/Loader';
import { useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { checkuserToken } from '../../redux/actions/auth';
import Add from './Add';

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
    const dispatch = useDispatch();
    const [confirmItem, setConfirmItem] = useState({});
    const [bookDate, setBookDate] = useState(moment(fromDate).format('YYYY/MM/DD HH:mm'));
    const [adults, setAdults] = useState('');
    const [child, setChild] = useState('');
    const [pickupPoints, setPickupPoints] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [tourSl, setTourSl] = useState('1');
    const [status, setStatus] = useState('Confirmed');
    const [amount, setAmount] = useState('0');
    const [paid, setPaid] = useState('0');
    const [Sl, setSl] = useState('');
    const [Tour, setTour] = useState(null);
    const [TourOpen, setTourOpen] = useState(false);
    const [Tours, setTours] = useState([

    ]);
    const [vehicleGroupOpen, setVehicleGroupOpen] = useState(false);
    const [vehicleGroup, setVehicleGroup] = useState(null);
    const [VehicleGroups, setVehicleGroups] = useState([]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [fromDate, setFromDate] = useState(new Date()); // Initialize as Date object
    const [time, setTime] = useState(new Date());

    const [addModal, setAddModal] = useState(false); // State to control modal visibility

    const handleOpenModal = () => {
        setAddModal(true); // Open the modal
    };
    const [vehicleGroupSl, setVehicleGroupSl] = useState()


    const GetTourPackage = async (token) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            await fetch(`${BASE_URL}api/tourlist`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // Log the result to verify response
                    // console.log('tourlist', result);

                    // Map the result to populate dropdown items
                    const toursData = result?.data_value?.map((tour) => ({
                        label: tour?.TourName,   // Label to show in the dropdown
                        value: tour?.TourSl,     // Value to use when selected
                    }));

                    // Set the transformed data into the Tours state
                    setTours(toursData);
                })
                .catch((error) => console.error('Error fetching tour list:', error));
        } catch (error) {
            console.error('Error:', error);
        }
    };



    useEffect(() => {
        if (confirmItem) {
            // Set common fields
            setBookDate(moment(fromDate).format('YYYY/MM/DD' + ' ' + moment(time).format('HH:mm:ss')));
            setAdults(confirmItem.Adults || 0); // Default to 0 if not provided
            setChild(confirmItem.Child || 0);
            setPickupPoints(confirmItem.PickupPoints || '');
            setCustomerName(confirmItem.CustumerName || '');
            setMobileNo(confirmItem.MobileNo || '');
            setSl(confirmItem.BookSl || '');
            setStatus('Confirmed');
            setAmount(confirmItem.amount || '0'); // Default to '3500' if not provided
            setPaid(confirmItem.paid || '0'); // Default to '1000' if not provided

            // Conditionally set additional fields based on type
            if (confirmItem.type === "Travels") {
                console.log('confirmItem.Travels:', confirmItem.TourName);

                // Check if the TourName exists in the VehicleGroups dropdown
                const matchingVehicleGroup = VehicleGroups.find(
                    (item) => item.label === confirmItem.TourName
                );

                if (matchingVehicleGroup) {
                    setVehicleGroup(matchingVehicleGroup.value); // Set the value if it matches
                } else {
                    setVehicleGroup(''); // If no match is found, set an empty value
                }
            } else if (confirmItem.type === "Tour") {
                // Check if the TourSl exists in the Tours dropdown
                const matchingTour = Tours.find((item) => item.value === confirmItem.TourSl);

                if (matchingTour) {
                    setTour(matchingTour.value); // Set the value if it matches
                    setTourSl(matchingTour.value);
                } else {
                    setTour(''); // If no match is found, set an empty value
                    setTourSl('');
                }
            }
            // Fetch additional data
            if (token) {

                GetTourPackage(token);
                fetchVehicleList(token)
            }
        }
    }, [confirmItem]);

    const fetchVehicleList = async (token) => {
        // console.log('hiiihere')
        try {
            const response = await fetch(`${BASE_URL}api/vehiclegrouplist`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            const text = await response.text()
            // console.log('Raw response:', text);

            const result = JSON.parse(text);
            // console.log('Parsed result:', result);

            if (result.status === "success") {
                const fetchedVehicles = result?.data_value?.map(vehicle => ({
                    label: vehicle.VehicleGroupName,
                    value: vehicle.VehicleGroupSl.toString(),
                }));
                setVehicleGroups(fetchedVehicles);
            } else {
                console.error('Failed to fetch vehicle list:', result.msg);
            }
        } catch (error) {
            console.error('Error fetching vehicle list:', error);
        }
    };



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
                setLoader(false)
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
            // console.log('tokennnnnn', loginResponse.token);
            if (loginResponse?.token) {
                await GetDashBoard(loginResponse?.token, todayDate);
                await GetAdminData(loginResponse?.token);
                await fetchVehicleList(loginResponse?.token)
                await GetTourPackage(loginResponse?.token)
                setToken(loginResponse?.token);
            }
        } catch {
            clearAll();
            dispatch(checkuserToken(false));
            console.log('Error retrieving loginResponse');
        }
    };


    useEffect(() => {
        // console.log('hiii')
        if (token) {

            setTimeout(() => {
                GetDashBoard(token);
                fetchVehicleList(token)
                GetTourPackage(token)
            }, 2000)

        }
    }, [token])



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

    const GetDashBoard = async (token, date) => {
        setLoader(true)
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            if (date) {
                await fetch(
                    `${BASE_URL}api/userdashbaorddate/?fromdate=${date}`,
                    requestOptions,
                )
                    .then(response => response.json())
                    .then(result => {
                        setLoader(false)
                        if (result.status === "success") {

                            // console.log('Dashboard Data: ', result);
                            setDashBoard(result);
                        }
                    })
                    .catch(error => {
                        clearAll();
                        dispatch(checkuserToken(false));
                        console.error(error)
                    });
            }
            else {

                await fetch(
                    `${BASE_URL}api/userdashbaorddate/?fromdate=${selectedDate}`,
                    requestOptions,
                )
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === 'success') {

                            setLoader(false)
                            // console.log('Dashboard Data: ', result);
                            setDashBoard(result);
                        }
                    })
                    .catch(error => {

                        // clearAll();
                        // dispatch(checkuserToken(false));
                        console.error(error)
                    });
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
        SetType(Type?.data_value[0]?.UserType);
    };

    const handleVerify = () => {
        // console.log('OTP', selected)
        handleStart(selected.BookSl, selected.type);
        setShowModal(false);
    };

    const handleStart = (id, type) => {
        // console.log('id', id, type)
        setLoader(true)
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
                        setLoader(false)
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
            setLoader(true)
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
                        setLoader(false)
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
        setLoader(true)

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
                        setLoader(false)
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
            setLoader(true)
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
                        setLoader(false)
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
        console.log('book', Sl)
        setLoader(true)
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            // Prepare the request body
            const raw = JSON.stringify({
                "BookDate": bookDate,
                "Adults": adults,
                "Child": child,
                "PickupPoints": pickupPoints,
                "CustumerName": customerName,
                "MobileNo": mobileNo,
                "status": status,
                "amount": amount,
                "paid": paid,
                ...(confirmItem.type === "Travels" ? { "VehicleGroupSl": vehicleGroup } : { "TourSl": tourSl }) // Conditionally add fields
            });


            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            // Determine the API endpoint based on the type
            const apiUrl = confirmItem.type === "Travels"
                ? `${BASE_URL}api/confirmtravelbooking/${Sl}`
                : `${BASE_URL}api/confirmtourbooking/${Sl}`;

            // Call the appropriate API
            fetch(apiUrl, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setLoader(false)
                    // console.log('confirmBooking', result);
                    alert(result.msg)
                    setconfirmModal(false);
                    GetDashBoard(token);
                    // clear all
                    setTour(null);
                    setVehicleGroup(null);
                    setTourSl(null);
                    setVehicleGroupSl(null);
                    setPickupPoints('');
                    setCustomerName('');
                    setMobileNo('');
                    setAmount('0');
                    setPaid('0');
                    setSl('');
                    setStatus('Confirmed');
                    setFromDate(new Date());
                    setTime(new Date());
                    setAdults('');
                    setChild('');


                })
                .catch((error) => console.error(error));

        } catch (error) {
            console.log('Error starting booking:', error);
        }
    };



    const handleFromDateChange = (event, selectedDate) => {
        // If the event type is set to 'dismissed', close the picker
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            setShowTimePicker(true)
            return;
        }
        const currentDate = selectedDate || fromDate;
        setShowDatePicker(false);
        setShowTimePicker(true)
        setFromDate(currentDate);
    };
    const handleTimeChange = (event, selectedTime) => {
        // If the event type is set to 'dismissed', close the picker
        if (event.type === 'dismissed') {
            setShowTimePicker(false);
            return;
        }



        setShowTimePicker(false);
        setTime(selectedTime);
    };

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
        let check = item.BookStatus
        console.log('check', check)
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

        console.log('time', time)

        // Render the card for each item when there is data
        return (
            <View style={[styles.card, { borderLeftColor: borderColor }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.TourName}</Text>
                    <Text style={styles.cardSubtitle}>Customer: {item.CustumerName}</Text>
                    <Text style={styles.cardSubtitle}>Pickup: {item.PickupPoints}</Text>
                    <Text style={styles.cardSubtitle}>MobileNo: {item.MobileNo}</Text>

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

                    {type === 'A' && check !== 'Confirmed' && check !== 'Assigned' && (
                        <TouchableOpacity
                            style={{
                                ...styles.stopButton,
                                backgroundColor: todayDate === selectedDate ? 'green' : 'grey',
                            }}
                            onPress={() => {
                                setconfirmModal(true);
                                setConfirmItem(item);
                            }}
                        >
                            <Text style={styles.startButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statusContainer}>
                    <Text style={styles.cardStatus} numberOfLines={1} ellipsizeMode="tail">
                        {item.BookStatus}
                    </Text>
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


    const GetAdminData = async (token) => {
        setLoader(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            };

            await fetch(`${BASE_URL}api/userdashbaord`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoader(false)

                    if (result?.status === "success") {

                        console.log('GetAdminData', result);
                        setAdminData(result);
                    }

                })
                .catch(error => console.error(error));
        } catch {
            console.log('Error fetching data');
        }
    };


    console.log("confirm", confirmItem)

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

                                                    onPress={handleOpenModal}
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
                                                    ListEmptyComponent={
                                                        <Text
                                                            style={{
                                                                fontSize: RFValue(16),
                                                            }}>
                                                            No more data available
                                                        </Text>
                                                    }
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
                                    ListEmptyComponent={
                                        <Text style={styles.noHistoryText}>No history available for the selected date range.</Text>
                                    }
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
                                        ListEmptyComponent={
                                            <Text style={{
                                                fontSize: RFValue(16),
                                                marginTop: 20,
                                                marginBottom: 20,
                                                textAlign: 'center',
                                                color: '#888888',
                                            }
                                            }>No Data Available</Text>
                                        }
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
                                                    height: type === 'A' ? HEIGHT * 0.30 : 25,
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

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                >
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
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
                onRequestClose={() => setconfirmModal(false)}
            >

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setconfirmModal(false)}
                >
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {customerName}'s
                        </Text>

                        {/* Book Date */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowDatePicker(true)
                            }}
                        >
                            <Text style={styles.label}>Booking Date:{moment(fromDate).format('YYYY-MM-DD') + ' ' + moment(time).format('HH:mm:ss')}</Text>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={fromDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleFromDateChange}
                                />
                            )}
                            {showTimePicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    display="default"
                                    onChange={
                                        handleTimeChange
                                    }
                                />
                            )}
                        </TouchableOpacity>

                        {/* Pickup Points */}
                        <Text style={styles.label}>Pickup Points</Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginBottom: 10,
                                fontSize: RFValue(12),
                                color: 'black',
                                width: WIDTH * 0.7,
                                paddingLeft: 10

                            }}
                            placeholder="Pickup Points"
                            placeholderTextColor={'grey'}
                            value={pickupPoints}
                            onChangeText={(txt) => setPickupPoints(txt)}
                        />

                        {/* Customer Name and Mobile No */}
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Customer</Text>
                                <TextInput
                                    style={styles.halfInput}
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChangeText={(txt) => setCustomerName(txt)}
                                />
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Mobile No</Text>
                                <TextInput
                                    style={styles.halfInput}
                                    placeholder="Mobile No"
                                    value={mobileNo}
                                    onChangeText={(txt) => setMobileNo(txt)}
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </View>
                        </View>

                        {/* Adults and Child */}
                        {confirmItem.type === "Tour" ? <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Adults</Text>
                                <TextInput
                                    style={{ ...styles.halfInput, alignItems: 'center', justifyContent: 'center', paddingLeft: 60, padding: 10, color: BLACK }}
                                    placeholder="Adults"
                                    value={adults.toString()} // Convert to string if it's a number
                                    onChangeText={(txt) => setAdults(txt)}
                                    keyboardType="numeric"
                                />


                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Child</Text>
                                <TextInput
                                    style={{ ...styles.halfInput, alignItems: 'center', justifyContent: 'center', paddingLeft: 60, padding: 10, color: BLACK }}
                                    placeholder="Adults"
                                    value={child.toString()} // Convert to string if it's a number
                                    onChangeText={(txt) => { setChild(txt) }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View> : <></>}

                        {/* TourSl Dropdown */}


                        {/* Paid Amount */}
                        <View style={styles.row}>

                            <View style={styles.column}>
                                <Text style={styles.label}>Amount</Text>
                                <TextInput
                                    style={styles.halfInput}
                                    placeholder="Amount"
                                    value={amount}
                                    onChangeText={(txt) => setAmount(txt)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Paid Amount</Text>
                                <TextInput
                                    style={styles.halfInput}
                                    placeholder="Paid Amount"
                                    value={paid}
                                    onChangeText={(txt) => setPaid(txt)}
                                    keyboardType="numeric"
                                />
                            </View>

                        </View>

                        {confirmItem.type === "Tour" ? (<>
                            {/* <Text style={styles.label}>Select Tour</Text> */}
                            <DropDownPicker
                                // searchable={true}
                                open={TourOpen}
                                placeholder='Select Tour'
                                value={Tour}
                                items={Tours}
                                setOpen={setTourOpen}
                                setValue={setTour}
                                style={styles.input}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                // onChangeItem={item => setTourSl(item.value)}
                                onSelectItem={(item) => {
                                    setTourSl(item.value)

                                }}

                            /></>) : (<>

                                {/* <Text style={styles.label}>Select Vehicle Group</Text> */}
                                <DropDownPicker
                                    open={vehicleGroupOpen}
                                    placeholder='Select Vehicle Group'
                                    value={vehicleGroup}
                                    items={VehicleGroups}
                                    setOpen={setVehicleGroupOpen}
                                    setValue={setVehicleGroup}
                                    style={styles.input}
                                /></>)}

                        <TouchableOpacity style={styles.verifyButton} onPress={() => {
                            confirm()

                        }}>
                            <Text style={styles.verifyButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}> */}
            <Add addModal={addModal} setAddModal={setAddModal} />
            {/* </View>
                </View>
            </Modal> */}
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
        marginTop: HEIGHT * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        height: HEIGHT * 0.1,
        marginBottom: HEIGHT * 0.09,
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
        // paddingVertical: 15,
        // paddingHorizontal: 20,
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        borderLeftWidth: 5,
        backgroundColor: WHITE,
        elevation: 5,
        width: '99%'
    },
    cardTitle: {
        fontSize: RFValue(16),
        color: BLACK,
        fontFamily: EXTRABOLD,
    },
    statusContainer: {
        flexDirection: 'row',
        width: '25%',
        alignItems: 'center',

    },
    cardStatus: {
        fontSize: RFValue(12),
        color: BLACK,
        fontFamily: 'Poppins-Medium',
        marginRight: 5,
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
        // padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 25,
        right: 20,
        zIndex: 1,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 10
    },
    closeButtonText: {
        fontSize: 18,
        color: 'black',
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
        marginTop: 20,
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: BLACK
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    column: {
        flex: 1,
        marginRight: 10, // For spacing between columns
    },
    halfInput: {
        height: 40,
        borderColor: '#ccc',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        // paddingHorizontal: 10,
        backgroundColor: '#fff',
        color: BLACK
    },
});
