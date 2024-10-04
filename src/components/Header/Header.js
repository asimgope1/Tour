import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { RFValue } from 'react-native-responsive-fontsize'
import { MENU, PLUS } from '../../constants/imagepath'
import { HEIGHT, WIDTH } from '../../constants/config'
import { BLACK, WHITE } from '../../constants/color'
import { EXTRABOLD } from '../../constants/fontfamily'

const Header = ({ title, onMenuPress, onAddPress }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={['#215be9', '#215be1']}
      style={styles.headerContainer}
    >
      <View style={styles.headerContent}>
        {/* Menu Icon */}
        <TouchableOpacity onPress={onMenuPress}>
          <Image
            style={styles.icon}
            source={MENU}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerText}>
          {title}
        </Text>

        {/* Add Icon */}
        <TouchableOpacity onPress={onAddPress}>
          <Image
            style={styles.iconSmall}
            source={PLUS}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: HEIGHT * 0.12, // Dynamic height
    justifyContent: 'center',
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    paddingHorizontal: WIDTH * 0.05, // Padding for content
  },
  headerContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: WHITE,
  },
  iconSmall: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: WHITE,
  },
  headerText: {
    color: WHITE,
    fontSize: RFValue(16),
    fontFamily: EXTRABOLD,
    textAlign: 'center',
    flex: 1, // Ensures the title is centered
  },
})
