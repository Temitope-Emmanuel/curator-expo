import "react-native-gesture-handler"
import React from 'react';
import Views from './src/views'
import {NativeBaseProvider} from "native-base"

export default function App() {
  return (
    <NativeBaseProvider>
      <Views/>
    </NativeBaseProvider>
  );
}