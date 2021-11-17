import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Waveform from "../components/Waveform";
import Animated, {
    useAnimatedScrollHandler,
    useDerivedValue,
    useAnimatedRef,
    scrollTo,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import waveform from "../assets/data/waveform.json";
import MaskedView from "@react-native-community/masked-view"

const barWidth = 4;
const barMargin = 1;

const App = () => {
    const scrollX = useSharedValue(0);
    const aref = useAnimatedRef<any>()
    
    const updateProgress = () => {
        "worklet";

        if (scrollX) {
            scrollX.value = withTiming(scrollX.value + ((barWidth + barMargin) * 2));
        }
    };

    React.useEffect(() => {
        const interval = setInterval(() => updateProgress(), 1000);
        return () => clearInterval(interval);
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: ({ contentOffset: { x } }) => {
            scrollX.value = x;
            console.log("this is the scrollX", JSON.stringify(scrollX))
        },
    });

    useDerivedValue(() => {        
        scrollTo(aref, scrollX.value, 0, true)
    })

    return (
        <View style={styles.container}>
            <Image source={require("../assets/Images/cover.jpg")}
             style={styles.cover} />
            <View style={styles.content}>
                <View>
                    <Animated.ScrollView
                        ref={aref}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        horizontal
                        scrollEventThrottle={10}
                        onScroll={scrollHandler}
                    >
                        {/* <MaskedView 
                            maskElement={
                                // <View style={{ 
                                //     flex: 1,
                                //     backgroundColor:"transparent"
                                //  }}>
                                //     <View style={StyleSheet.absoluteFillObject}>
                                //         <Waveform
                                //             primaryColor="#e95f2a"
                                //             secondaryColor="#f5c19f"
                                //             progress={scrollX}
                                //             waveform={waveform.samples}
                                //         />
                                //     </View>
                                // </View>
                                    <Animated.View>
                                        <Waveform
                                            primaryColor="white"
                                            secondaryColor="#e6d0bb"
                                            waveform={waveform.samples}
                                        />
                                    </Animated.View>
                            }

                            style={{
                                height:"100%",
                                width:"100%",
                                marginLeft:"50%"
                            }}
                        >
                            <Animated.View
                                style={[
                                    {
                                        position:"absolute",
                                        zIndex:1,
                                        left:0,
                                        bottom:0,
                                        top:0,
                                        backgroundColor: '#FF5836',
                                    }
                                ]}
                            />
                            <View
                                style={{ flex: 1, backgroundColor: 'white' }}
                            />
                        </MaskedView> */}
                    </Animated.ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "blue",
        justifyContent: "flex-end",
    },
    cover: {
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null,
    },
    content: {
        flex: 0.5,
        justifyContent: "center",
    },
});

export default App;