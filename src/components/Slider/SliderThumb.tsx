import React, { forwardRef } from "react"
import {Platform} from "react-native"
import {Box} from "native-base"
import {useSliderThumb} from "@react-native-aria/slider"
import {VisuallyHidden} from "@react-aria/visually-hidden"
import {ISliderThumbProps} from "./types"
import {useSliderService} from "./Context"
import { usePropsResolution, useToken } from "native-base"


const SliderThumb:React.ForwardRefRenderFunction<unknown, ISliderThumbProps> = (props,ref) => {
    const {
        state,
        trackLayout,
        orientation,
        colorScheme,
        thumbSize
    } = useSliderService()
    const themeProps = usePropsResolution("SliderThumb",{
        size:thumbSize,
        colorScheme,
        ...props
    })
    const inputRef = React.useRef(null);
    const {
        inputProps,thumbProps
    } = useSliderThumb(
        {
            index:0,
            trackLayout,
            inputRef,
            orientation
        },
        state
    )
    const thumbAbsoluteSize = useToken("sizes",themeProps.size)
    const thumbStyles: any = {
        bottom:
          orientation === 'vertical'
            ? `${state.getThumbPercent(0) * 100}%`
            : undefined,
        left:
          orientation !== 'vertical'
            ? `${state.getThumbPercent(0) * 100}%`
            : undefined,
        transform:
          orientation === 'vertical'
            ? [{ translateY: parseInt(thumbAbsoluteSize) / 2 }]
            : [{ translateX: -parseInt(thumbAbsoluteSize) / 2 }],
      };

    thumbStyles.transform.push({
        scale:state.isThumbDragging(0) ? themeProps.scaleOnPressed : 1
    })

    return(
        <Box
            position="absolute"
            {...thumbProps}
            {...themeProps}
            ref={ref} style={[thumbStyles,props.style]}
        >
            {props.children}
            {
                Platform.OS === "web" && (
                    <VisuallyHidden>
                        <input ref={inputRef} {...inputProps} />
                    </VisuallyHidden>
                )
            }
        </Box>
    )
}

SliderThumb.displayName = "SliderThumb"

export default React.forwardRef(SliderThumb)