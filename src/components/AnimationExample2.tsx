import React from "react"
import Animated, {
    useSharedValue, useAnimatedGestureHandler,
    useAnimatedStyle, withTiming
} from "react-native-reanimated"
import { View, StatusBar, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native"
import { samples as oldSamples } from "../assets/data/waveform.json"
import { PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import MaskedView from "@react-native-community/masked-view"
import {RenderingAudioContext,OfflineAudioContext} from "web-audio-engine"

const samples = oldSamples.slice(0, 500)
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

function findNearestMultiple(n, multiple) {
    'worklet';
    return Math.floor(n / multiple) * multiple;
}


const AnimationExample2 = () => {
    const { width } = useWindowDimensions();
    const playing = useSharedValue(true)
    const sliding = useSharedValue(false)
    const panX = useSharedValue(0)
    const maxPanX = -width;

    const updateProgress = () => {
        'worklet';

        if (playing.value && !sliding.value && panX.value > maxPanX) {
            panX.value = withTiming(panX.value - STICK_FULL_WIDTH)
        }
    }

    React.useEffect(() => {
        const interval = setInterval(() => updateProgress(), 150);
        // const RenderingContext = AudioEngine.RenderingAudioContext
        // const audioCtx = new RenderingContext()
        const AudioContext = OfflineAudioContext
        const audioContext = new AudioContext()
        console.log("this is the audio context",{audioContext})
        return () => clearInterval(interval)
    }, [])

    const panGestureHandler = useAnimatedGestureHandler({
        onStart(_, context: {
            startX: number
        }) {
            context.startX = panX.value;
            sliding.value = true;
        },
        onActive(event, context) {
            const nextPanX = context.startX + event.translationX;

            if (nextPanX > 0) {
                panX.value = 0;
            } else if (nextPanX < maxPanX) {
                panX.value = maxPanX;
            } else {
                panX.value = nextPanX;
            }
        },
        onEnd() {
            panX.value = withTiming(
                findNearestMultiple(panX.value, STICK_FULL_WIDTH)
            );

            sliding.value = false;
        },
    });

    const tapGestureHandler = useAnimatedGestureHandler({
        onActive() {
            playing.value = !playing.value;
        }
    })

    const maskAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    // Moves the entire waveform from right -> left
                    translateX: panX.value
                }
            ]
        }
    })

    const playedAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: -panX.value
        }
    })

    const topWavesAnimatedStyles = useAnimatedStyle(() => {
        return {
            height: withTiming(playing.value ? 50 : 1)
        }
    })

    const bottomWavesAnimatedStyles = useAnimatedStyle(() => {
        return {
            height: withTiming(playing.value ? 40 : 1)
        }
    })

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
                <TapGestureHandler numberOfTaps={1}
                    onGestureEvent={tapGestureHandler}
                >
                    <Animated.View style={{ flex: 1 }}>
                        <PanGestureHandler onGestureEvent={panGestureHandler}>
                            <Animated.View style={[{ flex: 1 }, maskAnimatedStyle]} >
                                <MaskedView
                                    maskElement={
                                        <View
                                            style={{
                                                backgroundColor: "transparent",
                                                flex: 1,
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Animated.View style={topWavesAnimatedStyles}>
                                                <WaveForm {...{ samples }} />
                                            </Animated.View>
                                            <Animated.View style={bottomWavesAnimatedStyles}>
                                                <WaveForm {...{ samples }} reversed />
                                            </Animated.View>
                                        </View>
                                    }
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        marginLeft: "50%"
                                    }}
                                >
                                    <Animated.View
                                        style={[{
                                            ...StyleSheet.absoluteFillObject,
                                            zIndex: 1,
                                            backgroundColor: "#FF5836"
                                        }, playedAnimatedStyle]}
                                    />
                                    <View
                                        style={{ flex: 1, backgroundColor: "white" }}
                                    />
                                </MaskedView>
                            </Animated.View>
                        </PanGestureHandler>
                    </Animated.View>
                </TapGestureHandler>
            </SafeAreaView>
        </>
    )
}

const waveFormStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: "100%",
    },
    containerReversed: {
        alignItems: 'flex-start',
        opacity: 0.3
    },
    stick: {
        backgroundColor: 'white',
        width: STICK_WIDTH,
        marginRight: STICK_MARGIN,
    },
});

export default AnimationExample2