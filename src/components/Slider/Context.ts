import React from "react"
import {createGenericContext} from "../../utils/hooks/useGenericContext"
import {SliderState} from "@react-stately/slider"
import { LayoutChangeEvent } from "react-native"


interface ISliderContext {
    isReversed?:boolean;
    colorScheme?:string;
    state:SliderState;
    trackLayout: {
        width: number;
        height: number;
    };
    orientation?:'horizontal' | 'vertical';
    sliderSize:any;
    trackProps:any;
    thumbSize:any;
    onTrackLayout: (e: LayoutChangeEvent) => void;
    bufferedPercent?:string
}

export const [useSliderService,SliderProvider] = createGenericContext<ISliderContext>()