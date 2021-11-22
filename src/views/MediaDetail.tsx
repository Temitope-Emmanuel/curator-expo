import React from "react"
import { StyleSheet } from "react-native"
import { Flex, View } from "native-base";
import { IMedia } from "../models/Media";
import { RootStackParamList } from "../models/route";
import { FULL_BAR_WIDTH } from "./utils/constants"
import {
    useSharedValue, withTiming
} from "react-native-reanimated";
import waveFormSamples from "../assets/data/waveform.json"
import TabView from "../../src/components/TabView"
import WaveFormContainer from "../components/WaveFormContainer";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import useMediaService from "./utils/mediaPlayer";



const MediaDetail: React.FC<{} & BottomTabScreenProps<RootStackParamList,"MediaDetail">> = ({
    route
}) => {
        const {
            changeTrack,getAudio,
            state,playing,seeking,mediaArr
        } = useMediaService()
        const panX = useSharedValue(0)
        const sliding = useSharedValue(false)
        const bufferedPoint = useSharedValue(0)

        const setUpPlaylist = async () => {
            const newMedia = await getAudio(route.params.uri)
            if(newMedia){
                changeTrack(newMedia as IMedia<"audio">)
            }
        }
        
        React.useEffect(() => {
            if(!state?.isLoaded){
                setUpPlaylist()
            }
        }, [])

        const updatePosition = (currentTime: number) => {
            'worklet';
            // updateProgress()
            const currentPanX = currentTime * (FULL_BAR_WIDTH * 1.5)
            console.log("this is the current panX",{
                currentTime,
                currentPanX
            })
            panX.value = withTiming(Number.isNaN(currentPanX) ? 1 : -currentPanX)
        }

        const updateBuffering = (bufferedPointArg: number) => {
            'worklet';
            if (bufferedPointArg) {
                const currentBufferedPoint = bufferedPointArg * (FULL_BAR_WIDTH * 1.5);
                bufferedPoint.value = withTiming(-currentBufferedPoint)
            }
        }

        React.useEffect(() => {
            // let currentNumber = 0;
            // setInterval(() => {
            //     updatePosition(currentNumber)
            //     currentNumber++
            // },1000)
        },[])

        React.useEffect(() => {
            console.log("this is the state",{state})
            if (state?.isPlaying) {
                if ((state as any).currentTime && !sliding.value && playing) {
                    updatePosition((state as any).currentTime)
                }
                if ((state as any).playableDurationMillis) {
                    updateBuffering((state as any).playableDurationMillis / 1000)
                }
            }
        }, [state])
        
        return (
            <View style={styles.container}>
                <Flex flex={1}>
                    <WaveFormContainer {...{sliding,playing,panX}}
                    waveform={waveFormSamples.samples}
                    />
                </Flex>
                <Flex flex={3}>
                    <TabView/>
                </Flex>
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "flex-end"
    },
    cover: {
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null
    },
    content: {
        flex: 0.5,
        justifyContent: "center"
    }
})

export default MediaDetail