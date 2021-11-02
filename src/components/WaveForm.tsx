import React from "react"
import Animated, {
    useSharedValue, useAnimatedGestureHandler,
    useAnimatedStyle, withTiming
} from "react-native-reanimated"
import { Box } from "native-base"
import { View, StatusBar, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native"
import { samples as oldSamples } from "../assets/data/waveform.json"
import { PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import MaskedView from "@react-native-community/masked-view"
import { STICK_FULL_WIDTH, STICK_WIDTH, STICK_MARGIN } from "../views/utils/constants"


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


const AnimationExample2: React.FC<{
    samples: number[];
    toggleSetPlaying: () => void;
    panX: Animated.SharedValue<number>;
    playing: Readonly<Animated.SharedValue<boolean>>;
}> = ({
    samples, playing,
    panX, toggleSetPlaying
}) => {
        const { width } = useWindowDimensions();
        const sliding = useSharedValue(false)
        const maxPanX = -width;
        const [newString, setNewString] = React.useState("")

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
            <TapGestureHandler numberOfTaps={2}
                onBegan={toggleSetPlaying}
            >
                <Animated.View style={{ flex: 1 }}>
                    <PanGestureHandler onGestureEvent={panGestureHandler}>
                        <Animated.View style={[{ flex: 1 }, maskAnimatedStyle]} >
                            <MaskedView
                                maskElement={
                                    <Box
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
                                    </Box>
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

export default React.memo(AnimationExample2)