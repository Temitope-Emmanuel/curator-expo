import { NativeBaseProvider } from "native-base";
import React from "react";
import Views from "./src/views";
import { FirebaseServiceProvider } from "./src/views/utils/firebase";
import { MediaServiceProvider } from "./src/views/utils/mediaPlayer";
import { NotificationProvider } from "./src/views/utils/notification";

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
