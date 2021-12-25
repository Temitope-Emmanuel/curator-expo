import { Box, Pressable, usePropsResolution } from "native-base";
import React from "react"
import {useSliderService} from "./Context"
import type {ISliderProps} from "./types"


const SliderTrack:React.ForwardRefRenderFunction<unknown, ISliderProps> = ({children,...props},ref) => {
    const {
        orientation,
        trackProps,
        onTrackLayout,
        colorScheme,
        sliderSize,
      } = useSliderService();

      const themeProps = usePropsResolution("SliderTrack",{
          size:sliderSize,
          colorScheme,
          ...props
      })
      const isVertical = orientation === "vertical";
      const trackStyle = React.useMemo(
          () => ({
              height:isVertical ? "100%" : themeProps.size,
              width: !isVertical ? "100%" : themeProps.size
          }),
          [isVertical,themeProps.size]
      )

      return(
        <Pressable
            onLayout={onTrackLayout}
            ref={ref}
            {...trackProps} {...trackStyle}
            paddingY={!isVertical ? "12px" : undefined}
            paddingX={isVertical ? "12px" : undefined}
            justifyContent="center" alignItems="center"
        >
            <Box {...themeProps} style={trackStyle}>
                {children}
            </Box>
        </Pressable>
      )
}


export default React.forwardRef(SliderTrack)