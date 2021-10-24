import React from "react"
import Animated, {useSharedValue,useAnimatedGestureHandler, useAnimatedStyle} from "react-native-reanimated"
import { View, StatusBar, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native"
import { samples } from "../assets/data/waveform.json"
import { PanGestureHandler } from "react-native-gesture-handler";
import MaskedView from "@react-native-community/masked-view"

const STICK_WIDTH = 4;
const STICK_MARGIN = 1;
const STICK_FULL_WIDTH = STICK_WIDTH + STICK_MARGIN;

const WaveForm: React.FC<{
    samples: number[];
    reversed?: boolean;
}> = (props) => {
    return (
        <View
            style={[
                waveFormStyles.container,
                props.reversed && waveFormStyles.containerReversed,
            ]}
        >
            {props.samples.map((value, index) => (
                <View
                    key={index}
                    style={[waveFormStyles.stick, { height: `${value}%` }]}
                />
            ))}
        </View>
    );
}


const AnimationExample2 = () => {
    const {width,...dimensions} = useWindowDimensions();


    const panX = useSharedValue(0)
    const maxPanX = -width;

    const panGestureHandler = useAnimatedGestureHandler({
        onStart:(_,ctx:{
            startX:number
        }) => {
            ctx.startX = panX.value
        },
        onActive:(evt,ctx) => {
            const nextPanX = ctx.startX + evt.translationX
            console.log("this is ctx",nextPanX)
            
            if(nextPanX >= 0){
                panX.value = 0
            }else if(nextPanX < maxPanX){
                panX.value = maxPanX
            }else{
                panX.value = nextPanX
            }
        }
    })

    const maskAnimatedStyle = useAnimatedStyle(() => {
        return{
            transform:[
                {
                    // Moves the entire waveform from right -> left
                    translateX:panX.value
                }
            ]
        }
    })

    const playedAnimatedStyle = useAnimatedStyle(() => {
        return{
            width:-panX.value
        }
    })




    return (
        <>
            <StatusBar barStyle="light-content" />
                <SafeAreaView style={{flex:1,backgroundColor:"black"}}>
                <PanGestureHandler onGestureEvent={panGestureHandler}>
                    <Animated.View style={[{flex:1},maskAnimatedStyle]} >
                        <MaskedView 
                            maskElement={
                                <View 
                                    style={{
                                        backgroundColor:"transparent",
                                        flex:1,
                                        justifyContent:"center"
                                    }}
                                >
                                    <WaveForm {...{ samples }} />
                                    <WaveForm {...{ samples }} reversed />
                                </View>
                            }
                            style={{
                                height:"100%",
                                width:"100%",
                                marginLeft:"50%"
                            }}
                        >
                            <Animated.View 
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    zIndex:1,
                                    backgroundColor:"#FF5836",
                                    width:"10%"
                                }}
                            />
                            <View 
                                style={{flex:1,backgroundColor:"white"}}
                            />
                        </MaskedView>
                    </Animated.View>
                </PanGestureHandler>
            </SafeAreaView>
        </>
    )
}

const waveFormStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 50,
    },
    containerReversed: {
        alignItems: 'flex-start',
        opacity: 0.3,
        height: 40,
    },
    stick: {
        backgroundColor: 'white',
        width: STICK_WIDTH,
        marginRight: STICK_MARGIN,
    },
});

export default AnimationExample2