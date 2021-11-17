import * as React from "react"
import {Dimensions} from "react-native"
import Animated from "react-native-reanimated"
import {Rect,Svg} from "react-native-svg"
import {BAR_WIDTH,FULL_BAR_WIDTH,BAR_HEIGHT,WAVEFORM_MARGIN} from "../views/utils/constants"

// const offset = wWidth / 2;
const offset = 1;


const Waveform = ({
    primaryColor,secondaryColor,waveform,
    height,width
}:{
    waveform:number[];
    height:number;
    width:number
    primaryColor:string;
    secondaryColor:string;
}) => {
    
    return(
        <Svg {...{height,width}}>
            {waveform.map((sample,key) => (
                <Rect {...{key}}
                 width={BAR_WIDTH}
                height={sample} fill={primaryColor}
                x={key * FULL_BAR_WIDTH + offset}
                y={BAR_HEIGHT - sample}
                />))
            }
            {waveform.map((sample,key) => (
                <Rect {...{key}}
                     width={BAR_WIDTH}
                    height={sample * 0.61} fill={secondaryColor} 
                    x={key * FULL_BAR_WIDTH + offset} 
                    y={BAR_HEIGHT + WAVEFORM_MARGIN}
                />
            ))}
        </Svg>
    )
}


export default Waveform