import {StyleSheet} from 'react-native';
import {BLACK, BRAND, WHITE} from '../../constants/color';
import {BOLD, MEDIUM, REGULAR} from '../../constants/fontfamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {HEIGHT, WIDTH} from '../../constants/config';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    color: BLACK,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeading: {
    color: BLACK,
    fontSize: RFValue(20),
    fontFamily: BOLD,
  },
  contentContainer: {
    flexGrow: 1,
  },
  heading: {
    color: BLACK,
    fontSize: RFValue(20),
    fontFamily: MEDIUM,
    fontWeight: '900',
    marginBottom: HEIGHT * 0.002,
  },
  paragraph: {
    color: '#787878',
    fontSize: RFValue(15),
    fontFamily: REGULAR,
    marginBottom: HEIGHT * 0.01,
  },
  checkboxContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WIDTH * 0.02,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontFamily: MEDIUM,
    color: '#444242',
    fontSize: RFValue(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: HEIGHT * 0.015,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: BRAND,
  },
  buttonText: {
    color: WHITE,
    fontSize: 16,
  },
});
