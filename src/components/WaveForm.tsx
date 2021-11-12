import * as React from "react"
import {Dimensions} from "react-native"
import Animated, {interpolate,withTiming,useAnimatedStyle} from "react-native-reanimated"
import * as ReactNativeSVG from "react-native-svg"

const {Rect,Defs,ClipPath,Svg} = ReactNativeSVG

const AnimatedRect = Animated.createAnimatedComponent(Rect)
const BAR_WIDTH = 4;
const BAR_HEIGHT = 140;
const BAR_MARGIN = 1;
const FULL_BAR_WIDTH = BAR_WIDTH + BAR_MARGIN;
const WAVEFORM_MARGIN = 1;
const {width:wWidth} = Dimensions.get("window")
const offset = wWidth / 2;


const Waveform = ({
    primaryColor,progress,secondaryColor,waveform
}:{
    waveform:number[];
    primaryColor:string;
    secondaryColor:string;
    progress?:Animated.SharedValue<number>;
}) => {
    const height = BAR_HEIGHT + 0.61 * BAR_HEIGHT + WAVEFORM_MARGIN;
    const width = waveform.length * FULL_BAR_WIDTH + (offset * 2);

    const animatedProps = (useAnimatedStyle as any)(() => {
        const x = progress ? interpolate(
            progress.value,
            [0,width - wWidth - offset,width - wWidth],
            [-width+offset,-wWidth,0]
        ) : 0;
        return {x}
    })

    return(
        <Svg {...{height,width}}>
            <Defs>
                <ClipPath id="progress">
                    <AnimatedRect animatedProps={animatedProps} {...{height,width}} />
                </ClipPath>
            </Defs>
            {waveform.map((sample,key) => (
                <Rect
                    clipPath="url(#progress)" width={BAR_WIDTH}
                    height={sample} fill={primaryColor}
                    x={key * FULL_BAR_WIDTH + offset}
                    y={BAR_HEIGHT - sample} {...{key}}
                />
            ))}
            {waveform.map((sample,key) => (
                <Rect {...{key}}
                    clipPath="url(#progress)" width={BAR_WIDTH}
                    height={sample * 0.61} fill={secondaryColor} 
                    x={key * FULL_BAR_WIDTH + offset} y={BAR_HEIGHT + WAVEFORM_MARGIN}
                />
            ))}
        </Svg>
    )
}


export default Waveform