import SliderMain from "./Slider"
import SliderThumb from "./SliderThumb"
import SliderTrack from "./SliderTrack"
import SliderFilledTrack from "./SliderFilledTrack"
import type {ISliderComponentType} from "./types"


let SliderTemp:any = SliderMain;
SliderTemp.Thumb = SliderThumb;
SliderTemp.Track = SliderTrack;
SliderTemp.FilledTrack = SliderFilledTrack;


const Slider = SliderTemp as ISliderComponentType;

export {Slider};

export type {ISliderProps} from "./types"