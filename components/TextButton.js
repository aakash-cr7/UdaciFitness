import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { white, purple } from '../utils/colors';

export default function TextButton ({ children, onPress , style = {} }) {
  return (
    <TouchableOpacity onPress={onPress}>
      {/* the childeren is the text thate we pass the TextButton */}
      <Text style={[ styles.reset, style ]}> { children } </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  reset: {
    textAlign: 'center',
    color: purple
  }
});
