import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Constants from 'expo-constants';
import { Foundation,FontAwesome,MaterialIcons } from "@expo/vector-icons"
import { Icon, IconButton } from 'native-base';

const FirstRoute = () => (
    <View style={[styles.container, { backgroundColor: 'whitesmoke' }]} />
);
const SecondRoute = () => (
    <View style={[styles.container, { backgroundColor: 'grey' }]} />
);
const ThirdRoute = () => (
    <View style={[styles.container,{backgroundColor:"blue"}]} />
)

const getIcon = (arg:"0" | "1" | "2") => {
    if(arg === "0"){
        return(<Icon as={MaterialIcons} name="notes" />)
    }else if(arg === "1"){
        return(<Icon as={Foundation} name="clipboard-notes" />)
    }else{
        return(<Icon as={FontAwesome} name="users" />)
    }
}

const TabViewContainer = () => {
    const [idx,setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'Notes' },
        { key: 'second', title: 'Timestamp' },
        {key:"third",title:"Users"}
    ])

    const handleIndexChange = (index:number) => setIndex(index);

    const renderTabBar = (props) => {
        return (
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const icon = getIcon(`${i}` as any)
                    const handleIndexChange = () => setIndex(i)

                    return (
                        <TouchableOpacity key={i}
                            style={styles.tabItem}
                            onPress={handleIndexChange}>
                            <IconButton
                                icon={icon}
                                borderRadius="full"
                                _icon={{
                                    // color: "orange.500",
                                    size: "sm",
                                    opacity:idx === i ? 100 : 50
                                }}
                                _hover={{
                                    opacity:50,
                                    // bg: "orange.600:alpha.20",
                                }}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third:ThirdRoute
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