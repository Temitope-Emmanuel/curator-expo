import React from "react"
import { StyleSheet,Dimensions } from "react-native"
import { Flex, View, IconButton, Text } from "native-base";
import { IMedia } from "../models/Media";
import { RootStackParamList } from "../models/route";
import { FULL_BAR_WIDTH } from "../utils/constants"
import {
    useSharedValue, withTiming
} from "react-native-reanimated";
import waveFormSamples from "../assets/data/waveform.json"
import TabView from "../../src/components/TabView"
import WaveFormContainer from "../components/WaveFormContainer";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import useMediaService from "../utils/mediaPlayer";
import { useNavigation } from "@react-navigation/core";
import {FontAwesome5} from "@expo/vector-icons"
import { ToggleComponent } from "../components/ToggleComponent";

const MediaDetail: React.FC<{} & BottomTabScreenProps<RootStackParamList,"MediaDetail">> = ({
    route
}) => {
        const {
            changeTrack,getAudio,currentMedia,
            state,playing,togglePlaying
        } = useMediaService()
        const panX = useSharedValue(0)
        const navigation = useNavigation()
        const sliding = useSharedValue(false)
        const bufferedPoint = useSharedValue(0)

        const setUpPlaylist = async () => {
            const newMedia = await getAudio(route.params.uri) as IMedia<"audio">
            if(newMedia?.id){
                console.log("we are here",{newMedia})
                changeTrack(newMedia as IMedia<"audio">)   
            }
        }

        React.useEffect(() => {
            // const unsubscribe = navigation.addListener("focus",() => {
            //     if(currentMedia?.id !== route.params.uri){
            //         setUpPlaylist()
            //     }else{

            //     }
            // })
            // return unsubscribe
        },[navigation])

        const updatePosition = (currentTime: number) => {
            'worklet';
            const currentPanX = currentTime * (FULL_BAR_WIDTH * 1.5)
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
                <Flex flex={2} position="relative" >
                    <Flex borderRadius="full" borderColor="grey" justifyContent="center"
                        width="50" height="50" borderWidth="2" alignItems="center"
                        marginX="auto" marginY={2}
                        >
                        <Text color="whitesmoke">
                            {state?.currentTimeFormat ?? "00:00"}
                        </Text>
                    </Flex>
                    {/* <Flex flex={5}>
                        <WaveFormContainer {...{sliding,playing,panX}}
                            waveform={waveFormSamples.samples}
                        />
                    </Flex> */}
                    <Flex style={styles.toggleContainer}>
                        <ToggleComponent open={playing} toggle={togglePlaying}
                            FirstComponent={
                                <IconButton position="absolute"
                                    _icon={{
                                        as:FontAwesome5,
                                        name:"pause",
                                        onPress:togglePlaying
                                    }}
                                />
                            }
                            SecondComponent={
                                <IconButton position="absolute"
                                    _icon={{
                                        as:FontAwesome5,
                                        name:"play",
                                        onPress:togglePlaying
                                    }}
                                />
                            }
                        />
                    </Flex>
                </Flex>
                <Flex flex={5}>
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
    },
    toggleContainer:{
        flex:1,
        marginRight:"auto",
        marginLeft:"auto",
        width:"50%",
        height:"50%",
        justifyContent:"center",
        alignItems:"center"
    }
})

export default MediaDetail