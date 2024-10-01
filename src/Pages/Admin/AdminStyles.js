import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {BOLD} from '../../constants/fontfamily';
import {HEIGHT, WIDTH} from '../../constants/config';
export const adminStyles = StyleSheet.create({
  addText: {
    color: '#1264FF',
    fontSize: RFValue(14),
    fontFamily: BOLD,
    fontWeight: 'bold',
  },
  addBtnContainer: {
    width: '25%',
    height: '90%',
    backgroundColor: '#EBF4FF',
    borderWidth: 1,
    borderColor: '#6FA0FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: WIDTH * 0.9,
    backgroundColor: '#EBF4FF',
    marginBottom: HEIGHT * 0.01,
    borderWidth: 0.2,
    flexDirection: 'row',
    borderColor: '#6FA0FF',
    borderRadius: 2,
  },
  deleteBtn: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
