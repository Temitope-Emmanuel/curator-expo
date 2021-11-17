import * as React from 'react';
import { Animated, View, TouchableOpacity, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Constants from 'expo-constants';
import { Foundation,MaterialIcons } from "@expo/vector-icons"
import { Icon, IconButton } from 'native-base';

const FirstRoute = () => (
    <View style={[styles.container, { backgroundColor: 'whitesmoke' }]} />
);
const SecondRoute = () => (
    <View style={[styles.container, { backgroundColor: 'grey' }]} />
);

const getIcon = (arg:"0" | "1") => {
    if(arg === "0"){
        return(<Icon as={MaterialIcons} name="notes" />)
    }else{
        return(<Icon as={Foundation} name="clipboard-notes" />)
    }
}

const TabViewContainer = () => {
    const [idx,setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'Notes' },
        { key: 'second', title: 'Timestamp' },
    ])

    const handleIndexChange = (index:number) => setIndex(index);

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) =>
                            inputIndex === i ? 1 : 0.5
                        ),
                    });
                    return (
                        <TouchableOpacity key={i}
                            style={styles.tabItem}
                            onPress={() => setIndex(i)}>
                            <IconButton
                                icon={getIcon(`${i}` as any)}
                                borderRadius="full"
                                _icon={{
                                    // color: "orange.500",
                                    size: "sm",
                                    // opacity
                                }}
                                _hover={{
                                    opacity:50,
                                    // bg: "orange.600:alpha.20",
                                }}
                            />
                            {/* <Animated.Text style={{ opacity }}>{route.title}</Animated.Text> */}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    return (
        <TabView
            navigationState={{routes,index:idx}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: Constants.statusBarHeight,
    },
    tabItem: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: "white",
    },
});


export default TabViewContainer