import { StyleSheet } from 'react-native';
import { WHITE } from '../../constants/color';
import { HEIGHT, WIDTH } from '../../constants/config';
export const splashStyles = StyleSheet.create({
  maincontainer: {
    // height: '100%',
    flex: 1,
    width: '100%',
    backgroundColor: WHITE,
  },
  logoContainer: {
    marginTop: HEIGHT * 0.45,
    width: WIDTH,
    height: HEIGHT * 0.6,
  },
});
