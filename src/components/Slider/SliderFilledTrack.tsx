import React from "react"
import {useSliderService} from "./Context"
import {StyleSheet} from "react-native"
import {Box, usePropsResolution} from "native-base"
import {ISliderProps} from "./types"


const SliderFilledTrack:React.ForwardRefRenderFunction<unknown, ISliderProps> = ({style,buffer,...props},ref) => {
    const {
        isReversed,
        colorScheme,
        state,
        bufferedPercent,
        trackLayout,
        orientation,
        sliderSize,
    } = useSliderService()

    const sliderTrackPosition = isReversed ?
    orientation === "vertical"
    ? trackLayout.height - trackLayout.height * state.getThumbPercent(0)
    : trackLayout.width - trackLayout.width * state.getThumbPercent(0)
    : state.getThumbPercent(0) * 100 + '%';
    
    const themeProps = usePropsResolution("SliderFilledTrack",{
        size:sliderSize,
        colorScheme,
        ...props
    })
    
    const customStyle = StyleSheet.create({
        verticalStyle:{
            height:buffer ? bufferedPercent : sliderTrackPosition,
            width:sliderSize
        },
        horizontalStyle:{
            width:buffer ? bufferedPercent : sliderTrackPosition,
            height:sliderSize
        }
    })

    return(
       <Box position="absolute"
       {...themeProps} bg={buffer ? "whitesmoke" : "black"}
       left={orientation !== 'vertical' && !isReversed ? 0 : undefined}
       bottom={orientation === 'vertical' && !isReversed ? 0 : undefined}
       right={orientation !== 'vertical' && isReversed ? 0 : undefined}
       top={orientation === 'vertical' && isReversed ? 0 : undefined}
       {...props}
       style={[
         style,
         orientation === 'vertical'
           ? customStyle.verticalStyle
           : customStyle.horizontalStyle,
       ]}
       ref={ref}
     />    
    )
}
export default React.forwardRef(SliderFilledTrack)