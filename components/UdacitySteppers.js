import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { white, purple, gray } from '../utils/colors';

export default function UdacitySteppers ({ max, unit, step, value, onIncrement, onDecrement }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between' }]}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity 
          style={[(Platform.OS === 'ios' ? styles.iosBtn : styles.androidBtn ), { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
          onPress={onDecrement}
        >
          <FontAwesome name='minus' size={20} color={ Platform.OS === 'ios' ? purple : white } />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[(Platform.OS === 'ios' ? styles.iosBtn : styles.androidBtn ), { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0}]}
          onPress={onIncrement}
        >
          <FontAwesome name='plus' size={20} color={ Platform.OS === 'ios' ? purple : white }  />
        </TouchableOpacity>
      </View>
      <View style={styles.metricCounter}>
        <Text style={{ fontSize: 24, textAlign: 'center' }}>{value}</Text>
        <Text style={{ fontSize: 24, color: gray }}>{unit}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  },
  iosBtn: {
    backgroundColor: white,
    borderColor: purple,
    borderRadius: 3,
    borderWidth: 1,
    padding: 5,
    paddingLeft: 25,
    paddingRight: 25
  },
  androidBtn: {
    margin: 5,
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2
  },
  metricCounter: {
    width: 85,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
