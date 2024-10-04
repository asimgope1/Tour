/**
 * @format
 */

import { Alert, AppRegistry, AppState } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async remoteMessage => {
    console.log('Message handled in the foreground!', remoteMessage);

    // Play the custom sound once when a message is received in the foreground
    setTimeout(() => { }, 5000);

    Alert.alert(
        'New Message',
        `Title: ${remoteMessage.notification.title}\nMessage: ${remoteMessage.notification.body}`,
        [
            {
                text: 'OK',
                onPress: () => {
                    console.log('OK Pressed');
                },
            },
        ],
        { cancelable: false },
    );
    console.log('msg2', remoteMessage.notification.body);
    // You can perform additional actions here based on the message data
});



AppState.addEventListener('change', newState => {
    if (newState === 'active') {
        isAppInForeground = true;
    } else if (newState === 'background') {
        isAppInForeground = false;
    }
});
AppRegistry.registerComponent(appName, () => App);
