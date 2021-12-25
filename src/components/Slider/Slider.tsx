import React from "react"
import {useSliderState} from "@react-stately/slider"
import type { LayoutChangeEvent } from 'react-native';
import type {ISliderProps} from "./types"
import {Box, usePropsResolution} from "native-base"
import {SliderProvider} from "./Context"
import {useSlider} from "@react-native-aria/slider"

export const useLayout = () => {
  const [layout, setLayout] = React.useState({
    width: 0,
    height: 0,
  });
  return {
    onLayout: (e: LayoutChangeEvent) => {
      setLayout(e.nativeEvent.layout);
    },
    layout,
  };
};


const Slider:React.ForwardRefRenderFunction<unknown, ISliderProps> = (props,ref) => {
    let newProps = {
        ...props,
        'aria-label':props.accessibilityLabel ?? "Slider",
    }
    if(typeof props.value === "number"){
        //@ts-ignore - React Native Aria slider accepts array of values
        newProps.value = [props.value];
    }
    if(typeof props.defaultValue === "number"){
        //@ts-ignore - React Native Aria slider accepts array of values
        newProps.defaultValue = [props.defaultValue]
    }
    props  = newProps;
    
    const {layout:trackLayout,onLayout} = useLayout()
    const state = useSliderState({
        ...props,
        //@ts-ignore
        numberFormatter: { format: (e) => e },
        minValue:props.minValue,
        maxValue:props.maxValue,
        onChange:(val: any) => {
            props.onChange && props.onChange(val[0])
        },
        onChangeEnd:(val:any) => {
            props.onChangeEnd && props.onChangeEnd(val[0])
        }
    })
    const themeProps = usePropsResolution("Slider",props);
    const {trackProps} = useSlider(props as any,state,trackLayout)

    const wrapperStyle = {
        height: props.orientation === "vertical" ? "100%" : undefined,
        width: props.orientation !== "vertical" ? "100%" : undefined
    }
    
    return(
        <SliderProvider
            value={{
                trackLayout,
                state,
                orientation:props.orientation,
                isReversed:props.isReversed,
                colorScheme:props.colorScheme,
                trackProps,
                onTrackLayout:onLayout,
                thumbSize:themeProps.thumbSize,
                bufferedPercent:props.buffered,
                sliderSize:themeProps.sliderSize
            }}
        >
            <Box
                {...wrapperStyle}
                justifyContent="center"
                ref={ref} alignItems="center"
                {...themeProps}
            >
                {React.Children.map(props.children,(child,index) => {
                    if(child.displayName === "SliderThumb") {
                        return React.cloneElement(child as React.ReactElement,{
                            index
                        })
                    }

                    return child
                })}
            </Box>
        </SliderProvider>
    )
}

export default React.forwardRef(Slider)