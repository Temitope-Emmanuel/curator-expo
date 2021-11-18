import * as React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Home from "./Home"
import MediaDetail from "./MediaDetail";
import Notification from "./Notification"
import { FastIOSTransitionSpec } from "./utils/transitions"
import {AntDesign,Ionicons,MaterialIcons} from "@expo/vector-icons"
import { IconButton,Icon, Flex } from "native-base"
import { RootStackParamList } from "../models/route"


const Tab = createBottomTabNavigator<RootStackParamList>()

const ROUTE_LOCATION_KEY = "routeLocation"

const tabIcons = {
  "Home":{
    icon:AntDesign,
    name:"home"
  },
  "MediaDetail":{
    icon:MaterialIcons,
    name:"my-library-music"
  },
  "Notification":{
    icon:Ionicons,
    name:"md-notifications-sharp"
  }
}

const Router = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Home"
          screenOptions={({route}) => ({
            tabBarIcon:(({focused,color,size}) =>{
              const icon = tabIcons[route.name]
              return <IconButton
                  // mb={4} variant="solid" rounded="full"
                  icon={
                    <Icon as={icon.icon} name={icon.name} />
                  }
                  _icon={{
                    color,
                    size
                  }}
                />
            }),
            tabBarLabelStyle:{
              display:"none"
            },
            tabBarActiveTintColor:"black",
            tabBarInactiveTintColor:"grey",
            header:() => <Flex style={{height:"5%"}} />
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="MediaDetail" component={MediaDetail} />
          <Tab.Screen name="Notification" component={Notification} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default Router