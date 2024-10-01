import {StyleSheet} from 'react-native';
import {BRAND, WHITE} from '../../constants/color';
import {WIDTH} from '../../constants/config';

export const signupStyles = StyleSheet.create({
  imageContainer: {
    width: WIDTH * 0.5,
    height: WIDTH * 0.2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '90%',
    tintColor: BRAND,
  },
});

export default signupStyles;
