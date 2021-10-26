import { NavigationContainer } from "@react-navigation/native";
import React from "react"
import {SafeAreaProvider} from "react-native-safe-area-context"
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import Home from "./Home"
import MediaDetail from "./MediaDetail";
import { FastIOSTransitionSpec } from "./utils/transitions"

const name = "Curator";

const Stack = createSharedElementStackNavigator({
    name
})

const ROUTE_LOCATION_KEY = "routeLocation"


const Router = () => {
    return(
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        transitionSpec: {
                          open: FastIOSTransitionSpec,
                          close: FastIOSTransitionSpec,
                        },
                        headerStyle:{
                          backgroundColor:"#0B0E11"
                        },
                        headerTitleStyle:{
                          color:"#FD4D4D"
                        },
                        headerBackTitleStyle:{
                          color:"#FD4D4D"
                        },
                      }}
                >
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="MediaDetail" component={MediaDetail} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default Router