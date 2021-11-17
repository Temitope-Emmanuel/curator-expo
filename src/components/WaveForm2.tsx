import React from "react"
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle, withTiming
} from "react-native-reanimated"
import { Box } from "native-base"
import { View, StyleSheet, Dimensions} from "react-native"
import { PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import MaskedView from "@react-native-community/masked-view"
import { FULL_BAR_WIDTH, BAR_WIDTH, BAR_MARGIN } from "../views/utils/constants"
import * as ReactNativeSvg from "react-native-svg"

const {Rect,Svg} = ReactNativeSvg

const WaveForm: React.FC<{
    samples: number[];
    reversed?: boolean;
}> = ({samples}) => {
    const waveformMargin = 1;
    const {width:wWidth} = Dimensions.get("window")
    const offset = 0;
    const waveformHeight = 140;
    const height = waveformHeight + waveformMargin + (waveformHeight * 0.61);
    const width = samples.length * (BAR_WIDTH + BAR_MARGIN) + (offset * 2)
    

    return (
        <Svg {...{width,height}} >
            {
                samples.map((value,key) => (
                    <Rect {...{key}} fill="white"
                        height={value} width={BAR_WIDTH}
                        y={waveformHeight - value} x={key * (FULL_BAR_WIDTH) + offset}
                    />
                ))
            }
            {
                samples.map((value,key) => (
                    <Rect {...{key}} fill="white"
                        height={value * 0.61} width={BAR_WIDTH}
                        y={waveformHeight + BAR_MARGIN} x={key * (FULL_BAR_WIDTH) + offset}
                    />
                ))
            }
        </Svg>
        // <View
        //     style={[
        //         waveFormStyles.container,
        //         props.reversed && waveFormStyles.containerReversed,
        //     ]}
        // >
        //     {props.samples.map((value, index) => (
        //         <View
        //             key={index}
        //             style={[waveFormStyles.stick, { height: `${value}%` }]}
        //         />
        //     ))}
        // </View>
    );
}

const MemoizedWaveForm = React.memo(WaveForm)

function findNearestMultiple(n, multiple) {
    'worklet';
    return Math.floor(n / multiple) * multiple;
}


const MainWavefrom: React.FC<{
    samples: number[];
    toggleSetPlaying: () => void;
    setSliding: (arg:boolean) => void;
    seek:(arg:number) => void;
    panX: Animated.SharedValue<number>;
    bufferedPosition: Animated.SharedValue<number>;
    sliding:Animated.SharedValue<boolean>;
    playing: Readonly<Animated.SharedValue<boolean>>;
}> = ({
    samples, playing,seek,bufferedPosition,
    panX, toggleSetPlaying
}) => {

        const { width } = Dimensions.get("window");
        const maxPanX = -width;

        const panGestureHandler = useAnimatedGestureHandler({
            onStart(_, context: {
                startX: number
            }) {
                context.startX = panX.value;
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
            }
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
                // Move the colors from right -> left
                width: -panX.value
            }
        })

        const bufferedAnimatedStyle = useAnimatedStyle(() => {
            return{
                width:bufferedPosition.value
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

        const handleSeek = ({nativeEvent}) => {
            const newPosition = -(panX.value/FULL_BAR_WIDTH) * 1000;
            const seekTo = newPosition + (nativeEvent.translationX as number)
            seek(seekTo)
        }

        return (
            <TapGestureHandler numberOfTaps={2}
                onEnded={toggleSetPlaying}
            >
                <Animated.View style={{ flex: 1 }}>
                    <PanGestureHandler minDist={100}
                    onEnded={handleSeek}
                     onGestureEvent={panGestureHandler}
                    >
                        <Animated.View style={[{ flex: 1 }, maskAnimatedStyle]} >
                            <MaskedView
                                maskElement={
                                    <Box
                                        style={{
                                            flex: 1,
                                            display:"flex",
                                            justifyContent: "center",
                                            backgroundColor: "transparent"
                                        }}
                                    >
                                        <MemoizedWaveForm {...{ samples }} />
                                        {/* <WaveForm {...{ samples }} reversed /> */}
                                        {/* <Animated.View style={topWavesAnimatedStyles}>
                                        </Animated.View>
                                        <Animated.View style={bottomWavesAnimatedStyles}>
                                        </Animated.View> */}
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
                                        zIndex: 2,
                                        backgroundColor: "#FF5836"
                                    }, playedAnimatedStyle]}
                                />
                                <Animated.View
                                    style={[{
                                        ...StyleSheet.absoluteFillObject,
                                        zIndex:1,
                                        backgroundColor:"white"
                                    },bufferedAnimatedStyle]}
                                />
                                <View
                                    style={{ flex: 1, backgroundColor:"rgba(255,255,255,0.5)" }}
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
        width: BAR_WIDTH,
        marginRight: BAR_MARGIN,
    },
});

export default React.memo(MainWavefrom)