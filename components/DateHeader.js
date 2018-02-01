import React from 'react';
import { View, Text } from 'react-native';
import { white, purple } from '../utils/colors';

export default function DateHeader ({ date }) {
  return (
    <Text style={{ color: purple, fontSize: 25, textAlign: 'left' }}>
      {date}
    </Text>
  )
}
