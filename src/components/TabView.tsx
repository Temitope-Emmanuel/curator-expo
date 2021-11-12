import React from "react"
import { Box, Center, Pressable } from "native-base"
import {TabView, SceneMap, SceneRendererProps, NavigationState} from "react-native-tab-view"
import { Dimensions, StatusBar } from "react-native"
import Animated from "react-native-reanimated"


const FirstRoute = () => (
    <Center flex={1}>
        This is Tab 1
    </Center>
)
const SecondRoute = () => (
    <Center flex={1}>
        This is Tab 2
    </Center>
)
const ThirdRoute = () => (
    <Center flex={1}>
        This is Tab 3
    </Center>
)
const initialLayout = {
    width:Dimensions.get("window").width
}
const renderScene = SceneMap({
    first:FirstRoute,
    second:SecondRoute,
    third:ThirdRoute
})





const PlaylistTabView = () => {
    const [index,setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Tab 1' },
        { key: 'second', title: 'Tab 2' },
        { key: 'third', title: 'Tab 3' },
      ]);

      const renderTabBar = (props: SceneRendererProps & {
        navigationState: NavigationState<any>;
    }) => {
        const inputRange = props.navigationState.routes.map((item,idx) => idx)
          return(
            <Box flexDirection="row">
                {props.navigationState.routes.map((route,i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIdx) => inputIdx === i ? 1 : 0.5)
                    })
                    const color = index === i ? "#1f2937" : "#a1a1aa";
                    const borderColor = index === i ? "cyan.500" : "coolGray.200"

                    return(
                        <Box p="3" cursor="pointer"
                            borderBottomWidth="3" flex={1}
                            borderColor={borderColor} alignItems="center"
                        >
                            <Pressable onPress={() => {
                                console.log("this is i",{i})
                                setIndex(i)
                            }} >
                                <Animated.Text
                                    style={{color}}
                                >
                                    {route.title}
                                </Animated.Text>
                            </Pressable>
                        </Box>
                    )
                })
            }
            </Box>
          )
      }
      
      return(
        <TabView
        navigationState={{index,routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{
            marginTop:StatusBar.currentHeight
        }}
        />
      )
}

export default PlaylistTabView