import { NativeBaseProvider } from "native-base";
import React from "react";
import Views from "./src/views";
import { FirebaseServiceProvider } from "./src/utils/firebase";
import { MediaServiceProvider } from "./src/utils/mediaPlayer";
import { NotificationProvider } from "./src/utils/notification";

const App = () => {
  return (
    <NativeBaseProvider>
      <Views />
    </NativeBaseProvider>
  );
};

export default FirebaseServiceProvider(
  NotificationProvider(MediaServiceProvider(App))
);
