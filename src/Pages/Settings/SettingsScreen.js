import React, { Fragment, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Header from '../../components/Header';
import { HEIGHT, MyStatusBar } from '../../constants/config';
import { splashStyles } from '../Splash/SplashStyles';

const SettingsScreen = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    const handleFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || fromDate;
        setShowFromPicker(false);
        setFromDate(currentDate);
    };

    const handleToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || toDate;
        setShowToPicker(false);
        setToDate(currentDate);
    };

    const validateDateRange = (fromDate, toDate) => {
        const dateDiff = moment(toDate).diff(moment(fromDate), 'days');
        return dateDiff <= 30;
    };

    const fetchUserHistory = () => {
        if (!validateDateRange(fromDate, toDate)) {
            Alert.alert("Date range error", "The date range should not exceed 30 days.");
            return;
        }

        const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
        const formattedToDate = moment(toDate).format('YYYY-MM-DD');

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer RFJJVkVSMXwxMjM0NXwxMC8wOC8yMDI0IDExOjI5OjI3IEFN");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`https://protimes.co.in/shreedham/api/userhistory/?fromdate=${formattedFromDate}&todate=${formattedToDate}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setHistoryData(result.BookDetails || []); // Using BookDetails from the API response
            })
            .catch((error) => {
                console.error("Error fetching user history:", error);
            });
    };

    const renderItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Text style={styles.historyText}>Customer: {item.CustumerName}</Text>
            <Text style={styles.historySubText}>Tour: {item.TourName}</Text>
            <Text style={styles.historySubText}>Pickup: {item.PickupPoints}</Text>
            <Text style={styles.historySubText}>Status: {item.BookStatus}</Text>
            <Text style={styles.historyDate}>Date: {item.dt}, Time: {item.tm}</Text>
        </View>
    );

    return (
        <Fragment>
            <MyStatusBar backgroundColor={'#215be9'} barStyle={'light-content'} />
            <SafeAreaView style={splashStyles.maincontainer}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" scrollEnabled={false}>


                        <Header
                            title="History"
                        />
                        <View style={{
                            // padding: 20,
                            alignSelf: 'center',
                            flex: 1,
                            width: '95%'
                        }}>
                            <Text style={styles.headerText}>Select Date Range (Max 30 Days)</Text>
                            <View style={styles.dateRow}>
                                <TouchableOpacity style={styles.dateButton} onPress={() => setShowFromPicker(true)}>
                                    <Text style={styles.dateText}>From: {moment(fromDate).format('YYYY-MM-DD')}</Text>
                                </TouchableOpacity>
                                {showFromPicker && (
                                    <DateTimePicker
                                        value={fromDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleFromDateChange}
                                    />
                                )}

                                <TouchableOpacity style={styles.dateButton} onPress={() => setShowToPicker(true)}>
                                    <Text style={styles.dateText}>To: {moment(toDate).format('YYYY-MM-DD')}</Text>
                                </TouchableOpacity>
                                {showToPicker && (
                                    <DateTimePicker
                                        value={toDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleToDateChange}
                                    />
                                )}
                            </View>

                            <TouchableOpacity style={styles.applyButton} onPress={fetchUserHistory}>
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>

                            <Text style={styles.historyHeader}>User History:</Text>
                            <View
                                style={{
                                    height: HEIGHT * 0.5
                                }}
                            >
                                {historyData.length > 0 ? (
                                    <FlatList
                                        data={historyData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderItem}
                                    />
                                ) : (
                                    <Text style={styles.noHistoryText}>No history available for the selected date range.</Text>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust spacing between buttons
        alignItems: 'center', // Center vertically
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        fontFamily: 'Poppins-Bold', // Use 'Poppins' font with a bold style
    },
    dateButton: {
        backgroundColor: '#4a90e2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    dateText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular', // Use 'Poppins' regular style for date text
    },
    applyButton: {
        backgroundColor: '#34a853',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold', // Use 'Poppins' bold style for button text
    },
    historyHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 25,
        color: '#333',
        fontFamily: 'Poppins-Bold', // Use 'Poppins' bold style for history header
    },
    noHistoryText: {
        marginTop: 15,
        fontSize: 16,
        color: '#888',
        fontFamily: 'Poppins-Regular', // Use 'Poppins' regular style for no history text
    },
    historyItem: {
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    historyText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Bold', // Use 'Poppins' for regular history text
    },
    historySubText: {
        fontSize: 14,

        color: '#555',
        marginTop: 3,
        fontFamily: 'Poppins-Regular', // Use 'Poppins' for history subtext
    },
    historyDate: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
        fontFamily: 'Poppins-Regular', // Use 'Poppins' for history date text
    },
});

export default SettingsScreen;
