import React, { useEffect, useState } from 'react'; // Import useState
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../Pages/Home/Home';
import SettingsScreen from '../Pages/Settings/SettingsScreen';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { clearAll, getObjByKey } from '../utils/Storage';
import { checkuserToken } from '../redux/actions/auth';
import { useDispatch } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, EXTRABOLD } from '../constants/fontfamily';
import { BASE_URL } from '../constants/url';

// Native Stack Navigator
const Stack = createNativeStackNavigator();

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Drawer Navigator
const Drawer = createDrawerNavigator();

// Function to handle Sign Out


const CustomDrawerContent = ({ userDetails, ...props }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState()
  const handleSignOut = async (navigation, dispatch) => {
    LogoutApi();
    clearAll();
    dispatch(checkuserToken(false));
    // Add your logout API call here if needed


  };


  useEffect(() => {
    RetrieveDetails();
  }, []);

  const RetrieveDetails = async () => {
    try {
      const loginResponse = await getObjByKey('loginResponse');
      console.log('tokennnnnnnntttt', loginResponse.token)
      setToken(loginResponse.token)

    } catch {
      console.log("Error retrieving loginResponse");
    }
  }



  const LogoutApi = async () => {


    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = "";

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${BASE_URL}api/logout`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }
    catch {

    }
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header Section with Profile */}
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.drawerHeader}>
        <TouchableOpacity onPress={() => alert('Profile clicked')}>
          <View style={styles.profileSection}>

            <View style={styles.profileText}>
              <Text style={styles.profileName}>{userDetails.UserName}</Text>
              <Text style={styles.profileEmail}>{userDetails.UserDesignation}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Drawer Items */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Home"
          icon={({ color, size }) => <Icon name="home" size={size} color={color} />}
          labelStyle={styles.drawerItemLabel}
          onPress={() => props.navigation.navigate('HomeTabs')}
        />
        <DrawerItem
          label="History"
          icon={({ color, size }) => <Icon name="toolbox" size={size} color={color} />}
          labelStyle={styles.drawerItemLabel}
          onPress={() => props.navigation.navigate('Settings')}
        />
      </View>

      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          label="Sign Out"
          icon={({ color, size }) => <Icon name="sign-out-alt" size={size} color={color} />}
          labelStyle={styles.drawerItemLabel}
          onPress={() => handleSignOut(props.navigation, dispatch)}
        />
      </View>
    </DrawerContentScrollView>
  );
};

// Define the Bottom Tab Navigator with Icons
const MyTabs = () => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({}); // State to hold user details

  useEffect(() => {
    const GetUserDetails = async () => {
      const response = await getObjByKey("userDetails");
      if (response?.data_value?.length) {
        setUserDetails(response?.data_value[0]); // Assuming data_value is an array
      }
      console.log('User Details:', response);
    };

    GetUserDetails();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#215be9', // Active tab color
        tabBarInactiveTintColor: 'gray',  // Inactive tab color
        tabBarStyle: {
          backgroundColor: 'white',       // Tab background color
          borderTopWidth: 0,              // Optional: remove the top border of the tab bar
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'; // Icon for Home
          } else if (route.name === 'Settings') {
            iconName = 'toolbox'; // Icon for Settings
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false, tabBarLabel: 'Home' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'History', headerShown: false }} />
    </Tab.Navigator>
  );
};

// Define the Drawer Navigator with Custom Drawer
const MyDrawer = ({ userDetails }) => { // Accept userDetails as a prop
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} userDetails={userDetails} />} // Pass userDetails
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f9f9f9', // Customize drawer background
          // borderRadius: 10,           // Add rounded edges
          marginTop: -5,              // Adjust positioning
        },
        headerShown: false, // Hide header to avoid conflicts with drawer header
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={MyTabs}
        options={{ drawerLabel: 'Home' }} // Main Home with Bottom Tabs
      />
    </Drawer.Navigator>
  );
};

// Stack Navigator to render the Drawer Navigator
const HomeStack = () => {
  const [userDetails, setUserDetails] = useState({}); // State to hold user details

  useEffect(() => {
    const GetUserDetails = async () => {
      const response = await getObjByKey("userDetails");
      if (response?.data_value?.length) {
        setUserDetails(response.data_value[0]); // Assuming data_value is an array
      }
    };

    GetUserDetails();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen
        name="Drawer"
        options={{ headerShown: false }}
      >
        {(props) => <MyDrawer {...props} userDetails={userDetails} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Custom Drawer Styles
const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileText: {
    justifyContent: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: RFValue(12),
    fontFamily: BOLD
  },
  profileEmail: {
    color: 'white',
    fontSize: 14,
  },
  drawerItemsContainer: {
    paddingTop: 10,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomDrawerSection: {
    marginTop: 'auto',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

// Export HomeStack as default
export default HomeStack;
