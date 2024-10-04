import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { BLACK, WHITE } from '../../constants/color'
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config'
import { splashStyles } from '../Splash/SplashStyles'
import LinearGradient from 'react-native-linear-gradient'
import { EXTRABOLD } from '../../constants/fontfamily'
import { RFValue } from 'react-native-responsive-fontsize'
import Header from '../../components/Header'
import { getObjByKey } from '../../utils/Storage'
import { BASE_URL } from '../../constants/url'
import moment from 'moment'

const Home = ({ navigation }) => {
    const [Dashboard, setDashBoard] = useState({ TotalAssigned: 0, Pending: 0, Completed: 0, BookDetails: [] });

    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const flatListRef = useRef(null);  // Ref to control FlatList for auto-scroll

    useEffect(() => {
        RetrieveDetails();
    }, []);

    const RetrieveDetails = async () => {
        try {
            const loginResponse = await getObjByKey('loginResponse');
            console.log('tokennnnnn', loginResponse.token)
            GetDashBoard(loginResponse.token);
        } catch {
            console.log("Error retrieving loginResponse");
        }
    }

    const GetDashBoard = (token) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`${BASE_URL}api/userdashbaord`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log("Dashboard Data: ", result);
                    setDashBoard(result);
                })
                .catch((error) => console.error(error));

        } catch (error) {
            console.log("Dashboard Fetch Error: ", error);
        }
    }

    // Generate the next 30 days' dates for the calendar
    const calendarDates = Array.from({ length: 30 }, (_, index) => {
        return moment().add(index, 'days').format('YYYY-MM-DD');
    });

    useEffect(() => {
        // Auto-scroll to today's date on the first render
        const todayIndex = calendarDates.indexOf(moment().format('YYYY-MM-DD'));
        if (flatListRef.current && todayIndex !== -1) {
            flatListRef.current.scrollToIndex({ index: todayIndex, animated: true });
        }
    }, []);

    // Render each date in the horizontal calendar
    const renderDateItem = ({ item }) => {
        const isSelected = item === selectedDate;

        return (
            <TouchableOpacity
                style={[styles.dateItem, isSelected && styles.selectedDateItem]}
                onPress={() => setSelectedDate(item)}
            >
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                    {moment(item).format('DD')}
                </Text>
                <Text style={[styles.monthText, isSelected && styles.selectedMonthText]}>
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
            ])
        ).start();
    }, [blinkAnim]);


    // Function to render each item in the FlatList
    const renderItem = ({ item }) => {
        let borderColor, blinkColor;
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

        return (
            <View style={[styles.card, { borderLeftColor: borderColor }]}>
                <View>
                    <Text style={styles.cardTitle}>{item.TourName}</Text>
                    <Text style={styles.cardSubtitle}>Customer: {item.CustumerName}</Text>
                    <Text style={styles.cardSubtitle}>Pickup: {item.PickupPoints}</Text>
                    <Text style={styles.cardSubtitle}>MobileNo: {item.MobileNo}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.cardStatus}>{item.BookStatus}</Text>
                    <Animated.View style={[styles.blinkingCircle, { opacity: blinkAnim, backgroundColor: blinkColor }]} />
                </View>
            </View>
        );
    };


    return (
        <Fragment>
            <MyStatusBar backgroundColor={'#215be9'} barStyle={'light-content'} />
            <SafeAreaView style={splashStyles.maincontainer}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View>


                            <Header
                                title="Trip Management"
                                onMenuPress={() => navigation.toggleDrawer()}
                                onAddPress={() => console.log('Add pressed')}
                            />

                            {/* Floating Banner Card */}
                            <View style={styles.bannerContainer}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['white', 'white']}
                                    style={styles.bannerCard}
                                >
                                    <View style={styles.bannerContent}>
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Total</Text>
                                            <Text style={styles.sectionData}>{Dashboard.TotalAssigned}</Text>
                                        </View>
                                        <View style={styles.separator} />
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Pending</Text>
                                            <Text style={styles.sectionData}>{Dashboard.Pending}</Text>
                                        </View>
                                        <View style={styles.separator} />
                                        <View style={styles.section}>
                                            <Text style={styles.sectionTitle}>Completed</Text>
                                            <Text style={styles.sectionData}>{Dashboard.Completed}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>

                            {/* Elevated Calendar and Trip List */}
                            <View style={styles.mainContent}>
                                {/* <View style={styles.calendarContainer}> */}
                                <FlatList
                                    ref={flatListRef} // Ref for auto-scroll
                                    data={calendarDates}
                                    renderItem={renderDateItem}
                                    keyExtractor={(item) => item}
                                    horizontal={true}
                                    contentContainerStyle={styles.calendarList}
                                    showsHorizontalScrollIndicator={false}
                                />
                                {/* </View> */}
                                <View
                                    style={{
                                        height: HEIGHT * 0.6,
                                        marginBottom: 20, // Add bottom margin
                                        // backgroundColor: 'white',
                                        borderRadius: 10, // Add rounded corners for the elevated look
                                        // elevation: 5, // Add shadow for elevation
                                        // borderBottomColor: 'lightgray',
                                    }}
                                >

                                    <FlatList
                                        data={Dashboard.BookDetails}  // Use the real data from Dashboard
                                        renderItem={renderItem}
                                    // keyExtractor={item => item.Sl.toString()}  // Assuming 'Sl' is unique
                                    // contentContainerStyle={styles.listContainer}
                                    />

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment >
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
        margin: 10
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
    bannerCard: {
        width: WIDTH * 0.9,
        height: HEIGHT * 0.12,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        elevation: 5,
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

});
