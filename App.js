import "react-native-gesture-handler"
import React from 'react';
import { StyleSheet,View } from 'react-native';
import Views from './src/views'
import {NativeBaseProvider} from "native-base"
import {Ionicons} from "@expo/vector-icons"

const IconCheck = () => {
  return(
    <View style={styles.container}>
      <Ionicons name="md-checkmark-circle" size={32} color="green" />
    </View>
  )
}

export default function App() {
  return (
    <NativeBaseProvider>
      <Views/>
    </NativeBaseProvider>
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
