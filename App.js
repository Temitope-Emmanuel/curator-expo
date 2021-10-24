import "react-native-gesture-handler"
import React from 'react';
import { StyleSheet } from 'react-native';
import Views from './src/views'

export default function App() {
  return (
    <Views/>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
