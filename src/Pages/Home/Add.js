import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { BASE_URL } from '../../constants/url';
import { getObjByKey } from '../../utils/Storage';

const Add = ({ addModal, setAddModal }) => {
    const [bookingTypeOpen, setBookingTypeOpen] = useState(false);
    const [bookingType, setBookingType] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [pickupPoints, setPickupPoints] = useState('');
    const [tourOpen, setTourOpen] = useState(false);
    const [tour, setTour] = useState(null);
    const [vehicleGroupOpen, setVehicleGroupOpen] = useState(false);
    const [vehicleGroup, setVehicleGroup] = useState(null);
    const [fromDate, setFromDate] = useState(new Date()); // Initialize as Date object
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [adults, setAdults] = useState('3');
    const [children, setChildren] = useState('2');
    const [Tours, setTours] = useState([]); // Initialize Tours state
    const [VehicleGroups, setVehicleGroups] = useState([]);
    const [token, setToken] = useState();




    const handleFromDateChange = (event, selectedDate) => {
        // If the event type is set to 'dismissed', close the picker
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            return;
        }
        const currentDate = selectedDate || fromDate;
        setShowDatePicker(false);
        setFromDate(currentDate);
    };

    const handleShowDatePicker = () => {
        setShowDatePicker(true); // Open date picker
    };

    useEffect(() => {
        RetrieveDetails();
    }, []);



    const RetrieveDetails = async () => {


        try {
            const loginResponse = await getObjByKey('loginResponse');
            console.log('tokennnnnn', loginResponse.token);
            setToken(loginResponse.token)
            fetchTours(loginResponse.token);
            fetchVehicleList(loginResponse.token);



        } catch {

            console.log('Error retrieving loginResponse');
        }
    };

    const fetchTours = async (token) => {
        try {
            const response = await fetch(`${BASE_URL}api/tourlist`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.status === "success") {
                const fetchedTours = result.data_value.map(tour => ({
                    label: tour.TourName,
                    value: tour.TourSl.toString(), // Ensure value is a string
                }));
                setTours(fetchedTours);
            } else {
                console.error('Failed to fetch tours:', result.msg);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    };

    // Fetch Vehicle Groups
    const fetchVehicleList = async (token) => {
        console.log('calling');
        try {
            const response = await fetch(`${BASE_URL}api/vehiclegrouplist`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            const text = await response.text(); // Get the raw text response
            console.log('Raw response:', text); // Log the raw response

            const result = JSON.parse(text); // Parse the text as JSON
            console.log('Parsed result:', result); // Log the parsed result

            if (result.status === "success") {
                const fetchedVehicles = result.data_value.map(vehicle => ({
                    label: vehicle.VehicleGroupName,  // Display name
                    value: vehicle.VehicleGroupSl.toString(), // Value to use when selected
                }));
                setVehicleGroups(fetchedVehicles); // Set vehicle groups
            } else {
                console.error('Failed to fetch vehicle list:', result.msg);
            }
        } catch (error) {
            console.error('Error fetching vehicle list:', error);
        }
    };



    const resetForm = () => {
        setCustomerName('');
        setMobileNo('');
        setPickupPoints('');
        setTour(null);
        setVehicleGroup(null);
        setAdults('3');
        setChildren('2');
        // close the modal
        setAddModal(false);


    };
    const handleTourBooking = async () => {
        const raw = JSON.stringify({
            "BookDate": moment(fromDate).format('YYYY-MM-DD HH:mm'),
            "Adults": adults,
            "Child": children,
            "PickupPoints": pickupPoints,
            "CustumerName": customerName,
            "MobileNo": mobileNo,
            "TourSl": tour
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: raw
        };

        try {
            const response = await fetch(`${BASE_URL}api/tourbooking`, requestOptions);
            const result = await response.json();
            console.log('result tour', result)

            if (result.status === "success") {
                Alert.alert("Success", "Tour booked successfully!");
                resetForm();
            } else {
                Alert.alert("Error", result.msg || "Failed to book tour.");
            }
        } catch (error) {
            console.error("Error booking tour:", error);
            Alert.alert("Error", "An error occurred while booking the tour.");
        }
    };

    const handleTravelBooking = async () => {
        const raw = JSON.stringify({
            "BookDate": moment(fromDate).format('YYYY-MM-DD HH:mm'),
            "PickupPoints": pickupPoints,
            "CustumerName": customerName,
            "MobileNo": mobileNo,
            "VehicleGroupSl": vehicleGroup
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: raw
        };

        try {
            const response = await fetch(`${BASE_URL}api/TravelBooking`, requestOptions);
            const result = await response.json();
            console.log('result travel', result)

            if (result.status === "success") {
                Alert.alert("Success", "Travel booked successfully!");
                resetForm();
            } else {
                Alert.alert("Error", result.msg || "Failed to book travel.");
            }
        } catch (error) {
            console.error("Error booking travel:", error);
            Alert.alert("Error", "An error occurred while booking travel.");
        }
    };

    useEffect(() => {
        // Fetch Tours



        fetchTours();
        fetchVehicleList();
    }, []);



    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={addModal}
            onRequestClose={() => setAddModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Booking Details</Text>

                    {/* Booking Type Selection */}
                    <Text style={styles.label}>Select Booking Type</Text>
                    <DropDownPicker
                        open={bookingTypeOpen}
                        value={bookingType}
                        items={[
                            { label: 'Tour Booking', value: 'tour' },
                            { label: 'Travel Booking', value: 'travel' },
                        ]}
                        setOpen={setBookingTypeOpen}
                        setValue={setBookingType}
                        style={styles.input}
                    />

                    {/* Common Input Fields */}
                    <Text style={styles.label}>Pickup Points</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Pickup Points"
                        value={pickupPoints}
                        onChangeText={setPickupPoints}
                    />

                    <Text style={styles.label}>Customer Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Customer Name"
                        value={customerName}
                        onChangeText={setCustomerName}
                    />

                    <Text style={styles.label}>Mobile No</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile No"
                        value={mobileNo}
                        onChangeText={setMobileNo}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Booking Date & Time</Text>
                    <TouchableOpacity onPress={handleShowDatePicker} style={styles.input}>
                        <Text style={{ fontSize: RFValue(16), color: '#666', paddingTop: 10, paddingBottom: 10 }}>
                            {moment(fromDate).format('YYYY-MM-DD HH:mm')}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={fromDate}
                            mode="date"
                            display="default"
                            onChange={handleFromDateChange}
                        />
                    )}

                    {/* Conditional Rendering of Inputs Based on Booking Type */}
                    {bookingType === 'tour' && (
                        <>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.label}>No. of Adults</Text>
                                    <TextInput
                                        style={styles.halfInput}
                                        value={adults}
                                        onChangeText={setAdults}
                                        keyboardType="numeric"
                                        placeholder="Adults"
                                    />
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.label}>No. of Child</Text>
                                    <TextInput
                                        style={styles.halfInput}
                                        value={children}
                                        onChangeText={setChildren}
                                        keyboardType="numeric"
                                        placeholder="Children"
                                    />
                                </View>
                            </View>
                            <Text style={styles.label}>Select Tour</Text>
                            <DropDownPicker
                                open={tourOpen}
                                value={tour}
                                items={Tours} // Use fetched Tours state
                                setOpen={setTourOpen}
                                setValue={setTour}
                                style={styles.input}
                            />
                            <TouchableOpacity style={styles.verifyButton} onPress={handleTourBooking}>
                                <Text style={styles.verifyButtonText}>Book Tour</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {bookingType === 'travel' && (
                        <>

                            <Text style={styles.label}>Select Vehicle Group</Text>
                            <DropDownPicker
                                open={vehicleGroupOpen}
                                value={vehicleGroup}
                                items={VehicleGroups} // Use fetched Vehicle Groups state
                                setOpen={setVehicleGroupOpen}
                                setValue={setVehicleGroup}
                                style={styles.input}
                            />
                            <TouchableOpacity style={styles.verifyButton} onPress={handleTravelBooking}>
                                <Text style={styles.verifyButtonText}>Book Travel</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: RFValue(18),
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: 'black',
    },
    halfInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '48%',
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    column: {
        width: '48%',
    },
    verifyButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    verifyButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Add;
